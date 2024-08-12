import { ChangeEvent } from 'react';
export interface ParentSectionProps {
	title: string;
	options: RadioGroup[];
	onChange: (evt: ChangeEvent<HTMLInputElement>) => void;
}

export type FormType = 'parent' | 'child';
export type FormCreationFrom = 'transparent' | 'tree' | 'dynamicObject';

export interface RadioGroup {
	name: string;
	value: string;
	disabled?: boolean;
	checked: boolean;
}

export interface ParentRadioGroup extends RadioGroup {
	type: FormType;
}

export interface FormCreationProps {
	from: FormCreationFrom;
}
