import {
	BackendResponse,
	CreatePrintFormPositionResponse,
} from '../../Shared/types';

function createPrintFormPositionAdapter(message: string) {
	const { Response }: BackendResponse = JSON.parse(message);
	const rowsUpdated: number = (
		Response.Tables[0].Rows as CreatePrintFormPositionResponse[]
	)[0].RowsUpdated;
	return rowsUpdated;
}

export default createPrintFormPositionAdapter;
