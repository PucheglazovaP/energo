import { ReactNode } from 'react';

export interface ICardItem {
	className?: string;
	name: string;
	value: ReactNode;
}

export type CardProps = {
	className?: string;
	title: string;
	items: ICardItem[];
};
