import { InputFormSelectOptions } from '../../Models/InputFormSelectOptions/types';
import {
	BackendResponse,
	InputFormPointSelectOptionsResponse,
} from '../../Shared/types';

export function selectPointOptionsAdapter(
	response: string,
): InputFormSelectOptions[] {
	const { Response }: BackendResponse = JSON.parse(response);
	const data = Response.Tables[0].Rows as InputFormPointSelectOptionsResponse[];
	const options = data.map((report) => ({
		id: report.ID,
		name: report.NAME,
	}));
	return options;
}
