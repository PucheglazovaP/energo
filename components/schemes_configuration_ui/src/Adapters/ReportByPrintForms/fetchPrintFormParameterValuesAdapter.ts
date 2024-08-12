import {
	BackendResponse,
	PrintFormParameterValue,
	PrintFormParameterValueResponse,
} from '../../Shared/types';

function fetchPrintFormParameterValuesAdapter(
	message: string,
): PrintFormParameterValue[] {
	const { Response }: BackendResponse = JSON.parse(message);
	const parameterValues: PrintFormParameterValueResponse[] = Response.Tables[0]
		.Rows as PrintFormParameterValueResponse[];

	return parameterValues.map(
		(parameterValue: PrintFormParameterValueResponse) => {
			const {
				ID_Value: valueId,
				StringValue: valueName,
				ActiveFrom,
				ActiveTo,
				isActive,
			} = parameterValue;

			const dateFrom = ActiveFrom ? new Date(ActiveFrom) : new Date();
			const dateTo = ActiveTo ? new Date(ActiveTo) : new Date();

			return {
				valueId,
				valueName,
				dateFrom,
				dateTo,
				isActive: !!isActive,
			};
		},
	);
}

export default fetchPrintFormParameterValuesAdapter;
