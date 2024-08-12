import {
	FetchDiagnosticCurrentStateSampleAdapterReturn,
	UpdateDeviceFavoriteStateAdapterReturn,
} from '../../Adapters/diagnosticAdapters';
import {
	FetchChannelsDiagnosticParams,
	FetchDiagnosticChartParams,
	FetchDiagnosticGroupCurrentStateParams,
	RpcQuery,
} from '../../Shared/types';
import { ModuleName } from '../../Shared/Types/moduleName';

export function fetchDiagnosticCurrentStateEffectQuery(
	data: FetchDiagnosticCurrentStateSampleAdapterReturn,
): RpcQuery {
	const {
		currentPage,
		interfaces,
		portsLines,
		deviceTypes,
		deviceStatuses,
		deviceNumbers,
		deviceNames,
		crcExpression,
		toExpression,
		icpToExpression,
		okExpression,
		serverId,
		isFavoriteOnly,
		version,
		userId,
	} = data;

	return {
		Sql: '[appl_tags].[Get_DiagnosticCurrentState]',
		CommandType: 'StoredProcedure',
		Parameters: [
			{
				Name: '@FK_Server',
				DbType: 'int',
				Value: serverId || null,
				Direction: 'Input',
			},
			{
				Name: '@OrderMode',
				DbType: 'int',
				Value: 0,
				Direction: 'Input',
			},
			{
				Name: '@Version',
				DbType: 'String',
				Value: version || null,
				Direction: 'Input',
			},
			{
				Name: '@Flt_Interface',
				DbType: 'String',
				Value: interfaces || null,
				Direction: 'Input',
			},
			{
				Name: '@Flt_State',
				DbType: 'String',
				Value: deviceStatuses || null,
				Direction: 'Input',
			},
			{
				Name: '@Flt_Net',
				DbType: 'String',
				Value: portsLines || null,
				Direction: 'Input',
			},
			{
				Name: '@Flt_TypeDevice',
				DbType: 'String',
				Value: deviceTypes || null,
				Direction: 'Input',
			},
			{
				Name: '@Flt_NameDevice',
				DbType: 'String',
				Value: deviceNames || null,
				Direction: 'Input',
			},
			{
				Name: '@Flt_NumberDevice',
				DbType: 'String',
				Value: deviceNumbers || null,
				Direction: 'Input',
			},
			{
				Name: '@Flt_Crc',
				DbType: 'String',
				Value: crcExpression,
				Direction: 'Input',
			},
			{
				Name: '@Flt_Ok',
				DbType: 'String',
				Value: okExpression,
				Direction: 'Input',
			},
			{
				Name: '@Flt_To',
				DbType: 'String',
				Value: toExpression,
				Direction: 'Input',
			},
			{
				Name: '@Flt_Icp',
				DbType: 'String',
				Value: icpToExpression,
				Direction: 'Input',
			},
			{
				Name: '@Fav_Only',
				DbType: 'int',
				Value: isFavoriteOnly ? 1 : 0,
				Direction: 'Input',
			},
			{
				Name: '@ID_User',
				DbType: 'String',
				Value: userId,
				Direction: 'Input',
			},
			{
				Name: '@PageRowCount',
				DbType: 'int',
				Value: 100,
				Direction: 'Input',
			},
			{
				Name: '@PageNumber',
				DbType: 'int',
				Value: currentPage,
				Direction: 'Input',
				Size: 64,
			},
			{
				Name: '@FirstRow',
				DbType: 'int',
				Value: null,
				Direction: 'Output',
				Size: 64,
			},
			{
				Name: '@PageTotalCount',
				DbType: 'int',
				Value: null,
				Direction: 'Output',
				Size: 64,
			},
			{
				Name: '@Err',
				DbType: 'int',
				Value: null,
				Direction: 'Output',
				Size: 64,
			},
			{
				Name: 'TextErr',
				DbType: 'String',
				Value: null,
				Direction: 'Output',
				Size: 2000,
			},
		],
	};
}

