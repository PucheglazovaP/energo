import { UserId } from '../../Shared/types';
import { Module } from '../../Shared/Types/moduleName';
import { InputFormDataset } from '../InputForm/types';

export type EditInputForm = {
	sessionId: number;
	data: InputFormDataset[];
};

export type EditRow = {
	id: string | number;
	columnName: string;
	value: string | number | null;
};

export interface GetEditDataAction extends UserId, Module {
	sessionId: number;
}

export interface UpdateEditValueAction extends UserId, Module {
	sessionId: number;
	date: string;
	energyResourceId: number;
	rowId: number;
	fieldName: string;
	value: string | number | null;
}
