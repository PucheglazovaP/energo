export interface DataLocationProps {
	className?: string;
	style?: Record<string, string>;
	NameOfChannels?: string;
	CNumber?: number | null;
	userID?: string | null;
	moduleName?: string | null;
	error?: number | null;
	textError?: string | null;
}
export interface ModalCloseProps {
	className?: string;
	style?: Record<string, string>;
	onClose?: any;
}

export interface DataLocationRenderingProps {
	className?: string;
	style?: Record<string, string>;
	data?: any;
}
