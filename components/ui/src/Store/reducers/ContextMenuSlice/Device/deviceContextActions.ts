import { toast } from 'react-toastify';
import { IMessage } from '@stomp/stompjs';

import { deleteDeviceBody } from '../../../../Components/SubmitOperation/deleteDeviceBody';
import {
	SubmitButtonText,
	SubmitOperation,
	SubmitOperationTitle,
} from '../../../../Components/SubmitOperation/types';
import {
	COMMON_PAGE_ROW_COUNT,
	COUNT_DEVICES_PARAM,
	DEVICE,
	DEVICE_INFO_PARAM,
	NAME_PREFIX_DEVICE_PARAM,
	NUMBER_START_DEVICE_PARAM,
	REVERSE_TREE,
} from '../../../../Const';
import {
	getParameterValue,
	getQueryOutputParameters,
} from '../../../../Const/utils';
import { ModuleName } from '../../../../Shared/types';
import {
	checkResponseOutputErrors,
	handleResponseOutputError,
} from '../../../../Shared/Utils/utils';
import { ParamsBlock } from '../../../../Types/ParametersBlockTypes';
import { FavouriteLogOperationType } from '../../../../Types/RpcResponseTypes';
import { rpcEndPoint } from '../../../../WebSocket';
import { AppDispatch, RootState, rxStompRPC } from '../../../store';
import {
	fetchUnusedChannelsList,
	positionOnElement,
	updateDevices,
} from '../../ConfiguratorSlice/configuratorActions';
import {
	filterDevicesList,
	setDevicesFilterMode,
	setDevicesFilterString,
	updateDeviceFavourite,
} from '../../ConfiguratorSlice/configuratorSlice';
import { setDevicesActiveFilter } from '../../FiltersSlice/filtersSlice';
import {
	clearForCreating,
	setIsCreating,
	setParameterItems,
} from '../../ParametersSlice/parametersSlice';
import {
	openSubmitOperationModal,
	setSubmitButtonText,
	setSubmitOperationBody,
	setSubmitOperationFunction,
	setSubmitOperationTitle,
} from '../../SubmitOperationSlice/SubmitOperationSlice';

import { addDeviceToFavouriteQuery } from './queries/addDeviceToFavouriteQuery';
import { createDevicesQuery } from './queries/createDevicesQuery';
import { deleteDeviceQuery } from './queries/deleteDeviceQuery';
import { removeDeviceFromFavouriteQuery } from './queries/removeDeviceFromFavouriteQuery';
import { updateDeviceQuery } from './queries/updateDeviceQuery';

export const createDevice =
	(parametersData: ParamsBlock[]) =>
	(dispatch: AppDispatch, getState: () => RootState) => {
		const server = getState().configuratorReducer.currentServer;
		const userId = getState().authReducer.user?.preferredUsername;
		const parameterItems = parametersData[0].sortParams;
		const name = parameterItems[0].value;
		const number = parameterItems[1].value;
		const comment = parameterItems[2].value;

		try {
			rxStompRPC
				.rpc({
					destination: rpcEndPoint,
					body: JSON.stringify(
						createDevicesQuery({
							name: String(name),
							number: Number(number),
							comment: String(comment),
							server: Number(server),
							userId: userId,
							moduleName: ModuleName.DeviceContextActions_createDevice,
						}),
					),
				})
				.subscribe(function (response: IMessage) {
					if (checkResponseOutputErrors(response)) {
						handleResponseOutputError(response);
					} else {
						toast.success('Прибор успешно создан');
						dispatch(positionOnElement(String(number), 1, DEVICE, 1));
						dispatch(
							setParameterItems([
								{ parameterType: DEVICE, parameterId: Number(number) },
							]),
						);
					}
				});
		} catch (e) {
			console.log(e);
		} finally {
			dispatch(setIsCreating(false));
		}
	};

