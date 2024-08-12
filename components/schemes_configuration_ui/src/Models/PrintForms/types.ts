import { UserId } from '../../Shared/types';

export interface PrintForm extends UserId {
	id: number;
	reportId: number;
	name: string;
	comment: string;
	lastModified: string;
	reportUrl: string;
}

export type EditPrintFormUrl = {
	reportId: number;
	reportUrl: string;
};

export type PrintFormSidebarsState = {
	isLeftSidebarOpen: boolean;
	isRightSidebarOpen: boolean;
};
