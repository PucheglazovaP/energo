import { EditInputFormSession } from '../../Models/InputFormSession/types';
import { BackendResponse, InputFormSessionResponse } from '../../Shared/types';

export function inputFormSessionAdapter(
	response: string,
): EditInputFormSession {
	const { Response }: BackendResponse = JSON.parse(response);
	const data = Response.Tables[0].Rows as InputFormSessionResponse[];
	return {
		sessionId: data[0]?.SessionID || 0,
		errorMessage: data[0]?.MSG || '',
	};
}