export const createDevices =
	(parametersData: ParamsBlock[]) =>
	(dispatch: AppDispatch, getState: () => RootState) => {
		const server = getState().configuratorReducer.currentServer;
		const userId = getState().authReducer.user?.preferredUsername;
		const parameterItems = parametersData[0].sortParams;
		const name = getParameterValue(parameterItems, NAME_PREFIX_DEVICE_PARAM);
		const number = getParameterValue(parameterItems, NUMBER_START_DEVICE_PARAM);
		const count = getParameterValue(parameterItems, COUNT_DEVICES_PARAM);
		const comment = getParameterValue(parameterItems, DEVICE_INFO_PARAM);

		try {
			rxStompRPC
				.rpc({
					destination: rpcEndPoint,
					body: JSON.stringify(
						createDevicesQuery({
							name: String(name),
							number: Number(number),
							comment: String(comment),
							server: Number(server),
							count: Number(count),
							userId,
							moduleName: ModuleName.DeviceContextActions_createDevices,
						}),
					),
				})
				.subscribe(function (response: IMessage) {
					if (checkResponseOutputErrors(response)) {
						handleResponseOutputError(response);
					} else {
						toast.success(`Серия из ${count} приборов успешно создана`);
						dispatch(positionOnElement(String(number), 1, DEVICE, 1));
						dispatch(
							setParameterItems([
								{ parameterType: DEVICE, parameterId: Number(number) },
							]),
						);
					}
				});
		} catch (e) {
			console.log(e);
		} finally {
			dispatch(setIsCreating(false));
		}
	};

export const updateDevice =
	(parametersData: ParamsBlock[]) =>
	(dispatch: AppDispatch, getState: () => RootState) => {
		const currentState = getState();
		const server = currentState.configuratorReducer.currentServer;
		const userId = getState().authReducer.user?.preferredUsername;
		const newDeviceData = parametersData[0];

		const deviceToUpdate = currentState.parameterReducer.parameterItems
			.filter((item) => item.parameterType === DEVICE)
			.map((item) => {
				const deviceItem = currentState.configuratorReducer.devicesList.find(
					(deviceListItem) => deviceListItem.Number === item.parameterId,
				);
				return {
					Number: item.parameterId,
					LastModified: deviceItem?.LastModified,
				};
			});

		const name = String(newDeviceData.sortParams[0].value);
		const number = Number(newDeviceData.sortParams[1].value);
		const comment = String(newDeviceData.sortParams[2].value);

		try {
			rxStompRPC
				.rpc({
					destination: rpcEndPoint,
					body: JSON.stringify(
						updateDeviceQuery({
							number,
							name,
							comment,
							lastModified: String(deviceToUpdate[0].LastModified),
							userId,
							moduleName: ModuleName.DeviceContextActions_updateDevice,
						}),
					),
				})
				.subscribe(function (response: IMessage) {
					if (checkResponseOutputErrors(response)) {
						handleResponseOutputError(response);
					} else {
						dispatch(
							updateDevices(number, DEVICE, REVERSE_TREE, server, userId),
						);
						toast.success(`Прибор ${number} успешно отредактирован`);
					}
				});
		} catch (e) {
			console.log(e);
		} finally {
			dispatch(setIsCreating(false));
		}
	};
