import { ReactNode } from 'react';

export interface DropDownProps {
	className?: string;
	style?: Record<string, string>;
	title?: ReactNode;
	children?: ReactNode;
}
