import React from 'react';
export interface SetPicturesDynamicProps {
	className?: string;
	style?: React.CSSProperties;
	codeForm: number | null;
	codeObject: number;
	nameParameter: string;
}
export interface ModalCloseProps {
	className?: string;
	style?: React.CSSProperties;
	onClose?: any;
}
export interface indicatorIconProps {
	className?: string;
	style?: React.CSSProperties;
}
export interface picturesDynamicProps {
	className?: string;
	style?: React.CSSProperties;
	data: Array<string>;
}
