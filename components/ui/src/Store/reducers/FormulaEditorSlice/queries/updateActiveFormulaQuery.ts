import { getOutputParameters } from '../../../../Const/utils';
import { UpdateActiveFormula } from '../types';

export function updateActiveFormulaQuery({
	number,
	userId,
	lastModified,
	activeFormula,
	moduleName,
}: UpdateActiveFormula) {
	return {
		Sql: '[appl_tags].[Upd_Group_ActiveFormula]',
		CommandType: 'StoredProcedure',
		Parameters: [
			{
				Name: '@Number',
				DbType: 'int',
				Value: number,
				Direction: 'Input',
			},
			{
				Name: '@ActiveFormula',
				DbType: 'Boolean',
				Value: activeFormula,
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
				Name: '@LastModified',
				DbType: 'Guid',
				Value: lastModified,
				Direction: 'Input',
			},
			...getOutputParameters('err', 'textErr', 'logOperation'),
		],
	};
}
