import { UserId } from '../../Shared/types';
import { Module } from '../../Shared/Types/moduleName';
import { InputFormPointsDataset } from '../InputFormPoints/types';

export type EditInputFormPoints = {
	sessionId: number;
	data: InputFormPointsDataset;
};

export type EditInputFormPointParameter = {
	fieldName: string;
	fieldValue: string | number | null;
	pointId: number | null;
};

export interface EditInputFormPointParameterAction extends UserId, Module {
	energyResourceId: number | null;
	date: string;
	sessionId: number | null;
	fieldName: string;
	fieldValue: string | number | null;
	pointId: number | null;
}
