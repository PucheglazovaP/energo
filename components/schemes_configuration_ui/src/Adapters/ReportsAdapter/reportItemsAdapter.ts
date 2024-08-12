import { ReportItem } from '../../Models/ReportItems/types';
import { BackendResponse, ReportItemsResponse } from '../../Shared/types';

export function reportItemsAdapter(response: string): ReportItem[] {
	const { Response }: BackendResponse = JSON.parse(response);
	const data = Response.Tables[0].Rows as ReportItemsResponse[];
	const reportItems = data.map((reportItem) => ({
		id: reportItem.ID,
		reportId: reportItem.FK_Reports,
		parentId: reportItem.PID,
		sortOrder: reportItem.SortOrder,
		reportPositionNumber: reportItem.ReportPositionNumber,
		positionName: reportItem.PositionName,
		isCalculated: reportItem.IsCalculated,
		pointId: reportItem.FK_Points,
		coefficient: reportItem.Coefficient,
		activeFrom: reportItem.ActiveFrom,
		activeTo: reportItem.ActiveTo,
		changeDateTime: reportItem.ChangeDT,
		level: reportItem.LEVEL,
		pointName: reportItem.PointName,
		isOpen: true,
	}));
	return reportItems;
}
