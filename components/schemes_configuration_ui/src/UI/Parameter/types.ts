import React from 'react';

export enum ParameterType {
	Number = 'number',
	Toggle = 'toggle',
	Color = 'color',
	File = 'file',
	List = 'List',
	Modal = 'Modal',
	Range = 'Range',
}
export interface ParameterProps {
	className?: string;
	style?: React.CSSProperties;
	type: ParameterType;
	value: string | null;
	caption: string;
	onClick?: (value: string) => void;
	onModalOpen?: () => void;
	onResetClick?: () => void;
	onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
	valuesList?: { value: string; displayValue: string }[];
	defaultValue?: string | number | null;
	disabled?: boolean;
	isHintEnabled?: boolean;
	parameterComment?: string;
}

export interface Option {
	value: string;
	displayValue: string;
}
export enum TooltipDirection {
	Up = 'up',
	Down = 'down',
	Right = 'right',
	Left = 'left',
}
export interface ParameterDisplayProps {
	className?: string;
	style?: React.CSSProperties;
	text?: string;
	value: string | null;
	valuesList?: { value: string; displayValue: string }[];
	workingWith: (value: boolean) => void;
	onClick?: (value: string) => void;
	onModalOpen?: () => void;
	onResetClick?: () => void;
	onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
	disabled?: boolean;
	isHintEnabled?: boolean;
}

export interface ParameterTooltipProps {
	className?: string;
	style?: React.CSSProperties;
	text?: string;
	children?: any;
}
export interface ParameterModalProps {
	className?: string;
	style?: React.CSSProperties;
	children?: any;
	value: string;
	onClick: (value: string) => void;
}
export interface IconProps {
	className?: string;
	style?: React.CSSProperties;
}
