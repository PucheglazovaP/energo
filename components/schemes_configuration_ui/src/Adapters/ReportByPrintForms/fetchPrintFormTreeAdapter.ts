import {
	BackendResponse,
	PrintFormTree,
	PrintFormTreeResponse,
} from '../../Shared/types';

function fetchPrintFormTreeAdapter(message: string): PrintFormTree[] {
	const { Response }: BackendResponse = JSON.parse(message);
	const backendPositions: PrintFormTreeResponse[] = Response.Tables[0]
		.Rows as PrintFormTreeResponse[];
	const result: PrintFormTree[] = backendPositions.map((node) => ({
		nodeId: node.ID,
		parentNodeId: node.PID || undefined,
		reportId: node.FK_Reports,
		nodeName: node.PositionName,
		positionId: node.ID_RepPosition,
		lvl: node.LEVEL,
		isOpen: false,
	}));
	return result;
}

export default fetchPrintFormTreeAdapter;
