import { BackendResponse, UpdateFormResponse } from '../../Shared/types';

export function reportAdapter(response: string): number {
	const { Response }: BackendResponse = JSON.parse(response);
	const pointResponse = Response.Tables[0].Rows as UpdateFormResponse;
	return pointResponse.RowsUpdated;
}
