import { IMessage } from '@stomp/stompjs';

import { rpcEndPoint } from '../../../WebSocket';
import { AppDispatch, rxStompRPC } from '../../store';

import {
	MethodsQuery,
	StorageTypesQuery,
	UnitsQuery,
} from './queries/preferenceQueries';
import { setMethods, setStorageTypes, setUnits } from './preferenceSlice';

export const fetchMethods = () => (dispatch: AppDispatch) => {
	try {
		rxStompRPC
			.rpc({
				destination: rpcEndPoint,
				body: JSON.stringify(MethodsQuery),
			})
			.subscribe(function (result: IMessage) {
				const methods = JSON.parse(result.body).Response.Tables[0].Rows;
				dispatch(setMethods(methods));
			});
	} catch (e) {
		console.log(e);
	}
};

export const fetchStorageTypes = () => (dispatch: AppDispatch) => {
	try {
		rxStompRPC
			.rpc({
				destination: rpcEndPoint,
				body: JSON.stringify(StorageTypesQuery),
			})
			.subscribe(function (result: IMessage) {
				const storageTypes = JSON.parse(result.body).Response.Tables[0].Rows;
				dispatch(setStorageTypes(storageTypes));
			});
	} catch (e) {
		console.log(e);
	}
};
export const fetchUnits = () => (dispatch: AppDispatch) => {
	try {
		rxStompRPC
			.rpc({
				destination: rpcEndPoint,
				body: JSON.stringify(UnitsQuery),
			})
			.subscribe(function (result: IMessage) {
				const units = JSON.parse(result.body).Response.Tables[0].Rows;
				dispatch(setUnits(units));
			});
	} catch (e) {
		console.log(e);
	}
};
