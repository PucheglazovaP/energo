import { UserId } from '../../../Shared/types';
import { Module } from '../../../Shared/Types/moduleName';

export interface GetMeasuringInstrumentsListParams extends UserId, Module {
	action: 'add' | 'set';
	measurementTypeCode: string | null;
	equipmentShortName: string | null;
	manufacturerTypeName: string | null;
	productionYear: string | null;
	userStatusCode: string | null;
	equipmentNumber: string | null;
	location: string | null;
	factoryNumber: string | null;
	pageRowCount: number;
	pageNumber: number;
	firstRow: number;
	selectRow: number | null;
	pageTotalCount: number;
	shouldAddToTop?: boolean;
}

export interface getMeasuringInstrumentsFiltersParams extends UserId, Module {}

export interface getDeviceByEquipmentNumberParams extends UserId, Module {
	equipmentNumber: string;
}
