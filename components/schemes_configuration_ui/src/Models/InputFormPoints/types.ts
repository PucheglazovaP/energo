import { UserId } from '../../Shared/types';
import { Module } from '../../Shared/Types/moduleName';

export interface GetPointsDataAction extends UserId, Module {
	energyResourceId: number | null;
	date: string;
	sessionId: number | null;
}

export type InputFormPointCellResponse = {
	val: number | string | null;
	editable: number | null;
	visible: number | null;
	needRefreshBase: number | null;
	needRefreshAll: number | null;
	fK_DailyPoints: number | null;
	blockEdit: number | null;
	fontColor: string | null;
	backgroundColor: string | null;
	borderColor: string | null;
};

export type InputFormPointCell = {
	value: number | string | null;
	isEditable: number | null;
	isVisible: number | null;
	needRefreshBase: number | null;
	needRefreshAll: number | null;
	pointId: number | null;
	isBlocked: number | null;
	fontColor: string | null;
	backgroundColor: string | null;
	borderColor: string | null;
};

export type InputFormPointsDatasetResponse = {
	FK_EnergyResources: number;
	externalT: string | null;
	externalP: string | null;
	skrub5DGCal: string | null;
	skrub6DGCal: string | null;
	skrub7DGCal: string | null;
	avgCal: string | null;
	tempCal: string | null;
	percFN: string | null;
	order2KGCal: string | null;
	order3KGCal: string | null;
	order2volumeKGCal: string | null;
	order3volumeKGCal: string | null;
	volumeKG: string | null;
	avgCalKG: string | null;
	partKG: string | null;
	volumeDG: string | null;
	avgCalDG: string | null;
	partDG: string | null;
	volumePG: string | null;
	avgCalPG: string | null;
	partPG: string | null;
	directionTK9: string | null;
	directionTK10: string | null;
	directionTK11: string | null;
};

export type InputFormPointsDataset = {
	energyResourceId: number;
	externalT?: InputFormPointCell | null;
	externalP?: InputFormPointCell | null;
	skrub5DGCal?: InputFormPointCell | null;
	skrub6DGCal?: InputFormPointCell | null;
	skrub7DGCal?: InputFormPointCell | null;
	avgCal?: InputFormPointCell | null;
	tempCal?: InputFormPointCell | null;
	percFN?: InputFormPointCell | null;
	order2KGCal?: InputFormPointCell | null;
	order3KGCal?: InputFormPointCell | null;
	order2volumeKGCal?: InputFormPointCell | null;
	order3volumeKGCal?: InputFormPointCell | null;
	volumeKG?: InputFormPointCell | null;
	avgCalKG?: InputFormPointCell | null;
	partKG?: InputFormPointCell | null;
	volumeDG?: InputFormPointCell | null;
	avgCalDG?: InputFormPointCell | null;
	partDG?: InputFormPointCell | null;
	volumePG?: InputFormPointCell | null;
	avgCalPG?: InputFormPointCell | null;
	partPG?: InputFormPointCell | null;
	directionTK9?: InputFormPointCell | null;
	directionTK10?: InputFormPointCell | null;
	directionTK11?: InputFormPointCell | null;
};
