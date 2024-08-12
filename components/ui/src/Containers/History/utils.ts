import {
	HistoryElementType,
	HistoryElementTypeName,
} from '../../Store/reducers/HistorySlice/types';
import {
	ContextMenuType,
	DEVICE_DEFAULT_CONTEXT_MENU,
	DEVICE_IN_CHANNEL_CONTEXT_MENU,
	GROUP_DEFAULT_CONTEXT_MENU,
	GROUP_IN_CHANNEL_CONTEXT_MENU,
} from '../../Types/ContextMenuTypes';

/**
 * Function to get type of history element based on chosen context menu type
 */
export const getElementTypeByMenuType = (menuType: ContextMenuType) => {
	if (
		menuType === GROUP_DEFAULT_CONTEXT_MENU ||
		menuType === GROUP_IN_CHANNEL_CONTEXT_MENU
	) {
		return HistoryElementType.GROUP;
	}
	if (
		menuType === DEVICE_DEFAULT_CONTEXT_MENU ||
		menuType === DEVICE_IN_CHANNEL_CONTEXT_MENU
	) {
		return HistoryElementType.DEVICE;
	}
	return HistoryElementType.CHANNEL;
};

/**
 * Function to get RU name of the element type by it's type
 */
export const getElementTypeName = (type: HistoryElementType) => {
	return HistoryElementTypeName[
		HistoryElementType[type] as keyof typeof HistoryElementType
	];
};
