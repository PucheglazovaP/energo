import { AccountingNodeMethodsResponse } from '../../Models/Points/types';
import { BackendResponse } from '../../Shared/types';
import { SelectOption } from '../../UI/Select/types';

export function accountingNodeMethodsAdapter(response: string): SelectOption[] {
	const { Response }: BackendResponse = JSON.parse(response);
	const data = Response.Tables[0].Rows as AccountingNodeMethodsResponse[];
	const methods: SelectOption[] = data.map((method) => ({
		value: method.ID,
		label: method.Name,
		isSelected: false,
	}));
	return methods;
}
