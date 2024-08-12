import { Permissions } from './types';

export const administratorPermissions: Permissions = {
	//Basic Permissions
	canSeeHistory: true,
	canCopyDataToBuffer: true,
	canFindItemInAnotherTree: true,

	//Group Default
	canCreateEditDeleteGroups: true,
	canFindGroupDoubles: true,
	canFindGroupOnScheme: true,
	canCopyPasteGroupFormula: true,
	canSetGroupFormula: true,
	canSeeAnalyticGroups: true,

	//Channel In Group
	canEditChannelCoefficient: true,
	canRemoveChannelFromGroup: true,

	//Device Default
	canCreateEditDeleteDevices: true,

	//Channel In Device || Unused Channels
	canCreateEditConnectDisconnectDeleteChannel: true,
	canSeeChannelDataPlacement: true,
	canIncludeChannelsToGroup: true,
	canCreateGroupsFromChannels: true,
};

export const analyticPermissions: Permissions = {
	//Basic Permissions
	canSeeHistory: true,
	canCopyDataToBuffer: true,
	canFindItemInAnotherTree: true,
	canSeeGroupRangeTooltip: true,

	//Group Default
	canCreateEditDeleteGroups: true,
	canFindGroupDoubles: true,
	canFindGroupOnScheme: true,

	//Channel In Group
	canEditChannelCoefficient: true,
	canRemoveChannelFromGroup: true,

	//Channel In Device
	canSeeChannelDataPlacement: true,
	canIncludeChannelsToGroup: true,
	canCreateGroupsFromChannels: true,
};

export const viewerPermissions: Permissions = {
	//Basic Permissions
	canSeeHistory: true,
	canCopyDataToBuffer: true,
	canFindItemInAnotherTree: true,

	//Group Default
	canFindGroupDoubles: true,
	canFindGroupOnScheme: true,

	//Channel In Device
	canSeeChannelDataPlacement: true,
};
