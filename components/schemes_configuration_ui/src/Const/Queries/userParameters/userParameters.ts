import {
	AddUserParameterOptionParams,
	AddUserParameterParams,
	DeleteUserParameterOptionParams,
	DeleteUserParameterParams,
	GetUserParameterDataTypesParams,
	GetUserParameterFileParams,
	GetUserParameterFilesListParams,
	GetUserParameterOptionsParams,
	SaveUserParameterValueParams,
	SetAllObjectsValueParams,
	UpdateUserParameterOptionParams,
	UpdateUserParameterParams,
	UserParametersListParams,
} from './types';

export function getUserParametersListQuery({
	unitId,
	unitTypeId,
	userId,
	moduleName,
}: UserParametersListParams) {
	return {
		Sql: '[NSI].[NSIConfiguration].[Get_ЗначенияДинамическихПараметровОбъектаНСИ]',
		CommandType: 'StoredProcedure',
		Parameters: [
			{
				Name: '@ИдентификаторОбъекта',
				DbType: 'String',
				Value: unitId,
				Direction: 'Input',
			},
			{
				Name: '@КодТипаОбъектаНСИ',
				DbType: 'int',
				Value: unitTypeId,
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

export function getUserParameterOptionsQuery({
	userId,
	parameterId,
	moduleName,
}: GetUserParameterOptionsParams) {
	return {
		Sql: '[NSI].[NSIConfiguration].[Get_ВозможныеЗначенияПараметраТипаСписок]',
		CommandType: 'StoredProcedure',
		Parameters: [
			{
				Name: '@ID_User',
				DbType: 'String',
				Value: userId,
				Direction: 'Input',
			},
			{
				Name: '@КодДинамическогоПараметра',
				DbType: 'int',
				Value: parameterId,
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
				DbType: 'Int',
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

export function setAllObjectsValueQuery({
	userId,
	parameterId,
	currentValueId,
	futureValueId,
	moduleName,
}: SetAllObjectsValueParams) {
	return {
		Sql: '[NSI].[NSIConfiguration].[Upd_ИзменитьЗначениеТипаСписокУВсехОбъектов]',
		CommandType: 'StoredProcedure',
		Parameters: [
			{
				Name: '@ID_User',
				DbType: 'String',
				Value: userId,
				Direction: 'Input',
			},
			{
				Name: '@КодПараметра',
				DbType: 'int',
				Value: parameterId,
				Direction: 'Input',
			},
			{
				Name: '@ТекущееЗначение',
				DbType: 'int',
				Value: currentValueId,
				Direction: 'Input',
			},
			{
				Name: '@НовоеЗначение',
				DbType: 'int',
				Value: futureValueId,
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
				DbType: 'Int',
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

export function getUserParameterFilesListQuery({
	userId,
	valueId,
	moduleName,
}: GetUserParameterFilesListParams) {
	return {
		Sql: '[NSI].[NSIConfiguration].[Get_СписокФайловДинамическогоПараметра]',
		CommandType: 'StoredProcedure',
		Parameters: [
			{
				Name: '@ID_User',
				DbType: 'String',
				Value: userId,
				Direction: 'Input',
			},
			{
				Name: '@КодЗначенияДинамическогоПараметра',
				DbType: 'int',
				Value: valueId,
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
				DbType: 'Int',
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

export function getUserParameterFileQuery({
	userId,
	fileId,
	moduleName,
}: GetUserParameterFileParams) {
	return {
		Sql: '[NSI].[NSIConfiguration].[Get_ФайлДинамическогоПараметра]',
		CommandType: 'StoredProcedure',
		Parameters: [
			{
				Name: '@ID_User',
				DbType: 'String',
				Value: userId,
				Direction: 'Input',
			},
			{
				Name: '@КодФайла',
				DbType: 'int',
				Value: fileId,
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
				DbType: 'Int',
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

export function deleteUserParameterFileQuery({
	userId,
	fileId,
	moduleName,
}: GetUserParameterFileParams) {
	return {
		Sql: '[NSI].[NSIConfiguration].[Del_УдалитьФайлДинамическогоПараметра]',
		CommandType: 'StoredProcedure',
		Parameters: [
			{
				Name: '@ID_User',
				DbType: 'String',
				Value: userId,
				Direction: 'Input',
			},
			{
				Name: '@КодФайла',
				DbType: 'int',
				Value: fileId,
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
				DbType: 'Int',
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

export function saveUserParameterValueQuery({
	unitId,
	userId,
	parameterId,
	valueId,
	value,
	fileId,
	fileBinaryData,
	fileName,
	valueLastModified,
	moduleName,
}: SaveUserParameterValueParams) {
	return {
		Sql: '[NSI].[NSIConfiguration].[InsUpd_СохранитьЗначениеДинамическогоПараметра]',
		CommandType: 'StoredProcedure',
		Parameters: [
			{
				Name: '@ИдентификаторОбъекта',
				DbType: 'String',
				Value: unitId,
				Direction: 'Input',
			},
			{
				Name: '@ID_User',
				DbType: 'String',
				Value: userId,
				Direction: 'Input',
			},
			{
				Name: '@КодПараметра',
				DbType: 'int',
				Value: parameterId,
				Direction: 'Input',
			},
			{
				Name: '@КодЗначения',
				DbType: 'int',
				Value: valueId,
				Direction: 'Input',
			},
			{
				Name: '@Значение',
				DbType: 'String',
				Value: value,
				Direction: 'Input',
			},
			{
				Name: '@КодФайла',
				DbType: 'int',
				Value: fileId,
				Direction: 'Input',
			},
			{
				Name: '@BINARYBASE64',
				DbType: 'String',
				Value: fileBinaryData,
				Direction: 'Input',
			},
			{
				Name: '@ИмяФайла',
				DbType: 'String',
				Value: fileName,
				Direction: 'Input',
			},
			{
				Name: '@Module_name',
				DbType: 'String',
				Value: moduleName,
				Direction: 'Input',
			},
			{
				Name: '@LastModified',
				DbType: 'Guid',
				Value: valueLastModified,
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

export function getUserParameterDataTypesQuery({
	userId,
	moduleName,
}: GetUserParameterDataTypesParams) {
	return {
		Sql: '[NSI].[NSIConfiguration].[Get_СписокВозможныхТиповДанныхДинамическихПараметров]',
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

export function addUserParameterQuery({
	userId,
	unitTypeId,
	name,
	dataTypeId,
	comment,
	moduleName,
}: AddUserParameterParams) {
	return {
		Sql: '[NSI].[NSIConfiguration].[Ins_СоздатьДинамическийПараметр]',
		CommandType: 'StoredProcedure',
		Parameters: [
			{
				Name: '@ID_User',
				DbType: 'String',
				Value: userId,
				Direction: 'Input',
			},
			{
				Name: '@ТипОбъектаНСИ',
				DbType: 'int',
				Value: unitTypeId,
				Direction: 'Input',
			},
			{
				Name: '@НазваниеПараметра',
				DbType: 'String',
				Value: name,
				Direction: 'Input',
			},
			{
				Name: '@ТипПараметра',
				DbType: 'int',
				Value: dataTypeId,
				Direction: 'Input',
			},
			{
				Name: '@Комментарий',
				DbType: 'String',
				Value: comment,
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
				DbType: 'Int',
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

export function addUserParameterOptionQuery({
	userId,
	parameterId,
	value,
	moduleName,
}: AddUserParameterOptionParams) {
	return {
		Sql: '[NSI].[NSIConfiguration].[Ins_ДобавитьЗначениеДинамическогоПараметраТипаСписок]',
		CommandType: 'StoredProcedure',
		Parameters: [
			{
				Name: '@ID_User',
				DbType: 'String',
				Value: userId,
				Direction: 'Input',
			},
			{
				Name: '@КодПараметра',
				DbType: 'int',
				Value: parameterId,
				Direction: 'Input',
			},
			{
				Name: '@Значение',
				DbType: 'String',
				Value: value,
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
				DbType: 'Int',
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

export function updateUserParameterQuery({
	userId,
	parameterId,
	name,
	comment,
	lastModified,
	moduleName,
}: UpdateUserParameterParams) {
	return {
		Sql: '[NSI].[NSIConfiguration].[Upd_ИзменитьДинамическийПараметр]',
		CommandType: 'StoredProcedure',
		Parameters: [
			{
				Name: '@ID_User',
				DbType: 'String',
				Value: userId,
				Direction: 'Input',
			},
			{
				Name: '@КодПараметра',
				DbType: 'int',
				Value: parameterId,
				Direction: 'Input',
			},
			{
				Name: '@НазваниеПараметра',
				DbType: 'String',
				Value: name,
				Direction: 'Input',
			},
			{
				Name: '@Комментарий',
				DbType: 'String',
				Value: comment,
				Direction: 'Input',
			},
			{
				Name: '@Module_name',
				DbType: 'String',
				Value: moduleName,
				Direction: 'Input',
			},
			{
				Name: '@LastModified',
				DbType: 'Guid',
				Value: lastModified,
				Direction: 'Input',
			},
			{
				Name: '@Err',
				DbType: 'Int',
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

export function updateUserParameterOptionQuery({
	userId,
	valueId,
	value,
	lastModified,
	moduleName,
}: UpdateUserParameterOptionParams) {
	return {
		Sql: '[NSI].[NSIConfiguration].[Upd_ИзменитьВозможноеЗначениеДинамическогоПараметра]',
		CommandType: 'StoredProcedure',
		Parameters: [
			{
				Name: '@ID_User',
				DbType: 'String',
				Value: userId,
				Direction: 'Input',
			},
			{
				Name: '@КодЗначения',
				DbType: 'int',
				Value: valueId,
				Direction: 'Input',
			},
			{
				Name: '@Значение',
				DbType: 'String',
				Value: value,
				Direction: 'Input',
			},
			{
				Name: '@Module_name',
				DbType: 'String',
				Value: moduleName,
				Direction: 'Input',
			},
			{
				Name: '@LastModified',
				DbType: 'Guid',
				Value: lastModified,
				Direction: 'Input',
			},
			{
				Name: '@Err',
				DbType: 'Int',
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

export function deleteUserParameterQuery({
	userId,
	parameterId,
	lastModified,
	moduleName,
}: DeleteUserParameterParams) {
	return {
		Sql: '[NSI].[NSIConfiguration].[Del_УдалитьДинамическийПараметр]',
		CommandType: 'StoredProcedure',
		Parameters: [
			{
				Name: '@ID_User',
				DbType: 'String',
				Value: userId,
				Direction: 'Input',
			},
			{
				Name: '@КодПараметра',
				DbType: 'int',
				Value: parameterId,
				Direction: 'Input',
			},
			{
				Name: '@Module_name',
				DbType: 'String',
				Value: moduleName,
				Direction: 'Input',
			},
			{
				Name: '@LastModified',
				DbType: 'Guid',
				Value: lastModified,
				Direction: 'Input',
			},
			{
				Name: '@Err',
				DbType: 'Int',
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

export function deleteUserParameterOptionQuery({
	userId,
	valueId,
	lastModified,
	moduleName,
}: DeleteUserParameterOptionParams) {
	return {
		Sql: '[NSI].[NSIConfiguration].[Del_УдалитьВозможноеЗначениеДинамическогоПараметра]',
		CommandType: 'StoredProcedure',
		Parameters: [
			{
				Name: '@ID_User',
				DbType: 'String',
				Value: userId,
				Direction: 'Input',
			},
			{
				Name: '@КодЗначения',
				DbType: 'int',
				Value: valueId,
				Direction: 'Input',
			},
			{
				Name: '@Module_name',
				DbType: 'String',
				Value: moduleName,
				Direction: 'Input',
			},
			{
				Name: '@LastModified',
				DbType: 'Guid',
				Value: lastModified,
				Direction: 'Input',
			},
			{
				Name: '@Err',
				DbType: 'Int',
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
