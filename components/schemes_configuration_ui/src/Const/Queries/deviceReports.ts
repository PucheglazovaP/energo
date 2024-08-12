import {
	DeviceReportsParams,
	DevicesListParams,
} from '../../Models/DeviceReports/types';

export function getDeviceReportsQuery({
	reportType = 1,
	userId,
}: DeviceReportsParams) {
	return {
		Sql: '[appl_tags].[Get_Reports_ArchiveRep]',
		CommandType: 'StoredProcedure',
		Parameters: [
			{
				Name: '@ReportType',
				DbType: 'int',
				Value: reportType,
				Direction: 'Input',
			},
			{
				Name: '@ID_User',
				DbType: 'String',
				Value: userId,
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
		],
	};
}

export function getDevicesListQuery({
	reportType = 1,
	reportId = 'Строка 1',
	userId,
}: DevicesListParams) {
	return {
		Sql: '[appl_tags].[Get_Devises_ArchiveRep]',
		CommandType: 'StoredProcedure',
		Parameters: [
			{
				Name: '@ReportType',
				DbType: 'int',
				Value: reportType,
				Direction: 'Input',
			},
			{
				Name: '@Str1',
				DbType: 'String',
				Value: reportId,
				Direction: 'Input',
			},
			{
				Name: '@ID_User',
				DbType: 'String',
				Value: userId,
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
		],
	};
}
