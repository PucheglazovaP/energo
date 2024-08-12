import { UserId } from '../../Shared/types';
import { Module } from '../../Shared/Types/moduleName';

export type InputFormHeader = {
	id: number;
	order: number;
	name: string;
	title: string;
	minWidth: number | null;
	maxWidth: number | null;
	fieldAlign?: string | null;
	fixed: string | null;
	type: string;
	isParentVisible: boolean;
	parentOrder: number;
	parentTitle: string | null;
	parentMinWidth: number | null;
	parentMaxWidth: number | null;
	additionalFieldName: string | null;
	comment: string | null;
};

export type HeaderGroup = {
	order: number;
	title: string | null;
	colSpan: number;
	isVisible: boolean;
	width?: number | null;
	isFixed?: boolean;
};

export interface GetHeaderAction extends UserId, Module {
	energyResource: number | null;
}

export enum HeaderParameterType {
	Text = 'Text',
	Number = 'Number',
	Method = 'Lookup Get_DailyPointsAVGMethods',
}
