export function moveObjectAdapter(body: string): string {
	const resp = JSON.parse(body).Response.Tables[0].Rows[0];
	return resp.RowsMoved;
}
