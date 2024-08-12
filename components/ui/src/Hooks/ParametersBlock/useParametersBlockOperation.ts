import { useCallback, useMemo } from 'react';

import {
	CREATE_DEVICE,
	CREATE_DEVICES,
	CREATE_GROUP_COPY,
	CREATE_GROUP_FROM_CHANNELS,
	CREATE_GROUPS,
	CREATE_GROUPS_FROM_CHANNELS,
	CREATE_NEW_CHANNELS,
	INCLUDE_CHANNELS_TO_GROUP,
	INCLUDE_UNUSED_CHANNELS_TO_GROUP,
	UPDATE_CHANNEL,
	UPDATE_CHANNEL_COEFFICIENT,
	UPDATE_DEVICE,
	UPDATE_GROUP,
	UPDATE_UNUSED_CHANNEL,
} from '../../Const/parametersBlock';
import {
	createGroupFromChannels,
	createGroupsFromChannels,
	createNewChannels,
	includeChannelsToGroup,
	updateChannels,
	updateChannelsCoefficients,
} from '../../Store/reducers/ContextMenuSlice/Channel/channelContextActions';
import { editUnusedChannels } from '../../Store/reducers/ContextMenuSlice/Channel/unusedChannelContextActions';
import {
	createDevice,
	createDevices,
	updateDevice,
} from '../../Store/reducers/ContextMenuSlice/Device/deviceContextActions';
import {
	createGroupCopy,
	createGroups,
	updateGroup,
} from '../../Store/reducers/ContextMenuSlice/Group/groupContextActions';
import { setIsCreating } from '../../Store/reducers/ParametersSlice/parametersSlice';
import { ParamsBlock } from '../../Types/ParametersBlockTypes';
import useAppDispatch from '../Store/useAppDispatch';
import { useAppSelector } from '../Store/useAppSelector';

export function useParametersBlockOperation(parametersData: ParamsBlock[]) {
	const dispatch = useAppDispatch();
	const { operationType } = useAppSelector((state) => state.parameterReducer);
	const confirmFunctions = useMemo((): any => {
		return {
			[CREATE_GROUPS]: createGroups,
			[CREATE_GROUP_COPY]: createGroupCopy,
			[UPDATE_GROUP]: updateGroup,

			[CREATE_DEVICE]: createDevice,
			[CREATE_DEVICES]: createDevices,
			[UPDATE_DEVICE]: updateDevice,

			[INCLUDE_CHANNELS_TO_GROUP]: includeChannelsToGroup,
			[UPDATE_CHANNEL]: updateChannels,
			[CREATE_NEW_CHANNELS]: createNewChannels,
			[UPDATE_CHANNEL_COEFFICIENT]: updateChannelsCoefficients,

			[UPDATE_UNUSED_CHANNEL]: editUnusedChannels,
			[INCLUDE_UNUSED_CHANNELS_TO_GROUP]: includeChannelsToGroup,
			[CREATE_GROUPS_FROM_CHANNELS]: createGroupsFromChannels,
			[CREATE_GROUP_FROM_CHANNELS]: createGroupFromChannels,
		};
	}, []);

	const confirmFunction = useCallback(() => {
		if (operationType === null) return;
		return dispatch(confirmFunctions[operationType](parametersData));
	}, [operationType, parametersData, dispatch, confirmFunctions]);

	const cancelFunction = useCallback(() => {
		dispatch(setIsCreating(false));
	}, [dispatch]);
	return { confirmFunction, cancelFunction };
}
