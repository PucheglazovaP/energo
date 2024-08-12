import { getOutputParameters } from '../../../../../Const/utils';

import { UpdateGroup } from './types';

export function updateGroupQuery({
	groupNumber,
	groupName,
	fkUnits,
	fkTypeStorage,
	fkMethods,
	lastModified,
	eWork,
	userId,
	isFormula,
	isFormulaActive,
	moduleName,
}: UpdateGroup) {
	return {
		Sql: '[appl_tags].[Upd_Group]',
		CommandType: 'StoredProcedure',
		Parameters: [
			{
				Name: '@Number',
				DbType: 'int',
				Value: groupNumber,
				Direction: 'Input',
			},
			{
				Name: '@Name',
				DbType: 'String',
				Value: groupName,
				Direction: 'Input',
			},
			{
				Name: '@FK_Units',
				DbType: 'int',
				Value: fkUnits,
				Direction: 'Input',
			},
			{
				Name: '@FK_Methods',
				DbType: 'int',
				Value: fkMethods,
				Direction: 'Input',
			},
			{
				Name: '@FK_TypesStorage',
				DbType: 'int',
				Value: fkTypeStorage,
				Direction: 'Input',
			},
			{
				Name: '@Formula',
				DbType: 'Boolean',
				Value: isFormula,
				Direction: 'Input',
			},
			{
				Name: '@ActiveFormula',
				DbType: 'Boolean',
				Value: isFormulaActive,
				Direction: 'Input',
			},
			{
				Name: '@ID_User',
				DbType: 'String',
				Value: userId,
				Direction: 'Input',
			},
			{
				Name: '@Number_EWork',
				DbType: 'int',
				Value: eWork,
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
			...getOutputParameters('logOperation', 'textErr', 'textWarn'),
		],
	};
}
