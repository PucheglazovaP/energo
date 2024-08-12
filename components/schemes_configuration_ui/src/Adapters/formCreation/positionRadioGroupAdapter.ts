import { RadioGroup } from '../../Containers/FormCreation/types';
import { FormPosition } from '../../Models/NewForm/types';

export function positionRadioGroupAdapter(): RadioGroup[] {
	const result: RadioGroup[] = [
		{
			name: 'Выше текущего узла',
			value: String(FormPosition.ABOVE),
			checked: false,
			disabled: true,
		},
		{
			name: 'Ниже текущего узла',
			value: String(FormPosition.UNDER),
			checked: false,
			disabled: true,
		},
		{
			name: 'В конце',
			value: String(FormPosition.END),
			checked: true,
			disabled: true,
		},
	];
	return result;
}
