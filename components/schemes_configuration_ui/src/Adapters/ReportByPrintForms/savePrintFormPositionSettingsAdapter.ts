import {
	BackendResponse,
	SavePrintFormPositionSettingsResponse,
} from '../../Shared/types';

function savePrintFormPositionSettingsAdapter(message: string) {
	const { Response }: BackendResponse = JSON.parse(message);
	const rowsUpdated: number = (
		Response.Tables[0].Rows as SavePrintFormPositionSettingsResponse[]
	)[0].RowsUpdated;
	return rowsUpdated;
}

export default savePrintFormPositionSettingsAdapter;
