import { DeleteObjectParams } from '../../Shared/types';

export function deleteObjectQuery(params: DeleteObjectParams) {
	return {
		Sql: '[Редактор].[dbo].Del_УдалитьЗначениеTStringsПараметра',
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
				Name: '@ПорядковыйНомер',
				DbType: 'int',
				Value: params.objectIdx != null ? params.objectIdx : null,
				Direction: 'Input',
			},
			{
				Name: '@УдалитьВсе',
				DbType: 'int',
				Value: params.deleteAllFlag || 0,
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
