import React, { CSSProperties, ReactNode } from 'react';

export interface ModalProps {
	className?: string;
	style?: React.CSSProperties;
	openedModalList: string[];
	modalsList: Record<string, ModalInfo>;
}
export interface ModalWindowProps {
	className?: string;
	style?: React.CSSProperties;
	title?: string;
	hasCloseButton?: boolean;
	children: ReactNode;
	width?: CSSProperties['width'];
	height?: CSSProperties['height'];
	onClose?: () => void;
	isVisible?: boolean;
	isOverflowVisible?: boolean;
	hasTitle?: boolean;
}

export type ModalInfo = {
	title?: string;
	hasCloseButton?: boolean;
	body: ReactNode;
	width?: CSSProperties['width'];
	height?: CSSProperties['height'];
	onCloseFn?: () => void;
	isOverflowVisible?: boolean;
	hasTitle?: boolean;
};
export interface ModalCloseProps {
	className?: string;
	style?: React.CSSProperties;
	setActive?: any;
	onClose: () => void;
}
