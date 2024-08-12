import {
	BackendResponse,
	MovePrintFormPositionResponse,
} from '../../Shared/types';

function movePrintFormPositionAdapter(message: string) {
	const { Response }: BackendResponse = JSON.parse(message);
	const rowsUpdated: number = (
		Response.Tables[0].Rows as MovePrintFormPositionResponse[]
	)[0].RowsUpdated;
	return rowsUpdated;
}

export default movePrintFormPositionAdapter;
