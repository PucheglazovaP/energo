import { BackendResponse, DeletePrintFormResponse } from '../../Shared/types';

function deletePrintFormAdapter(message: string) {
	const { Response }: BackendResponse = JSON.parse(message);
	const rowsUpdated: number = (
		Response.Tables[0].Rows as DeletePrintFormResponse[]
	)[0].RowsUpdated;
	return {
		rowsUpdated,
	};
}

export default deletePrintFormAdapter;
