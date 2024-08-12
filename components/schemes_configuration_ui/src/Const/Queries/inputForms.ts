import {
	GetEditDataAction,
	UpdateEditValueAction,
} from '../../Models/EditInputForm/types';
import { GetDataAction } from '../../Models/InputForm/types';
import { GetHeaderAction } from '../../Models/InputFormHeader/types';
import { GetInputFormSessionAction } from '../../Models/InputFormSession/types';
import { InputFormOptionsParams } from '../../Shared/types';
import { ModuleName } from '../../Shared/Types/moduleName';

export function getInputFormOptionsQuery({
	userId,
	moduleName = ModuleName.Test,
}: InputFormOptionsParams) {
	return {
		Sql: '[EnergyConsum_Reports].dbo.Get_DailyPointsAVGMethods',
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

export function getInputFormHeaderQuery(params: GetHeaderAction) {
	const { userId, energyResource, moduleName = ModuleName.Test } = params;
	return {
		Sql: '[EnergyConsum_Reports].dbo.Get_DailyPointsDataEditorCaptions',
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
				Name: '@Version',
				DbType: 'int',
				Value: 2,
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

export function getInputFormDataQuery(params: GetDataAction) {
	const {
		userId,
		energyResourceId,
		date,
		moduleName = ModuleName.Test,
	} = params;
	return {
		Sql: '[EnergyConsum_Reports].dbo.Form_BaseInput_V3',
		CommandType: 'StoredProcedure',
		Parameters: [
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

export function getInputFormSessionQuery(params: GetInputFormSessionAction) {
	const {
		userId,
		energyResourceId,
		date,
		moduleName = ModuleName.Test,
	} = params;
	return {
		Sql: '[EnergyConsum_Reports].dbo.Get_EditSessions_CheckEnergyResourcesAndValueDT',
		CommandType: 'StoredProcedure',
		Parameters: [
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
				Name: '@ValueDT',
				Size: null,
				Value: date,
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

export function createInputFormSessionQuery(params: GetDataAction) {
	const {
		userId,
		energyResourceId,
		date,
		moduleName = ModuleName.Test,
	} = params;
	return {
		Sql: '[EnergyConsum_Reports].dbo.Ins_EditSessions_CreateSession',
		CommandType: 'StoredProcedure',
		Parameters: [
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
				Name: '@ValueDT',
				Size: null,
				Value: date,
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

export function getEditInputFormDatasetQuery(params: GetEditDataAction) {
	const { userId, sessionId, moduleName = ModuleName.Test } = params;
	return {
		Sql: '[EnergyConsum_Reports].dbo.Form_BaseInputBySession',
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

export function updateEditValueQuery(params: UpdateEditValueAction) {
	const {
		userId,
		sessionId,
		energyResourceId,
		date,
		rowId,
		fieldName,
		value,
		moduleName = ModuleName.Test,
	} = params;
	return {
		Sql: '[EnergyConsum_Reports].dbo.Upd_EditSessions_SaveEditedValue',
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
				Value: rowId,
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
				Value: value,
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

export function closeInputFormSessionQuery(params: GetEditDataAction) {
	const { userId, sessionId, moduleName = ModuleName.Test } = params;
	return {
		Sql: '[EnergyConsum_Reports].dbo.Upd_EditSessions_CloseSessionWithoutSaveData',
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

export function saveInputFormSessionQuery(params: GetEditDataAction) {
	const { userId, sessionId, moduleName = ModuleName.Test } = params;
	return {
		Sql: '[EnergyConsum_Reports].dbo.Upd_EditSessions_CloseSessionWithSaveData',
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
