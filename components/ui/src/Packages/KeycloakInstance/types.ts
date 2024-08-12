export type Permissions = {
	canCreateEditDeleteGroups?: boolean;
	canFindGroupDoubles?: boolean;
	canFindGroupOnScheme?: boolean;
	canSeeHistory?: boolean;
	canEditChannelCoefficient?: boolean;
	canRemoveChannelFromGroup?: boolean;
	canCopyDataToBuffer?: boolean;
	canFindItemInAnotherTree?: boolean;
	canCreateEditDeleteDevices?: boolean;
	canCreateEditConnectDisconnectDeleteChannel?: boolean;
	canCreateGroupsFromChannels?: boolean;
	canIncludeChannelsToGroup?: boolean;
	canSeeChannelDataPlacement?: boolean;
	canCopyPasteGroupFormula?: boolean;
	canSetGroupFormula?: boolean;
	canSeeGroupRangeTooltip?: boolean;
	canSeeAnalyticGroups?: boolean;
};

export enum Role {
	EM_ADMIN,
	EM_ANALYTIC,
	EM_VIEW,
}
