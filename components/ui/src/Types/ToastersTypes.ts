import { ReactNode } from 'react';

export type ToastersType = {
	text: string;
};

export type ToasterType = {
	title: string;
	children: ReactNode;
};
