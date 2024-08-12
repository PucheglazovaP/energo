export function getEnumValuesQuery(listId: number) {
	return {
		Sql: '[EMConfiguration].[dict].[Get_EnumValues]',
		CommandType: 'StoredProcedure',
		Parameters: [
			{
				Name: '@IDEnum',
				DbType: 'int',
				Value: listId,
				Direction: 'Input',
			},
		],
	};
}
