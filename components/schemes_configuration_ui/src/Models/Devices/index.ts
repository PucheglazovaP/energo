import { createStore } from 'effector';

import { fetchDevicesFxHandler } from './effectHandlers';
import { fetchDevicesURSV510Fx } from './effects';
import {
	clearDevicesListHandler,
	clearDevicesPaginationHandler,
	openDeviceByIdHandler,
	rollupDevicesNodesHandler,
	setDevicesActiveNodeHandler,
	setDevicesIsLoadingHandler,
	setDevicesListHandler,
	setDevicesPaginationHandler,
	toggleDeviceByIdHandler,
	toggleDevicesNodeHandler,
} from './eventHandlers';
import {
	clearDevicesList,
	clearDevicesListURSV510,
	clearDevicesPagination,
	clearDevicesPaginationURSV510,
	openDeviceById,
	openDeviceByIdURSV510,
	rollupDevicesNodes,
	rollupDevicesNodesURSV510,
	setDevicesActiveNode,
	setDevicesActiveNodeURSV510,
	setDevicesIsLoading,
	setDevicesIsLoadingURSV510,
	setDevicesList,
	setDevicesListURSV510,
	setDevicesPagination,
	setDevicesPaginationURSV510,
	toggleDeviceById,
	toggleDeviceByIdURSV510,
	toggleDevicesNode,
	toggleDevicesNodeURSV510,
} from './events';
import { DevicesModel } from './types';

const initState: DevicesModel = {
	list: [],
	pagination: {
		positionRow: 0,
		pageTotalCount: 1,
		pageNumber: 1,
		rowsPerPage: 100,
	},
	isLoading: false,
	activeNode: undefined,
};

/**
 * This store responsible not only for fetching devices, but for holding
 * entire tree logic of 'Devices and channels'. It includes pagination and
 * positioning
 */
export const $devices = createStore<DevicesModel>(initState);
export const $devicesURSV510 = createStore<DevicesModel>(initState);

$devices.on(setDevicesList, setDevicesListHandler);

$devices.on(setDevicesIsLoading, setDevicesIsLoadingHandler);

$devices.on(clearDevicesList, clearDevicesListHandler);

$devices.on(setDevicesPagination, setDevicesPaginationHandler);

$devices.on(clearDevicesPagination, clearDevicesPaginationHandler);

$devices.on(setDevicesActiveNode, setDevicesActiveNodeHandler);

$devices.on(toggleDevicesNode, toggleDevicesNodeHandler);

$devices.on(toggleDeviceById, toggleDeviceByIdHandler);

$devices.on(openDeviceById, openDeviceByIdHandler);

$devices.on(rollupDevicesNodes, rollupDevicesNodesHandler);

$devicesURSV510.on(setDevicesListURSV510, setDevicesListHandler);

$devicesURSV510.on(setDevicesIsLoadingURSV510, setDevicesIsLoadingHandler);

$devicesURSV510.on(clearDevicesListURSV510, clearDevicesListHandler);

$devicesURSV510.on(setDevicesPaginationURSV510, setDevicesPaginationHandler);

$devicesURSV510.on(
	clearDevicesPaginationURSV510,
	clearDevicesPaginationHandler,
);

$devicesURSV510.on(setDevicesActiveNodeURSV510, setDevicesActiveNodeHandler);

$devicesURSV510.on(toggleDevicesNodeURSV510, toggleDevicesNodeHandler);

$devicesURSV510.on(toggleDeviceByIdURSV510, toggleDeviceByIdHandler);

$devicesURSV510.on(openDeviceByIdURSV510, openDeviceByIdHandler);

$devicesURSV510.on(rollupDevicesNodesURSV510, rollupDevicesNodesHandler);

$devicesURSV510.on(fetchDevicesURSV510Fx.doneData, fetchDevicesFxHandler);
