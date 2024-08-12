import {
	BackendResponse,
	DeletePrintFormPositionResponse,
} from '../../Shared/types';

function deletePrintFormPositionAdapter(message: string) {
	const { Response }: BackendResponse = JSON.parse(message);
	const rowsUpdated: number = (
		Response.Tables[0].Rows as DeletePrintFormPositionResponse[]
	)[0].RowsUpdated;
	return rowsUpdated;
}

export default deletePrintFormPositionAdapter;
