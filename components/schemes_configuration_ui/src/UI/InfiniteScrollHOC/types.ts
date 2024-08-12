import { ReactNode } from 'react';

export type InfiniteScrollHOCProps = {
	children: ReactNode;
	isDataLoading: boolean;
	onDataLoad: (nextPage: number) => void;
	totalPages: number;
	firstPage?: number;
	initialPage?: number;
	scrollMargin?: number;
	className?: string;
};

export default {};
