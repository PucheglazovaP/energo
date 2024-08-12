import { createStore, sample } from 'effector';

import { fetchChannelsDiagnosticFx } from './effects';
import {
	applyFilters,
	changeInterval,
	resetFilterIndicators,
	setChannels,
	setFilteredChannels,
	setFilterStorage,
	setPartialModel,
	toggleFilterIndicator,
	toggleFilterIndicatorAll,
} from './events';
import {
	Channel,
	ChannelDiagnosticModel,
	FilterIndicator,
	FilterIndicatorToChannelPropDictionary,
	FilterIndicatorToStorageDictionary,
	FilterStorage,
	FilterStorageToChannelPropDictionary,
} from './types';

const init: ChannelDiagnosticModel = {
	channels: [],
	filteredChannels: [],
	interval: 0,
	channelIdFilterStorage: [],
	channelNameFilterStorage: [],
	errorFilterStorage: [],
	deviceIdFilterStorage: [],
	deviceNameFilterStorage: [],
	channelIdFilterIndicator: new Map(),
	channelNameFilterIndicator: new Map(),
	deviceIdFilterIndicator: new Map(),
	deviceNameFilterIndicator: new Map(),
	errorFilterIndicator: new Map(),
};

export const $channelsDiagnostic = createStore<ChannelDiagnosticModel>(init);

$channelsDiagnostic.on(setChannels, (state, channels) => ({
	...state,
	channels,
}));

$channelsDiagnostic.on(setFilteredChannels, (state, channels) => ({
	...state,
	filteredChannels: channels,
}));

$channelsDiagnostic.on(changeInterval, (state, interval) => ({
	...state,
	interval,
}));

$channelsDiagnostic.on(setFilterStorage, (state, payload) => {
	const { accessor, items } = payload;
	return {
		...state,
		[accessor]: items,
	};
});

$channelsDiagnostic.on(toggleFilterIndicator, (state, payload) => {
	const { accessor, id } = payload;
	const indicators: Map<string, boolean> = new Map(state[accessor]);
	const flag: boolean = indicators.get(id) || false;
	if (flag) {
		indicators.delete(id);
	} else {
		indicators.set(id, true);
	}
	return {
		...state,
		[accessor]: indicators,
	};
});

$channelsDiagnostic.on(toggleFilterIndicatorAll, (state, accessor) => {
	const indicators: Map<string, boolean> = new Map(state[accessor]);
	const isSelected: boolean = [...indicators.values()].some((val) => val);
	const storageKey: FilterStorage | undefined =
		FilterIndicatorToStorageDictionary[accessor];
	if (storageKey) {
		const storage = state[storageKey];
		for (const item of storage) {
			if (isSelected) {
				indicators.delete(item.name);
			} else {
				indicators.set(item.name, true);
			}
		}
	}
	return {
		...state,
		[accessor]: indicators,
	};
});

$channelsDiagnostic.on(setPartialModel, (state, partial) => ({
	...state,
	...partial,
}));

$channelsDiagnostic.on(resetFilterIndicators, (state) => {
	const filterIndicators = Object.values(FilterIndicator).reduce(
		(acc, curr) => {
			acc[curr] = new Map();
			return acc;
		},
		{} as Partial<ChannelDiagnosticModel>,
	);
	return {
		...state,
		...filterIndicators,
	};
});

// DECLARATIVES

// Set channels when fetching is done
sample({
	clock: fetchChannelsDiagnosticFx.doneData,
	target: setChannels,
});

// Clear filter indicators when fetching is done
sample({
	clock: fetchChannelsDiagnosticFx.doneData,
	target: resetFilterIndicators,
});

// Set filter storages when fetching is done
// Also, initiate filtered channels with the fetched value
sample({
	clock: fetchChannelsDiagnosticFx.doneData,
	source: $channelsDiagnostic,
	fn: (_src, clk) => {
		const filters = clk.reduce((acc, curr) => {
			// Loop through all filter options from dictionary
			for (const [key, value] of Object.entries(
				FilterStorageToChannelPropDictionary,
			)) {
				// add type to key to not cast it everywhere
				const typedKey = key as FilterStorage;
				// Add filter prop to accumulator with empty array as init
				if (!Object.prototype.hasOwnProperty.call(acc, typedKey)) {
					acc[typedKey] = [];
				}
				// Add element to the accumulator[typedKey] only
				// if it's not represented there yet
				if (!acc[typedKey]?.find((elem) => elem.name === curr[value])) {
					acc[typedKey]!.push({
						name: String(curr[value]),
						key: String(curr[value]),
					});
				}
			}
			return acc;
		}, {} as Partial<Pick<ChannelDiagnosticModel, FilterStorage>>);
		return { ...filters, filteredChannels: clk };
	},
	target: setPartialModel,
});

// When interval is changed, fetch data with new value
sample({
	clock: changeInterval,
	fn: (clk) => ({ interval: clk }),
	target: fetchChannelsDiagnosticFx,
});

// Clear indicators except applied one
sample({
	clock: applyFilters,
	fn: (clk) => {
		const accessor: FilterIndicator = clk;
		const indicatorNames: FilterIndicator[] = Object.values(
			FilterIndicator,
		).filter((indicator) => indicator !== accessor);
		const indicators = indicatorNames.reduce((acc, curr) => {
			acc[curr] = new Map();
			return acc;
		}, {} as Partial<ChannelDiagnosticModel>);
		return indicators;
	},
	target: setPartialModel,
});

// When apply filters event called, filter channels and set it
sample({
	clock: applyFilters,
	source: $channelsDiagnostic,
	fn: (src, clk) => {
		const { channels } = src;
		const accessor: FilterIndicator = clk;
		const newChannels: Channel[] = [];
		const indicators: Map<string, boolean> = src[accessor];
		const propKey: keyof Channel | undefined =
			FilterIndicatorToChannelPropDictionary[accessor];
		if (!propKey) {
			return [];
		}
		for (const [name, flag] of indicators) {
			if (flag) {
				const channel: Channel[] = channels.filter(
					(ch) => ch[propKey] === name,
				);
				if (channel) {
					newChannels.push(...channel);
				}
			}
		}
		return newChannels.length ? newChannels : channels;
	},
	target: setFilteredChannels,
});
