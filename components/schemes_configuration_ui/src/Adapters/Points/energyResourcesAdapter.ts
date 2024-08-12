import { DEFAULT_ENERGY_RESOURCES_ID } from '../../Containers/ParameterByValueTable/constants';
import { EnergyResource } from '../../Models/EnergyResources/types';
import { BackendResponse, EnergyResourceResponse } from '../../Shared/types';

export function energyResourcesAdapter(response: string): EnergyResource[] {
	const { Response }: BackendResponse = JSON.parse(response);
	const data = Response.Tables[0].Rows as EnergyResourceResponse[];
	const energyResources = data.map((resource) => ({
		value: resource.ID,
		label: resource.ShortName,
		baseHour: resource.BaseHour,
		changeDateTime: resource.ChangeDT,
		isSelected: resource.ID === DEFAULT_ENERGY_RESOURCES_ID,
	}));
	return energyResources;
}
