import { InputFormSelectOptions } from '../../Models/InputFormSelectOptions/types';
import {
	BackendResponse,
	InputFormSelectOptionsResponse,
} from '../../Shared/types';

export function selectOptionsAdapter(
	response: string,
): InputFormSelectOptions[] {
	const { Response }: BackendResponse = JSON.parse(response);
	const data = Response.Tables[0].Rows as InputFormSelectOptionsResponse[];
	const options = data.map((report) => ({
		id: report.ID,
		name: report.Name,
	}));
	return options;
}
