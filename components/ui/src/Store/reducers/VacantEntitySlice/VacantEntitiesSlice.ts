import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { SelectOption } from '../../../Components/Select/types';

import { vacantEntitiesSelectorData } from './const';
import { VacantEntitiesState, VacantEntity, VacantEntityType } from './types';

const initialState: VacantEntitiesState = {
	isModalOpen: false,
	isLoading: false,
	vacantEntities: [],
	totalCount: 0,
	vacantEntitiesSelectorData: vacantEntitiesSelectorData,
	activeVacantEntityType: VacantEntityType.Channel,
};

export const vacantEntitiesSlice = createSlice({
	name: 'vacantEntities',
	initialState,
	reducers: {
		setVacantEntities: (state, action: PayloadAction<VacantEntity[]>) => {
			state.vacantEntities = [...state.vacantEntities, ...action.payload];
		},
		clearVacantEntities: (state) => {
			state.vacantEntities = [];
		},
		openVacantEntitiesModal: (state) => {
			state.isModalOpen = true;
		},
		closeVacantEntitiesModal: (state) => {
			state.isModalOpen = false;
		},
		setIsVacantEntitiesLoading: (state, action: PayloadAction<boolean>) => {
			state.isLoading = action.payload;
		},
		setVacantEntitiesTotalCount: (state, action: PayloadAction<number>) => {
			state.totalCount = action.payload;
		},
		setVacantEntitiesSelectorData: (
			state,
			action: PayloadAction<SelectOption[]>,
		) => {
			const activeEntity = action.payload.find((entity) => entity.isSelected)
				?.value as VacantEntityType;
			state.vacantEntitiesSelectorData = action.payload;
			state.activeVacantEntityType = activeEntity;
		},
		setVacantEntityTypeActive: (
			state,
			action: PayloadAction<VacantEntityType>,
		) => {
			state.vacantEntitiesSelectorData = state.vacantEntitiesSelectorData.map(
				(entityType) => {
					if ((entityType.value as VacantEntityType) === action.payload) {
						return { ...entityType, isSelected: true };
					}
					return { ...entityType, isSelected: false };
				},
			);
			state.activeVacantEntityType = action.payload;
		},
	},
});

export default vacantEntitiesSlice.reducer;
