import { BackendResponse, DefaultListResponse } from '../Shared/types';
import { SelectOption } from '../UI/Select/types';

export function getEnumValuesAdapter(response: string): SelectOption[] {
	const { Response }: BackendResponse = JSON.parse(response);
	const data = Response.Tables[0].Rows as { enum: string }[];

	return (JSON.parse(data[0].enum) as DefaultListResponse[]).map((item) => ({
		label: item.DisplayName,
		value: item.Val,
		isSelected: false,
	}));
}
