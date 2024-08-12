import { CHANNEL, DEVICE, GROUP } from '../../../Const';
import { GroupsListItemType, TreeItemType } from '../../../Types';
import {
	ContextMenuType,
	DEVICE_DEFAULT_CONTEXT_MENU,
	DEVICE_IN_CHANNEL_CONTEXT_MENU,
	GROUP_DEFAULT_CONTEXT_MENU,
	GROUP_IN_CHANNEL_CONTEXT_MENU,
} from '../../../Types/ContextMenuTypes';

export const getTreeItemTypeByMenuType = (
	menuType: ContextMenuType,
): TreeItemType => {
	if (
		menuType === GROUP_DEFAULT_CONTEXT_MENU ||
		menuType === GROUP_IN_CHANNEL_CONTEXT_MENU
	) {
		return GROUP;
	}
	if (
		menuType === DEVICE_DEFAULT_CONTEXT_MENU ||
		menuType === DEVICE_IN_CHANNEL_CONTEXT_MENU
	) {
		return DEVICE;
	}
	return CHANNEL;
};

export const getGroupItemEditingAvailable = (
	groupsList: GroupsListItemType[],
	id: number,
): boolean => {
	return !!groupsList.find((item) => item.Number === id)?.CanEdit;
};
