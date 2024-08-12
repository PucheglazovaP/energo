import { Device } from '../Models/Devices/types';
import { DeviceResponse, OptimizedPagination } from '../Shared/types';

export function devicesAdapter(response: string): {
	devices: Device[];
	pagination: OptimizedPagination;
} {
	const data: DeviceResponse[] = JSON.parse(response).Response.Tables[0].Rows;
	const outParams = JSON.parse(response).Response.OutParameters[0];
	const devicesList: Device[] = data.map((device) => ({
		id: device.Number,
		name: `${device.Number}. ${device.Name}`,
		serverId: device.FK_DataServers,
		lastModified: device.LastModified,
		comment: device.Comment,
		channelsList: device.ChannelsList,
		isFavorite: device.isFavorite,
		order: device.RowNumber,
		isOpen: false,
	}));
	const pagination: OptimizedPagination = {
		pageNumber: Number(outParams['@PageNumberOut']),
		pageTotalCount: Number(outParams['@PageTotalCount']),
		rowsPerPage: devicesList.length,
		positionRow: Number(outParams['@SelectRow']),
	};

	return { devices: devicesList, pagination };
}
