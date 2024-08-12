import React from 'react';
import {
	ActionFunction,
	LoaderFunction,
	RouteObject,
	ShouldRevalidateFunction,
} from 'react-router-dom';

import { UserRole } from '../Store/reducers/AuthSlice/types';

declare global {
	interface Window {
		appConfig: {
			KEYCLOAK_AUTH_ON: string;
			KEYCLOAK_CONFIG_URL: string;
			KEYCLOAK_CONFIG_REALM: string;
			KEYCLOAK_CONFIG_CLIENT_ID: string;
			KEYCLOAK_TOKEN_MIN_VALIDITY: string;
			KEYCLOAK_FLOW: string;
			RABBIT_USER: string;
			RABBIT_PASS: string;
			RABBIT_WS_URL: string;
			RABBIT_WS_CHANNEL_NAME: string;
		};
	}
}

export type RouteItem = {
	path?: string;
	displayName: string;
	key: string;
	index?: boolean;
	element?: React.ReactNode | null;
	caseSensitive?: boolean;
	id?: string;
	loader?: LoaderFunction;
	action?: ActionFunction;
	errorElement?: React.ReactNode | null;
	handle?: RouteObject['handle'];
	shouldRevalidate?: ShouldRevalidateFunction;
};

export enum RouteApps {
	MONITORING = 'monitoring',
}

export enum CalendarType {
	DayTime = 'daytime',
	Day = 'day',
	Month = 'month',
	Year = 'year',
	Period = 'period',
	PeriodWithTime = 'periodWithTime',
}

type OutputParametersKeys = '@Err' | '@TextErr' | '@TextWarn';

export type OutputParameters = {
	[key in OutputParametersKeys]: string;
};

export type Pagination = {
	rowCount: number;
	pageNumber: number;
};
export type User = {
	id: string;
	firstName: string;
	lastName: string;
	secondName?: string;
	email?: string;
	groups?: string[];
	preferredUsername: string;
	roles: UserRole[];
};

export type UserResponse = {
	LDAP_ENTRY_DN: string;
	email: string;
	email_verified: boolean;
	family_name: string;
	given_name: string;
	groups: string[];
	name: string;
	preferred_username: string;
	sub: string;
	roles: UserRole[];
};

export enum Path {
	Monitoring = '/monitoring/',
	NSI = '/nsi',
	ReportByDevices = '/report-by-devices/',
	ReportByPoints = '/report-by-points/',
	ReportByParameters = '/report-by-parameters/',
	ReferenceByReports = '/reference-by-reports/',
	ReferenceByForms = '/reference-by-forms/',
	ReportsTechnical = '/reports-technical/',
	ReportByInputForms = '/report-by-input-forms',
	EmergencyEvents = '/emergency-events/',
	DevicesStatus = '/devices-status/',
	RetrofittingAccountingNodes = '/retrofitting-accounting-nodes/',
	StatisticalProcessing = '/statistical-processing/',
	ElectricPower = '/electric-power/',
	NaturalGas = '/natural-gas/',
}
export interface Module {
	moduleName?: ModuleName;
}

export enum ModuleName {
	Test = 'test',

	UseAnalyticGroups_getAnalyticGroupsRpc = 'EM_CONFIG_TAG [useAnalyticGroups getAnalyticGroupsRpc ]',
	UseAnalyticGroups_createNewAnalyticGroupRpc = 'EM_CONFIG_TAG [useAnalyticGroups createNewAnalyticGroupRpc ]',
	UseAnalyticGroups_updateAnalyticGroupRangeRpc = 'EM_CONFIG_TAG [useAnalyticGroups updateAnalyticGroupRangeRpc ]',
	UseAnalyticGroups_deleteAnalyticGroupRangeRpc = 'EM_CONFIG_TAG [useAnalyticGroups deleteAnalyticGroupRangeRpc ]',

	UseDataLocation_getDataLocationRpc = 'EM_CONFIG_TAG [useDataLocation getDataLocationRpc ]',

	UseFormulaEditorContainer_onFormulaActiveToggle = 'EM_CONFIG_TAG [UseFormulaEditorContainer onFormulaActiveToggle ]',

	ChannelContextActions_createGroupsFromChannels = 'EM_CONFIG_TAG [ChannelContextActions createGroupsFromChannelsQuery ]',
	ChannelContextActions_createNewChannels = 'EM_CONFIG_TAG [ChannelContextActions createNewChannels ]',
	ChannelContextActions_deleteChannel = 'EM_CONFIG_TAG [ChannelContextActions deleteChannel ]',
	ChannelContextActions_disconnectChannels = 'EM_CONFIG_TAG [ChannelContextActions disconnectChannels ]',
	ChannelContextActions_includeChannelsToGroup = 'EM_CONFIG_TAG [ChannelContextActions includeChannelsToGroup ]',
	ChannelContextActions_createGroupFromChannels = 'EM_CONFIG_TAG [ChannelContextActions createGroupFromChannels(includeChannelsToGroup) ]',
	ChannelContextActions_removeChannelFromGroup = 'EM_CONFIG_TAG [ChannelContextActions removeChannelFromGroup ]',
	ChannelContextActions_updateChannels = 'EM_CONFIG_TAG [ChannelContextActions updateChannels ]',
	ChannelContextActions_editUnusedChannels = 'EM_CONFIG_TAG [ChannelContextActions editUnusedChannels ]',
	ChannelContextActions_updateChannelsCoefficients = 'EM_CONFIG_TAG [ChannelContextActions updateChannelsCoefficients ]',

	UnusedChannelContextActions_connectChannelsToDeviceQuery = 'EM_CONFIG_TAG [UnusedChannelContextActions connectChannelsToDeviceQuery ]',

	DeviceContextActions_addDeviceToFavourite = 'EM_CONFIG_TAG [DeviceContextActions addDeviceToFavourite ]',
	DeviceContextActions_createDevice = 'EM_CONFIG_TAG [DeviceContextActions createDevice ]',
	DeviceContextActions_createDevices = 'EM_CONFIG_TAG [DeviceContextActions createDevices ]',
	DeviceContextActions_deleteDevice = 'EM_CONFIG_TAG [DeviceContextActions deleteDevice ]',
	DeviceContextActions_removeDeviceFromFavourite = 'EM_CONFIG_TAG [DeviceContextActions removeDeviceFromFavourite ]',
	DeviceContextActions_updateDevice = 'EM_CONFIG_TAG [DeviceContextActions updateDevice ]',

	GroupContextActions_addGroupToFavourite = 'EM_CONFIG_TAG [GroupContextActions addGroupToFavourite ]',
	GroupContextActions_createGroupCopy = 'EM_CONFIG_TAG [GroupContextActions createGroupCopy ]',
	GroupContextActions_createGroups = 'EM_CONFIG_TAG [GroupContextActions createGroups ]',
	GroupContextActions_removeGroupFromFavourite = 'EM_CONFIG_TAG [GroupContextActions removeGroupFromFavourite ]',
	GroupContextActions_deleteGroup = 'EM_CONFIG_TAG [GroupContextActions deleteGroup ]',
	GroupContextActions_updateGroup = 'EM_CONFIG_TAG [GroupContextActions updateGroup ]',
}
