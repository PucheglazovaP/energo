import { OperationType } from './ParametersBlockTypes';

export const GROUP_DEFAULT_CONTEXT_MENU = 'group_default_context_menu';
export const DEVICE_DEFAULT_CONTEXT_MENU = 'device_default_context_menu';
export const CHANNEL_IN_GROUP_CONTEXT_MENU = 'channel_in_group_context_menu';
export const DEVICE_IN_CHANNEL_CONTEXT_MENU = 'device_in_channel_context_menu';
export const CHANNEL_IN_DEVICE_CONTEXT_MENU = 'channel_in_device_context_menu';
export const GROUP_IN_CHANNEL_CONTEXT_MENU = 'group_in_channel_context_menu';
export const UNUSED_CHANNEL_CONTEXT_MENU = 'unused_channel_context_menu';
export const GROUPS_SERVER_CONTEXT_MENU = 'groups_server_context_menu';
export const DEVICES_SERVER_CONTEXT_MENU = 'devices_server_context_menu';
export const UNUSED_CHANNELS_SERVER_CONTEXT_MENU =
	'unused_channels_server_context_menu';

export interface ContextMenuItem {
	name: string;
	onClick: () => void;
	icon?: string;
	needRenderSeparator?: boolean;
	disabled?: boolean;
	isVisible?: boolean;
}
export type PositionTypes = number[] | undefined[];

export interface ContextMenuTypes {
	position: PositionTypes;
	items: ContextMenuItem[];
	id: number;
	parentId: number;
	type: ContextMenuType;
	itemTitle: string;
}

export type SetContextMenuType = (
	id: number,
	parentId: number,
	menuType: ContextMenuType,
	position: number[],
	itemTitle: string,
) => void;

export type ContextMenuType =
	| typeof GROUP_DEFAULT_CONTEXT_MENU
	| typeof GROUP_IN_CHANNEL_CONTEXT_MENU
	| typeof DEVICE_DEFAULT_CONTEXT_MENU
	| typeof DEVICE_IN_CHANNEL_CONTEXT_MENU
	| typeof CHANNEL_IN_GROUP_CONTEXT_MENU
	| typeof CHANNEL_IN_DEVICE_CONTEXT_MENU
	| typeof UNUSED_CHANNEL_CONTEXT_MENU
	| typeof GROUPS_SERVER_CONTEXT_MENU
	| typeof UNUSED_CHANNELS_SERVER_CONTEXT_MENU
	| typeof DEVICES_SERVER_CONTEXT_MENU;

export type DictionaryType = {
	[id: string]: ContextMenuItem[];
};

export type ContextMenuItemClickType = {
	operationType: OperationType | null;
	needToClear?: boolean;
	updateConfiguratorFunction?: CallableFunction | null;
};
