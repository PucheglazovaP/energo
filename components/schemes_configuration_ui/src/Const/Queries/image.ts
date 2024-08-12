import { UploadImageParams } from '../../Shared/types';
import { ModuleName } from '../../Shared/Types/moduleName';

export function uploadImageQuery({
	userId,
	formId,
	fileName,
	image,
	replaceFlag,
	moduleName = ModuleName.Test,
	versionCode,
}: UploadImageParams) {
	return {
		Sql: '[Редактор].[dbo].Ins_АРМ_ЗагрузкаФайлаВБД',
		CommandType: 'StoredProcedure',
		Parameters: [
			{
				Name: '@ИмяФайла',
				DbType: 'String',
				Value: fileName,
				Direction: 'Input',
			},
			{
				Name: '@КодСистемы',
				DbType: 'int',
				Value: versionCode,
				Direction: 'Input',
			},
			{
				Name: '@КодФормы',
				DbType: 'int',
				Value: formId,
				Direction: 'Input',
			},
			{
				Name: '@BINARYBASE64',
				DbType: 'String',
				Value: image,
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
				Name: '@ReplaceImage',
				DbType: 'Byte',
				Value: replaceFlag || 0,
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

export function getImageQuery(fileName: string, formId: number) {
	return {
		Sql: '[Редактор].[dbo].[Get_АРМ_Изображение]',
		CommandType: 'StoredProcedure',
		Parameters: [
			{
				Name: '@ИмяФайла',
				DbType: 'String',
				Value: fileName,
				Direction: 'Input',
			},
			{
				Name: '@КодФормы',
				DbType: 'int',
				Value: formId,
				Direction: 'Input',
			},
		],
	};
}
