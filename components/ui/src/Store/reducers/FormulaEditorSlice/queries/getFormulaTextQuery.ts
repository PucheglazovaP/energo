import { getOutputParameters } from '../../../../Const/utils';
import { GetFormula } from '../types';

export function getFormulaTextQuery({ number }: GetFormula) {
	return {
		Sql: '[appl_tags].[Get_FormulaGroups_txt]',
		CommandType: 'StoredProcedure',
		Parameters: [
			{
				Name: '@Number',
				DbType: 'int',
				Value: number,
				Direction: 'Input',
			},
			{
				Name: '@Vid',
				DbType: 'int',
				Value: 0,
				Direction: 'Input',
			},
			...getOutputParameters('err', 'textErr'),
		],
	};
}
