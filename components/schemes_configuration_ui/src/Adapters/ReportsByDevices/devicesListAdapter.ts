import {
	DevicesList,
	DevicesListResponse,
} from '../../Models/DeviceReports/types';
import { BackendResponse } from '../../Shared/types';
import { getNumber, getString, isValidJson } from '../../Utils/guards';

export function getDevicesListAdapter(response: string): DevicesList[] {
	const { Response }: BackendResponse = JSON.parse(response);
	const data = Response.Tables[0].Rows as DevicesListResponse[];
	const devicesList: DevicesList[] = data.map((param) => ({
		deviceId: getNumber(param.Number, 'Number'),
		device: getString(param.Наименование, 'Наименование'),
		deviceType: getString(param.DeviceType, 'DeviceType'),
		deviceTypeCode: getNumber(param.КодТипаПрибора, 'КодТипаПрибора'),
		heatSystems: isValidJson(param.Теплосистемы, 'Теплосистемы')
			? JSON.parse(param.Теплосистемы)
			: [],
	}));

	return devicesList;
}
