import { UserId } from '../../Shared/types';
import { Module } from '../../Shared/Types/moduleName';
import { CellKeys } from '../InputForm/types';
import { InputFormHeader } from '../InputFormHeader/types';

export interface PointLogBookHeaderListParams extends UserId, Module {
	pointId: number;
}

export type PointLogBookHeaderListResponse = {
	ID: number;
	FieldOrder: number;
	FieldDatasetName: string;
	FieldTitle: string;
	FieldMinWidth: number | null;
	FieldMaxWidth: number | null;
	FieldAlign: string | null;
	FieldFixed: string | null;
	FieldType: string;
	IsParentVisible: boolean;
	ParentGroupOrder: number;
	ParentTitle: string | null;
	ParentMinWidth: number | null;
	ParentMaxWidth: number | null;
};

export interface PointLogBookBodyListParams extends UserId, Module {
	fromd: string;
	tod: string;
	pointId: number;
}

export interface SavePointLogBookValueParams extends UserId, Module {
	sessionId: string | null;
	pointId: number;
	date: string;
	fieldDatasetName: string;
	fieldValue: string | null;
}

export type PointLogBookBodyListResponse = {
	date: string;
	correctionValue?: string | null;
	correctionValueComment?: string | null;
	constantValue?: string | null;
	constantValueComment?: string | null;
	mainAggr?: string | null;
	mainDaily?: string | null;
	mainCnt?: string | null;
	avgTemp?: string | null;
	avgPress?: string | null;
	avgBPTemp?: string | null;
	avgBPPress?: string | null;
	avgHeatTemp?: string | null;
	avgHeatPress?: string | null;
	avgHeatCond?: string | null;
	avgCalory?: string | null;
	normDaily?: string | null;
	normKG?: string | null;
	normDG?: string | null;
	normPart?: string | null;
	kgCalcAVG?: string | null;
	kgCalcCNT?: string | null;
	khpSteam?: string | null;
	khpWAB?: string | null;
	khpKC3Boiler?: string | null;
	khpUSTKSteam?: string | null;
};

export type PointLogBookBodyList = {
	date: string;
	correctionValue?: Record<CellKeys, number | string> | null;
	correctionValueComment?: Record<CellKeys, number | string> | null;
	constantValue?: Record<CellKeys, number | string> | null;
	constantValueComment?: Record<CellKeys, number | string> | null;
	mainAggr?: Record<CellKeys, number | string> | null;
	mainDaily?: Record<CellKeys, number | string> | null;
	mainCnt?: Record<CellKeys, number | string> | null;
	avgTemp?: Record<CellKeys, number | string> | null;
	avgPress?: Record<CellKeys, number | string> | null;
	avgBPTemp?: Record<CellKeys, number | string> | null;
	avgBPPress?: Record<CellKeys, number | string> | null;
	avgHeatTemp?: Record<CellKeys, number | string> | null;
	avgHeatPress?: Record<CellKeys, number | string> | null;
	avgHeatCond?: Record<CellKeys, number | string> | null;
	avgCalory?: Record<CellKeys, number | string> | null;
	normDaily?: Record<CellKeys, number | string> | null;
	normKG?: Record<CellKeys, number | string> | null;
	normDG?: Record<CellKeys, number | string> | null;
	normPart?: Record<CellKeys, number | string> | null;
	kgCalcAVG?: Record<CellKeys, number | string> | null;
	kgCalcCNT?: Record<CellKeys, number | string> | null;
	khpSteam?: Record<CellKeys, number | string> | null;
	khpWAB?: Record<CellKeys, number | string> | null;
	khpKC3Boiler?: Record<CellKeys, number | string> | null;
	khpUSTKSteam?: Record<CellKeys, number | string> | null;
};

export type PointLogBook = {
	pointLogBookHeader: InputFormHeader[];
	pointLogBookBody: PointLogBookBodyList[];
	isLoading: boolean;
};

export type SavePointLogBookValue = {
	id: string | number;
	columnName: string;
	value: string | number | Record<CellKeys, number | string> | null;
};
