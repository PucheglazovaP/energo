import { UpdateFormObjectParams } from '../../Shared/types';

export function updateFormObjectQuery(params: UpdateFormObjectParams) {
	return {
		Sql: '[Редактор].[dbo].Upd_ИзменитьTStringsПараметр',
		CommandType: 'StoredProcedure',
		Parameters: [
			{
				Name: '@КодФормы',
				DbType: 'int',
				Value: null,
				Direction: 'Input',
			},
			{
				Name: '@КодОбъектаФормы',
				DbType: 'int',
				Value: params.objectId,
				Direction: 'Input',
			},
			{
				Name: '@НазваниеПараметра',
				DbType: 'String',
				Value: params.paramName,
				Direction: 'Input',
			},
			{
				Name: '@НомерПоПорядку',
				DbType: 'int',
				Value: params.paramIdx,
				Direction: 'Input',
			},
			{
				Name: '@Значение',
				DbType: 'String',
				Value: params.value,
				Direction: 'Input',
			},
			{
				Name: '@КодВерсии',
				DbType: 'int',
				Value: params.versionId,
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
