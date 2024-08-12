import { BackendResponse, UpdateFormResponse } from '../../Shared/types';

// create, update, move, delete visualization group adapter
export function visualizationGroupAdapter(response: string): number {
	const { Response }: BackendResponse = JSON.parse(response);
	const visualizationGroupResponse = Response.Tables[0]
		.Rows as UpdateFormResponse;

	return visualizationGroupResponse.RowsUpdated;
}
