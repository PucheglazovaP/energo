import { toast } from 'react-toastify';
import { IMessage } from '@stomp/stompjs';

import { deleteChannelBody } from '../../../../Components/SubmitOperation/deleteChannelBody';
import { disconnectChannelsBody } from '../../../../Components/SubmitOperation/disconnectChannelsBody';
import { removeChannelFromGroupBody } from '../../../../Components/SubmitOperation/removeChannelFromGroupBody';
import {
	SubmitButtonText,
	SubmitOperation,
	SubmitOperationTitle,
} from '../../../../Components/SubmitOperation/types';
import {
	CHANNEL,
	CHANNEL_PARAMETERS,
	CHANNEL_TO_GROUP_PARAMETERS,
	COEFFICIENT,
	COMMON_PAGE_ROW_COUNT,
	DEVICE,
	FORWARD_TREE,
	GROUP,
	METHOD_PARAM,
	NAME_PARAM,
	NUMBER_GROUP_PARAM,
	REVERSE_TREE,
	STORAGE_TYPE_PARAM,
	UNIT_PARAM,
} from '../../../../Const';
import { getParameterValue } from '../../../../Const/utils';
import { ModuleName } from '../../../../Shared/types';
import {
	checkResponseOutputErrors,
	checkResponseOutputWarnings,
	handleResponseOutputError,
} from '../../../../Shared/Utils/utils';
import { ParamsBlock } from '../../../../Types/ParametersBlockTypes';
import { rpcEndPoint } from '../../../../WebSocket';
import { AppDispatch, RootState, rxStompRPC } from '../../../store';
import {
	fetchDeviceList,
	fetchGroupsList,
	fetchUnusedChannelsList,
	positionOnElement,
	updateElementsLists,
} from '../../ConfiguratorSlice/configuratorActions';
import {
	deleteChannelFromGroup,
	filterUnusedChannelsList,
	setGroupsFilterMode,
	setGroupsFilterString,
	setGroupsPaginationAvailable,
} from '../../ConfiguratorSlice/configuratorSlice';
import { setGroupsActiveFilter } from '../../FiltersSlice/filtersSlice';
import {
	removeParameterItems,
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
import { createGroupsQuery } from '../Group/queries/createGroupsQuery';

import { createGroupsFromChannelsQuery } from './queries/createGroupsFromChannelsQuery';
import { createNewChannelsQuery } from './queries/createNewChannelsQuery';
import { deleteChannelQuery } from './queries/deleteChannelQuery';
import { disconnectChannelsQuery } from './queries/disconnectChannelsQuery';
import { includeChannelsToGroupQuery } from './queries/includeChannelsToGroupQuery';
import { removeChannelFromGroupQuery } from './queries/removeChannelFromGroupQuery';
import { updateChannelQuery } from './queries/updateChannelQuery';
import { updateChannelsCoefficientsQuery } from './queries/updateChannelsCoefficientsQuery';
import { updateChannelsQuery } from './queries/updateChannelsQuery';

export const includeChannelsToGroup =
	(parametersData: ParamsBlock[]) =>
	async (dispatch: AppDispatch, getState: () => RootState) => {
		const {
			authReducer,
			configuratorReducer,
			parameterReducer,
			filtersReducer,
		} = getState();
		const server = configuratorReducer.currentServer;
		const userId = authReducer.user?.preferredUsername;
		const parameterItems = parametersData[0].sortParams;
		const channelsNumbers = parameterReducer.parameterItems
			.filter((item) => item.parameterType === CHANNEL)
			.map((item) => {
				if (item.parameterType === CHANNEL) {
					return item.parameterId;
				}
			})
			.sort()
			.join(',');
		const { groupsActiveFilter } = filtersReducer;
		const { filterMode } = configuratorReducer.groupPagination;
		const coefficient = getParameterValue(parameterItems, COEFFICIENT);
		const groupNumber = parameterReducer.parameterItems.filter(
			(item) => item.parameterType === GROUP,
		)[0].parameterId;

		try {
			rxStompRPC
				.rpc({
					destination: rpcEndPoint,
					body: JSON.stringify(
						includeChannelsToGroupQuery({
							groupNumber: Number(groupNumber),
							channels: channelsNumbers,
							coefficient: coefficient === '' ? 1 : Number(coefficient),
							userId,
							moduleName:
								ModuleName.ChannelContextActions_includeChannelsToGroup,
						}),
					),
				})
				.subscribe(function (response: IMessage) {
					if (checkResponseOutputErrors(response)) {
						handleResponseOutputError(response);
					} else {
						dispatch(setGroupsPaginationAvailable(false));
						dispatch(setGroupsFilterString(''));
						setTimeout(() => {
							dispatch(
								positionOnElement(
									String(groupNumber),
									filterMode,
									GROUP,
									groupsActiveFilter,
								),
							);
						}, 1);

						toast.success('Канал/каналы успешно включены в группу');
						dispatch(
							setParameterItems([
								{ parameterType: GROUP, parameterId: Number(groupNumber) },
							]),
						);
						dispatch(
							updateElementsLists(
								Number(groupNumber),
								GROUP,
								FORWARD_TREE,
								server,
							),
						);
					}
				});
		} catch (e) {
			console.log(e);
		} finally {
			dispatch(setIsCreating(false));
			dispatch(setGroupsPaginationAvailable(true));
		}
	};

export const updateChannels =
	(parametersData: ParamsBlock[]) =>
	(dispatch: AppDispatch, getState: () => RootState) => {
		const server = getState().configuratorReducer.currentServer;
		const userId = getState().authReducer.user?.preferredUsername;
		const deviceNumber = Number(
			getState().parameterReducer.parameterItems.find(
				(item) => item.parameterType === DEVICE,
			)?.parameterId,
		);
		const unusedChannelsList =
			getState().configuratorReducer.unusedChannelsList;
		const channelsList = getState().configuratorReducer.channelsList;

		const channelNumbersToUpdate = getState()
			.parameterReducer.parameterItems.filter(
				(item) => item.parameterType === CHANNEL,
			)
			.map((item) => {
				let channelItem = channelsList.find(
					(channelsListItem) => channelsListItem.Number === item.parameterId,
				);
				if (!channelItem) {
					channelItem = unusedChannelsList.find(
						(channelsListItem) => channelsListItem.Number === item.parameterId,
					);
				}
				return {
					Number: item.parameterId,
					LastModified: channelItem?.LastModified,
				};
			});

		let requestBody: object;
		let successMessage: string;

		if (channelNumbersToUpdate.length > 1) {
			const resultChannelsString = { info: channelNumbersToUpdate };
			const newChannelData = parametersData[1].sortParams;
			const fkUnits = Number(getParameterValue(newChannelData, UNIT_PARAM));
			const fkMethods = Number(getParameterValue(newChannelData, METHOD_PARAM));
			const fkTypeStorage = Number(
				getParameterValue(newChannelData, STORAGE_TYPE_PARAM),
			);
			requestBody = updateChannelsQuery({
				channelsString: JSON.stringify(resultChannelsString),
				fkUnits,
				fkTypeStorage,
				fkMethods,
				userId,
				moduleName: ModuleName.ChannelContextActions_updateChannels,
			});
			successMessage = 'Каналы успешно отредактированы';
		} else {
			const newChannelData = parametersData[0].sortParams;
			const channelName = String(getParameterValue(newChannelData, NAME_PARAM));
			const fkUnits = Number(getParameterValue(newChannelData, UNIT_PARAM));
			const fkMethods = Number(getParameterValue(newChannelData, METHOD_PARAM));
			const fkTypeStorage = Number(
				getParameterValue(newChannelData, STORAGE_TYPE_PARAM),
			);
			requestBody = updateChannelQuery({
				channelNumber: channelNumbersToUpdate[0].Number,
				channelName,
				fkDevices: deviceNumber,
				fkUnits,
				fkTypeStorage,
				fkMethods,
				lastModified: String(channelNumbersToUpdate[0].LastModified),
				userId,
				moduleName: ModuleName.ChannelContextActions_updateChannels,
			});
			successMessage = 'Канал успешно отредактирован';
		}
		try {
			rxStompRPC
				.rpc({
					destination: rpcEndPoint,
					body: JSON.stringify(requestBody),
				})
				.subscribe(function (response: IMessage) {
					if (checkResponseOutputErrors(response)) {
						handleResponseOutputError(response);
					} else {
						dispatch(
							updateElementsLists(deviceNumber, DEVICE, REVERSE_TREE, server),
						);
						toast.success(successMessage);
						checkResponseOutputWarnings(response);
					}
				});
		} catch (e) {
			console.log(e);
		} finally {
			dispatch(setIsCreating(false));
		}
	};

export const createNewChannels =
	(parametersData: ParamsBlock[]) =>
	(dispatch: AppDispatch, getState: () => RootState) => {
		const { sortReducer, authReducer, configuratorReducer, parameterReducer } =
			getState();
		const { unusedChannelsSortOrder, devicesSortOrder } = sortReducer;
		const serverId = Number(configuratorReducer.currentServer);
		const userId = authReducer.user?.preferredUsername;
		const deviceNumber = Number(
			parameterReducer.parameterItems.find(
				(item) => item.parameterType === DEVICE,
			)?.parameterId,
		);
		const newChannelData = parametersData[0];

		const channelName = String(newChannelData.sortParams[0].value);
		const channelNumber = Number(newChannelData.sortParams[1].value);
		const fkUnits = Number(newChannelData.sortParams[2].value);
		const fkMethods = Number(newChannelData.sortParams[3].value);
		const fkTypeStorage = Number(newChannelData.sortParams[4].value);

		try {
			rxStompRPC
				.rpc({
					destination: rpcEndPoint,
					body: JSON.stringify(
						createNewChannelsQuery({
							channelNumber,
							count: parametersData.length,
							channelName,
							deviceNumber,
							fkUnits,
							fkTypeStorage,
							fkMethods,
							serverId,
							userId,
							moduleName: ModuleName.ChannelContextActions_createNewChannels,
						}),
					),
				})
				.subscribe(function (response: IMessage) {
					if (checkResponseOutputErrors(response)) {
						handleResponseOutputError(response);
					} else {
						if (!deviceNumber) {
							dispatch(
								fetchUnusedChannelsList(
									serverId,
									1,
									COMMON_PAGE_ROW_COUNT,
									false,
									unusedChannelsSortOrder,
									channelNumber,
									userId,
								),
							);
						} else {
							dispatch(
								fetchDeviceList(
									1,
									COMMON_PAGE_ROW_COUNT,
									String(deviceNumber),
									serverId,
									true,
									1,
									1,
									devicesSortOrder,
									userId,
								),
							);
							dispatch(
								updateElementsLists(
									deviceNumber,
									DEVICE,
									REVERSE_TREE,
									serverId,
								),
							);
						}

						dispatch(
							setParameterItems([
								{
									parameterType: CHANNEL,
									parameterId: Number(channelNumber),
								},
							]),
						);
						if (deviceNumber)
							dispatch(
								setParameterItems([
									{
										parameterType: DEVICE,
										parameterId: deviceNumber,
									},
								]),
							);

						toast.success('Канал успешно создан');
					}
				});
		} catch (e) {
			console.log(e);
		} finally {
			dispatch(setIsCreating(false));
		}
	};

export const deleteChannelSubmitting = (
	dispatch: AppDispatch,
	getState: () => RootState,
) => {
	const { parameterReducer, configuratorReducer } = getState();
	const channel = parameterReducer.parameterItems
		.filter((item) => item.parameterType === CHANNEL)
		.map((item) => {
			return configuratorReducer.unusedChannelsList.find(
				(channelsListItem) => channelsListItem.Number === item.parameterId,
			);
		})[0];
	const channelNumber = Number(channel?.Number);
	dispatch(setSubmitOperationTitle(SubmitOperationTitle.DeletePosition));
	dispatch(
		setSubmitOperationBody(
			deleteChannelBody({
				itemNumber: channelNumber,
				itemName: String(channel?.Name),
			}),
		),
	);
	dispatch(setSubmitButtonText(SubmitButtonText.Delete));
	dispatch(setSubmitOperationFunction(SubmitOperation.DeleteChannel));
	dispatch(openSubmitOperationModal());
};
export const deleteChannel = (
	dispatch: AppDispatch,
	getState: () => RootState,
) => {
	const { authReducer, parameterReducer, configuratorReducer } = getState();
	const userId = authReducer.user?.preferredUsername;
	const channel = parameterReducer.parameterItems
		.filter((item) => item.parameterType === CHANNEL)
		.map((item) => {
			return configuratorReducer.unusedChannelsList.find(
				(channelsListItem) => channelsListItem.Number === item.parameterId,
			);
		})[0];
	const channelNumber = Number(channel?.Number);

	try {
		rxStompRPC
			.rpc({
				destination: rpcEndPoint,
				body: JSON.stringify(
					deleteChannelQuery({
						number: channelNumber,
						lastModified: String(channel?.LastModified),
						userId,
						moduleName: ModuleName.ChannelContextActions_deleteChannel,
					}),
				),
			})
			.subscribe(function (response: IMessage) {
				if (checkResponseOutputErrors(response)) {
					handleResponseOutputError(response);
				} else {
					dispatch(filterUnusedChannelsList(channelNumber));
					dispatch(setParameterItems([]));
					toast.success(`Канал ${channelNumber} успешно удален`);
				}
			});
	} catch (e) {
		console.log(e);
	}
};
export const removeChannelFromGroupSubmitting = (
	dispatch: AppDispatch,
	getState: () => RootState,
) => {
	const { contextMenuReducer, configuratorReducer } = getState();
	const groupNumber = contextMenuReducer.parentId;
	const group = configuratorReducer.groupsList.find(
		(groupListItem) => groupListItem.Number === groupNumber,
	);

	const channel = getState()
		.parameterReducer.parameterItems.filter(
			(item) => item.parameterType === CHANNEL,
		)
		.map((item) => {
			return configuratorReducer.channelsList.find(
				(channelsListItem) => channelsListItem.Number === item.parameterId,
			);
		})[0];

	dispatch(setSubmitOperationTitle(SubmitOperationTitle.DeletePosition));
	dispatch(
		setSubmitOperationBody(
			removeChannelFromGroupBody({
				itemNumber: Number(channel?.Number),
				itemName: String(channel?.Name),
				subItemNumber: groupNumber,
				subItemName: group?.Name,
			}),
		),
	);
	dispatch(setSubmitButtonText(SubmitButtonText.Delete));
	dispatch(setSubmitOperationFunction(SubmitOperation.RemoveChannelFromGroup));
	dispatch(openSubmitOperationModal());
};
export const removeChannelFromGroup = (
	dispatch: AppDispatch,
	getState: () => RootState,
) => {
	const {
		sortReducer,
		authReducer,
		configuratorReducer,
		contextMenuReducer,
		filtersReducer,
		parameterReducer,
	} = getState();
	const channelNumber = Number(
		parameterReducer.parameterItems.find(
			(item) => item.parameterType === CHANNEL,
		)?.parameterId,
	);

	const { groupsSortOrder } = sortReducer;
	const groupNumber = contextMenuReducer.parentId;
	const filterMode = configuratorReducer.groupPagination.filterMode;
	const mode = filtersReducer.groupsActiveFilter;
	const server = configuratorReducer.currentServer;
	const userId = authReducer.user?.preferredUsername;

	try {
		rxStompRPC
			.rpc({
				destination: rpcEndPoint,
				body: JSON.stringify(
					removeChannelFromGroupQuery({
						groupNumber: groupNumber,
						channelNumber: channelNumber,
						userId,
						moduleName: ModuleName.ChannelContextActions_removeChannelFromGroup,
					}),
				),
			})
			.subscribe(function (response: IMessage) {
				if (checkResponseOutputErrors(response)) {
					handleResponseOutputError(response);
				} else {
					dispatch(
						deleteChannelFromGroup({
							channelNumber,
							groupNumber,
						}),
					);
					dispatch(
						fetchGroupsList(
							1,
							COMMON_PAGE_ROW_COUNT,
							String(groupNumber),
							null,
							server,
							true,
							filterMode,
							mode,
							groupsSortOrder,
							userId,
						),
					);
					toast.success(
						`Канал ${channelNumber} успешно удален из группы ${groupNumber}`,
					);
				}
			});
	} catch (e) {
		console.log(e);
	}
};

export const disconnectChannelsSubmitting = (
	dispatch: AppDispatch,
	getState: () => RootState,
) => {
	const { parameterReducer } = getState();

	const parameterItems = parameterReducer.parameterItems;
	const channelNumbers = parameterItems
		.filter((item) => item.parameterType === CHANNEL)
		.map((item) => item.parameterId);

	const inlineChannelNumbers = channelNumbers.join(', ');

	dispatch(setSubmitOperationTitle(SubmitOperationTitle.DisconnectPosition));
	dispatch(
		setSubmitOperationBody(
			disconnectChannelsBody({
				channelsCount: channelNumbers.length,
				channels: inlineChannelNumbers,
			}),
		),
	);
	dispatch(setSubmitOperationFunction(SubmitOperation.DisconnectChannels));
	dispatch(setSubmitButtonText(SubmitButtonText.Disconnect));
	dispatch(openSubmitOperationModal());
};

export const disconnectChannels = (
	dispatch: AppDispatch,
	getState: () => RootState,
) => {
	const {
		sortReducer,
		authReducer,
		configuratorReducer,
		parameterReducer,
		filtersReducer,
	} = getState();
	const { unusedChannelsSortOrder, devicesSortOrder } = sortReducer;
	const server = configuratorReducer.currentServer;
	const userId = authReducer.user?.preferredUsername;
	const mode = filtersReducer.devicesActiveFilter;
	const filterMode = configuratorReducer.devicePagination.filterMode;

	const parameterItems = parameterReducer.parameterItems;
	const channelNumbers = parameterItems
		.filter((item) => item.parameterType === CHANNEL)
		.map((item) => item.parameterId);

	const deviceNumbers = parameterItems
		.filter((item) => item.parameterType === DEVICE)
		.map((item) => item.parameterId);

	const inlineChannelNumbers = channelNumbers.join(', ');

	try {
		rxStompRPC
			.rpc({
				destination: rpcEndPoint,
				body: JSON.stringify(
					disconnectChannelsQuery({
						channelNumbers: inlineChannelNumbers,
						userId,
						moduleName: ModuleName.ChannelContextActions_disconnectChannels,
					}),
				),
			})
			.subscribe(function (response: IMessage) {
				if (checkResponseOutputErrors(response)) {
					handleResponseOutputError(response);
				} else {
					deviceNumbers.forEach((number) => {
						dispatch(
							fetchDeviceList(
								1,
								1,
								String(number),
								server,
								true,
								filterMode,
								mode,
								devicesSortOrder,
								userId,
							),
						);
					});
					dispatch(
						fetchUnusedChannelsList(
							Number(server),
							1,
							COMMON_PAGE_ROW_COUNT,
							false,
							unusedChannelsSortOrder,
							null,
							userId,
						),
					);
					dispatch(removeParameterItems(CHANNEL));
					const isChannelSolo = !(channelNumbers.length > 1);
					toast.success(
						isChannelSolo
							? `Канал ${inlineChannelNumbers} успешно отключен`
							: `Каналы ${inlineChannelNumbers} успешно отключены`,
					);
				}
			});
	} catch (e) {
		console.log(e);
	}
};

export const updateChannelsCoefficients =
	(parametersData: ParamsBlock[]) =>
	(dispatch: AppDispatch, getState: () => RootState) => {
		const serverId = getState().configuratorReducer.currentServer;
		const userId = getState().authReducer.user?.preferredUsername;
		const groupNumber = getState().parameterReducer.parameterItems.find(
			(item) => item.parameterType === GROUP,
		)?.parameterId;

		const coefficient = parametersData.filter(
			(item) => item.header === CHANNEL_TO_GROUP_PARAMETERS,
		)[0].sortParams[0].value;

		const channelNumber = parametersData.filter(
			(item) => item.header === CHANNEL_PARAMETERS,
		)[0].sortParams[1].value;

		try {
			if (!Number(coefficient)) {
				throw Error('Введите корректный коэффициент');
			}
			rxStompRPC
				.rpc({
					destination: rpcEndPoint,
					body: JSON.stringify(
						updateChannelsCoefficientsQuery({
							groupNumber: Number(groupNumber),
							coefficient: Number(coefficient),
							channelsNumbers: String(channelNumber),
							userId,
							moduleName:
								ModuleName.ChannelContextActions_updateChannelsCoefficients,
						}),
					),
				})
				.subscribe(function (response: IMessage) {
					if (checkResponseOutputErrors(response)) {
						handleResponseOutputError(response);
					} else {
						dispatch(
							updateElementsLists(
								Number(groupNumber),
								GROUP,
								FORWARD_TREE,
								serverId,
							),
						);
						toast.success(
							`Коэффициент канала ${channelNumber} успешно изменен`,
						);
					}
				});
		} catch (e) {
			const error = e as Error;
			toast.error(error.message);
		} finally {
			dispatch(setIsCreating(false));
		}
	};

export const createGroupsFromChannels =
	(parametersData: ParamsBlock[]) =>
	(dispatch: AppDispatch, getState: () => RootState) => {
		const newGroupData = parametersData[0];
		const channelNumbers = newGroupData.sortParams[0].listItems;
		const channelInlineNumbers = String(channelNumbers?.join(', '));
		const namePrefix = String(newGroupData.sortParams[1].value);
		const groupStartNumber = Number(newGroupData.sortParams[2].value);
		const userId = getState().authReducer.user?.preferredUsername;

		try {
			rxStompRPC
				.rpc({
					destination: rpcEndPoint,
					body: JSON.stringify(
						createGroupsFromChannelsQuery({
							groupStartNumber,
							channelNumbers: channelInlineNumbers,
							namePrefix,
							userId,
							moduleName:
								ModuleName.ChannelContextActions_createGroupsFromChannels,
						}),
					),
				})
				.subscribe(function (response: IMessage) {
					if (checkResponseOutputErrors(response)) {
						handleResponseOutputError(response);
					} else {
						dispatch(setGroupsPaginationAvailable(false));
						dispatch(setGroupsFilterMode(1));
						dispatch(setGroupsFilterString(''));
						dispatch(setGroupsActiveFilter(1));
						setTimeout(() => {
							dispatch(
								positionOnElement(String(groupStartNumber), 1, GROUP, 1),
							);
						}, 1);

						const message =
							channelNumbers?.length === 1
								? `Группа ${groupStartNumber} из канала ${channelInlineNumbers} успешно создана`
								: `Группы из диапазона каналов ${channelInlineNumbers} успешно созданы`;
						toast.success(message);
					}
					dispatch(setIsCreating(false));
					dispatch(setGroupsPaginationAvailable(true));
				});
		} catch (e) {
			console.log(e);
		}
	};

export const createGroupFromChannels =
	(parametersData: ParamsBlock[]) =>
	(dispatch: AppDispatch, getState: () => RootState) => {
		const { authReducer, configuratorReducer } = getState();
		const serverId = Number(configuratorReducer.currentServer);
		const userId = authReducer.user?.preferredUsername;
		const { channelsList, unusedChannelsList } = configuratorReducer;
		const totalChannelsList = channelsList.concat(unusedChannelsList);
		const newGroupData = parametersData[0].sortParams;
		const channelNumbers = newGroupData[0].listItems;
		const firstChannel = totalChannelsList.find(
			(channelItem) =>
				channelItem.Number === (channelNumbers && channelNumbers[0]),
		);
		const firstChannelMethod = Number(firstChannel?.FK_Methods);
		const firstChannelUnit = Number(firstChannel?.Unit_ID);

		const channelInlineNumbers = String(channelNumbers?.join(', '));
		const groupName = String(getParameterValue(newGroupData, NAME_PARAM));
		const groupNumber = Number(
			getParameterValue(newGroupData, NUMBER_GROUP_PARAM),
		);

		try {
			channelNumbers?.forEach((channelNumber) => {
				if (
					totalChannelsList.find(
						(channelItem) => channelItem.Number === channelNumber,
					)?.FK_TypeStorage === 1
				) {
					throw Error(
						'Попытка создания группы из каналов с нерегламентированным типом хранения данных',
					);
				}
			});
			rxStompRPC
				.rpc({
					destination: rpcEndPoint,
					body: JSON.stringify(
						createGroupsQuery({
							name: groupName,
							number: groupNumber,
							unit: firstChannelUnit,
							method: firstChannelMethod,
							typeStorage: 0,
							server: serverId,
							userId: userId,
							moduleName:
								ModuleName.ChannelContextActions_createGroupFromChannels,
						}),
					),
				})
				.subscribe(function (response: IMessage) {
					if (checkResponseOutputErrors(response)) {
						handleResponseOutputError(response);
					} else {
						rxStompRPC
							.rpc({
								destination: rpcEndPoint,
								body: JSON.stringify(
									includeChannelsToGroupQuery({
										groupNumber: groupNumber,
										channels: channelInlineNumbers,
										coefficient: 1,
										userId,
										moduleName:
											ModuleName.ChannelContextActions_createGroupFromChannels,
									}),
								),
							})
							.subscribe(function (response: IMessage) {
								if (checkResponseOutputErrors(response)) {
									handleResponseOutputError(response);
								} else {
									dispatch(setGroupsPaginationAvailable(false));
									dispatch(setGroupsFilterMode(1));
									dispatch(setGroupsFilterString(''));
									dispatch(setGroupsActiveFilter(1));
									setTimeout(() => {
										dispatch(
											positionOnElement(String(groupNumber), 1, GROUP, 1),
										);
									}, 1);
									const message = `Группа ${groupNumber} из каналов ${channelInlineNumbers} успешно создана`;
									toast.success(message);
								}
								setGroupsPaginationAvailable(true);
								dispatch(setIsCreating(false));
							});
					}
				});
		} catch (e) {
			const error = e as Error;
			toast.error(error.message);
		}
	};
