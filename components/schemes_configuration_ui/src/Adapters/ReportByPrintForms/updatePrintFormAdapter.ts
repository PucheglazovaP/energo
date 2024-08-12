import { BackendResponse, UpdatePrintFormResponse } from '../../Shared/types';

function udpatePrintFormAdapter(message: string) {
	const { Response }: BackendResponse = JSON.parse(message);
	const rowsUpdated: number = (
		Response.Tables[0].Rows as UpdatePrintFormResponse[]
	)[0].RowsUpdated;
	return {
		rowsUpdated,
	};
}

export default udpatePrintFormAdapter;
