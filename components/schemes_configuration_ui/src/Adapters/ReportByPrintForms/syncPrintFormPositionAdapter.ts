import {
	BackendResponse,
	SyncPrintFormPositionResponse,
} from '../../Shared/types';

function syncPrintFormPositionAdapter(message: string): number {
	const { Response }: BackendResponse = JSON.parse(message);
	const rowsUpdated: number = (
		Response.Tables[0].Rows as SyncPrintFormPositionResponse[]
	)[0].RowsUpdated;

	return rowsUpdated;
}

export default syncPrintFormPositionAdapter;
