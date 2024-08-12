import { createEvent } from 'effector';

import {
	Channel,
	ChannelDiagnosticModel,
	FilterIndicator,
	SetFilterStorage,
	ToggleFilterStorage,
} from './types';

export const setChannels = createEvent<Channel[]>();
export const changeInterval = createEvent<number>();
export const setFilterStorage = createEvent<SetFilterStorage>();
export const toggleFilterIndicator = createEvent<ToggleFilterStorage>();
export const toggleFilterIndicatorAll = createEvent<FilterIndicator>();
export const setPartialModel = createEvent<Partial<ChannelDiagnosticModel>>();
export const setFilteredChannels = createEvent<Channel[]>();
export const applyFilters = createEvent<FilterIndicator>();
export const resetFilterIndicators = createEvent();
