import { DeviceParameter } from '../../Models/DeviceReports/types';
import { BackendResponse, DeviceParameterResponse } from '../../Shared/types';
import { ModuleName } from '../../Shared/Types/moduleName';
import { getString } from '../../Utils/guards';

export function getDeviceParametersAdapter(
	response: string,
): DeviceParameter[] {
	const { Response }: BackendResponse = JSON.parse(response);
	const data = Response.Tables[0].Rows as DeviceParameterResponse[];
	const deviceParameters: DeviceParameter[] = data.map((param) => ({
		name: getString(param.param_name, 'device_name'),
		value:
			param.param_value === null
				? ''
				: getString(param.param_value, 'device_value'),
		userId: '',
		moduleName: ModuleName.GetDeviceParametersAdapter_deviceParameters,
	}));
	return deviceParameters;
}

export function updateDeviceParameterAdapter(response: string): string | null {
	const { Response }: BackendResponse = JSON.parse(response);
	const error = Response.Error as string;

	return error;
}
