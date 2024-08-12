import { createEvent } from 'effector';

import { OptimizedPagination } from '../../Shared/types';
import { TreeItem } from '../../UI/Tree/types';

import { Device } from './types';

export const setDevicesList = createEvent<Device[]>();
export const clearDevicesList = createEvent();
export const setDevicesIsLoading = createEvent<boolean>();
export const setDevicesPagination = createEvent<Partial<OptimizedPagination>>();
export const clearDevicesPagination = createEvent();
export const setDevicesActiveNode = createEvent<TreeItem | undefined>();
export const setDevicesChannelActiveNode = createEvent<TreeItem | undefined>();
export const toggleDevicesNode = createEvent<TreeItem>();
export const rollupDevicesNodes = createEvent();
export const toggleDeviceById = createEvent<number>();
export const openDeviceById = createEvent<number>();
export const setDevicesListURSV510 = createEvent<Device[]>();
export const clearDevicesListURSV510 = createEvent();
export const setDevicesIsLoadingURSV510 = createEvent<boolean>();
export const setDevicesPaginationURSV510 =
	createEvent<Partial<OptimizedPagination>>();
export const clearDevicesPaginationURSV510 = createEvent();
export const setDevicesActiveNodeURSV510 = createEvent<TreeItem | undefined>();
export const setDevicesChannelActiveNodeURSV510 = createEvent<
	TreeItem | undefined
>();
export const toggleDevicesNodeURSV510 = createEvent<TreeItem>();
export const rollupDevicesNodesURSV510 = createEvent();
export const toggleDeviceByIdURSV510 = createEvent<number>();
export const openDeviceByIdURSV510 = createEvent<number>();
