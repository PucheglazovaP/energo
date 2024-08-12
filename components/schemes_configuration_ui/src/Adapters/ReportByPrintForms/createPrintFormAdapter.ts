import { BackendResponse, CreatePrintFormResponse } from '../../Shared/types';

function createPrintFormAdapter(message: string) {
	const { Response }: BackendResponse = JSON.parse(message);
	const rowsUpdated: number = (
		Response.Tables[0].Rows as CreatePrintFormResponse[]
	)[0].RowsUpdated;
	return {
		rowsUpdated,
	};
}

export default createPrintFormAdapter;
