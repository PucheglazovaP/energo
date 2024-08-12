import { toast } from 'react-toastify';
import { IMessage } from '@stomp/stompjs';

import { rxStompRPC } from '../packages/StompClient';
import { rpcEndPoint } from '../packages/StompClient/createWSConnection';
import { OutputParameters, RpcQuery } from '../Shared/types';

export class RpcError extends Error {
	constructor(public type: RpcErrorType, public details: any) {
		super(`Ошибка типа ${type}`, details);
	}
	public toastMessage() {
		const err = this.#constructMessage(this.type, this.details.errorName);
		toast.error(err);
	}

	#constructMessage(type: RpcErrorType, name: string | string[]) {
		const typeError: string = `Ошибка типа ${type} \n`;
		let resultError: string = '';
		if (typeof name === 'string') {
			resultError = typeError.concat(name);
		} else {
			const errorNames: string = name.reduce(
				(acc, curr) => (acc += `${curr}\n`),
				'',
			);
			resultError += errorNames;
		}
		return resultError;
	}
}

enum RpcErrorType {
	UserLevel = 'UserLevel',
	Processing = 'Processing',
	DatabaseError = 'DatabaseError',
}

function checkResponseOutputErrors(response: IMessage): boolean {
	const errors: OutputParameters[] = JSON.parse(response.body).Response
		.OutParameters;
	if (errors.length) {
		const filteredErrors = errors.filter(
			(error) => error['@TextErr'] && error['@TextErr'] !== '',
		);
		return !!filteredErrors.length;
	}
	return false;
}

export function rpcQuery<T>(
	params: RpcQuery,
	responseAdapter?: (response: string) => T,
	handleResponseOutputWarnings?: (response: IMessage) => void,
): Promise<T> {
	const observable = rxStompRPC.rpc({
		destination: rpcEndPoint,
		body: JSON.stringify(params),
	});
	return new Promise<T>((resolve, reject) => {
		observable.subscribe((result: IMessage) => {
			try {
				const parsedResponse = JSON.parse(result.body);

				const errorName: string = parsedResponse.Response.Error;
				if (errorName)
					reject(
						new RpcError(RpcErrorType.DatabaseError, {
							errorName,
							errorDescription: result.body,
						}),
					);
				const errors: OutputParameters[] =
					parsedResponse.Response.OutParameters;
				const possibleErrorInResponse =
					parsedResponse.Response.Tables[0]?.Rows[0];
				if (checkResponseOutputErrors(result)) {
					reject(
						new RpcError(RpcErrorType.UserLevel, {
							errorName: errors.map((error) => error['@TextErr']).join(', '),
							errorDescription: result.body,
						}),
					);
				} else if (possibleErrorInResponse?.TextErr) {
					reject(
						new RpcError(RpcErrorType.UserLevel, {
							errorName: possibleErrorInResponse.TextErr,
							errorDescription: possibleErrorInResponse.TextErr,
						}),
					);
				} else {
					handleResponseOutputWarnings && handleResponseOutputWarnings(result);
					const rawResponse: string = result.body;
					if (responseAdapter) {
						const response: T = responseAdapter(rawResponse);
						resolve(response);
					} else {
						resolve(result.body as T);
					}
				}
			} catch (err) {
				reject(
					new RpcError(RpcErrorType.Processing, {
						errorName: (err as Error).toString(),
					}),
				);
			}
		});
	});
}
