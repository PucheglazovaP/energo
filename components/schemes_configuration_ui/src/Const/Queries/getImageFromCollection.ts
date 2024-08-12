import { FetchImageByIdParams } from '../../Shared/types';
import { ModuleName } from '../../Shared/Types/moduleName';

export const getImageByIdQuery = ({
	id,
	userId,
	moduleName = ModuleName.Test,
}: FetchImageByIdParams) => {
	return {
		Sql: '[Редактор].[dbo].Get_ИзображениеByID',
		CommandType: 'StoredProcedure',
		Parameters: [
			{
				Name: '@SKEY',
				DbType: 'int',
				Value: id,
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
