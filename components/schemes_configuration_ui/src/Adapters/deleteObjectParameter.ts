export function deleteObjectParameter(body: string): number {
	const resp = JSON.parse(body).Response.Tables[0].Rows[0];
	return resp.RowsDeleted;
}
