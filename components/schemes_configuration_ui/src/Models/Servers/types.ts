import { UserId } from '../../Shared/types';

export type ServersModel = {
	list: Server[];
	isLoading: boolean;
};

export interface Server extends UserId {
	id: number;
	name: string;
	ip: string;
	domenName: string;
	comment: string;
	lastModified: string;
	hasDevices: boolean;
	hasGroups: boolean;
	hasUnconnChannels: boolean;
	isOpen?: boolean;
}
