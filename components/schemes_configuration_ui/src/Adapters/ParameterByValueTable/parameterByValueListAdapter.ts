import {
	ParameterByValueListResponse,
	ParametersByValueList,
} from '../../Models/ParametersByValueReports/types';
import { BackendResponse } from '../../Shared/types';
import { getNumber, getString } from '../../Utils/guards';

export function getParametersByValueListAdapter(
	response: string,
): ParametersByValueList[] {
	const { Response }: BackendResponse = JSON.parse(response);
	const data = Response.Tables[0].Rows as ParameterByValueListResponse[];
	const devicesList: ParametersByValueList[] = data.map((param) => ({
		parameterId: getNumber(param.ID, 'ID'),
		dailyPointGroupsId: param.FK_DailyPointsGroups ?? '',
		visualizationGroupName: param.GroupName ?? '',
		name: param.Name,
		shortName: getString(param.ShortName, 'ShortName'),
		sortOrder: getNumber(param.SortOrder, 'SortOrder'),
		sortOrderGroup: Number(param.SortOrderGroup),
		comment: param.Comment ?? '',
		pointId: getNumber(param.FK_Points, 'FK_Points'),
		pointName: getString(param.PointName, 'PointName'),
		methodId: getNumber(param.FK_Methods, 'FK_Methods'),
		methodName: getString(param.MethodName, 'MethodName'),
		calculateMethodId: getNumber(
			param.FK_CalculateMethods,
			'FK_CalculateMethods',
		),
		calcName: getString(param.CalcName, 'CalcName'),
		energyResourceId: getNumber(param.FK_EnergyResources, 'FK_EnergyResources'),
		precision: param.RoundToDig ?? 0,
		hourShift: param.HourShift ?? 0,
		activeFrom: param.ActiveFrom,
		activeTo: param.ActiveTo,
		linkedDailyPointsId: param.FK_LinkedDailyPoints,
		linkedColumns: getNumber(param.LinkedColumns, 'LinkedColumns'),
		changeDT: param.ChangeDT,
		lastModified: getString(param.LastModified, 'LastModified'),
	}));

	return devicesList;
}
