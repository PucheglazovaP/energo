import { getOutputParameters } from '../../../../Const/utils';
import { GetFormula } from '../types';

export function getFormulaListQuery({ number }: GetFormula) {
	return {
		Sql: '[appl_tags].[Get_FormulaGroups]',
		CommandType: 'StoredProcedure',
		Parameters: [
			{
				Name: '@Number',
				DbType: 'int',
				Value: number,
				Direction: 'Input',
			},
			...getOutputParameters('err', 'textErr'),
		],
	};
}
