import { MultiselectDropdownItem } from '../../UI/MultiselectDropdown/types';

export type Channel = {
	channelId: string;
	channelName: string;
	deviceId: string;
	deviceName: string;
	errCode: number;
	errName: string;
	errCount: number;
	errDate: string;
	serverId: number;
};

export enum FilterStorage {
	ChannelId = 'channelIdFilterStorage',
	ChannelName = 'channelNameFilterStorage',
	DeviceId = 'deviceIdFilterStorage',
	DeviceName = 'deviceNameFilterStorage',
	Error = 'errorFilterStorage',
}

export enum FilterIndicator {
	ChannelId = 'channelIdFilterIndicator',
	ChannelName = 'channelNameFilterIndicator',
	DeviceId = 'deviceIdFilterIndicator',
	DeviceName = 'deviceNameFilterIndicator',
	Error = 'errorFilterIndicator',
}

export type TFilterStorageToChannelPropDictionary = {
	[property in FilterStorage]: keyof Channel;
};

export type TFilterIndicatorToChannelPropDictionary = {
	[property in FilterIndicator]: keyof Channel;
};

export type TFilterIndicatorToStorageDictionary = {
	[property in FilterIndicator]: FilterStorage;
};

// Dictionary to map FilterStorage to props in channel
export const FilterStorageToChannelPropDictionary: Partial<TFilterStorageToChannelPropDictionary> =
	{
		[FilterStorage.ChannelId]: 'channelId',
		[FilterStorage.ChannelName]: 'channelName',
		[FilterStorage.DeviceId]: 'deviceId',
		[FilterStorage.DeviceName]: 'deviceName',
		[FilterStorage.Error]: 'errName',
	};

// Dictionary to map FilterIndicator to FilterStorage
export const FilterIndicatorToStorageDictionary: Partial<TFilterIndicatorToStorageDictionary> =
	{
		[FilterIndicator.ChannelId]: FilterStorage.ChannelId,
		[FilterIndicator.ChannelName]: FilterStorage.ChannelName,
		[FilterIndicator.DeviceId]: FilterStorage.DeviceId,
		[FilterIndicator.DeviceName]: FilterStorage.DeviceName,
		[FilterIndicator.Error]: FilterStorage.Error,
	};

export const FilterIndicatorToChannelPropDictionary: Partial<TFilterIndicatorToChannelPropDictionary> =
	{
		[FilterIndicator.ChannelId]: 'channelId',
		[FilterIndicator.ChannelName]: 'channelName',
		[FilterIndicator.DeviceId]: 'deviceId',
		[FilterIndicator.DeviceName]: 'deviceName',
		[FilterIndicator.Error]: 'errName',
	};

export type SetFilterStorage = {
	accessor: FilterStorage;
	items: MultiselectDropdownItem[];
};

export type ToggleFilterStorage = {
	accessor: FilterIndicator;
	id: string;
};

export type ChannelDiagnosticModel = {
	channels: Channel[];
	filteredChannels: Channel[];
	interval: number;
	// Filter storages
	channelIdFilterStorage: MultiselectDropdownItem[];
	channelNameFilterStorage: MultiselectDropdownItem[];
	errorFilterStorage: MultiselectDropdownItem[];
	deviceIdFilterStorage: MultiselectDropdownItem[];
	deviceNameFilterStorage: MultiselectDropdownItem[];
	// Filter indicators
	channelIdFilterIndicator: Map<string, boolean>;
	channelNameFilterIndicator: Map<string, boolean>;
	deviceIdFilterIndicator: Map<string, boolean>;
	deviceNameFilterIndicator: Map<string, boolean>;
	errorFilterIndicator: Map<string, boolean>;
};
