import { UserId } from '../../Shared/types';
import { Module } from '../../Shared/Types/moduleName';

export type CellKeys =
	| 'val'
	| 'visible'
	| 'editable'
	| 'fontColor'
	| 'backgroundColor'
	| 'borderColor'
	| 'iD_Server'
	| 'iD_Device';

export type InputFormDatasetResponse = {
	id: number;
	pid: number;
	level: number;
	dpgSortOrder: number;
	aVGValue?: string | null;
	aVGValueText?: string | null;
	constantValue?: string | null;
	constantValueComment?: string | null;
	correctionValue?: string | null;
	correctionValueComment?: string | null;
	normSumMonth?: string | null;
	shortName?: string | null;
	sumMonth?: string | null;
	todayDG?: string | null;
	todayKG?: string | null;
	todayNormVAL?: string | null;
	todayVAL?: string | null;
	todayVALCNT?: string | null;
	yesterdayConstantValue?: string | null;
	yesterdayCorrectionValue?: string | null;
	yesterdayDG?: string | null;
	yesterdayKG?: string | null;
	yesterdayNormVAL?: string | null;
	yesterdayVAL?: string | null;
	yesterdayVALCNT?: string | null;
	dGSumm?: string | null;
	kGSumm?: string | null;
	eXT01_TodayVAL?: string | null;
	eXT01_YesterdayVAL?: string | null;
	baseCCN?: string | null;
};

export type InputFormDataset = {
	id: number;
	pid: number;
	level: number;
	dpgSortOrder: number;
	aVGValue?: Record<CellKeys, number | string> | null;
	aVGValueText?: Record<CellKeys, number | string> | null;
	constantValue?: Record<CellKeys, number | string> | null;
	constantValueComment?: Record<CellKeys, number | string> | null;
	correctionValue?: Record<CellKeys, number | string> | null;
	correctionValueComment?: Record<CellKeys, number | string> | null;
	normSumMonth?: Record<CellKeys, number | string> | null;
	shortName?: Record<CellKeys, number | string> | null;
	sumMonth?: Record<CellKeys, number | string> | null;
	todayDG?: Record<CellKeys, number | string> | null;
	todayKG?: Record<CellKeys, number | string> | null;
	todayNormVAL?: Record<CellKeys, number | string> | null;
	todayVAL?: Record<CellKeys, number | string> | null;
	todayVALCNT?: Record<CellKeys, number | string> | null;
	yesterdayConstantValue?: Record<CellKeys, number | string> | null;
	yesterdayCorrectionValue?: Record<CellKeys, number | string> | null;
	yesterdayDG?: Record<CellKeys, number | string> | null;
	yesterdayKG?: Record<CellKeys, number | string> | null;
	yesterdayNormVAL?: Record<CellKeys, number | string> | null;
	yesterdayVAL?: Record<CellKeys, number | string> | null;
	yesterdayVALCNT?: Record<CellKeys, number | string> | null;
	dGSumm?: Record<CellKeys, number | string> | null;
	kGSumm?: Record<CellKeys, number | string> | null;
	eXT01_TodayVAL?: Record<CellKeys, number | string> | null;
	eXT01_YesterdayVAL?: Record<CellKeys, number | string> | null;
	baseCCN?: Record<CellKeys, number | string> | null;
};

export interface GetDataAction extends UserId, Module {
	energyResourceId: number | null;
	date: string;
}
