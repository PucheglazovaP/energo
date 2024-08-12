import {
	FilterOptions,
	SearchFilters,
	SortOptions,
	UserId,
} from '../../Shared/types';
import { Module } from '../../Shared/Types/moduleName';

export type DeviceReportsTypes = {
	id: string;
	isChecked: boolean;
	title: string;
};

export interface DeviceParameter extends UserId, Module {
	name: string;
	value: string;
}

export interface DeviceReportsParams extends UserId {
	reportType: number;
}

export type DeviceReportResponse = {
	КодТипаПрибора: number;
	UrlОтчета: string;
	Наименование: string;
	Описание: string;
	ReportVid: number;
};

export type DeviceReport = {
	deviceType: number;
	reportUrl: string;
	report: string;
	reportDescription: string;
	reportType: number;
};

export interface DevicesListParams extends UserId {
	reportType: number;
	reportId: string;
}

export type DevicesListResponse = {
	Number: number;
	Наименование: string;
	DeviceType: string;
	КодТипаПрибора: number;
	Теплосистемы: string;
};

export type HeatSystem = {
	tsys: number;
};

export type DeviceTypeAndHeatSystem = {
	deviceTypeCode: number;
	heatSystems: HeatSystem[];
};

export type DevicesList = {
	deviceId: number;
	device: string;
	deviceType: string;
	deviceTypeCode: number;
	heatSystems: HeatSystem[];
};

export type DeviceReports = {
	isEditMode: boolean;
	reportTypes: DeviceReportsTypes[];
	deviceParameters: DeviceParameter[];
	activeDeviceId: number;
	deviceReports: DeviceReport[];
	devicesList: DevicesList[];
	sortFilter: SortOptions;
	searchFilters: SearchFilters;
	isLoading: boolean;
	deviceTypeOptions: FilterOptions[];
	selectedDeviceTypes: string[];
};
