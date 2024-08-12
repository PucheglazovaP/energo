import {
	CopyFormObjectParams,
	CreateFormObjectParams,
} from '../../Shared/types';
import { ModuleName } from '../../Shared/Types/moduleName';

export function createStatusIndicator({
	x,
	y,
	formId,
	userId,
	moduleName = ModuleName.Test,
	layerId = null,
}: CreateFormObjectParams) {
	return {
		Sql: '[Редактор].[dbo].Ins_СоздатьИндикатор',
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
				Value: '300',
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
export function copyStatusIndicatorQuery(params: CopyFormObjectParams) {
	return {
		Sql: '[Редактор].[dbo].Ins_СоздатьКопиюИндикатора',
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
