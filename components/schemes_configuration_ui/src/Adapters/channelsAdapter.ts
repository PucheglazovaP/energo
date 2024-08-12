import { Channel } from '../Models/Channels/types';
import { ChannelResponse, OptimizedPagination } from '../Shared/types';

export function channelsAdapter(response: string): {
	channels: Channel[];
	pagination: OptimizedPagination;
} {
	const data: ChannelResponse[] = JSON.parse(response).Response.Tables[0].Rows;
	const outParams = JSON.parse(response).Response.OutParameters[0];
	const channels: Channel[] = data.map((channel) => ({
		id: channel.Number,
		name: `${channel.Number}. ${channel.Name}`,
		serverId: channel.FK_DataServers,
		groupsList: channel.GroupsList,
		isFavorite: channel.IsFavorite,
		koefList: channel.KoefList,
		lastModified: channel.LastModified,
		method: channel.Method_Name,
		methodId: channel.FK_Methods,
		order: channel.RowNumber,
		typesStorage: channel.TypesStorage_Name,
		typesStorageId: channel.FK_TypesStorage,
		unit: channel.Unit_Name,
		unitId: channel.Unit_ID,
		deviceId: channel.FK_Devices,
		isConsumption: Boolean(channel.IsConsumption),
	}));
	const pagination: OptimizedPagination = {
		pageNumber: Number(outParams['@PageNumberOut']),
		pageTotalCount: Number(outParams['@PageTotalCount']),
		rowsPerPage: channels.length,
	};
	return { channels, pagination };
}