export function updateDeviceFavoriteStateEffectQuery(
	data: UpdateDeviceFavoriteStateAdapterReturn,
): RpcQuery {
	const { isAdding, deviceNumber, userId, moduleName = ModuleName.Test } = data;

	const addDeviceQuery = {
		Sql: '[appl_tags].[Ins_CreateFavoriteDevicesDiagnostic]',
		CommandType: 'StoredProcedure',
		Parameters: [
			{
				Name: '@Devices',
				DbType: 'String',
				Value: deviceNumber,
				Direction: 'Input',
			},
			{
				Name: '@ID_User',
				DbType: 'String',
				Value: userId,
				Direction: 'Input',
			},
			{
				Name: '@ID_System',
				DbType: 'int',
				Value: 1,
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
				Size: 64,
			},
			{
				Name: 'TextErr',
				DbType: 'String',
				Value: null,
				Direction: 'Output',
				Size: 2000,
			},
			{
				Name: 'LogOperation',
				DbType: 'String',
				Value: null,
				Direction: 'Output',
				Size: 2000,
			},
		],
	};

	const removeDeviceQuery = {
		Sql: '[appl_tags].[Del_FavoriteDevicesDiagnostic]',
		CommandType: 'StoredProcedure',
		Parameters: [
			{
				Name: '@Devices',
				DbType: 'String',
				Value: deviceNumber,
				Direction: 'Input',
			},
			{
				Name: '@ID_User',
				DbType: 'String',
				Value: userId,
				Direction: 'Input',
			},
			{
				Name: '@ID_System',
				DbType: 'int',
				Value: 1,
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
				Size: 64,
			},
			{
				Name: 'TextErr',
				DbType: 'String',
				Value: null,
				Direction: 'Output',
				Size: 2000,
			},
			{
				Name: 'LogOperation',
				DbType: 'String',
				Value: null,
				Direction: 'Output',
				Size: 2000,
			},
		],
	};

	return isAdding ? addDeviceQuery : removeDeviceQuery;
}

export function fetchDiagnosticChartQuery(params: FetchDiagnosticChartParams) {
	return {
		Sql: '[appl_tags].[Get_DiagnosticDeviceData]',
		CommandType: 'StoredProcedure',
		Parameters: [
			{
				Name: '@Number',
				DbType: 'int',
				Value: params.deviceId,
				Direction: 'Input',
			},
			{
				Name: '@FromDate',
				DbType: 'DateTime',
				Value: params.fromDate, //"2022-11-01 00:00:00",
				Direction: 'Input',
			},
			{
				Name: '@ToDate',
				DbType: 'DateTime',
				Value: params.toDate, //"2022-12-01 00:00:00",
				Direction: 'Input',
			},
		],
	};
}

export function fetchDiagnosticGroupCurrentStateQuery(
	params: FetchDiagnosticGroupCurrentStateParams,
) {
	const { groupId, userId } = params;
	return {
		Sql: '[appl_tags].[Get_DiagnosticGroupCurrentState]',
		CommandType: 'StoredProcedure',
		Parameters: [
			{
				Name: '@FK_Group',
				DbType: 'int',
				Value: groupId,
				Direction: 'Input',
			},
			{
				Name: '@OrderMode',
				DbType: 'int',
				Value: 0,
				Direction: 'Input',
			},
			{
				Name: '@Flt_State',
				DbType: 'String',
				Value: null,
				Direction: 'Input',
			},
			{
				Name: '@Flt_NumberDevice',
				DbType: 'String',
				Value: null,
				Direction: 'Input',
			},
			{
				Name: '@Flt_NameDevice',
				DbType: 'String',
				Value: null,
				Direction: 'Input',
			},
			{
				Name: '@ID_User',
				DbType: 'String',
				Value: userId,
				Direction: 'Input',
			},
			{
				Name: '@PageRowCount',
				DbType: 'int',
				Value: 0,
				Direction: 'Input',
			},
			{
				Name: '@PageNumber',
				DbType: 'int',
				Value: 1,
				Direction: 'Output',
				Size: '64',
			},
			{
				Name: '@FirstRow',
				DbType: 'int',
				Value: null,
				Direction: 'Output',
				Size: '64',
			},
			{
				Name: '@PageTotalCount',
				DbType: 'int',
				Value: null,
				Direction: 'Output',
				Size: '64',
			},
			{
				Name: '@Err',
				DbType: 'int',
				Value: null,
				Direction: 'Output',
				Size: 64,
			},
			{
				Name: 'TextErr',
				DbType: 'String',
				Value: null,
				Direction: 'Output',
				Size: 2000,
			},
		],
	};
}

export function fetchChannelsDiagnosticQuery(
	params: FetchChannelsDiagnosticParams,
) {
	return {
		Sql: '[EMConfiguration].[appl_tags].Get_DiagnosticChannelsTable',
		CommandType: 'StoredProcedure',
		Parameters: [
			{
				Name: '@LastMinuts',
				DbType: 'int',
				Value: params.interval,
				Direction: 'Input',
			},
		],
	};
}

export default {};
