import { ReactNode } from 'react';

export interface SubmitOperationHeader {
	title: string;
	body: ReactNode;
}

export enum SubmitOperationTitle {
	DeletePosition = 'Удалить позицию',
	DisconnectPosition = 'Отключить от прибора',
}
export enum SubmitButtonText {
	Delete = 'Удалить',
	Disconnect = 'Отключить',
}

export interface DeleteItem {
	itemNumber?: number;
	itemName?: string;
	channels?: string;
	channelsCount?: number;
	subItemNumber?: number;
	subItemName?: string;
}

export enum SubmitOperation {
	DeleteGroup,
	DeleteDevice,
	RemoveChannelFromGroup,
	DeleteChannel,
	DisconnectChannels,
}
