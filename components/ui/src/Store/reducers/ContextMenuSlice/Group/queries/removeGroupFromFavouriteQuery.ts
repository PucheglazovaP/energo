import { getOutputParameters } from '../../../../../Const/utils';
import { QueryWithFavouritePropsType } from '../../types';

export function removeGroupFromFavouriteQuery({
	numbers,
	userId,
	moduleName,
}: QueryWithFavouritePropsType) {
	return {
		Sql: '[appl_tags].[Del_FavoriteGroups]',
		CommandType: 'StoredProcedure',
		Parameters: [
			{
				Name: '@Groups',
				DbType: 'String',
				Value: numbers,
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
			...getOutputParameters('textErr', 'logOperation'),
		],
	};
}
