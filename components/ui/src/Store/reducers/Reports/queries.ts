export function getReportLink(id: number) {
	return {
		Sql: '[dict].[Get_ReportsURL]',
		CommandType: 'StoredProcedure',
		Parameters: [
			{
				Name: '@ID',
				DbType: 'int',
				Value: id,
				Direction: 'Input',
			},
		],
	};
}
