import {
	BackendResponse,
	PriorityMethod,
	PriorityMethodResponse,
} from '../../Shared/types';

export function fetchPriorityMethodsAdapter(message: string): PriorityMethod[] {
	const { Response }: BackendResponse = JSON.parse(message);
	const backendMethods: PriorityMethodResponse[] = Response.Tables[0]
		.Rows as PriorityMethodResponse[];
	const methods: PriorityMethod[] = backendMethods.map((method) => ({
		comment: method.Comment || '',
		label: method.NAME,
		objectToSelect: method.ObjectToSelect,
		value: method.ID.toString(),
	}));
	return methods;
}
