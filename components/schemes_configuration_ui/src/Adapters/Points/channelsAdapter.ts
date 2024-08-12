import { PointChannel } from '../../Models/Points/types';
import { BackendResponse, PointChannelResponse } from '../../Shared/types';

export function channelsAdapter(response: string): PointChannel[] {
	const { Response }: BackendResponse = JSON.parse(response);
	const data = Response.Tables[0].Rows as PointChannelResponse[];
	const channels = data.map((channel) => ({
		id: channel.ID,
		pointId: channel.FK_Points,
		number: channel.CoreChannelsNumber,
		name: channel.ChannelName,
		deviceNumber: channel.FK_Devices,
		deviceName: channel.DeviceName,
		baseValue: channel.BaseCumulativeValue,
		coefficient: Number(channel.Coefficient || 0),
		startTime: channel.ActiveFrom,
		endTime: channel.ActiveTo,
		lastModified: channel.LastModified,
		canDelete: Boolean(channel.canDelete),
	}));
	return channels;
}
