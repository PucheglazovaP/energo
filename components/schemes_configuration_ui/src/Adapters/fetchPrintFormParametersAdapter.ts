import { checkIsMaxDate } from '../Shared/checkIsMaxDate';
import {
	BackendResponse,
	PrintFormParameter,
	PrintFormParameterResponse,
} from '../Shared/types';
import { DateFormat, formatDate } from '../Utils/dateUtils';

function fetchPrintFormParametersAdapter(
	message: string,
): PrintFormParameter[] {
	const { Response }: BackendResponse = JSON.parse(message);
	const parametersResponse = Response.Tables[0]
		.Rows as PrintFormParameterResponse[];

	return parametersResponse.map((parameter: PrintFormParameterResponse) => {
		const {
			ID_PrintRepLinkParam: linkId,
			ID_Param: paramId,
			Name: paramName,
			ID_Value: valueId,
			StringValue: valueName,
			ActiveFrom: dateFrom,
			ActiveTo: dateTo,
			isActive,
			inReport: isInReport,
		} = parameter;
		const isMaxEndDate = checkIsMaxDate(new Date(dateTo));

		return {
			linkId,
			paramId,
			paramName,
			valueId,
			valueName,
			dateFrom: dateFrom ? new Date(dateFrom) : new Date(),
			dateTo: dateTo ? new Date(dateTo) : new Date(),
			dateToString: isMaxEndDate
				? '...'
				: formatDate(dateTo, DateFormat.DisplayFormatWithoutTime),

			dateFromString: formatDate(dateFrom, DateFormat.DisplayFormatWithoutTime),
			isActive: !!isActive,
			isInReport: !!isInReport,
		};
	});
}

export default fetchPrintFormParametersAdapter;
