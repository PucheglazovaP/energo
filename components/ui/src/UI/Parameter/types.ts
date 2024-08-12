import React from 'react';

export enum ParameterType {
	Toggle = 'toggle',
}
export interface ParameterProps {
	className?: string;
	style?: Record<string, string>;
	type: ParameterType;
	value: string;
	caption: string;
	onClick?: (value: string) => void;
	onModalOpen?: () => void;
	onResetClick?: () => void;
	onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
	valuesList?: { value: string; displayValue: string }[];
	defaultValue?: string | number | null;
}

export interface ParameterDisplayProps {
	className?: string;
	style?: Record<string, string>;
	text?: string;
	value: string;
	valuesList?: { value: string; displayValue: string }[];
	workingWith: (value: boolean) => void;
	onClick?: (value: string) => void;
	onModalOpen?: () => void;
	onResetClick?: () => void;
	onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export interface IconProps {
	className?: string;
	style?: Record<string, string>;
}
