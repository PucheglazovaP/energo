import {
	CommonIdParams,
	CreateReportItemParams,
	EditReportItemParams,
	EditReportParams,
	MoveReportItemParams,
} from '../../Shared/types';
import { ModuleName } from '../../Shared/Types/moduleName';

export function getReportsQuery() {
	return {
		Sql: '[EnergyConsum_Reports].[dbo].Get_Reports',
		CommandType: 'StoredProcedure',
		Parameters: [],
	};
}

export function createReportQuery(params: EditReportParams) {
	const { comment, name, userId, moduleName = ModuleName.Test } = params;
	return {
		Sql: '[EnergyConsum_Reports].[dbo].Ins_Report',
		CommandType: 'StoredProcedure',
		Parameters: [
			{
				Name: '@Name',
				DbType: 'String',
				Value: name,
				Direction: 'Input',
			},
			{
				Name: '@Comment',
				DbType: 'String',
				Value: comment,
				Direction: 'Input',
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
				Name: '@LogOperation',
				DbType: 'String',
				Value: '',
				Direction: 'Output',
			},
		],
	};
}

export function editReportQuery(params: EditReportParams) {
	const {
		id = null,
		comment,
		name,
		userId,
		moduleName = ModuleName.Test,
	} = params;
	return {
		Sql: '[EnergyConsum_Reports].[dbo].Upd_Report',
		CommandType: 'StoredProcedure',
		Parameters: [
			{
				Name: '@ID',
				DbType: 'int',
				Value: id,
				Direction: 'Input',
			},
			{
				Name: '@Name',
				DbType: 'String',
				Value: name,
				Direction: 'Input',
			},
			{
				Name: '@Comment',
				DbType: 'String',
				Value: comment,
				Direction: 'Input',
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
				Name: '@LogOperation',
				DbType: 'String',
				Value: '',
				Direction: 'Output',
			},
		],
	};
}

export function deleteReportQuery(params: CommonIdParams) {
	const { id, userId, moduleName = ModuleName.Test } = params;
	return {
		Sql: '[EnergyConsum_Reports].[dbo].Del_Report',
		CommandType: 'StoredProcedure',
		Parameters: [
			{
				Name: '@ID',
				DbType: 'int',
				Value: id,
				Direction: 'Input',
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
		],
	};
}

export function getReportItemsQuery(params: CommonIdParams) {
	const { id, userId, moduleName = ModuleName.Test } = params;
	return {
		Sql: '[EnergyConsum_Reports].[dbo].Get_ReportItems',
		CommandType: 'StoredProcedure',
		Parameters: [
			{
				Name: '@FK_Report',
				DbType: 'int',
				Value: id,
				Direction: 'Input',
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
		],
	};
}

export function createReportItemQuery(params: CreateReportItemParams) {
	const {
		userId,
		reportId,
		positionName,
		insertPosition,
		targetId,
		moduleName = ModuleName.Test,
	} = params;
	return {
		Sql: '[EnergyConsum_Reports].[dbo].Ins_ReportsTreeItem',
		CommandType: 'StoredProcedure',
		Parameters: [
			{
				Name: '@FK_Reports',
				DbType: 'int',
				Value: reportId,
				Direction: 'Input',
			},
			{
				Name: '@TargetID',
				DbType: 'int',
				Value: targetId,
				Direction: 'Input',
			},
			{
				Name: '@InsPosition',
				DbType: 'int',
				Value: insertPosition,
				Direction: 'Input',
			},
			{
				Name: '@PositionName',
				DbType: 'String',
				Value: positionName,
				Direction: 'Input',
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
				Name: '@LogOperation',
				DbType: 'String',
				Value: '',
				Direction: 'Output',
			},
		],
	};
}

export function editReportItemQuery(params: EditReportItemParams) {
	const {
		id,
		userId,
		isCalculated,
		pointId,
		coefficient,
		positionName,
		reportPositionNumber,
		activeFrom,
		activeTo,
		moduleName = ModuleName.Test,
	} = params;
	return {
		Sql: '[EnergyConsum_Reports].[dbo].Upd_ReportsTreeItem',
		CommandType: 'StoredProcedure',
		Parameters: [
			{
				Name: '@ID',
				DbType: 'int',
				Value: id,
				Direction: 'Input',
			},
			{
				Name: '@PositionName',
				DbType: 'String',
				Value: positionName,
				Direction: 'Input',
			},
			{
				Name: 'ReportPositionNumber',
				DbType: 'String',
				Value: reportPositionNumber,
				Direction: 'Input',
			},
			{
				Name: '@IsCalculated',
				DbType: 'int',
				Value: isCalculated,
				Direction: 'Input',
			},
			{
				Name: '@FK_Points',
				DbType: 'int',
				Value: pointId,
				Direction: 'Input',
			},
			{
				Name: '@Coefficient',
				DbType: 'float',
				Value: coefficient,
				Direction: 'Input',
			},
			{
				Name: '@ActiveFrom',
				DbType: 'Date',
				Value: activeFrom,
				Direction: 'Input',
			},
			{
				Name: '@ActiveTo',
				DbType: 'Date',
				Value: activeTo,
				Direction: 'Input',
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
				Name: '@LogOperation',
				DbType: 'String',
				Value: '',
				Direction: 'Output',
			},
		],
	};
}

export function moveReportItemQuery(params: MoveReportItemParams) {
	const {
		id,
		targetId,
		insertPosition,
		userId,
		moduleName = ModuleName.Test,
	} = params;
	return {
		Sql: '[EnergyConsum_Reports].[dbo].Upd_ReportsTreeItem_move',
		CommandType: 'StoredProcedure',
		Parameters: [
			{
				Name: '@ID',
				DbType: 'int',
				Value: id,
				Direction: 'Input',
			},
			{
				Name: '@TargetID',
				DbType: 'int',
				Value: targetId,
				Direction: 'Input',
			},
			{
				Name: '@InsPosition',
				DbType: 'int',
				Value: insertPosition,
				Direction: 'Input',
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
		],
	};
}

export function deleteReportItemQuery(params: CommonIdParams) {
	const { id, userId, moduleName = ModuleName.Test } = params;
	return {
		Sql: '[EnergyConsum_Reports].[dbo].Del_ReportsTreeItem',
		CommandType: 'StoredProcedure',
		Parameters: [
			{
				Name: '@ID',
				DbType: 'int',
				Value: id,
				Direction: 'Input',
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
		],
	};
}

export function getReportLink(id: number) {
	return {
		Sql: '[dict].[Get_ReportsURL]',
		CommandType: 'StoredProcedure',
		Parameters: [
			{
				Name: '@ID',
				DbType: 'int',
				Value: id,
				Direction: 'Input',
			},
		],
	};
}
