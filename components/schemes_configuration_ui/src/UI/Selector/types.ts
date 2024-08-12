export interface Option {
	value: string;
	displayValue: string;
}

export interface SelectorProps {
	options: Option[];
	selectedOption?: string;
	setSelectedOption: (value: string) => void;
	className?: string;
	setSelected?: (value: boolean) => void;
	multipleChoice?: boolean;
}
