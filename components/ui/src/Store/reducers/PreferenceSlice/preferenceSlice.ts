import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { PreferenceType, UnitsType } from '../../../Types/PreferenceTypes';
import { UnitsTreeItem } from '../../../Types/UnitsTreeTypes';

export interface PreferenceState {
	methods: PreferenceType[];
	storageTypes: PreferenceType[];
	units: UnitsTreeItem[];
	activeUnit: number | null;
}

const initialState: PreferenceState = {
	methods: [],
	storageTypes: [],
	units: [],
	activeUnit: null,
};

export const preferenceSlice = createSlice({
	name: 'preference',
	initialState,
	reducers: {
		setMethods: (state, action: PayloadAction<PreferenceType[]>) => {
			state.methods = action.payload;
		},
		setStorageTypes: (state, action: PayloadAction<PreferenceType[]>) => {
			state.storageTypes = action.payload;
		},
		setUnits: (state, action: PayloadAction<UnitsType[]>) => {
			state.units = [];
			action.payload.forEach((item) => {
				state.units.push({
					id: item.ID,
					name: item.Name,
					displayName: item.Name,
					parentId: item.ID_Parent ? item.ID_Parent : undefined,
					isOpen: !item.ID_Parent,
					isLast: item.Type === 1,
				});
			});
		},
		setActiveUnit: (state, action: PayloadAction<number>) => {
			state.activeUnit = action.payload;
		},
		setUnitsOpen: (
			state,
			action: PayloadAction<{ id: number; isOpen: boolean }>,
		) => {
			for (let unit of state.units) {
				if (unit.id === action.payload.id) {
					unit.isOpen = action.payload.isOpen;
					break;
				}
			}
		},
	},
});

// Action creators are generated for each case reducer function
export const {
	setMethods,
	setStorageTypes,
	setUnits,
	setUnitsOpen,
	setActiveUnit,
} = preferenceSlice.actions;

export default preferenceSlice.reducer;
