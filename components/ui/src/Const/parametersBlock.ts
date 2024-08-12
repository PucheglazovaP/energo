//Типы операций с группами
export const CREATE_GROUPS = 'create_groups';
export const CREATE_GROUP_COPY = 'create_group_copy';
export const UPDATE_GROUP = 'update_group';
export const DELETE_GROUP = 'delete_group';

//Типы операций с приборами
export const CREATE_DEVICE = 'create_device';
export const CREATE_DEVICES = 'create_devices';
export const UPDATE_DEVICE = 'update_device';

//Типы операций с каналами
export const INCLUDE_CHANNELS_TO_GROUP = 'include_channels_to_group';
export const UPDATE_CHANNEL = 'update_channel';
export const CREATE_NEW_CHANNELS = 'create_new_channels';
export const UPDATE_CHANNEL_COEFFICIENT = 'update_channel_coefficient';
export const CREATE_GROUPS_FROM_CHANNELS = 'create_groups_from_channels';
export const CREATE_GROUP_FROM_CHANNELS = 'create_group_from_channels';

//Типы операций с неподключенными каналами
export const UPDATE_UNUSED_CHANNEL = 'update_unused_channel';
export const INCLUDE_UNUSED_CHANNELS_TO_GROUP =
	'include_unused_channels_to_group';
