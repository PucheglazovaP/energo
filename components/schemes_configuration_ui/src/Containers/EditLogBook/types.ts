import { InputFormSelectOptions } from '../../Models/InputFormSelectOptions/types';

export interface InputCellProps {
	id: string;
	type: string;
	name: string;
	value: string | number;
	options?: InputFormSelectOptions[];
	handleEditValue: (value: string, name: string, rowId: string) => void;
}
