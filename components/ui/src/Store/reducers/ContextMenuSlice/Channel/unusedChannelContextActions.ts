import { toast } from 'react-toastify';
import { IMessage } from '@stomp/stompjs';

import {
	CHANNEL,
	COMMON_PAGE_ROW_COUNT,
	DEVICE,
	METHOD_PARAM,
	NAME_PARAM,
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
	updateElementsLists,
	updateUnusedChannels,
} from '../../ConfiguratorSlice/configuratorActions';
import { filterUnusedChannelsList } from '../../ConfiguratorSlice/configuratorSlice';
import {
	removeParameterItems,
	setIsCreating,
} from '../../ParametersSlice/parametersSlice';

import { connectChannelsToDeviceQuery } from './queries/connectChannelsToDeviceQuery';
import { updateChannelQuery } from './queries/updateChannelQuery';
import { updateChannelsQuery } from './queries/updateChannelsQuery';

export const editUnusedChannels =
	(parametersData: ParamsBlock[]) =>
	(dispatch: AppDispatch, getState: () => RootState) => {
		const { sortReducer, authReducer, configuratorReducer, parameterReducer } =
			getState();
		const server = configuratorReducer.currentServer;
		const userId = authReducer.user?.preferredUsername;
		const { unusedChannelsSortOrder } = sortReducer;
		const channelItemsToUpdate = parameterReducer.parameterItems
			.filter((item) => item.parameterType === CHANNEL)
			.map((item) => {
				let channelItem = configuratorReducer.unusedChannelsList.find(
					(channelsListItem) => channelsListItem.Number === item.parameterId,
				);
				if (!channelItem) {
					channelItem = configuratorReducer.channelsList.find(
						(channelsListItem) => channelsListItem.Number === item.parameterId,
					);
				}
				return {
					Number: item.parameterId,
					LastModified: channelItem?.LastModified,
				};
			});

		const channelNumbersToUpdate = channelItemsToUpdate
			.map((item) => item.Number)
			.sort();

		let requestBody: object;
		let successMessage: string;

		if (channelItemsToUpdate.length > 1) {
			const newChannelData = parametersData[1].sortParams;
			const resultChannelsString = { info: channelItemsToUpdate };
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
			successMessage = `Каналы ${channelNumbersToUpdate.join(
				', ',
			)} успешно отредактированы`;
		} else {
			const newChannelData = parametersData[0].sortParams;
			const channelName = String(getParameterValue(newChannelData, NAME_PARAM));
			const fkUnits = Number(getParameterValue(newChannelData, UNIT_PARAM));
			const fkMethods = Number(getParameterValue(newChannelData, METHOD_PARAM));
			const fkTypeStorage = Number(
				getParameterValue(newChannelData, STORAGE_TYPE_PARAM),
			);
			requestBody = updateChannelQuery({
				channelNumber: channelItemsToUpdate[0].Number,
				channelName,
				fkDevices: null,
				fkUnits,
				fkTypeStorage,
				fkMethods,
				lastModified: String(channelItemsToUpdate[0].LastModified),
				userId,
				moduleName: ModuleName.ChannelContextActions_editUnusedChannels,
			});
			successMessage = `Канал ${channelNumbersToUpdate[0]} успешно отредактирован`;
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
							updateUnusedChannels(
								Number(server),
								channelNumbersToUpdate[0],
								channelNumbersToUpdate[channelNumbersToUpdate.length - 1],
								unusedChannelsSortOrder,
								userId,
							),
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
export const connectChannelsToDevice =
	() => (dispatch: AppDispatch, getState: () => RootState) => {
		const { sortReducer, authReducer, configuratorReducer, parameterReducer } =
			getState();

		const parametersItems = parameterReducer.parameterItems;
		const serverId = configuratorReducer.currentServer;
		const userId = authReducer.user?.preferredUsername;
		const { devicesSortOrder } = sortReducer;

		const channelsNumbers = parametersItems
			.filter((item) => item.parameterType === CHANNEL)
			.map((item) => {
				return item.parameterId;
			})
			.sort();

		const channelsString = channelsNumbers.join(', ');

		const deviceNumber = parametersItems.filter(
			(item) => item.parameterType === DEVICE,
		)[0].parameterId;

		try {
			rxStompRPC
				.rpc({
					destination: rpcEndPoint,
					body: JSON.stringify(
						connectChannelsToDeviceQuery({
							deviceNumber,
							channelsNumbers: channelsString,
							userId,
							moduleName:
								ModuleName.UnusedChannelContextActions_connectChannelsToDeviceQuery,
						}),
					),
				})
				.subscribe(function (response: IMessage) {
					if (checkResponseOutputErrors(response)) {
						handleResponseOutputError(response);
					} else {
						channelsNumbers.forEach((number) =>
							dispatch(filterUnusedChannelsList(number)),
						);
						dispatch(removeParameterItems(CHANNEL));
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
							updateElementsLists(deviceNumber, DEVICE, REVERSE_TREE, serverId),
						);
						toast.success(
							`Каналы ${channelsNumbers} успешно подключены к прибору №${deviceNumber}`,
						);
					}
				});
		} catch (e) {
			console.log(e);
		}
	};
