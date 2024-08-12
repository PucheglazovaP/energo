import {
	deleteChannel,
	disconnectChannels,
	removeChannelFromGroup,
} from '../../Store/reducers/ContextMenuSlice/Channel/channelContextActions';
import { deleteDevice } from '../../Store/reducers/ContextMenuSlice/Device/deviceContextActions';
import { deleteGroup } from '../../Store/reducers/ContextMenuSlice/Group/groupContextActions';

import { SubmitOperation } from './types';

export const submitActions = {
	[SubmitOperation.DeleteGroup]: deleteGroup,
	[SubmitOperation.DeleteDevice]: deleteDevice,
	[SubmitOperation.RemoveChannelFromGroup]: removeChannelFromGroup,
	[SubmitOperation.DeleteChannel]: deleteChannel,
	[SubmitOperation.DisconnectChannels]: disconnectChannels,
};
