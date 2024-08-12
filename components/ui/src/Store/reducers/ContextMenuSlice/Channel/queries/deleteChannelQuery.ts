import { getOutputParameters } from '../../../../../Const/utils';
import { QueryDeletePropsType } from '../../types';

export function deleteChannelQuery({
	number,
	lastModified,
	userId,
	moduleName,
}: QueryDeletePropsType) {
	return {
		Sql: '[appl_tags].[Del_Channel]',
		CommandType: 'StoredProcedure',
		Parameters: [
			{
				Name: '@Number',
				DbType: 'int',
				Value: number,
				Direction: 'InputOutput',
				Size: '64',
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
				Name: '@LastModified',
				DbType: 'Guid',
				Value: lastModified,
				Direction: 'InputOutput',
				Size: '64',
			},
			...getOutputParameters('textErr', 'err'),
		],
	};
}
