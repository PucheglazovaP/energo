import type { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';

import { ParameterItem, TreeItemType } from '../../../Types';
import {
	OperationType,
	ParamItem,
	ParamsBlock,
	ParamsList,
} from '../../../Types/ParametersBlockTypes';

export interface ParametersProps {
	isParametersActive: boolean;
	parameterItems: ParameterItem[];
	isCreating: boolean;
	operationType: OperationType | null;
	parametersData: ParamsBlock[];
}

const initialState: ParametersProps = {
	isParametersActive: false,
	parameterItems: [],
	isCreating: false,
	operationType: null,
	parametersData: [],
};

export const parametersSlice = createSlice({
	name: 'parameters',
	initialState,
	reducers: {
		setParametersActive: (state, action: PayloadAction<boolean>) => {
			state.isParametersActive = action.payload;
		},
		switchParametersActive: (state) => {
			state.isParametersActive = !state.isParametersActive;
		},
		setParameterItems: (state, action: PayloadAction<ParameterItem[]>) => {
			state.parameterItems = action.payload;
		},
		addParameterItems: (state, action: PayloadAction<ParameterItem[]>) => {
			let newItems: ParameterItem[] = [];
			for (let item of action.payload) {
				const isItemCopy = state.parameterItems.some(
					(stateItem) =>
						stateItem.parameterId === item.parameterId &&
						stateItem.parameterType === item.parameterType,
				);
				if (!isItemCopy) newItems.push(item);
			}
			state.parameterItems = [...newItems, ...state.parameterItems];
		},
		removeParameterItem: (state, action: PayloadAction<number>) => {
			state.parameterItems = state.parameterItems.filter(
				(item, index) => index !== action.payload,
			);
		},
		filterParameterItems: (state, action: PayloadAction<TreeItemType>) => {
			state.parameterItems = state.parameterItems.filter(
				(item) => item.parameterType === action.payload,
			);
		},
		removeParameterItems: (state, action: PayloadAction<TreeItemType>) => {
			state.parameterItems = state.parameterItems.filter(
				(item) => item.parameterType !== action.payload,
			);
		},
		removeParametersItem: (
			state,
			action: PayloadAction<{ id: Number; parameterType: TreeItemType }>,
		) => {
			state.parameterItems = state.parameterItems.filter((item) => {
				if (item.parameterType !== action.payload.parameterType) return item;
				else if (item.parameterId !== action.payload.id) return item;
				else return;
			});
		},
		setIsCreating: (state, action: PayloadAction<boolean>) => {
			state.isCreating = action.payload;
		},
		setOperationType: (state, action: PayloadAction<OperationType | null>) => {
			state.operationType = action.payload;
		},
		clearForCreating: (state) => {
			state.parameterItems = [];
		},
		addParametersData: (state, action: PayloadAction<ParamsBlock>) => {
			state.parametersData.push(action.payload);
		},
		setParametersData: (state, action: PayloadAction<ParamsBlock[]>) => {
			state.parametersData = action.payload;
		},
		editParameterData: (state, action: PayloadAction<ParamItem>) => {
			if (state.parametersData.length !== 0) {
				const paramIndex = state.parametersData.findIndex(
					(item: ParamsBlock) => item.header === action.payload.header,
				);
				if (paramIndex !== -1) {
					const itemIndex = state.parametersData[
						paramIndex
					].sortParams.findIndex(
						(param: ParamsList) =>
							param.placeholder === action.payload.placeholder,
					);
					if (itemIndex !== -1) {
						state.parametersData[paramIndex].sortParams[itemIndex].value =
							action.payload.value;
					}
				}
			}
		},
	},
});

// Action creators are generated for each case reducer function
export const {
	setParameterItems,
	addParameterItems,
	removeParameterItem,
	removeParametersItem,
	setIsCreating,
	clearForCreating,
	addParametersData,
	setParametersData,
	editParameterData,
	setParametersActive,
	switchParametersActive,
	setOperationType,
	filterParameterItems,
	removeParameterItems,
} = parametersSlice.actions;

export default parametersSlice.reducer;
