import { FetchReportGroupListParams } from '../../Shared/types';
import { ModuleName } from '../../Shared/Types/moduleName';

export default function getReportFormGroupList({
	formId,
	userId,
	moduleName = ModuleName.Test,
}: FetchReportGroupListParams) {
	return {
		Sql: '[Редактор].[dbo].Get_СписокГрупп_ФормыТипаОтчет',
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
