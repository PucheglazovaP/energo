import { getOutputParameters } from '../../../../../Const/utils';
import { QueryWithFavouritePropsType } from '../../types';

export function addDeviceToFavouriteQuery({
	numbers,
	userId,
	moduleName,
}: QueryWithFavouritePropsType) {
	return {
		Sql: '[appl_tags].[Ins_CreateFavoriteDevices]',
		CommandType: 'StoredProcedure',
		Parameters: [
			{
				Name: '@Devices',
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
