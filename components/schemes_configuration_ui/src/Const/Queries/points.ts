import {
	CreatePointChannelParams,
	DeleteParams,
	EditPointChannelParams,
	EditPointParams,
	EnergyResourceUpdateParams,
	GetPointsAction,
	MovePointsSortOrder,
	PointChannelsListParams,
} from '../../Models/Points/types';
import { ModuleName } from '../../Shared/Types/moduleName';

export function getPointsQuery({
	energyResource,
	pointId = null,
	userId,
	moduleName = ModuleName.Test,
}: GetPointsAction) {
	return {
		Sql: '[EnergyConsum_Reports].[dbo].Get_Points',
		CommandType: 'StoredProcedure',
		Parameters: [
			{
				Name: '@ID',
				DbType: 'int',
				Value: pointId,
				Direction: 'Input',
			},
			{
				Name: '@FK_EnergyResources',
				DbType: 'int',
				Value: energyResource,
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

export function getEnergyResourcesQuery() {
	return {
		Sql: '[EnergyConsum_Reports].[dbo].[Get_EnergyResourcesForPrimaryChannelsData]',
		CommandType: 'StoredProcedure',
		Parameters: [],
	};
}

export function updateEnergyResourceBaseHourQuery({
	energyResourceId,
	baseHour,
	userId,
	moduleName,
}: EnergyResourceUpdateParams) {
	return {
		Sql: '[EnergyConsum_Reports].[dbo].Upd_EnergyResource',
		CommandType: 'StoredProcedure',
		Parameters: [
			{
				Name: '@ID',
				DbType: 'int',
				Value: energyResourceId,
				Direction: 'Input',
			},
			{
				Name: '@BaseHour',
				DbType: 'int',
				Value: baseHour,
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

export function getChannelsQuery({
	point,
	userId,
	moduleName,
}: PointChannelsListParams) {
	return {
		Sql: '[EnergyConsum_Reports].[dbo].Get_PointCoreChannelsNumberReplaces',
		CommandType: 'StoredProcedure',
		Parameters: [
			{
				Name: '@FK_Points',
				DbType: 'int',
				Value: point,
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
// fromId айдишник элемента, который двигаем
// toId айдишник элемента, после которым ставим
export function movePointsOrderQuery({
	fromId,
	toId,
	lastModified,
	userId,
	moduleName = ModuleName.Test,
}: MovePointsSortOrder) {
	return {
		Sql: '[EnergyConsum_Reports].[dbo].Upd_PointsSortOrder',
		CommandType: 'StoredProcedure',
		Parameters: [
			{
				Name: '@ID',
				DbType: 'int',
				Value: fromId,
				Direction: 'Input',
			},
			{
				Name: '@PrevID',
				DbType: 'int',
				Value: toId,
				Direction: 'Input',
			},
			{
				Name: '@LastModified',
				DbType: 'Guid',
				Value: lastModified,
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
				Name: '@LogOperation',
				DbType: 'String',
				Value: '',
				Direction: 'Output',
			},
		],
	};
}

export function createPointQuery(pointData: EditPointParams) {
	const {
		prevId,
		shortName,
		captionName,
		name,
		comment,
		energyResource,
		linkedPointRatio,
		linkedPointId,
		linkedPointComment,
		userId,
		moduleName = ModuleName.Test,
	} = pointData;
	return {
		Sql: '[EnergyConsum_Reports].[dbo].Ins_Points',
		CommandType: 'StoredProcedure',
		Parameters: [
			{
				Name: '@PID',
				DbType: 'int',
				Value: null,
				Direction: 'Input',
			},
			{
				Name: '@PrevID',
				DbType: 'int',
				Value: prevId || 0,
				Direction: 'Input',
			},
			{
				Name: '@ShortName',
				DbType: 'String',
				Value: shortName,
				Direction: 'Input',
			},
			{
				Name: '@InputCaption',
				DbType: 'String',
				Value: captionName,
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
				Name: '@FK_EnergyResources',
				DbType: 'int',
				Value: energyResource,
				Direction: 'Input',
			},
			{
				Name: '@LinkedPointID',
				DbType: 'int',
				Value: linkedPointId,
				Direction: 'Input',
			},
			{
				Name: '@LinkedPointCoeff',
				DbType: 'float',
				Value: linkedPointRatio || 0,
				Direction: 'Input',
			},
			{
				Name: '@LinkedPointComment',
				DbType: 'String',
				Value: linkedPointComment,
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

export function updatePointQuery(pointData: EditPointParams) {
	const {
		id,
		shortName,
		captionName,
		name,
		comment,
		energyResource,
		linkedPointId,
		linkedPointRatio,
		linkedPointComment,
		lastModified,
		userId,
		moduleName = ModuleName.Test,
	} = pointData;
	return {
		Sql: '[EnergyConsum_Reports].[dbo].Upd_Points',
		CommandType: 'StoredProcedure',
		Parameters: [
			{
				Name: '@ID',
				DbType: 'int',
				Value: id || null,
				Direction: 'Input',
			},
			{
				Name: '@PID',
				DbType: 'int',
				Value: null,
				Direction: 'Input',
			},
			{
				Name: '@ShortName',
				DbType: 'String',
				Value: shortName,
				Direction: 'Input',
			},
			{
				Name: '@InputCaption',
				DbType: 'String',
				Value: captionName,
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
				Name: '@FK_EnergyResources',
				DbType: 'int',
				Value: energyResource,
				Direction: 'Input',
			},
			{
				Name: '@LinkedPointID',
				DbType: 'int',
				Value: linkedPointId,
				Direction: 'Input',
			},
			{
				Name: '@LinkedPointCoeff',
				DbType: 'float',
				Value: linkedPointRatio || 0,
				Direction: 'Input',
			},
			{
				Name: '@LinkedPointComment',
				DbType: 'String',
				Value: linkedPointComment,
				Direction: 'Input',
			},
			{
				Name: '@LastModified',
				DbType: 'Guid',
				Value: lastModified,
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

export function deletePointQuery(pointData: DeleteParams) {
	const { id, lastModified, userId, moduleName = ModuleName.Test } = pointData;
	return {
		Sql: '[EnergyConsum_Reports].[dbo].Del_Points',
		CommandType: 'StoredProcedure',
		Parameters: [
			{
				Name: '@ID',
				DbType: 'int',
				Value: id,
				Direction: 'Input',
			},
			{
				Name: '@LastModified',
				DbType: 'Guid',
				Value: lastModified,
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

export function addPointChannelQuery(channelData: CreatePointChannelParams) {
	const {
		pointId,
		channelNumber,
		userId,
		moduleName = ModuleName.Test,
	} = channelData;
	return {
		Sql: '[EnergyConsum_Reports].[dbo].Ins_PointCoreChannelsNumberReplaces',
		CommandType: 'StoredProcedure',
		Parameters: [
			{
				Name: '@FK_Points',
				DbType: 'int',
				Value: pointId,
				Direction: 'Input',
			},
			{
				Name: '@CoreChannelsNumber',
				DbType: 'int',
				Value: channelNumber,
				Direction: 'Input',
			},
			{
				Name: '@BaseCumulativeValue',
				DbType: 'Decimal',
				Value: 1,
				Direction: 'Input',
			},
			{
				Name: '@Coefficient',
				DbType: 'Decimal',
				Value: 1,
				Direction: 'Input',
			},
			{
				Name: '@Comment',
				DbType: 'String',
				Value: '',
				Direction: 'Input',
			},
			{
				Name: '@ActiveFrom',
				DbType: 'Date',
				Value: null,
				Direction: 'Input',
			},
			{
				Name: '@ActiveTo',
				DbType: 'Date',
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
				Size: '2000',
			},
		],
	};
}

export function editPointChannelQuery(channelData: EditPointChannelParams) {
	const {
		id,
		number,
		baseValue,
		coefficient,
		startTime,
		endTime,
		lastModified,
		userId,
		moduleName = ModuleName.Test,
	} = channelData;
	return {
		Sql: '[EnergyConsum_Reports].[dbo].Upd_PointCoreChannelsNumberReplaces',
		CommandType: 'StoredProcedure',
		Parameters: [
			{
				Name: '@ID',
				DbType: 'int',
				Value: id,
				Direction: 'Input',
			},
			{
				Name: '@CoreChannelsNumber',
				DbType: 'int',
				Value: number,
				Direction: 'Input',
			},
			{
				Name: '@BaseCumulativeValue',
				DbType: 'Decimal(38,8)',
				Value: String(baseValue),
				Direction: 'Input',
			},
			{
				Name: '@Coefficient',
				DbType: 'Decimal(38,8)',
				Value: String(coefficient),
				Direction: 'Input',
			},
			{
				Name: '@Comment',
				DbType: 'String',
				Value: '',
				Direction: 'Input',
			},
			{
				Name: '@ActiveFrom',
				DbType: 'Date',
				Value: startTime,
				Direction: 'Input',
			},
			{
				Name: '@ActiveTo',
				DbType: 'Date',
				Value: endTime || null,
				Direction: 'Input',
			},
			{
				Name: '@LastModified',
				DbType: 'Guid',
				Value: lastModified,
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
				Size: '2000',
			},
		],
	};
}

export function deletePointChannelQuery(channelData: DeleteParams) {
	const {
		id,
		lastModified,
		userId,
		moduleName = ModuleName.Test,
	} = channelData;
	return {
		Sql: '[EnergyConsum_Reports].[dbo].Del_PointCoreChannelsNumberReplaces',
		CommandType: 'StoredProcedure',
		Parameters: [
			{
				Name: '@ID',
				DbType: 'int',
				Value: id,
				Direction: 'Input',
			},
			{
				Name: '@LastModified',
				DbType: 'Guid',
				Value: lastModified,
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
				Size: '2000',
			},
		],
	};
}
