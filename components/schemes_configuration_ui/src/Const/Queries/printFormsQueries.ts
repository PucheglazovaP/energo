import {
	AddParameterValuePrintFormParams,
	CommonPrintFormParametersParams,
	CreatePrintFormParams,
	CreatePrintFormPositionParams,
	DeletePrintFormParams,
	DeletePrintFormPositionParams,
	FetchDevicesURSV510Params,
	FetchPrintFormParametersParams,
	FetchPrintFormPositionParams,
	FetchPrintFormTreeParams,
	MovePrintFormPositionParams,
	RpcQuery,
	SavePrintFormPositionSettingsParams,
	SyncPrintFormParametersParams,
	SyncPrintFormPositionParams,
	UnsyncPrintFormPositionParams,
	UpdatePrintFormParams,
} from '../../Shared/types';
import { ModuleName } from '../../Shared/Types/moduleName';

export function fetchPrintFormsQuery(reportId: number | null) {
	return {
		Sql: '[EnergyConsum_Reports].[dbo].Get_PrintReports',
		CommandType: 'StoredProcedure',
		Parameters: [
			{
				Name: '@FK_Report',
				DbType: 'int',
				Value: reportId,
				Direction: 'Input',
			},
		],
	};
}

export function createPrintFormQuery(params: CreatePrintFormParams) {
	return {
		Sql: '[EnergyConsum_Reports].[dbo].Ins_PrintReport',
		CommandType: 'StoredProcedure',
		Parameters: [
			{
				Name: '@FK_Report',
				DbType: 'int',
				Value: params.reportId,
				Direction: 'Input',
			},
			{
				Name: '@Name',
				DbType: 'String',
				Value: params.name,
				Direction: 'Input',
			},
			{
				Name: '@Comment',
				DbType: 'String',
				Value: params.comment,
				Direction: 'Input',
			},
			{
				Name: '@ID_User',
				DbType: 'String',
				Value: params.userId,
				Direction: 'Input',
			},
			{
				Name: '@Module_name',
				DbType: 'String',
				Value: (params.moduleName = ModuleName.Test),
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
				Name: '@LogOperation',
				DbType: 'String',
				Value: '',
				Direction: 'Output',
			},
		],
	};
}

export function updatePrintFormQuery(params: UpdatePrintFormParams) {
	return {
		Sql: '[EnergyConsum_Reports].[dbo].Upd_PrintReports',
		CommandType: 'StoredProcedure',
		Parameters: [
			{
				Name: '@ID',
				DbType: 'int',
				Value: params.reportId,
				Direction: 'Input',
			},
			{
				Name: '@Name',
				DbType: 'String',
				Value: params.name,
				Direction: 'Input',
			},
			{
				Name: '@Comment',
				DbType: 'String',
				Value: params.comment,
				Direction: 'Input',
			},
			{
				Name: '@ID_User',
				DbType: 'String',
				Value: params.userId,
				Direction: 'Input',
			},
			{
				Name: '@Module_name',
				DbType: 'String',
				Value: (params.moduleName = ModuleName.Test),
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
				Name: '@LogOperation',
				DbType: 'String',
				Value: '',
				Direction: 'Output',
			},
		],
	};
}

