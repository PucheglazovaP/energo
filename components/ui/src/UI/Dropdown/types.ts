export interface TOption {
	value: string;
	label: string;
	disabled?: boolean;
}

export interface TOptionHeading {
	title: string;
	withSeparator?: boolean;
}

export interface OptionProps {
	option: TOption;
	selectedOption?: TOption;
	onClick: (option: TOption) => void;
}

export interface OptionHeadingProps {
	option: TOptionHeading;
}

export interface DropdownProps {
	options: (TOption | TOptionHeading)[];
	selectedOption?: TOption;
	setSelectedOption: (value: TOption) => void;
	isActive?: boolean;
	isDisabled?: boolean;
	defaultTitle?: string;
	className?: string;
}
