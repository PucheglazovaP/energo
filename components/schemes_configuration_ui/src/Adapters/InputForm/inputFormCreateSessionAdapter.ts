import {
	BackendResponse,
	InputFormCreateSessionResponse,
} from '../../Shared/types';

export function inputFormCreateSessionAdapter(response: string): number {
	const { Response }: BackendResponse = JSON.parse(response);
	const data = Response.Tables[0].Rows as InputFormCreateSessionResponse[];
	return data[0]?.SessionID || 0;
}
