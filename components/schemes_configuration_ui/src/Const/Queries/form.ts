import { FormActionParams } from '../../Models/NewForm/types';
import {
	ChangeFormNameParams,
	DeleteFormParams,
	FetchFormParametersParams,
	MoveFormParams,
	PublishFormParams,
} from '../../Shared/types';
import { ModuleName } from '../../Shared/Types/moduleName';

export function getFormTypesQuery(versionId: number) {
	return {
		Sql: '[Редактор].[dbo].Get_СписокТиповФорм',
		CommandType: 'StoredProcedure',
		Parameters: [
			{
				Name: '@КодВерсии',
				DbType: 'int',
				Value: versionId,
				Direction: 'Input',
			},
		],
	};
}

export function saveFormQuery(params: FormActionParams) {
	return {
		Sql: '[Редактор].[dbo].Ins_СоздатьФорму',
		CommandType: 'StoredProcedure',
		Parameters: [
			{
				Name: '@Название',
				DbType: 'String',
				Value: params.name,
				Direction: 'Input',
			},
			{
				Name: '@КодТипаФормы',
				DbType: 'int',
				Value: params.formTypeCode,
				Direction: 'Input',
			},
			{
				Name: '@КодРодителя',
				DbType: 'int',
				Value: params.parentCode,
				Direction: 'Input',
			},
			{
				Name: '@КодТекущегоУзла',
				DbType: 'int',
				Value: params.formCode,
				Direction: 'Input',
			},
			{
				Name: '@ВставитьПоОтношениюКТекущемуУзлу',
				DbType: 'int',
				Value: params.position,
				Direction: 'Input',
			},
			{
				Name: '@КодВерсии',
				DbType: 'int',
				Value: params.versionCode,
				Direction: 'Input',
			},
			{
				Name: '@КодОбъектаФормы',
				DbType: 'int',
				Value: params.objectId || null,
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
				Value: params.moduleName,
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

export function copyFormQuery(params: FormActionParams) {
	return {
		Sql: '[Редактор].[dbo].Ins_СоздатьКопиюФормы',
		CommandType: 'StoredProcedure',
		Parameters: [
			{
				Name: '@Название',
				DbType: 'String',
				Value: params.name,
				Direction: 'Input',
			},
			{
				Name: '@КодФормыОригинала',
				DbType: 'int',
				Value: params.formTypeCode,
				Direction: 'Input',
			},
			{
				Name: '@КодРодителя',
				DbType: 'int',
				Value: params.parentCode,
				Direction: 'Input',
			},
			{
				Name: '@КодТекущегоУзла',
				DbType: 'int',
				Value: params.formCode,
				Direction: 'Input',
			},
			{
				Name: '@ВставитьПоОтношениюКТекущемуУзлу',
				DbType: 'int',
				Value: params.position,
				Direction: 'Input',
			},
			{
				Name: '@СПотомками',
				DbType: 'int',
				Value: Number(params.withChildren),
				Direction: 'Input',
			},
			{
				Name: '@КодВерсии',
				DbType: 'int',
				Value: params.versionCode,
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
				Value: params.moduleName,
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

export function deleteFormQuery(params: DeleteFormParams) {
	return {
		Sql: '[Редактор].[dbo].Del_УдалитьФорму',
		CommandType: 'StoredProcedure',
		Parameters: [
			{
				Name: '@КодФормы',
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
				Value: params.moduleName,
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

export const moveFormQuery = (params: MoveFormParams) => {
	return {
		Sql: '[Редактор].[dbo].Upd_ПорядковыйНомерФормы',
		CommandType: 'StoredProcedure',
		Parameters: [
			{
				Name: '@КодФормы',
				DbType: 'int',
				Value: params.formId,
				Direction: 'Input',
			},
			{
				Name: '@УвеличитьПорядковыйНомер',
				DbType: 'int',
				Value: params.move,
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
				Value: params.moduleName,
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
};

export function getFormParametersQuery(params: FetchFormParametersParams) {
	return {
		Sql: '[Редактор].[dbo].[Get_АРМ_ПараметрыФорм_ТрансляцияПараметровИзЦМ]',
		CommandType: 'StoredProcedure',
		Parameters: [
			{
				Name: '@КодФормы',
				DbType: 'int',
				Value: params.formId,
				Direction: 'Input',
			},
			{
				Name: '@КодВерсии',
				DbType: 'int',
				Value: params.versionCode,
				Direction: 'Input',
			},
		],
	};
}
export function fetchFormTreeQuery(
	versionCode: number,
	userId: string,
	moduleName: ModuleName = ModuleName.Test,
) {
	return {
		Sql: '[Редактор].[dbo].[Get_ДеревоФормУпорядоченоПоУровням2]',
		CommandType: 'StoredProcedure',
		Parameters: [
			{
				Name: '@КодВерсии',
				DbType: 'int',
				Value: versionCode,
				Direction: 'Input',
			},
			{
				Name: '@СтартовыйУзел',
				DbType: 'int',
				Value: null,
				Direction: 'Input',
			},
			{
				Name: '@КодФормыДиагностики',
				DbType: 'int',
				Value: 1,
				Direction: 'Output',
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
export function getFormBackgroundQuery(formId: number) {
	return {
		Sql: '[Редактор].[dbo].[Get_АРМ_ПодложкаФормы]',
		CommandType: 'StoredProcedure',
		Parameters: [
			{
				Name: '@КодФормы',
				DbType: 'int',
				Value: formId,
				Direction: 'Input',
			},
		],
	};
}

export function updateFormNameQuery(params: ChangeFormNameParams) {
	return {
		Sql: '[Редактор].[dbo].Upd_ИзменитьИмяФормы',
		CommandType: 'StoredProcedure',
		Parameters: [
			{
				Name: '@КодФормы',
				DbType: 'int',
				Value: params.formId,
				Direction: 'Input',
			},
			{
				Name: '@НовоеНазваниеФормы',
				DbType: 'String',
				Value: params.newFormName,
				Direction: 'Input',
			},
			{
				Name: '@КодВерсии',
				DbType: 'int',
				Value: params.versionCode,
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
				Value: params.moduleName,
				Direction: 'Input',
			},
			{
				Name: '@Err',
				DbType: 'int',
				Value: null,
				Direction: 'Output',
				Size: '64',
			},
		],
	};
}

export function publishFormQuery(params: PublishFormParams) {
	const { formId, userId, moduleName = ModuleName.Test } = params;
	return {
		Sql: '[Редактор].[dbo].Upd_ОпубликоватьФорму',
		CommandType: 'StoredProcedure',
		Parameters: [
			{
				Name: '@КодФормы',
				DbType: 'int',
				Value: formId,
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
