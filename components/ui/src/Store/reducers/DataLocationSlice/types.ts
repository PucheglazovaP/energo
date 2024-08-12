import { User } from '../../../Types/UserTypes';

export interface ChannelsLocationQuery extends User {
	channelNumber: number | null;
	moduleName: string | null;
	error: number | null;
	textError: string | null;
}
