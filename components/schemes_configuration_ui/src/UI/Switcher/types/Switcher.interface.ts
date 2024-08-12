/* global React */
export interface SwitcherProps {
	id?: string;
	name?: string;
	type?: 'checkbox' | 'radio' | 'switcher';
	checked: boolean;
	disabled?: boolean;
	caption?: string;
	value?: string;
	className?: string;
	glyphClassName?: string;
	markerRenderFn?: (checked: boolean) => JSX.Element;
	onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export interface MarkerProps {
	checked: boolean;
	className?: string;
}
