import {
	BackendResponse,
	PrintFormPosition,
	PrintFormPositionResponse,
} from '../../Shared/types';
import { getNumber, getString } from '../../Utils/guards';

function fetchPrintFormPositionsAdapter(message: string): PrintFormPosition[] {
	const { Response }: BackendResponse = JSON.parse(message);
	const backendPositions: PrintFormPositionResponse[] = Response.Tables[0]
		.Rows as PrintFormPositionResponse[];
	const positions: PrintFormPosition[] = backendPositions.map((position) => ({
		bold: !!position.Bold,
		bgColor: getString(position.HexColor, 'HexColor'),
		fontColor: position.FontHexColor,
		id: getNumber(position.ID, 'ID'),
		lastModified: getString(position.ChangeDT, 'ChangeDT'),
		name: position.PositionName ? position.PositionName : '',
		positionNumber: position.ReportPositionNumber,
		sortOrder: getNumber(position.SortOrder),
		textAlign: position.FK_TextAlign,
		userId: getString(position.ID_User, 'ID_User'),
		treeId: position.FK_ReportsTrees,
		treeName: position.RepItemName || '',
		channelId: position.NUMCAN,
		channelName: position.ChannelName,
		deviceId: position.NUMPR,
		deviceName: position.DeviceName,
		method: position.FK_Methods,
		methodName: position.MethodName,
		priority: position.accountingPriority,
		priorityMethod: position.FK_ExternalCalculations_Method,
	}));
	return positions;
}

export default fetchPrintFormPositionsAdapter;
