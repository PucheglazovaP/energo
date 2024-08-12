import {
	CopyFormObjectParams,
	CreateFormObjectParams,
	DeleteFormObjectParams,
	GetFormObjectDataQueryParams,
} from '../../Shared/types';
import { ModuleName } from '../../Shared/Types/moduleName';

export function createTransparentQuery({
	x,
	y,
	formId,
	userId,
	moduleName = ModuleName.Test,
	layerId = null,
}: CreateFormObjectParams) {
	return {
		Sql: '[Редактор].[dbo].Ins_СоздатьТранспарант',
		CommandType: 'StoredProcedure',
		Parameters: [
			{
				Name: '@Layer',
				DbType: 'int',
				Value: layerId,
				Direction: 'Input',
			},
			{
				Name: '@КодФормы',
				DbType: 'int',
				Value: formId,
				Direction: 'Input',
			},
			{
				Name: '@X',
				DbType: 'String',
				Value: String(x),
				Direction: 'Input',
			},
			{
				Name: '@Y',
				DbType: 'String',
				Value: String(y),
				Direction: 'Input',
			},
			{
				Name: '@Length',
				DbType: 'String',
				Value: '250',
				Direction: 'Input',
			},
			{
				Name: '@Height',
				DbType: 'String',
				Value: '24',
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
export function createDynamicObjectQuery({
	x,
	y,
	formId,
	userId,
	moduleName = ModuleName.Test,
}: CreateFormObjectParams) {
	return {
		Sql: '[Редактор].[dbo].Ins_СоздатьДинамическийОбъект',
		CommandType: 'StoredProcedure',
		Parameters: [
			{
				Name: '@Layer',
				DbType: 'int',
				Value: null,
				Direction: 'Input',
			},
			{
				Name: '@КодФормы',
				DbType: 'int',
				Value: formId,
				Direction: 'Input',
			},
			{
				Name: '@X',
				DbType: 'String',
				Value: String(x),
				Direction: 'Input',
			},
			{
				Name: '@Y',
				DbType: 'String',
				Value: String(y),
				Direction: 'Input',
			},
			{
				Name: '@Length',
				DbType: 'String',
				Value: '250',
				Direction: 'Input',
			},
			{
				Name: '@Height',
				DbType: 'String',
				Value: '24',
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

export function deleteObjectQuery({
	objectId,
	userId,
	moduleName = ModuleName.Test,
}: DeleteFormObjectParams) {
	return {
		Sql: '[Редактор].[dbo].Del_УдалитьОбъект',
		CommandType: 'StoredProcedure',
		Parameters: [
			{
				Name: '@КодОбъектаФормы',
				DbType: 'int',
				Value: objectId,
				Direction: 'Input',
			},
			{
				Name: '@СкорректироватьПорядковыйНомер',
				DbType: 'int',
				Value: 1,
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
export function copyTransparentQuery(params: CopyFormObjectParams) {
	return {
		Sql: '[Редактор].[dbo].Ins_СоздатьКопиюТранспаранта',
		CommandType: 'StoredProcedure',
		Parameters: [
			{
				Name: '@КодОбъекта',
				DbType: 'int',
				Value: params.id,
				Direction: 'Input',
			},
			{
				Name: '@КодФормы',
				DbType: 'int',
				Value: params.formId,
				Direction: 'Input',
			},
			{
				Name: '@КодВерсии',
				DbType: 'int',
				Value: params.versionId,
				Direction: 'Input',
			},
			{
				Name: '@left',
				DbType: 'int',
				Value: params.x,
				Direction: 'Input',
			},
			{
				Name: '@top',
				DbType: 'int',
				Value: params.y,
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
export function copyDynamicObjectQuery(params: CopyFormObjectParams) {
	return {
		Sql: '[Редактор].[dbo].Ins_СоздатьКопиюДинамическогоОбъекта',
		CommandType: 'StoredProcedure',
		Parameters: [
			{
				Name: '@КодОбъекта',
				DbType: 'int',
				Value: params.id,
				Direction: 'Input',
			},
			{
				Name: '@КодФормы',
				DbType: 'int',
				Value: params.formId,
				Direction: 'Input',
			},
			{
				Name: '@КодВерсии',
				DbType: 'int',
				Value: params.versionId,
				Direction: 'Input',
			},
			{
				Name: '@left',
				DbType: 'int',
				Value: params.x,
				Direction: 'Input',
			},
			{
				Name: '@top',
				DbType: 'int',
				Value: params.y,
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
export function getFormObjectsParametersQuery(
	objectId: number,
	versionCode: number,
) {
	return {
		Sql: '[Редактор].[dbo].Get_ПараметрыОбъектовФорм',
		CommandType: 'StoredProcedure',
		Parameters: [
			{
				Name: '@КодОбъектаФормы',
				DbType: 'int',
				Value: objectId,
				Direction: 'Input',
			},
			{
				Name: '@КодВерсии',
				DbType: 'int',
				Value: versionCode,
				Direction: 'Input',
			},
		],
	};
}

export function getFormParametersQuery(formId: number, versionCode: number) {
	return {
		Sql: '[Редактор].[dbo].Get_ПараметрыФорм',
		CommandType: 'StoredProcedure',
		Parameters: [
			{
				Name: '@КодФормы',
				DbType: 'int',
				Value: formId,
				Direction: 'Input',
			},
			{
				Name: '@КодВерсии',
				DbType: 'int',
				Value: versionCode,
				Direction: 'Input',
			},
		],
	};
}

export function updateFormParameterQuery(
	formId: number,
	parameterCode: number,
	value: string,
	versionCode: number,
	itHasPairedParameter?: boolean,
	pairedParameterValue?: string | number | null,
) {
	return {
		Sql: '[Редактор].[dbo].Upd_ПараметрыФормы',
		CommandType: 'StoredProcedure',
		Parameters: [
			{
				Name: '@КодФормы',
				DbType: 'int',
				Value: formId,
				Direction: 'Input',
			},
			{
				Name: '@КодПараметра',
				DbType: 'int',
				Value: parameterCode,
				Direction: 'Input',
			},
			{
				Name: '@КодВерсии',
				DbType: 'int',
				Value: versionCode,
				Direction: 'Input',
			},
			{
				Name: '@Значение',
				DbType: 'String',
				Value: value,
				Direction: 'Input',
			},
			{
				Name: '@ОбновитьПарныйПараметр',
				DbType: 'int',
				Value: itHasPairedParameter ? Number(itHasPairedParameter) : 0,
				Direction: 'Input',
			},
			{
				Name: '@ЗначениеПарногоПараметра',
				DbType: 'int',
				Value: pairedParameterValue || null,
				Direction: 'Input',
			},
			{
				Name: '@ПрименитьДляВсехПодчиненныхФорм',
				DbType: 'int',
				Value: 0,
				Direction: 'Input',
			},
		],
	};
}

export function updateFormObjectParametersQuery(
	objectId: number,
	parameterValue: number,
	value: string,
	versionCode: number,
	itHasPairedParameter?: boolean,
	pairedParameterValue?: string | number | null,
) {
	return {
		Sql: '[Редактор].[dbo].Upd_ПараметрыОбъектаФормы',
		CommandType: 'StoredProcedure',
		Parameters: [
			{
				Name: '@КодОбъектаФормы',
				DbType: 'int',
				Value: objectId,
				Direction: 'Input',
			},
			{
				Name: '@КодПараметра',
				DbType: 'int',
				Value: parameterValue,
				Direction: 'Input',
			},
			{
				Name: '@КодВерсии',
				DbType: 'int',
				Value: versionCode,
				Direction: 'Input',
			},
			{
				Name: '@Значение',
				DbType: 'String',
				Value: value,
				Direction: 'Input',
			},
			{
				Name: '@ОбновитьПарныйПараметр',
				DbType: 'int',
				Value: itHasPairedParameter ? Number(itHasPairedParameter) : 0,
				Direction: 'Input',
			},
			{
				Name: '@ЗначениеПарногоПараметра',
				DbType: 'int',
				Value: pairedParameterValue || null,
				Direction: 'Input',
			},
		],
	};
}
export function getFormDynamicObjectValuesQuery(formId: number) {
	return {
		Sql: '[Редактор].[dbo].Get_АРМ_ЗначенияTStringsПараметраОбъектовФормы',
		CommandType: 'StoredProcedure',
		Parameters: [
			{
				Name: '@КодФормы',
				DbType: 'int',
				Value: formId,
				Direction: 'Input',
				Size: null,
			},
			{
				Name: '@НазваниеПараметра',
				DbType: 'String',
				Value: 'FilePicture',
				Direction: 'Input',
				Size: null,
			},
		],
	};
}

export function getFormObjectDataQuery(params: GetFormObjectDataQueryParams) {
	return {
		Sql: '[Energy].[energy].[Get_АРМ_ДанныеПоГруппеЗаПериодИлиМаксимальноеВремя]',
		CommandType: 'StoredProcedure',
		Parameters: [
			// эти параметры для формы типа график
			{
				Name: '@fromd',
				DbType: 'date',
				Value: params.fromd || null,
				Direction: 'Input',
			},
			{
				Name: '@tod',
				DbType: 'date',
				Value: params.tod || null,
				Direction: 'Input',
			},
			//clsgroup
			{
				Name: '@gr',
				DbType: 'int',
				Value: params.gr,
				Direction: 'Input',
			},
			// пока не берем во внимание этот параметр
			// to do: уточнить про значения этого параметра
			{
				Name: '@btn',
				DbType: 'int',
				Value: params.btn || null,
				Direction: 'Input',
			},
			//visdelay
			{
				Name: '@delay',
				DbType: 'int',
				Value: params.visdelay,
				Direction: 'Input',
			},
			//datatype
			{
				Name: '@typ',
				DbType: 'String',
				Value: params.datatype || 'C',
				Direction: 'Input',
			},
			//round
			{
				Name: '@round',
				DbType: 'int',
				Value: params.round != undefined ? params.round : 10,
				Direction: 'Input',
			},
			{
				Name: '@mode',
				DbType: 'int',
				Value: params.mode,
				Direction: 'Input',
			},
			{
				Name: '@nullaserr',
				DbType: 'int',
				Value: params.nullaserr || 0,
				Direction: 'Input',
			},
			{
				Name: '@notnull_minutediff',
				DbType: 'int',
				Value: params.notnullMinutediff || 0,
				Direction: 'Input',
			},
			{
				Name: '@HOURShift',
				DbType: 'int',
				Value: params.hourSift || 0,
				Direction: 'Input',
			},
			{
				Name: '@UseHint',
				DbType: 'int',
				Value: params.useHint || 0,
				Direction: 'Input',
			},
			// boolean ???
			{
				Name: '@CanDiagInclude',
				DbType: 'int',
				Value: params.canDiagInclude || 0,
				Direction: 'Input',
			},
		],
	};
}
export function getFormObjectDataByLayersQuery(
	layers: number[],
	userId: string,
) {
	return {
		Sql: '[Редактор].[dbo].Get_ПоследниеДанныеДляСлоевФормы',
		CommandType: 'StoredProcedure',
		Parameters: [
			{
				Name: '@leyers',
				DbType: 'String',
				Value: layers.join(','),
				Direction: 'Input',
			},
			{
				Name: '@ID_User',
				DbType: 'String',
				Value: userId,
				Direction: 'Input',
			},
		],
	};
}
export function getFormObjectsQuery(formId: number, versionCode: number) {
	return {
		Sql: '[Редактор].[dbo].[Get_АРМ_ПараметрыОбъектовФормДляФормы_ТрансляцияПараметровИзЦМ]',
		CommandType: 'StoredProcedure',
		Parameters: [
			{
				Name: '@КодФормы',
				DbType: 'int',
				Value: formId,
				Direction: 'Input',
				Size: null,
			},
			{
				Name: '@КодВерсии',
				DbType: 'int',
				Value: versionCode,
				Direction: 'Input',
				Size: null,
			},
		],
	};
}
export function getInfoAboutTransparents(
	codeForm: number | null,
	codeVersion: number | null,
) {
	return {
		Sql: '[Редактор].[dbo].Get_СведенияОТранспарантахФормы',
		CommandType: 'StoredProcedure',
		Parameters: [
			{
				Name: '@КодФормы',
				DbType: 'int',
				Value: codeForm,
				Direction: 'Input',
			},
			{
				Name: '@КодВерсии',
				DbType: 'int',
				Value: codeVersion,
				Direction: 'Input',
			},
		],
	};
}
export function getInfoAboutDynamicObjects(
	codeForm: number | null,
	codeVersion: number,
) {
	return {
		Sql: '[Редактор].[dbo].Get_СведенияОДинамическихОбъектахФормы',
		CommandType: 'StoredProcedure',
		Parameters: [
			{
				Name: '@КодФормы',
				DbType: 'int',
				Value: codeForm,
				Direction: 'Input',
			},
			{
				Name: '@КодВерсии',
				DbType: 'int',
				Value: codeVersion,
				Direction: 'Input',
			},
		],
	};
}
