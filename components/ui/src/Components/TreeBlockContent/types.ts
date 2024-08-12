import { ContentHeader, ReportLinks } from '../../Types';

export interface BlockHeaderProps {
	filterHeader: ContentHeader;
	isListFetching: boolean;
}

export interface DataExportItem {
	name: string;
	onClick?: () => void;
}

export interface DataExportParams {
	ID_DataServers: number | null;
	FilterMode: number;
	FilterStr: string | null;
	Mode: number;
	OrderMode: number;
	ID_User?: string | null;
	reportLinks: ReportLinks;
}

export enum ExportMenuItems {
	GroupsList = 'Список%20групп',
	GroupsAndChannelsList = 'Список%20групп%20и%20используемых%20ими%20каналов',
	ChannelsAndGroupsUsingThoseChannelsList = 'Список%20каналов%20групп%20и%20групп%20использующих%20эти%20каналы',
	AnalyticRanges = 'Диапазоны%20номеров%20групп',
	DevicesList = 'Список%20приборов',
	DevicesAndChannelsList = 'Список%20приборов%20и%20их%20каналов',
	UnusedChannelsList = 'Список%20неподключенных%20каналов',
}

export enum ReportServerEntity {
	Monitoring = 'Мониторинг',
	Configurator = 'Конфигуратор%20тегов',
}
