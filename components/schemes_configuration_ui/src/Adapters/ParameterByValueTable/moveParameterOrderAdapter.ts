import { BackendResponse, UpdateFormResponse } from '../../Shared/types';

export function moveParameterOrderAdapter(response: string): number {
	const { Response }: BackendResponse = JSON.parse(response);
	const parameterResponse = Response.Tables[0].Rows as UpdateFormResponse;

	return parameterResponse.RowsUpdated;
}
