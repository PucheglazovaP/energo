import { BackendResponse } from '../../Shared/types';

function syncPrintFormParameterAdapter(message: string): number {
	const { Response }: BackendResponse = JSON.parse(message);
	const operationLog = JSON.parse(Response.OutParameters[0]['@LogOperation']);
	const linkId = operationLog.info[0].ID;

	return linkId;
}

export default syncPrintFormParameterAdapter;
