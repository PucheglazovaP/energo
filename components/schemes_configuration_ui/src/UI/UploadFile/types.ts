import { ChangeEvent, ReactNode } from 'react';

export enum AcceptanceTypes {
	jpeg = 'image/jpeg',
	png = 'image/png',
	gif = 'image/gif',
	svg = 'image/svg+xml',
	bmp = 'image/bmp',
	wmf = 'application/x-msmetafile',
	pdf = '.pdf',
	xls = '.xls',
	xlsx = '.xlsx',
	doc = '.doc',
	docx = '.docx',
}

export interface UploadFileProps {
	id: string;
	className?: string;
	icon?: ReactNode;
	title: string;
	acceptedTypes: AcceptanceTypes[];
	multiple?: boolean;
	onChange: (e: ChangeEvent<HTMLInputElement>) => void;
}
