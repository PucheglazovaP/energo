export function deleteSeriesAdapter(message: string): number {
	const deletedCount: number =
		JSON.parse(message).Response.Tables[0].Rows[0].RowsDeleted;
	return deletedCount;
}
