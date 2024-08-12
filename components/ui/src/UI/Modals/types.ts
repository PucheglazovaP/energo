import { ReactNode } from 'react';

export interface ModalProps {
	className?: string;
	style?: Record<string, string>;
	openedModalList: string[];
	modalsList: Record<string, ModalInfo>;
}
export interface ModalWindowProps {
	className?: string;
	style?: Record<string, string>;
	title?: string;
	hasCloseButton?: boolean;
	children: ReactNode;
	width?: number;
	height?: number;
}

export type ModalInfo = {
	title?: string;
	hasCloseButton?: boolean;
	body: ReactNode;
	width?: number;
	height?: number;
};
export interface ModalCloseProps {
	className?: string;
	style?: Record<string, string>;
	setActive?: any;
}
export interface ModalIconProps {
	className?: string;
	style?: Record<string, string>;
	filterTreeClick?: any;
}
