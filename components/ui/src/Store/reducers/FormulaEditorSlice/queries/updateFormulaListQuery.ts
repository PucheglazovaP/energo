import { getOutputParameters } from '../../../../Const/utils';
import { UpdateFormula } from '../types';

export function updateFormulaListQuery({
	formulaList,
	number,
	lastModified,
	userId,
}: UpdateFormula) {
	return {
		Sql: '[appl_tags].[Ins_FormulaCreate]',
		CommandType: 'StoredProcedure',
		Parameters: [
			{
				Name: '@Number',
				DbType: 'int',
				Value: number,
				Direction: 'Input',
			},
			{
				Name: '@ItemsList',
				DbType: 'String',
				Value: JSON.stringify(formulaList),
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
