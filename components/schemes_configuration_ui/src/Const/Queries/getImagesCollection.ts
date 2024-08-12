import { FetchImagesCollectionsParams } from '../../Shared/types';
import { ModuleName } from '../../Shared/Types/moduleName';

export const getImagesCollectionQuery = ({
	versionCode,
	userId,
	moduleName = ModuleName.Test,
}: FetchImagesCollectionsParams) => {
	return {
		Sql: '[Редактор].[dbo].Get_СписокИзображений',
		CommandType: 'StoredProcedure',
		Parameters: [
			{
				Name: '@КодВерсии',
				DbType: 'int',
				Value: versionCode,
				Direction: 'Input',
			},
			{
				Name: '@СписокРасширений',
				DbType: 'String',
				Value: 'jpg,jpeg,wmf,bmp,png,gif,svg',
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
};
