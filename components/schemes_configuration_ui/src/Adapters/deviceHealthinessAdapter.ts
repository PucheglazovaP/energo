import { DeviceHealthiness } from '../Models/DeviceHealthiness/types';
import { BackendResponse, DeviceHealthinessResponse } from '../Shared/types';
import { getNumber, getString } from '../Utils/guards';

export function deviceHealthinessAdapter(message: string): DeviceHealthiness[] {
	const { Response }: BackendResponse = JSON.parse(message);
	const backendDevices = Response.Tables[2].Rows as DeviceHealthinessResponse[];
	const result: DeviceHealthiness[] = backendDevices.map((device) => ({
		crc: getNumber(device.num_crc, 'num_crc'),
		crcColor: getString(device.num_crc_clr, 'num_crc_clr'),
		ok: getNumber(device.num_ok, 'num_ok'),
		okColor: getString(device.num_ok_clr, 'num_ok_clr'),
		timeout: getNumber(device.num_to, 'num_to'),
		timeoutColor: getString(device.num_to_clr, 'num_to_clr'),
		timeoutICP: getNumber(device.num_icp, 'num_icp'),
		timeoutICPColor: getString(device.num_icp_clr, 'num_icp_clr'),
		name: getString(device.Name, 'Name'),
		date: getString(device.dat, 'dat'),
		id: getNumber(device['НомерПрибора'], 'НомерПрибора'),
	}));
	return result;
}