export function fetchPrintFormPositionsQuery(
	params: FetchPrintFormPositionParams,
) {
	return {
		Sql: '[EnergyConsum_Reports].[dbo].Get_PrintReportsItems',
		CommandType: 'StoredProcedure',
		Parameters: [
			{
				Name: '@ID_PrintReport',
				DbType: 'int',
				Value: params.printFormId,
				Direction: 'Input',
			},
			{
				Name: '@ID_User',
				DbType: 'String',
				Value: params.userId,
				Direction: 'Input',
			},
			{
				Name: '@Module_name',
				DbType: 'String',
				Value: (params.moduleName = ModuleName.Test),
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

export function deletePrintFormQuery(params: DeletePrintFormParams) {
	return {
		Sql: '[EnergyConsum_Reports].[dbo].Del_PrintReport',
		CommandType: 'StoredProcedure',
		Parameters: [
			{
				Name: '@ID',
				DbType: 'int',
				Value: params.id,
				Direction: 'Input',
			},
			{
				Name: '@ID_User',
				DbType: 'String',
				Value: params.userId,
				Direction: 'Input',
			},
			{
				Name: '@Module_name',
				DbType: 'String',
				Value: (params.moduleName = ModuleName.Test),
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

export function fetchPrintFormTreeQuery(params: FetchPrintFormTreeParams) {
	return {
		Sql: '[EnergyConsum_Reports].[dbo].Get_ReportsItems1',
		CommandType: 'StoredProcedure',
		Parameters: [
			{
				Name: '@ID_PrintReport',
				DbType: 'int',
				Value: params.printFormId,
				Direction: 'Input',
			},
			{
				Name: '@ID_User',
				DbType: 'String',
				Value: params.userId,
				Direction: 'Input',
			},
			{
				Name: '@Module_name',
				DbType: 'String',
				Value: (params.moduleName = ModuleName.Test),
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

export function fetchPriorityMethodsQuery(): RpcQuery {
	return {
		Sql: '[EnergyConsum_Reports].[dbo].Get_AccountingPriorityMethods',
		CommandType: 'StoredProcedure',
		Parameters: [],
	};
}

export function movePrintFormPositionQuery(
	params: MovePrintFormPositionParams,
) {
	return {
		Sql: '[EnergyConsum_Reports].[dbo].Upd_PrintReportsPosition_move',
		CommandType: 'StoredProcedure',
		Parameters: [
			{
				Name: '@ID',
				DbType: 'int',
				Value: params.from,
				Direction: 'Input',
			},
			{
				Name: '@TargetID',
				DbType: 'int',
				Value: params.to,
				Direction: 'Input',
			},
			{
				Name: '@ID_User',
				DbType: 'String',
				Value: params.userId,
				Direction: 'Input',
			},
			{
				Name: '@Module_name',
				DbType: 'String',
				Value: (params.moduleName = ModuleName.Test),
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

export function createPrintFormPositionQuery(
	params: CreatePrintFormPositionParams,
) {
	return {
		Sql: '[EnergyConsum_Reports].[dbo].Ins_PrintReportItem',
		CommandType: 'StoredProcedure',
		Parameters: [
			{
				Name: '@ID_Target',
				DbType: 'int',
				Value: params.id,
				Direction: 'Input',
			},
			{
				Name: '@ID_User',
				DbType: 'String',
				Value: params.userId,
				Direction: 'Input',
			},
			{
				Name: '@Module_name',
				DbType: 'String',
				Value: (params.moduleName = ModuleName.Test),
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
				Name: '@LogOperation',
				DbType: 'String',
				Value: '',
				Direction: 'Output',
			},
		],
	};
}

export function deletePrintFormPositionQuery(
	params: DeletePrintFormPositionParams,
) {
	return {
		Sql: '[EnergyConsum_Reports].[dbo].Del_PrintReportItem',
		CommandType: 'StoredProcedure',
		Parameters: [
			{
				Name: '@ID',
				DbType: 'int',
				Value: params.id,
				Direction: 'Input',
			},
			{
				Name: '@ID_User',
				DbType: 'String',
				Value: params.userId,
				Direction: 'Input',
			},
			{
				Name: '@Module_name',
				DbType: 'String',
				Value: (params.moduleName = ModuleName.Test),
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

export function savePrintFormPositionSettingsQuery(
	params: SavePrintFormPositionSettingsParams,
) {
	return {
		Sql: '[EnergyConsum_Reports].[dbo].Upd_PrintReportItem',
		CommandType: 'StoredProcedure',
		Parameters: [
			{
				Name: '@ID',
				DbType: 'int',
				Value: params.id,
				Direction: 'Input',
			},
			{
				Name: '@ReportPositionNumber',
				DbType: 'String',
				Value: params.number,
				Direction: 'Input',
			},
			{
				Name: '@PositionName',
				DbType: 'String',
				Value: params.name,
				Direction: 'Input',
			},
			{
				Name: '@Bold',
				DbType: 'int',
				Value: params.bold,
				Direction: 'Input',
			},
			{
				Name: '@FK_TextAlign',
				DbType: 'int',
				Value: params.textAlign,
				Direction: 'Input',
			},
			{
				Name: '@HexColor',
				DbType: 'String',
				Value: params.bgColor,
				Direction: 'Input',
			},
			{
				Name: '@FontHexColor',
				DbType: 'String',
				Value: params.fontColor,
				Direction: 'Input',
			},
			{
				Name: '@AccountingPriority',
				DbType: 'int',
				Value: params.priority,
				Direction: 'Input',
			},
			{
				Name: '@FK_ExtCalc_Method',
				DbType: 'int',
				Value: params.methodId,
				Direction: 'Input',
			},
			{
				Name: '@NUMPR',
				DbType: 'int',
				Value: params.deviceId,
				Direction: 'Input',
			},
			{
				Name: '@NUMCAN',
				DbType: 'int',
				Value: params.channelId,
				Direction: 'Input',
			},
			{
				Name: '@ID_User',
				DbType: 'String',
				Value: params.userId,
				Direction: 'Input',
			},
			{
				Name: '@Module_name',
				DbType: 'String',
				Value: (params.moduleName = ModuleName.Test),
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

export function unsyncPrintFormPositionQuery(
	params: UnsyncPrintFormPositionParams,
) {
	return {
		Sql: '[EnergyConsum_Reports].[dbo].Del_ReportsItemLinkPrintRepItem',
		CommandType: 'StoredProcedure',
		Parameters: [
			{
				Name: '@ID_PrintRepItem',
				DbType: 'int',
				Value: params.nodeId,
				Direction: 'Input',
			},
			{
				Name: '@ID_User',
				DbType: 'String',
				Value: params.userId,
				Direction: 'Input',
			},
			{
				Name: '@Module_name',
				DbType: 'String',
				Value: (params.moduleName = ModuleName.Test),
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
export function syncPrintFormPositionQuery(
	params: SyncPrintFormPositionParams,
) {
	return {
		Sql: '[EnergyConsum_Reports].[dbo].[Ins_ReportsItemLinkPrintRepItem]',
		CommandType: 'StoredProcedure',
		Parameters: [
			{
				Name: '@ID_ReportItem',
				DbType: 'int',
				Value: params.reportItemId,
				Direction: 'Input',
			},
			{
				Name: '@ID_PrintRepItem',
				DbType: 'int',
				Value: params.printReportItemId,
				Direction: 'Input',
			},
			{
				Name: '@ID_User',
				DbType: 'String',
				Value: params.userId,
				Direction: 'Input',
			},
			{
				Name: '@Module_name',
				DbType: 'String',
				Value: (params.moduleName = ModuleName.Test),
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

export function fetchPrintFormParametersQuery(
	params: FetchPrintFormParametersParams,
) {
	return {
		Sql: '[EnergyConsum_Reports].[dbo].[Get_PrintReportParamsInRep]',
		CommandType: 'StoredProcedure',
		Parameters: [
			{
				Name: '@FK_PrintReports',
				DbType: 'int',
				Value: params.printReportId,
				Direction: 'Input',
			},
			{
				Name: '@ID_User',
				DbType: 'String',
				Value: params.userId,
				Direction: 'Input',
			},
			{
				Name: '@Module_name',
				DbType: 'String',
				Value: (params.moduleName = ModuleName.Test),
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
export function fetchNotSyncedPrintFormParametersQuery(
	params: FetchPrintFormParametersParams,
) {
	return {
		Sql: '[EnergyConsum_Reports].[dbo].[Get_PrintReportParamsNotInRep]',
		CommandType: 'StoredProcedure',
		Parameters: [
			{
				Name: '@FK_PrintReports',
				DbType: 'int',
				Value: params.printReportId,
				Direction: 'Input',
			},
			{
				Name: '@ID_User',
				DbType: 'String',
				Value: params.userId,
				Direction: 'Input',
			},
			{
				Name: '@Module_name',
				DbType: 'String',
				Value: (params.moduleName = ModuleName.Test),
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
export function syncPrintFormParameterQuery(
	params: SyncPrintFormParametersParams,
) {
	return {
		Sql: '[EnergyConsum_Reports].[dbo].[Ins_PrintReportLinkParam]',
		CommandType: 'StoredProcedure',
		Parameters: [
			{
				Name: '@ID_Param',
				DbType: 'int',
				Value: params.paramId,
				Direction: 'Input',
			},
			{
				Name: '@FK_PrintReports',
				DbType: 'int',
				Value: params.printReportId,
				Direction: 'Input',
			},
			{
				Name: '@ID_User',
				DbType: 'String',
				Value: params.userId,
				Direction: 'Input',
			},
			{
				Name: '@Module_name',
				DbType: 'String',
				Value: (params.moduleName = ModuleName.Test),
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
				Name: '@LogOperation',
				DbType: 'String',
				Value: null,
				Direction: 'Output',
				Size: '2000',
			},
		],
	};
}
export function unsyncPrintFormParameterQuery(
	params: CommonPrintFormParametersParams,
) {
	return {
		Sql: '[EnergyConsum_Reports].[dbo].[Del_PrintReportLinkParam]',
		CommandType: 'StoredProcedure',
		Parameters: [
			{
				Name: '@ID_PrintRepLinkParam',
				DbType: 'int',
				Value: params.linkId,
				Direction: 'Input',
			},
			{
				Name: '@ID_User',
				DbType: 'String',
				Value: params.userId,
				Direction: 'Input',
			},
			{
				Name: '@Module_name',
				DbType: 'String',
				Value: (params.moduleName = ModuleName.Test),
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
export function fetchPrintFormParameterValuesQuery(
	params: CommonPrintFormParametersParams,
) {
	return {
		Sql: '[EnergyConsum_Reports].[dbo].[Get_PrintReportParamValues]',
		CommandType: 'StoredProcedure',
		Parameters: [
			{
				Name: '@FK_PrintReportsLinkParams',
				DbType: 'int',
				Value: params.linkId,
				Direction: 'Input',
			},
			{
				Name: '@ID_User',
				DbType: 'String',
				Value: params.userId,
				Direction: 'Input',
			},
			{
				Name: '@Module_name',
				DbType: 'String',
				Value: (params.moduleName = ModuleName.Test),
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
export function addPrintFormParameterValueQuery(
	params: AddParameterValuePrintFormParams,
) {
	return {
		Sql: '[EnergyConsum_Reports].[dbo].[Ins_PrintReportParamValue]',
		CommandType: 'StoredProcedure',
		Parameters: [
			{
				Name: '@ID_PrintRepLinkParam',
				DbType: 'int',
				Value: params.linkId,
				Direction: 'Input',
			},
			{
				Name: '@StringValue',
				DbType: 'String',
				Value: params.name,
				Direction: 'Input',
			},
			{
				Name: '@ActiveFrom',
				DbType: 'Datetime',
				Value: params.dateFrom,
				Direction: 'Input',
			},
			{
				Name: '@ActiveTo',
				DbType: 'Datetime',
				Value: params.dateTo,
				Direction: 'Input',
			},
			{
				Name: '@ID_User',
				DbType: 'String',
				Value: params.userId,
				Direction: 'Input',
			},
			{
				Name: '@Module_name',
				DbType: 'String',
				Value: (params.moduleName = ModuleName.Test),
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
export function updatePrintFormParameterValueQuery(
	params: AddParameterValuePrintFormParams,
) {
	return {
		Sql: '[EnergyConsum_Reports].[dbo].[Upd_PrintReportParamValue]',
		CommandType: 'StoredProcedure',
		Parameters: [
			{
				Name: '@ID',
				DbType: 'int',
				Value: params.linkId,
				Direction: 'Input',
			},
			{
				Name: '@StringValue',
				DbType: 'String',
				Value: params.name,
				Direction: 'Input',
			},
			{
				Name: '@ActiveFrom',
				DbType: 'Datetime',
				Value: params.dateFrom,
				Direction: 'Input',
			},
			{
				Name: '@ActiveTo',
				DbType: 'Datetime',
				Value: params.dateTo,
				Direction: 'Input',
			},
			{
				Name: '@ID_User',
				DbType: 'String',
				Value: params.userId,
				Direction: 'Input',
			},
			{
				Name: '@Module_name',
				DbType: 'String',
				Value: (params.moduleName = ModuleName.Test),
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
export function deletePrintFormParameterValueQuery(
	params: CommonPrintFormParametersParams,
) {
	return {
		Sql: '[EnergyConsum_Reports].[dbo].[Del_PrintReportParamValue]',
		CommandType: 'StoredProcedure',
		Parameters: [
			{
				Name: '@ID',
				DbType: 'int',
				Value: params.linkId,
				Direction: 'Input',
			},
			{
				Name: '@ID_User',
				DbType: 'String',
				Value: params.userId,
				Direction: 'Input',
			},
			{
				Name: '@Module_name',
				DbType: 'String',
				Value: (params.moduleName = ModuleName.Test),
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
export function fetchDevicesURSV510Query(params: FetchDevicesURSV510Params) {
	return {
		Sql: '[EnergyConsum_Reports].[dbo].[Get_DevicesURSV]',
		CommandType: 'StoredProcedure',
		Parameters: [
			{
				Name: '@ID_User',
				DbType: 'String',
				Value: params.userId,
				Direction: 'Input',
			},
			{
				Name: '@Module_name',
				DbType: 'String',
				Value: (params.moduleName = ModuleName.Test),
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
