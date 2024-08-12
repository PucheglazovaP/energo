export interface UserGroupsState {
	userGroups: UserGroup[];
}

export interface UserGroup {
	start: number;
	end: number;
}

export interface UserGroupResponse {
	ACC_UID: string;
	ID_Group_Start: number;
	ID_Group_End: number;
}
