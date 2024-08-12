import {
	BackendResponse,
	EditResponse,
	FormLayer,
	FormLayersResponse,
} from '../../Shared/types';

function fetchFormLayersAdapter(message: string): FormLayer[] {
	const { Response }: BackendResponse = JSON.parse(message);
	const parametersResponse = Response.Tables[0].Rows as FormLayersResponse[];

	return parametersResponse.map((parameter: FormLayersResponse) => {
		return {
			id: parameter.Код,
			name: parameter.Название,
			layerId: parameter.КодСлояСистемы,
			parentId: parameter.КодРодительскогоСлоя || undefined,
			lastModified: parameter.LastModified,
			order: parameter.НомерПоПорядку,
			formId: parameter.КодФормы,
		};
	});
}

export function editFormLayerAdapter(message: string) {
	const { Response }: BackendResponse = JSON.parse(message);
	const rowsUpdated: number = (Response.Tables[0].Rows as EditResponse[])[0]
		.RowsUpdated;
	return {
		rowsUpdated,
	};
}

export default fetchFormLayersAdapter;
