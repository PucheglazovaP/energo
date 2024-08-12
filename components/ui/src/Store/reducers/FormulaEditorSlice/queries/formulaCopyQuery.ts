import { getOutputParameters } from '../../../../Const/utils';
import { FormulaCopyQuery } from '../types';

export function formulaCopyQuery({
	number,
	numberSource,
	userId,
	lastModified,
}: FormulaCopyQuery) {
	return {
		Sql: '[appl_tags].[Ins_FormulaCopy]',
		CommandType: 'StoredProcedure',
		Parameters: [
			{
				Name: '@Number',
				DbType: 'int',
				Value: number,
				Direction: 'Input',
			},
			{
				Name: '@Numbersource',
				DbType: 'int',
				Value: numberSource,
				Direction: 'Input',
			},
			{
				Name: '@ID_User',
				DbType: 'String',
				Value: userId,
				Direction: 'Input',
			},
			{
				Name: '@LastModified',
				DbType: 'Guid',
				Value: lastModified,
				Direction: 'Input',
			},
			...getOutputParameters('err', 'textErr', 'logOperation'),
		],
	};
}
