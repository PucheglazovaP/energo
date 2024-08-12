import { OptimizedPagination } from '../../Shared/types';
import { TreeItem } from '../../UI/Tree/types';

import { Device, DevicesModel } from './types';

export function setDevicesListHandler(
	state: DevicesModel,
	list: Device[],
): DevicesModel {
	return {
		...state,
		list,
	};
}
export function clearDevicesListHandler(state: DevicesModel): DevicesModel {
	return {
		...state,
		list: [],
	};
}
export function setDevicesIsLoadingHandler(
	state: DevicesModel,
	isLoading: boolean,
): DevicesModel {
	return {
		...state,
		isLoading,
	};
}
export function setDevicesPaginationHandler(
	state: DevicesModel,
	pagination: Partial<OptimizedPagination>,
): DevicesModel {
	return {
		...state,
		pagination: {
			...state.pagination,
			...pagination,
		},
	};
}
export function clearDevicesPaginationHandler(
	state: DevicesModel,
): DevicesModel {
	return {
		...state,
		pagination: {
			positionRow: 0,
			pageTotalCount: 1,
			pageNumber: 1,
			rowsPerPage: 100,
		},
	};
}
export function setDevicesActiveNodeHandler(
	state: DevicesModel,
	activeNode: TreeItem | undefined,
): DevicesModel {
	return {
		...state,
		activeNode,
	};
}
export function toggleDevicesNodeHandler(
	state: DevicesModel,
	node: TreeItem,
): DevicesModel {
	const chosenNodeIdx = state.list.findIndex(
		(device: Device) => device.id === node.id,
	);
	if (chosenNodeIdx !== -1) {
		const newList = [...state.list];
		newList[chosenNodeIdx] = {
			...newList[chosenNodeIdx],
			isOpen: !newList[chosenNodeIdx].isOpen,
		};
		return {
			...state,
			list: newList,
		};
	}
	return { ...state };
}
export function toggleDeviceByIdHandler(
	state: DevicesModel,
	id: number,
): DevicesModel {
	const newList = state.list.map((device: Device) => {
		if (device.id === id) {
			return { ...device, isOpen: !device.isOpen };
		}
		return device;
	});
	return {
		...state,
		list: newList,
	};
}
export function openDeviceByIdHandler(
	state: DevicesModel,
	id: number,
): DevicesModel {
	const newList = state.list.map((device: Device) => {
		if (device.id === id) {
			return { ...device, isOpen: true };
		}
		return device;
	});
	return {
		...state,
		list: newList,
	};
}
export function rollupDevicesNodesHandler(state: DevicesModel): DevicesModel {
	const newList = state.list.map((node: Device) => ({
		...node,
		isOpen: false,
	}));
	return {
		...state,
		list: newList,
	};
}
