import {
	BackendResponse,
	EditResponse,
	SystemLayer,
	SystemLayerForms,
	SystemLayerFormsResponse,
	SystemLayersResponse,
} from '../../Shared/types';

function fetchSystemLayersAdapter(message: string): SystemLayer[] {
	const { Response }: BackendResponse = JSON.parse(message);
	const parametersResponse = Response.Tables[0].Rows as SystemLayersResponse[];

	return parametersResponse.map((parameter: SystemLayersResponse) => {
		return {
			id: parameter.Код,
			name: parameter.Название,
			comment: parameter.Описание,
			systemCode: parameter.КодСистемы,
			lastModified: parameter.LastModified,
		};
	});
}
export function fetchSystemLayerFormsAdapter(
	message: string,
): SystemLayerForms[] {
	const { Response }: BackendResponse = JSON.parse(message);
	const parametersResponse = Response.Tables[0]
		.Rows as SystemLayerFormsResponse[];

	return parametersResponse.map((parameter: SystemLayerFormsResponse) => {
		return {
			id: parameter.Код,
			name: parameter.Название,
			systemCode: parameter.КодВерсии,
			objectsCount: parameter.КоличествоОбъектов,
		};
	});
}
export function editSystemLayerAdapter(message: string) {
	const { Response }: BackendResponse = JSON.parse(message);
	const rowsUpdated: number = (Response.Tables[0].Rows as EditResponse[])[0]
		.RowsUpdated;
	return {
		rowsUpdated,
	};
}

export default fetchSystemLayersAdapter;
