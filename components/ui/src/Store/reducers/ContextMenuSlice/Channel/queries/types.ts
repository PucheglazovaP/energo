import { Module } from '../../../../../Shared/types';
import { User } from '../../../../../Types/UserTypes';

export interface CreateNewChannels extends User, Module {
	channelNumber: number;
	count: number;
	channelName: string;
	deviceNumber: number;
	fkUnits: number;
	fkTypeStorage: number;
	fkMethods: number;
	serverId: number;
}
export interface RemoveChannelsFromGroup {
	groupNumber: number;
	channelNumber: number;
}
export interface RemoveChannelsFromGroupQuery
	extends RemoveChannelsFromGroup,
		User,
		Module {}
export interface DisconnectChannels extends User, Module {
	channelNumbers: string;
}

export interface UpdateChannelsCoefficients extends User, Module {
	channelsNumbers: string;
	groupNumber: number;
	coefficient: number;
}

export interface ConnectChannelsToDevice extends User, Module {
	deviceNumber: number;
	channelsNumbers: string;
}

export interface CreateGroupsFromChannels extends User, Module {
	groupStartNumber: number;
	channelNumbers: string;
	namePrefix: string;
}

export interface IncludeChannelsToGroup extends User, Module {
	groupNumber: number;
	channels: string;
	coefficient: number;
}

export interface UpdateChannel extends User, Module {
	channelNumber: number;
	channelName: string;
	fkDevices: number | null;
	fkUnits: number;
	fkTypeStorage: number;
	fkMethods: number;
	lastModified: string;
}

export interface UpdateChannels extends User, Module {
	channelsString: string;
	fkUnits: number;
	fkTypeStorage: number;
	fkMethods: number;
}
