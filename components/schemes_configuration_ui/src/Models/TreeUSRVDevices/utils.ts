import { Device } from '../Devices/types';

export function getFilteredDevices(
	devices: Device[],
	searchValue: string,
): Device[] {
	return searchValue === ''
		? devices
		: devices.filter((device) => {
				const { name, id } = device;
				const isFound =
					name.toUpperCase().indexOf(searchValue.toUpperCase()) > -1 ||
					String(id).toUpperCase().indexOf(searchValue.toUpperCase()) > -1;

				return isFound;
		  });
}
