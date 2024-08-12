/* global React */
import { SelectOption } from '../Select/types';

export type InputWithSelectProps = {
	value?: string | number;
	onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
	options: SelectOption[];
	onSelect: (options: SelectOption[]) => void;
	className?: string;
	isDisabled?: boolean;
	tooltipTextForSelector?: string;
	tooltipTextForInput?: string;
};
