export type SelectOption = {
	label: string;
	value: string | number;
	isSelected: boolean;
};

export enum SelectVariant {
	PRIMARY = 'primary',
	SECONDARY = 'secondary',
}

export type SelectProps = {
	options: SelectOption[];
	placeholder?: string;
	variant?: SelectVariant;
	legend?: string;
	isMultiple?: boolean;
	isClearable?: boolean;
	disabled?: boolean;
	className?: string;
	onSelect(options: SelectOption[]): void;
};

export type SelectTagProps = {
	option: SelectOption;
	onRemove(option: SelectOption): void;
};

export type SelectFieldProps = {
	options: SelectOption[];
	isMultiple: boolean;
	placeholder: string;
	onRemove(option: SelectOption): void;
};

export type SelectPaneProps = {
	options: SelectOption[];
	isMultiple: boolean;
	onSelect(option: SelectOption): void;
};

export type SelectPaneItemProps = {
	option: SelectOption;
	isMultiple: boolean;
	onSelect(option: SelectOption): void;
};
