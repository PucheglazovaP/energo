export function fetchChannelsListQuery() {
	return {
		Sql: 'MODELDATA.dbo.Get_СписокКаналов',
		CommandType: 'StoredProcedure',
		Parameters: [],
	};
}
