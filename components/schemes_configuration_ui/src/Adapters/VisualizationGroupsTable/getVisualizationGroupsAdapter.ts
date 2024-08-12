import {
	VisualizationGroupList,
	VisualizationGroupsListResponse,
} from '../../Models/VisualizationGroups/types';
import { BackendResponse } from '../../Shared/types';
import { ModuleName } from '../../Shared/Types/moduleName';
import { getNumber, getString } from '../../Utils/guards';

export function getVisualizationGroupsAdapter(
	response: string,
): VisualizationGroupList[] {
	const { Response }: BackendResponse = JSON.parse(response);
	const data = Response.Tables[0].Rows as VisualizationGroupsListResponse[];
	const visualizationGroupsList: VisualizationGroupList[] = data.map(
		(param) => ({
			visualizationGroupId: getNumber(param.ID, 'ID'),
			name: param.Name,
			shortName: getString(param.ShortName, 'ShortName'),
			sortOrder: getNumber(param.SortOrder, 'SortOrder'),
			comment: param.Comment ?? '',
			energyResourceId: getNumber(
				param.FK_EnergyResources,
				'FK_EnergyResources',
			),
			activeFrom: param.ActiveFrom,
			activeTo: param.ActiveTo,
			userId: getString(param.ID_User, 'ID_User'),
			changeDT: param.ChangeDT,
			lastModified: getString(param.LastModified, 'LastModified'),
			moduleName:
				ModuleName.GetVisualizationGroupsAdapter_visualizationGroupsList,
		}),
	);

	return visualizationGroupsList;
}
