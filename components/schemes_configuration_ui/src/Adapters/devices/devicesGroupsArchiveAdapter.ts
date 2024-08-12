import {
	BackendResponse,
	DevicesGroupsArchiveResponse,
} from '../../Shared/types';

export function devicesGroupsArchiveAdapter(response: string) {
	const { Response }: BackendResponse = JSON.parse(response);
	const devicesGroupsArchive = Response.Tables[0]
		.Rows as DevicesGroupsArchiveResponse[];
	return devicesGroupsArchive.map((item) => ({
		number: item.Number,
		name: item.Name,
		deviceType: item.DeviceType,
	}));
}
