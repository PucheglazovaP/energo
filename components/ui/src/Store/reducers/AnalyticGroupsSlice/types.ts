import { ChangeEvent } from 'react';

import { Module } from '../../../Shared/types';
import { User } from '../../../Types/UserTypes';

export interface AnalyticGroupsProps extends User, Module {}
export interface CreateAnalyticGroupsProps extends User, Module {
	rangeStart: number;
	rangeEnd: number;
	analyticId: string;
}

export interface AnalyticGroupsResponse {
	ACC_UID: string;
	ACC_NAME: string;
	ACC_POST: string;
	ranges: string;
}

export interface GroupRangeResponse {
	rangeId: number;
	ID_Group_Start: number;
	ID_Group_End: number;
	LastModified: string;
}
export interface AnalyticGroups {
	analyticId: string;
	name: string;
	job: string;
	ranges: GroupRange[];
	isCollapsed?: boolean;
}

export interface GroupRange {
	rangeId: number;
	rangeStart: number;
	rangeEnd: number;
	lastModified: string;
}

export interface AnalyticRangeLogOperation {
	ID?: number;
	LastModified: string;
}

export interface NewAnalyticGroupRange extends GroupRange {
	analyticId: string;
}

export interface UpdateAnalyticGroupRange extends GroupRange, User, Module {
	analyticId: string;
}

export interface DeleteAnalyticGroupRange extends User, Module {
	analyticId: string;
	rangeId: number;
	lastModified: string;
}

export interface UpdateAnalyticRange extends UpdateAnalyticGroupRange {
	rangeType: AnalyticRangeType;
}
export enum AnalyticRangeType {
	Start,
	End,
}

export type UpdateGroupCallback = (
	props: UpdateAnalyticRange,
) => (e: ChangeEvent<HTMLInputElement>) => void;

export type CreateLocalRangeCallback = (analyticId: string) => () => void;

export type DeleteRangeCallback = (
	props: DeleteAnalyticGroupRange,
) => () => void;

export type SetSearchValueCallback = (e: ChangeEvent<HTMLInputElement>) => void;
