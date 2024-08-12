import { CreateSeriesResponse } from '../../Shared/types';

export function createSeriesAdapter(message: string): CreateSeriesResponse {
	const response = JSON.parse(message).Response.Tables[0].Rows[0];
	return {
		err: response.Err,
		textErr: response.TextErr,
		trendId: response.КодСозданногоОбъекта,
	};
}
