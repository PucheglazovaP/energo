import React from 'react';
export interface InformationAboutBannersProps {
	className?: string;
	style?: React.CSSProperties;
	title: string;
	codeForm: number | null;
	codeVersion: number;
}

export interface ModalCloseProps {
	className?: string;
	style?: React.CSSProperties;
	closeModal?: any;
}
export interface DataLocationRenderingProps {
	className?: string;
	style?: React.CSSProperties;
	data?: any;
	clickCodeT?: any;
}
export interface ModalIconProps {
	className?: string;
	style?: React.CSSProperties;
}
export interface ModalIconSearchProps {
	className?: string;
	style?: React.CSSProperties;
	filterTreeClick?: any;
	sortingList?: any;
	order?: number;
	arrow: any;
}
export interface InformationBannersProps {
	ГруппаДанных: string;
	ДанныеИзСУБД: boolean;
	КлючТранспаранта: string;
	КодТранспаранта: number;
	НомерEWorkГруппыДанных: string | number | null;
	НомерГруппыДанных: number;
}
export type DynamicObjectsInfo = {
	nameObject: string;
	numberGroupData: number | null;
	eWork: number | null;
	groupData: string;
};
