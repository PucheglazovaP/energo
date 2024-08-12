import {
	PointLogBookBodyListParams,
	PointLogBookHeaderListParams,
	SavePointLogBookValueParams,
} from '../../Models/PointsLogBook/types';
import { ModuleName } from '../../Shared/Types/moduleName';

export function fetchPointLogBookHeaderListQuery({
	pointId = 1,
	userId,
	moduleName = ModuleName.Test,
}: PointLogBookHeaderListParams) {
	return {
		Sql: '[EnergyConsum_Reports].[dbo].Get_DailyPointsDataRangedEditorCaptions',
		CommandType: 'StoredProcedure',
		Parameters: [
			{
				Name: '@FK_Points',
				DbType: 'int',
				Value: pointId,
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

export function fetchPointLogBookBodyListQuery({
	fromd,
	tod,
	pointId = 1,
	userId,
	moduleName = ModuleName.Test,
}: PointLogBookBodyListParams) {
	return {
		Sql: '[EnergyConsum_Reports].[dbo].Get_DailyPointsDataRangedForm',
		CommandType: 'StoredProcedure',
		Parameters: [
			{
				Name: '@fromd',
				DbType: 'DateTime',
				Value: fromd,
				Direction: 'Input',
			},
			{
				Name: '@tod',
				DbType: 'DateTime',
				Value: tod,
				Direction: 'Input',
			},
			{
				Name: '@FK_Points',
				DbType: 'int',
				Value: pointId,
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

export function savePointLogBookValueQuery({
	sessionId = null,
	pointId = 1,
	date,
	fieldDatasetName = 'test',
	fieldValue = 'test',
	userId,
	moduleName = ModuleName.Test,
}: SavePointLogBookValueParams) {
	return {
		Sql: '[EnergyConsum_Reports].[dbo].Upd_DailyPointsDataRangedForm_SaveEditedValue',
		CommandType: 'StoredProcedure',
		Parameters: [
			{
				Name: '@FK_RangeEditSessionID',
				DbType: 'int',
				Value: sessionId,
				Direction: 'Input',
			},
			{
				Name: '@FK_Point',
				DbType: 'int',
				Value: pointId,
				Direction: 'Input',
			},
			{
				Name: '@Date',
				DbType: 'DateTime',
				Value: date,
				Direction: 'Input',
			},
			{
				Name: '@FieldDatasetName',
				DbType: 'String',
				Value: fieldDatasetName,
				Direction: 'Input',
			},
			{
				Name: '@FieldValue',
				DbType: 'String',
				Value: fieldValue,
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
