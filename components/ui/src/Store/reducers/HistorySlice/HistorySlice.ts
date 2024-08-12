import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { add } from 'date-fns';

import { SelectOption } from '../../../Components/Select/types';

import {
	History,
	HistoryElementType,
	HistoryElementTypeName,
	HistoryType,
} from './types';

export interface HistoryFiltersType {
	dates: Date[];
	types: SelectOption[];
}

interface HistoryState {
	isModalOpen: boolean;
	history: History[];
	isLoading: boolean;
	type: HistoryType;
	filters: HistoryFiltersType;
	totalCount: number;
}

const initialState: HistoryState = {
	isModalOpen: false,
	history: [],
	isLoading: false,
	type: HistoryType.GENERAL,
	filters: {
		dates: [add(new Date(), { weeks: -1 }), new Date()],
		types: [
			{
				label: HistoryElementTypeName.GROUP,
				value: HistoryElementType.GROUP,
				isSelected: true,
			},
			{
				label: HistoryElementTypeName.CHANNEL,
				value: HistoryElementType.CHANNEL,
				isSelected: true,
			},
			{
				label: HistoryElementTypeName.DEVICE,
				value: HistoryElementType.DEVICE,
				isSelected: true,
			},
		],
	},
	totalCount: 1,
};

export const historySlice = createSlice({
	name: 'history',
	initialState,
	reducers: {
		openHistoryModal: (state) => {
			state.isModalOpen = true;
		},
		closeHistoryModal: (state) => {
			state.isModalOpen = false;
		},
		setHistoryIsLoading: (state, action: PayloadAction<boolean>) => {
			state.isLoading = action.payload;
		},
		setHistory: (state, action: PayloadAction<History[]>) => {
			state.history = [...state.history, ...action.payload];
		},
		clearHistory: (state) => {
			state.history = [];
		},
		toggleCollapseHistoryItem: (
			state,
			action: PayloadAction<string | number>,
		) => {
			const id = action.payload;
			const chosenHistory = state.history.find(
				(elem) => elem.lastModifiedId === id,
			);
			if (chosenHistory) {
				chosenHistory.isCollapsed = !chosenHistory.isCollapsed;
			}
		},
		setHistoryDates: (state, action: PayloadAction<Date[]>) => {
			state.filters.dates = action.payload;
		},
		setHistoryTypes: (state, action: PayloadAction<SelectOption[]>) => {
			state.filters.types = action.payload;
		},
		setHistoryType: (state, action: PayloadAction<HistoryType>) => {
			state.type = action.payload;
		},
		setHistoryDefaultFilters: (state) => {
			state.filters = initialState.filters;
		},
		setHistoryTotalCount: (state, action: PayloadAction<number>) => {
			state.totalCount = action.payload;
		},
	},
});

export default historySlice.reducer;
