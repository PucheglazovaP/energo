import { ReactNode } from 'react';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import {
	SubmitButtonText,
	SubmitOperation,
	SubmitOperationTitle,
} from '../../../Components/SubmitOperation/types';

import { SubmitSlice } from './types';

const initialState: SubmitSlice = {
	isOpen: false,
	title: null,
	body: null,
	submitOperation: SubmitOperation.DeleteGroup,
	submitButtonText: SubmitButtonText.Delete,
};

export const submitOperationSlice = createSlice({
	name: 'submitOperation',
	initialState,
	reducers: {
		openSubmitOperationModal: (state) => {
			state.isOpen = true;
		},
		closeSubmitOperationModal: (state) => {
			state.isOpen = false;
		},
		setSubmitOperationTitle: (
			state,
			action: PayloadAction<SubmitOperationTitle>,
		) => {
			state.title = action.payload;
		},
		setSubmitOperationBody: (state, action: PayloadAction<ReactNode>) => {
			state.body = action.payload;
		},
		setSubmitOperationFunction: (
			state,
			action: PayloadAction<SubmitOperation>,
		) => {
			state.submitOperation = action.payload;
		},
		setSubmitButtonText: (state, action: PayloadAction<SubmitButtonText>) => {
			state.submitButtonText = action.payload;
		},
	},
});

export const {
	openSubmitOperationModal,
	closeSubmitOperationModal,
	setSubmitOperationTitle,
	setSubmitOperationBody,
	setSubmitOperationFunction,
	setSubmitButtonText,
} = submitOperationSlice.actions;

export default submitOperationSlice.reducer;
