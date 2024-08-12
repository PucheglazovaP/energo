import { AddObjectQueryParams } from '../../Shared/types';
import { ModuleName } from '../../Shared/Types/moduleName';

export function createObjectParameterQuery(params: AddObjectQueryParams) {
	return {
		Sql: '[Редактор].[dbo].Ins_СоздатьTStringsПараметр',
		CommandType: 'StoredProcedure',
		Parameters: [
			{
				Name: '@КодФормы',
				DbType: 'int',
				Value: params.formId || null,
				Direction: 'Input',
			},
			{
				Name: '@КодОбъектаФормы',
				DbType: 'int',
				Value: params.objectId || null,
				Direction: 'Input',
			},
			{
				Name: '@НазваниеПараметра',
				DbType: 'String',
				Value: params.parameterName,
				Direction: 'Input',
			},
			{
				Name: '@Значение',
				DbType: 'String',
				Value: params.value,
				Direction: 'Input',
			},
			{
				Name: '@ЗначениеПараметра_FieldNames',
				DbType: 'String',
				Value: null,
				Direction: 'Input',
			},
			{
				Name: '@ЗначениеПараметра_FieldRound',
				DbType: 'String',
				Value: null,
				Direction: 'Input',
			},
			{
				Name: '@КодВерсии',
				DbType: 'int',
				Value: params.versionId,
				Direction: 'Input',
			},
			{
				Name: '@НомерПоПорядку',
				DbType: 'int',
				Value: params.order != null ? params.order : null,
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
				Value: (params.moduleName = ModuleName.Test),
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
