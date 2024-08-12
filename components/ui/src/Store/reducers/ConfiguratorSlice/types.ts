import {
	ChannelsListActionPayloadType,
	DevicesListItemType,
	GroupsListItemType,
} from '../../../Types';

export interface UpdateElements {
	elementsList:
		| GroupsListItemType[]
		| DevicesListItemType[]
		| ChannelsListActionPayloadType[];
	toBottom?: boolean;
}
