import { BackendResponse } from '../Shared/types';

type RowType = {
	КодСозданнойФормы: number;
	КодСозданногоОбъектаФормы: number;
};

export function formActionAdapter(response: string) {
	const { Response }: BackendResponse = JSON.parse(response);
	const row: RowType = (Response.Tables[0].Rows as RowType[])[0];
	return row.КодСозданнойФормы || row.КодСозданногоОбъектаФормы;
}
