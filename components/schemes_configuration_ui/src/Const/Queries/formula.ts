export function getFormulaListQuery(groupNumber: number) {
	return {
		Sql: '[appl_tags].[Get_FormulaGroups]',
		CommandType: 'StoredProcedure',
		Parameters: [
			{
				Name: '@Number',
				DbType: 'int',
				Value: groupNumber,
				Direction: 'Input',
			},
			{
				Name: '@Err',
				DbType: 'int',
				Value: null,
				Direction: 'Output',
				Size: 64,
			},
			{
				Name: 'TextErr',
				DbType: 'String',
				Value: null,
				Direction: 'Output',
				Size: 2000,
			},
		],
	};
}
export function getGroupComponentsTreeQuery(
	groupNumber: number,
	delay: number,
) {
	return {
		Sql: '[appl_tags].[Get_GroupComponentsTree]',
		CommandType: 'StoredProcedure',
		Parameters: [
			{
				Name: '@Number',
				DbType: 'int',
				Value: groupNumber,
				Direction: 'Input',
			},
			{
				Name: '@Delay',
				DbType: 'int',
				Value: delay,
				Direction: 'Input',
			},
		],
	};
}