export const deleteDeviceSubmitting = (
	dispatch: AppDispatch,
	getState: () => RootState,
) => {
	const { configuratorReducer, parameterReducer } = getState();

	const device = parameterReducer.parameterItems
		.filter((item) => item.parameterType === DEVICE)
		.map((item) => {
			return configuratorReducer.devicesList.find(
				(deviceListItem) => deviceListItem.Number === item.parameterId,
			);
		})[0];

	const deviceNumber = Number(device?.Number);
	dispatch(setSubmitOperationTitle(SubmitOperationTitle.DeletePosition));
	dispatch(
		setSubmitOperationBody(
			deleteDeviceBody({
				itemNumber: deviceNumber,
				itemName: String(device?.Name),
			}),
		),
	);
	dispatch(setSubmitButtonText(SubmitButtonText.Delete));
	dispatch(setSubmitOperationFunction(SubmitOperation.DeleteDevice));
	dispatch(openSubmitOperationModal());
};
export const deleteDevice = (
	dispatch: AppDispatch,
	getState: () => RootState,
) => {
	const { configuratorReducer, sortReducer, authReducer, parameterReducer } =
		getState();
	const server = configuratorReducer.currentServer;
	const userId = authReducer.user?.preferredUsername;
	const { unusedChannelsSortOrder } = sortReducer;

	const device = parameterReducer.parameterItems
		.filter((item) => item.parameterType === DEVICE)
		.map((item) => {
			return configuratorReducer.devicesList.find(
				(deviceListItem) => deviceListItem.Number === item.parameterId,
			);
		})[0];
	const deviceNumber = Number(device?.Number);

	try {
		rxStompRPC
			.rpc({
				destination: rpcEndPoint,
				body: JSON.stringify(
					deleteDeviceQuery({
						number: deviceNumber,
						lastModified: String(device?.LastModified),
						userId,
						moduleName: ModuleName.DeviceContextActions_deleteDevice,
					}),
				),
			})
			.subscribe(function (response: IMessage) {
				if (checkResponseOutputErrors(response)) {
					handleResponseOutputError(response);
				} else {
					dispatch(
						fetchUnusedChannelsList(
							server,
							1,
							COMMON_PAGE_ROW_COUNT,
							false,
							unusedChannelsSortOrder,
							null,
							userId,
						),
					);
					dispatch(filterDevicesList(deviceNumber));
					dispatch(setDevicesFilterString(''));
					dispatch(setDevicesFilterMode(1));
					dispatch(setDevicesActiveFilter(1));
					dispatch(clearForCreating());
					toast.success(`Прибор ${deviceNumber} успешно удален`);
				}
			});
	} catch (e) {
		console.log(e);
	}
};

export const addDeviceToFavourite =
	(deviceNumber: number) =>
	(dispatch: AppDispatch, getState: () => RootState) => {
		const userId = getState().authReducer.user?.preferredUsername;
		try {
			rxStompRPC
				.rpc({
					destination: rpcEndPoint,
					body: JSON.stringify(
						addDeviceToFavouriteQuery({
							numbers: String(deviceNumber),
							userId,
							moduleName: ModuleName.DeviceContextActions_addDeviceToFavourite,
						}),
					),
				})
				.subscribe(function (response: IMessage) {
					const outParameters = getQueryOutputParameters(response);
					if (checkResponseOutputErrors(response)) {
						handleResponseOutputError(response);
					} else {
						const logOperation: FavouriteLogOperationType = JSON.parse(
							outParameters['@LogOperation'],
						);
						dispatch(
							updateDeviceFavourite({
								logOperation: logOperation,
								isFavourite: true,
							}),
						);
						toast.success(`Прибор ${deviceNumber} добавлен в избранное`);
					}
				});
		} catch (e) {
			console.log(e);
		}
	};

export const removeDeviceFromFavourite =
	(deviceNumber: number) =>
	(dispatch: AppDispatch, getState: () => RootState) => {
		const userId = getState().authReducer.user?.preferredUsername;
		try {
			rxStompRPC
				.rpc({
					destination: rpcEndPoint,
					body: JSON.stringify(
						removeDeviceFromFavouriteQuery({
							numbers: String(deviceNumber),
							userId,
							moduleName:
								ModuleName.DeviceContextActions_removeDeviceFromFavourite,
						}),
					),
				})
				.subscribe(function (response: IMessage) {
					const outParameters = getQueryOutputParameters(response);
					if (checkResponseOutputErrors(response)) {
						handleResponseOutputError(response);
					} else {
						const logOperation: FavouriteLogOperationType = JSON.parse(
							outParameters['@LogOperation'],
						);
						dispatch(
							updateDeviceFavourite({
								logOperation: logOperation,
								isFavourite: false,
							}),
						);
						toast.success(`Прибор ${deviceNumber} удален из избранных`);
					}
				});
		} catch (e) {
			console.log(e);
		}
	};
