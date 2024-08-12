import { toast } from 'react-toastify';
import { IMessage } from '@stomp/stompjs';

import { rpcEndPoint } from '../../../WebSocket';
import { AppDispatch, rxStompRPC } from '../../store';

import {
	convertForms,
	convertMnemoschemes,
	convertSystems,
	convertVersions,
} from './converters';
import { groupInformationSlice } from './GroupInformationSlice';
import {
	getFormsQuery,
	getMnemoschemesQuery,
	getSystemsQuery,
	getVersionsQuery,
} from './queries';
import {
	FormResponse,
	FormsParams,
	MnemoschemeResponse,
	MnemoschemesParams,
	System,
	SystemResponse,
	Version,
	VersionResponse,
} from './types';

export const {
	openGroupInformation,
	closeGroupInformation,
	setForms,
	setSystems,
	setVersions,
	setMnemoschemes,
	setFormsIsLoading,
	setSystemsIsLoading,
	setVersionsIsLoading,
	setMnnemoschemesIsLoading,
	toggleCollapseFormItem,
	toggleExpandTree,
	toggleIsTreeOpen,
	selectFormItem,
	selectTreeItem,
	expandTreeToItem,
} = groupInformationSlice.actions;

export const getSystemsPromise = (groupId: number): Promise<System[]> => {
	const observable = rxStompRPC.rpc({
		destination: rpcEndPoint,
		body: JSON.stringify(getSystemsQuery(groupId)),
	});
	return new Promise((resolve, reject) =>
		observable.subscribe((response: IMessage) => {
			try {
				const systems: SystemResponse[] = JSON.parse(response.body).Response
					.Tables[0].Rows;
				const convertedSystems = convertSystems(systems);
				resolve(convertedSystems);
			} catch (_err) {
				reject(_err);
			}
		}),
	);
};

export const getVersionsPromise = (
	groupId: number,
	systemId: number,
): Promise<Version[]> => {
	const observable = rxStompRPC.rpc({
		destination: rpcEndPoint,
		body: JSON.stringify(getVersionsQuery(groupId, systemId)),
	});
	return new Promise((resolve, reject) =>
		observable.subscribe((response: IMessage) => {
			try {
				const versions: VersionResponse[] = JSON.parse(response.body).Response
					.Tables[0].Rows;
				const convertedVersions = convertVersions(versions);
				resolve(convertedVersions);
			} catch (_err) {
				reject();
			}
		}),
	);
};

export const getFormsRpc = (params: FormsParams) => (dispatch: AppDispatch) => {
	dispatch(setFormsIsLoading(true));
	rxStompRPC
		.rpc({
			destination: rpcEndPoint,
			body: JSON.stringify(getFormsQuery(params)),
		})
		.subscribe((response: IMessage) => {
			try {
				const forms: FormResponse[] = JSON.parse(response.body).Response
					.Tables[0].Rows;
				const convertedForms = convertForms(forms);
				if (!convertedForms.length) {
					toast.warn('Нет данных по текущей версии');
				}
				dispatch(setForms(convertedForms));
			} catch (_err) {
				toast.error('Что-то пошло не так');
			} finally {
				dispatch(setFormsIsLoading(false));
			}
		});
};

export const getMnemoschemesRpc =
	(params: MnemoschemesParams) => (dispatch: AppDispatch) => {
		dispatch(setMnnemoschemesIsLoading(true));
		rxStompRPC
			.rpc({
				destination: rpcEndPoint,
				body: JSON.stringify(getMnemoschemesQuery(params)),
			})
			.subscribe((response: IMessage) => {
				try {
					const mnemoschemes: MnemoschemeResponse[] = JSON.parse(response.body)
						.Response.Tables[0].Rows;
					const convertedMnemoschemes = convertMnemoschemes(mnemoschemes);
					dispatch(setMnemoschemes(convertedMnemoschemes));
				} catch (_err) {
					toast.error('Что-то пошло не так');
				} finally {
					dispatch(setFormsIsLoading(false));
				}
			});
	};
