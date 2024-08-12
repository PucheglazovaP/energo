import React, {
	Dispatch,
	MouseEventHandler,
	ReactNode,
	SetStateAction,
} from 'react';

import {
	CHANNEL,
	DEVICE,
	FORWARD_TREE,
	GROUP,
	REVERSE_TREE,
	SERVER,
	UNUSED_CHANNELS_TREE,
} from '../Const';
import { FiltersTitle } from '../Containers/ListContainer/types';

import { ContextMenuType, SetContextMenuType } from './ContextMenuTypes';

export type GroupsListItemType = {
	ActiveFormula: boolean;
	ChannelsCount: number;
	FK_DataServers: number;
	FK_Methods: number;
	FK_TypesStorage: number;
	Formula: boolean;
	LastModified: string;
	Method_Name: string;
	Name: string;
	Number: number;
	Number_EWork: number | null;
	RowNumber: number;
	TypesStorage_Name: string;
	Unit_ID: number;
	Unit_Name: string;
	isFavorite: boolean;
	CanEdit: number;
};

export type ServersListItemType = {
	Comment: string;
	FQDN: string;
	ID: number;
	IP: string;
	LastModified: string;
	TextName: string;
	User_ID: string;
	HaveDevices: number;
	HaveGroups: number;
	HaveUnConnCh: number;
};

export type ChannelsListItemType = {
	Number: number;
	Name: string;
	FK_DataServers: number;
	FK_Devices: number;
	LastModified: string;
	Unit_ID: number;
	Unit_Name: string;
	FK_Methods: number;
	Method_Name: string;
	FK_TypeStorage: number;
	TypesStorage_Name: string;
	GroupsList: number[];
	KoefList: string[];
	isFavorite: boolean;
	RowNumber: number;
};

export type ChannelsListActionPayloadType = ChannelsListItemType & {
	GroupsList: string | null;
	KoefList: string | null;
};

export type DevicesListItemType = {
	Number: number;
	Name: string;
	FK_DataServers: number;
	LastModified: string;
	Comment: string;
	ChannelsCount: number;
	ChannelsList: string;
	isFavorite: boolean;
	RowNumber: number;
};

export interface Button {
	title: string;
}
export interface ContentHeader {
	title: FiltersTitle;
	buttons: Button[];
}
export type RenderHeaderProps = ({
	number,
	eWorkNumber,
	onClick,
	headerType,
	treeType,
}: TreeHeadersProps) => ReactNode;

export type TreeType =
	| typeof FORWARD_TREE
	| typeof REVERSE_TREE
	| typeof UNUSED_CHANNELS_TREE;

export type TreeItemType =
	| typeof GROUP
	| typeof DEVICE
	| typeof CHANNEL
	| typeof SERVER;

export interface ParameterItem {
	parameterType: TreeItemType;
	parameterId: number;
}

export type UpdateElementsListParamsType = {
	fkNumber: number;
	itemType: TreeItemType;
	treeType: TreeType;
	serverId: number | null;
};

interface RootTreeItemProps {
	number: number;
	eWorkNumber?: number | null;
	title?: string;
	count?: number;
	isFavourite?: boolean;
	hasFormula?: boolean;
	activeFormula?: boolean;
	coefficient?: string;
	isDropdownDisabled?: boolean;
	isIncluded?: boolean;
	treeType: TreeType;
	setContextMenu?: SetContextMenuType;
	contextMenuType?: ContextMenuType;
	currentParent?: number;
	serverId: number | null;
	updateElementsLists?: ({
		fkNumber,
		itemType,
		treeType,
		serverId,
	}: UpdateElementsListParamsType) => void;
	renderChildren?: boolean;
}

export interface TreeItemProps extends RootTreeItemProps {
	treeItemType: TreeItemType;
	className?: string;
	style?: Record<string, string>;
	children?: JSX.Element[];
	renderHeader?: RenderHeaderProps;
	onClick?: MouseEventHandler;
}
export interface TreeHeadersProps extends RootTreeItemProps {
	headerType: TreeItemType;
	onClick: MouseEventHandler | undefined;
	isTreeItemActive: boolean;
	setTreeItemActive: Dispatch<SetStateAction<boolean>>;
}

export type TreePropsType = {
	serversList: ServersListItemType[];
	groupsList: GroupsListItemType[];
	channelsList: ChannelsListItemType[];
	devicesList: DevicesListItemType[];
	onClick: React.MouseEventHandler<HTMLButtonElement>;
	setContextMenu: SetContextMenuType;
};

export enum ReportLinkType {
	GroupList = 12,
	GroupsAndChannelsList = 13,
	ChannelsAndGroupsUsingThoseChannelsList = 14,
	AnalyticRanges = 15,
	DevicesList = 16,
	DevicesAndChannelsList = 17,
	UnusedChannelsList = 18,
}
export type ReportLinks = {
	groupListReportLink: string;
	groupsAndChannelsListReportLink: string;
	channelsAndGroupsUsingThoseChannelsListReportLink: string;
	analyticRangesReportLink: string;
	devicesListReportLink: string;
	devicesAndChannelsListReportLink: string;
	unusedChannelsListReportLink: string;
};
