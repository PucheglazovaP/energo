import {
	BackendResponse,
	NotSyncedPrintFormParameterResponse,
	PrintFormParameterNotSynced,
} from '../Shared/types';

function fetchNotSyncedPrintFormParametersAdapter(
	message: string,
): PrintFormParameterNotSynced[] {
	const { Response }: BackendResponse = JSON.parse(message);
	const parametersResponse = Response.Tables[0]
		.Rows as NotSyncedPrintFormParameterResponse[];

	return parametersResponse.map(
		(parameter: NotSyncedPrintFormParameterResponse) => {
			const { ID_Param: paramId, Name: paramName } = parameter;

			return {
				id: String(paramId),
				name: paramName,
				isSelected: false,
			};
		},
	);
}

export default fetchNotSyncedPrintFormParametersAdapter;
