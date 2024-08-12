import { combine, createStore, sample } from 'effector';

import { convertDevicesToTree } from '../../Adapters/Tree/devices';
import { convertNodeItemsToTree } from '../../Adapters/Tree/nodeItems';
import { convertNodesToTree } from '../../Adapters/Tree/nodes';
import { convertServersToTree } from '../../Adapters/Tree/servers';
import { AvailableFiltersByObjectTypes } from '../../Shared/types';
import { ModuleName } from '../../Shared/Types/moduleName';
import { $user } from '../Auth';
import { $devices } from '../Devices';
import { getDevicesListFx } from '../Devices/effects';
import { $nodeItems } from '../NodeItems';
import { $nodes } from '../Nodes';
import { $selectedRow } from '../NSIMeasuringInstruments';
import { $servers } from '../Servers';

import { getAvailableFiltersNSIFx, getFilteredDevicesListFx } from './effects';
import {
	clearNSIParameterFilter,
	clearNSIParameterFilters,
	setAreDevicesNotFound,
	setNSICurrentObjectType,
	setNSIExtendedFiltersCheckedIds,
	setNSIExtendedFiltersCheckedIdsConfirmed,
	setNSIExtendedFiltersParameterCheckedIds,
	setNSIParametersExtendedFilterStr,
} from './events';

export const $nsiTreeDevices = combine(
	$servers,
	$devices,
	$nodes,
	$nodeItems,
	$selectedRow,
	(serversModel, devicesModel, nodesModel, nodeItemsModel, selectedRow) => {
		const { list: serversList } = serversModel;
		const { list: devicesList } = devicesModel;
		const { list: nodesList } = nodesModel;
		const { list: nodeItemsList } = nodeItemsModel;

		const treeServers = convertServersToTree(serversList);
		const treeDevices = convertDevicesToTree(devicesList);
		const treeNodes = convertNodesToTree(nodesList);
		const treeNodeItems = convertNodeItemsToTree(nodeItemsList, selectedRow);
		return [...treeServers, ...treeDevices, ...treeNodes, ...treeNodeItems];
	},
);

export const $nsiCurrentObjectType = createStore<string | null>(null).on(
	setNSICurrentObjectType,
	(state, objectType: string | null) => objectType,
);

export const $nsiAvailableFilters = createStore<AvailableFiltersByObjectTypes>(
	{},
).on(
	getAvailableFiltersNSIFx.doneData,
	(state, response: AvailableFiltersByObjectTypes) => response,
);

export const $nsiCurrentAvailableFilters = combine(
	$nsiCurrentObjectType,
	$nsiAvailableFilters,
	(
		objectType: string | null,
		availableFilters: AvailableFiltersByObjectTypes,
	) => {
		if (objectType === null || !availableFilters[objectType]) {
			return null;
		}

		return availableFilters[objectType];
	},
);

export const $nsiExtendedFiltersCheckedIds = createStore<Map<number, number[]>>(
	new Map([]),
)
	.on(
		setNSIExtendedFiltersParameterCheckedIds,
		(state, { parameterId, checkedIds }) => {
			state.set(parameterId, checkedIds);

			return new Map(JSON.parse(JSON.stringify(Array.from(state))));
		},
	)
	.on(
		setNSIExtendedFiltersCheckedIds,
		(state, payload: Map<number, number[]>) => {
			return new Map(JSON.parse(JSON.stringify(Array.from(payload))));
		},
	);

export const $nsiExtendedFiltersCheckedIdsConfirmed = createStore<
	Map<number, number[]>
>(new Map())
	.on(
		setNSIExtendedFiltersCheckedIdsConfirmed,
		(state, payload: Map<number, number[]>) => {
			return new Map(JSON.parse(JSON.stringify(Array.from(payload))));
		},
	)
	.on(clearNSIParameterFilter, (state, parameterId) => {
		if (state.has(parameterId)) {
			state.set(parameterId, []);
		}

		return new Map(JSON.parse(JSON.stringify(Array.from(state))));
	})
	.on(clearNSIParameterFilters, (state) => {
		for (let [key] of state) {
			state.set(key, []);
		}

		return new Map(JSON.parse(JSON.stringify(Array.from(state))));
	});
export const $nsiParametersExtendedFilterJSON =
	$nsiExtendedFiltersCheckedIdsConfirmed.map((checkedIds) => {
		const filterArr: { param: number; value: number }[] = [];

		for (let [key, values] of checkedIds) {
			if (values.length > 0) {
				for (let value of values) {
					filterArr.push({ param: key, value });
				}
			}
		}
		const filterStr = filterArr.length > 0 ? JSON.stringify(filterArr) : '';

		return filterStr;
	});
export const $nsiParametersExtendedFilterStr = createStore<string>('').on(
	setNSIParametersExtendedFilterStr,
	(state, filterStr: string) => filterStr,
);
export const $areDevicesNotFound = createStore<boolean>(false).on(
	setAreDevicesNotFound,
	(state, areDevicesNotFound: boolean) => areDevicesNotFound,
);

sample({
	source: {
		currentFilters: $nsiCurrentAvailableFilters,
		checkedIds: $nsiExtendedFiltersCheckedIdsConfirmed,
	},
	filter: ({ currentFilters }) => currentFilters !== null,
	fn: ({ currentFilters, checkedIds }) => {
		if (currentFilters) {
			const idsMap = new Map();

			for (let filter of currentFilters) {
				if (filter.type === 'parameter') {
					const ids = checkedIds.get(filter.id);
					if (ids) {
						idsMap.set(filter.id, ids);
					} else {
						idsMap.set(filter.id, []);
					}
				}
			}

			setNSIExtendedFiltersCheckedIds(idsMap);
		}
	},
});

sample({
	source: {
		filterStr: $nsiParametersExtendedFilterJSON,
		user: $user,
	},
	clock: [
		setNSIExtendedFiltersCheckedIdsConfirmed,
		clearNSIParameterFilter,
		clearNSIParameterFilters,
	],
	fn: ({ filterStr, user }) => {
		if (user) {
			if (filterStr) {
				getFilteredDevicesListFx({
					filterStr,
					userId: user.preferredUsername,
					moduleName:
						ModuleName.NSITreeDevices_model_sample_getFilteredDevicesListFx,
				}).then((value) => {
					console.log(value);
					setNSIParametersExtendedFilterStr(value);

					if (value) {
						getDevicesListFx({
							pageNumber: 1,
							userId: user.preferredUsername,
							filterMode: 1,
							filterStr: value,
						});
						setAreDevicesNotFound(false);
					} else {
						setAreDevicesNotFound(true);
					}
				});
			} else {
				getDevicesListFx({
					pageNumber: 1,
					userId: user.preferredUsername,
					filterMode: 1,
					filterStr: '',
				});
				setAreDevicesNotFound(false);
			}
		}
	},
});
