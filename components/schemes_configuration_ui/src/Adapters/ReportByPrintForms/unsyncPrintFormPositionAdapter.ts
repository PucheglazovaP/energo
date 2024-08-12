import {
	BackendResponse,
	UnsyncPrintFormPositionResponse,
} from '../../Shared/types';

function unsyncPrintFormPositionAdapter(message: string): number {
	const { Response }: BackendResponse = JSON.parse(message);
	const rowsUpdated: number = (
		Response.Tables[0].Rows as UnsyncPrintFormPositionResponse[]
	)[0].RowsUpdated;
	return rowsUpdated;
}

export default unsyncPrintFormPositionAdapter;
