export interface DuplicatesProps {
	className?: string;
	style?: Record<string, string>;
	CNumber?: number | null;
}
export interface DuplicatesRenderingProps {
	className?: string;
	style?: Record<string, string>;
	data?: any;
}
export interface ModalCloseProps {
	className?: string;
	style?: Record<string, string>;
	onClose?: any;
}
export interface ModalIconSearchProps {
	className?: string;
	style?: Record<string, string>;
	filterTreeClick?: any;
	sortingList?: any;
	order?: number;
}
export interface SortingOptionsProps {
	optionsMode: number;
	optionsFilter: string;
}
