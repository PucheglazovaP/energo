import React from 'react';
export type CheckboxProps = {
	name: string;
	checked: boolean;
	title?: string;
	className?: string;
	classNameCheckmark?: string;
	disabled?: boolean;
	onChange?: () => void;
	style?: React.CSSProperties;
};
