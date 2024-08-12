import { FormObjectParameters } from '../../Models/EditMode/types';
import { SelectOption } from '../../UI/Select/types';
import { getParameterValue } from '../../Utils/objectParameters';

export function convertTrendsToSelect(
	objectParameters: Map<number, FormObjectParameters[]>,
	activeId: number,
): SelectOption[] {
	const options: SelectOption[] = Array.from(objectParameters).map(
		([id, params]) => {
			const getParameterValueFn = getParameterValue(params);
			return {
				label: String(getParameterValueFn('name')),
				value: id,
				isSelected: id === activeId,
			};
		},
	);
	return options;
}
