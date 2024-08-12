import {
	getDeviceByEquipmentNumberParams,
	getMeasuringInstrumentsFiltersParams,
	GetMeasuringInstrumentsListParams,
} from './types';

export function getUMeasuringInstrumentsListQuery({
	measurementTypeCode,
	equipmentShortName,
	manufacturerTypeName,
	factoryNumber,
	productionYear,
	userStatusCode,
	equipmentNumber,
	location,
	pageRowCount,
	pageNumber,
	firstRow,
	selectRow,
	pageTotalCount,
	userId,
	moduleName,
}: GetMeasuringInstrumentsListParams) {
	return {
		Sql: '[NSI].[NSIConfiguration].Get_JournalMISAP_pages',
		CommandType: 'StoredProcedure',
		Parameters: [
			{
				Name: '@EQART',
				DbType: 'String',
				Value: measurementTypeCode,
				Direction: 'Input',
			},
			{
				Name: '@EQKTX',
				DbType: 'String',
				Value: equipmentShortName,
				Direction: 'Input',
			},
			{
				Name: '@TYPBZ',
				DbType: 'String',
				Value: manufacturerTypeName,
				Direction: 'Input',
			},
			{
				Name: '@SERGE',
				DbType: 'String',
				Value: factoryNumber,
				Direction: 'Input',
			},
			{
				Name: '@BAUJJ',
				DbType: 'String',
				Value: productionYear,
				Direction: 'Input',
			},
			{
				Name: '@UserStatus',
				DbType: 'String',
				Value: userStatusCode,
				Direction: 'Input',
			},
			{
				Name: '@EQUNR',
				DbType: 'String',
				Value: equipmentNumber,
				Direction: 'Input',
			},
			{
				Name: '@Location',
				DbType: 'String',
				Value: location,
				Direction: 'Input',
			},
			{
				Name: '@PageRowCount',
				DbType: 'int',
				Value: pageRowCount,
				Direction: 'Input',
			},
			{
				Name: '@PageNumber',
				DbType: 'int',
				Value: pageNumber,
				Direction: 'InputOutput',
				Size: '64',
			},
			{
				Name: '@FirstRow',
				DbType: 'int',
				Value: firstRow,
				Direction: 'Output',
				Size: '64',
			},
			{
				Name: '@SelectRow',
				DbType: 'int',
				Value: selectRow,
				Direction: 'Output',
				Size: '64',
			},
			{
				Name: '@PageTotalCount',
				DbType: 'int',
				Value: pageTotalCount,
				Direction: 'Output',
				Size: '64',
			},
			{
				Name: '@ID_User',
				DbType: 'String',
				Value: userId,
				Direction: 'Input',
			},
			{
				Name: '@Module_name',
				DbType: 'String',
				Value: moduleName,
				Direction: 'Input',
			},
			{
				Name: '@Err',
				DbType: 'int',
				Value: null,
				Direction: 'Output',
				Size: '64',
			},
			{
				Name: '@TextErr',
				DbType: 'String',
				Value: null,
				Direction: 'Output',
				Size: '2000',
			},
			{
				Name: '@TextWarn',
				DbType: 'String',
				Value: null,
				Direction: 'Output',
				Size: '2000',
			},
		],
	};
}

export function getMeasuringTypesListQuery({
	userId,
	moduleName,
}: getMeasuringInstrumentsFiltersParams) {
	return {
		Sql: '[NSI].[NSIConfiguration].Get_СправочникВидовИзмеренийSAP',
		CommandType: 'StoredProcedure',
		Parameters: [
			{
				Name: '@ID_User',
				DbType: 'String',
				Value: userId,
				Direction: 'Input',
			},
			{
				Name: '@Module_name',
				DbType: 'String',
				Value: moduleName,
				Direction: 'Input',
			},
			{
				Name: '@Err',
				DbType: 'int',
				Value: null,
				Direction: 'Output',
				Size: '64',
			},
			{
				Name: '@TextErr',
				DbType: 'String',
				Value: null,
				Direction: 'Output',
				Size: '2000',
			},
		],
	};
}

export function getUserStatusesListQuery({
	userId,
	moduleName,
}: getMeasuringInstrumentsFiltersParams) {
	return {
		Sql: '[NSI].[NSIConfiguration].Get_СправочникПользовательскихСтатусовЕОSAP',
		CommandType: 'StoredProcedure',
		Parameters: [
			{
				Name: '@ID_User',
				DbType: 'String',
				Value: userId,
				Direction: 'Input',
			},
			{
				Name: '@Module_name',
				DbType: 'String',
				Value: moduleName,
				Direction: 'Input',
			},
			{
				Name: '@Err',
				DbType: 'int',
				Value: null,
				Direction: 'Output',
				Size: '64',
			},
			{
				Name: '@TextErr',
				DbType: 'String',
				Value: null,
				Direction: 'Output',
				Size: '2000',
			},
		],
	};
}

export function getDeviceByEquipmentNumberQuery({
	userId,
	moduleName,
	equipmentNumber,
}: getDeviceByEquipmentNumberParams) {
	return {
		Sql: '[NSI].[NSIConfiguration].[Get_DeviceByEQUNR]',
		CommandType: 'StoredProcedure',
		Parameters: [
			{
				Name: '@ID_User',
				DbType: 'String',
				Value: userId,
				Direction: 'Input',
			},
			{
				Name: '@Module_name',
				DbType: 'String',
				Value: moduleName,
				Direction: 'Input',
			},
			{
				Name: '@EQUNR',
				DbType: 'String',
				Value: equipmentNumber,
				Direction: 'Input',
			},
			{
				Name: '@Err',
				DbType: 'int',
				Value: null,
				Direction: 'Output',
				Size: '64',
			},
			{
				Name: '@TextErr',
				DbType: 'String',
				Value: null,
				Direction: 'Output',
				Size: '2000',
			},
		],
	};
}
