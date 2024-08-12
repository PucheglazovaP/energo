import { EditInputFormPointParameterAction } from '../../Models/EditInputFormPoints/types';
import { GetPointsDataAction } from '../../Models/InputFormPoints/types';
import { GetPointsHeaderAction } from '../../Models/InputFormPointsHeader/types';
import { InputFormOptionsParams } from '../../Shared/types';
import { ModuleName } from '../../Shared/Types/moduleName';

export function getInputFormPointOptionsQuery({
	userId,
	moduleName = ModuleName.Test,
}: InputFormOptionsParams) {
	return {
		Sql: '[EnergyConsum_Reports].dbo.Get_DailyPointsDataTKDirections',
		CommandType: 'StoredProcedure',
		Parameters: [
			{
				Name: '@Module_name',
				DbType: 'String',
				Value: moduleName,
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

export function getInputFormPointsHeaderQuery(params: GetPointsHeaderAction) {
	const { userId, energyResource, moduleName = ModuleName.Test } = params;
	return {
		Sql: '[EnergyConsum_Reports].dbo.Get_DailyPointsDataBaseEditorCaptions',
		CommandType: 'StoredProcedure',
		Parameters: [
			{
				DbType: 'int',
				Direction: 'Input',
				Name: '@FK_EnergyResources',
				Size: null,
				Value: energyResource,
			},
			{
				DbType: 'String',
				Direction: 'Input',
				Name: '@Module_name',
				Size: null,
				Value: moduleName,
			},
			{
				DbType: 'String',
				Direction: 'Input',
				Name: '@ID_User',
				Size: null,
				Value: userId,
			},
			{
				DbType: 'int',
				Direction: 'Output',
				Name: '@Err',
				Size: '64',
				Value: null,
			},
			{
				DbType: 'String',
				Direction: 'Output',
				Name: '@TextErr',
				Size: '2000',
				Value: null,
			},
		],
	};
}

export function getInputFormPointsDatasetQuery(params: GetPointsDataAction) {
	const {
		userId,
		energyResourceId,
		sessionId,
		date,
		moduleName = ModuleName.Test,
	} = params;
	return {
		Sql: '[EnergyConsum_Reports].dbo.Get_DailyPointsDataBaseEditorValues',
		CommandType: 'StoredProcedure',
		Parameters: [
			{
				DbType: 'int',
				Direction: 'Input',
				Name: '@FK_EditSessionID',
				Size: null,
				Value: sessionId || null,
			},
			{
				DbType: 'Datetime',
				Direction: 'Input',
				Name: '@Date',
				Size: null,
				Value: date,
			},
			{
				DbType: 'int',
				Direction: 'Input',
				Name: '@FK_EnergyResources',
				Size: null,
				Value: energyResourceId,
			},
			{
				DbType: 'String',
				Direction: 'Input',
				Name: '@Module_name',
				Size: null,
				Value: moduleName,
			},
			{
				DbType: 'String',
				Direction: 'Input',
				Name: '@ID_User',
				Size: null,
				Value: userId,
			},
			{
				DbType: 'int',
				Direction: 'Output',
				Name: '@Err',
				Size: '64',
				Value: null,
			},
			{
				DbType: 'String',
				Direction: 'Output',
				Name: '@TextErr',
				Size: '2000',
				Value: null,
			},
		],
	};
}

export function editInputFormPointParameterQuery(
	params: EditInputFormPointParameterAction,
) {
	const {
		userId,
		energyResourceId,
		sessionId,
		pointId,
		date,
		fieldName,
		fieldValue,
		moduleName = ModuleName.Test,
	} = params;
	return {
		Sql: '[EnergyConsum_Reports].dbo.Upd_EditSessions_SaveBaseEditedValue',
		CommandType: 'StoredProcedure',
		Parameters: [
			{
				DbType: 'int',
				Direction: 'Input',
				Name: '@FK_EditSessionID',
				Size: null,
				Value: sessionId,
			},
			{
				DbType: 'int',
				Direction: 'Input',
				Name: '@FK_EnergyResources',
				Size: null,
				Value: energyResourceId,
			},
			{
				DbType: 'Datetime',
				Direction: 'Input',
				Name: '@Date',
				Size: null,
				Value: date,
			},
			{
				DbType: 'int',
				Direction: 'Input',
				Name: '@id',
				Size: null,
				Value: pointId,
			},
			{
				DbType: 'String',
				Direction: 'Input',
				Name: '@FieldDatasetName',
				Size: null,
				Value: fieldName,
			},
			{
				DbType: 'String',
				Direction: 'Input',
				Name: '@FieldValue',
				Size: null,
				Value: fieldValue,
			},
			{
				DbType: 'String',
				Direction: 'Input',
				Name: '@Module_name',
				Size: null,
				Value: moduleName,
			},
			{
				DbType: 'String',
				Direction: 'Input',
				Name: '@ID_User',
				Size: null,
				Value: userId,
			},
			{
				DbType: 'int',
				Direction: 'Output',
				Name: '@Err',
				Size: '64',
				Value: null,
			},
			{
				DbType: 'String',
				Direction: 'Output',
				Name: '@TextErr',
				Size: '2000',
				Value: null,
			},
		],
	};
}
