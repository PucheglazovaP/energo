import { UserId } from '../../Shared/types';
import { Module } from '../../Shared/Types/moduleName';

export type InputFormPointsHeader = {
	id: number;
	order: number;
	name: string;
	title: string;
	minWidth: number | null;
	maxWidth: number | null;
	fieldAlign?: string | null;
	fixed: string | null;
	type: string;
	isEditable: boolean;
	isParentVisible: boolean;
	parentOrder: number;
	parentTitle: string | null;
	parentMinWidth: number | null;
	parentMaxWidth: number | null;
	pointId: number;
};

export type PointsHeaderGroup = {
	order: number;
	title: string | null;
	colSpan: number;
	isVisible: boolean;
};

export interface GetPointsHeaderAction extends UserId, Module {
	energyResource: number | null;
}

export enum PointsHeaderParameterType {
	Text = 'Text',
	Number = 'Number',
	Method = 'Lookup Get_DailyPointsAVGMethods',
}
