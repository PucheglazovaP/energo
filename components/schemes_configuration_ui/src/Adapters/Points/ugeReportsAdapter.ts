import { Point } from '../../Models/Points/types';
import { BackendResponse, PointsResponse } from '../../Shared/types';

export function pointsAdapter(response: string): Point[] {
	const { Response }: BackendResponse = JSON.parse(response);
	const data = Response.Tables[0].Rows as PointsResponse[];
	const points = data.map((point) => ({
		id: point.ID,
		shortName: point.ShortName,
		captionName: point.InputCaption,
		name: point.Name,
		comment: point.Comment,
		channelNumber: point.CoreChannelsNumber,
		channelName: point.ChannelName,
		deviceNumber: point.FK_Devices,
		deviceName: point.DeviceName,
		channelState: point.CoreChannelsNumber ? 'Да' : 'Нет',
		coefficient: Number(point.Coefficient || 0),
		linkedPointId: point.LinkedPointID,
		linkedPointName: point.LinkedPointName,
		linkedPointRatio: point.LinkedPointCoeff,
		linkedPointComment: point.LinkedPointComment,
		lastModified: point.LastModified,
		sortOrder: point.SortOrder,
		isCollapsed: false,
		isActive: false,
		channels: [],
		energyResource: point.FK_EnergyResources,
	}));
	return points;
}
