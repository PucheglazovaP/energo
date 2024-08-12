import { createStore } from 'effector';

import { setSearchOptions, setSearchValue } from './events';
import { DevicesSearchModel } from './types';

const initialState: DevicesSearchModel = {
	value: '',
	options: [
		{
			label: '№ прибора',
			value: 1,
			isSelected: true,
		},
		{
			label: 'Наименование прибора',
			value: 2,
			isSelected: false,
		},
		{
			label: '№ канала',
			value: 3,
			isSelected: false,
		},
		{
			label: 'Наименование канала',
			value: 4,
			isSelected: false,
		},
	],
};

export const $devicesSearch = createStore<DevicesSearchModel>(initialState);

$devicesSearch.on(setSearchValue, (state, value) => {
	return {
		...state,
		value,
	};
});

$devicesSearch.on(setSearchOptions, (state, options) => {
	return {
		...state,
		options,
	};
});
