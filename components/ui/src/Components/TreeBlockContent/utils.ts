import { FiltersTitle } from '../../Containers/ListContainer/types';
import { getOpenFunction } from '../../Shared/Utils/utils';

import { DataExportItem, DataExportParams } from './types';

export function getDataExportItems(
	header: FiltersTitle,
	params: DataExportParams,
): DataExportItem[] {
	const {
		Mode,
		FilterMode,
		FilterStr,
		OrderMode,
		ID_DataServers,
		ID_User,
		reportLinks,
	} = params;

	if (!ID_DataServers) return [];

	switch (header) {
		case FiltersTitle.GROUPS:
			return [
				{
					name: 'Список групп',
					onClick: getOpenFunction(
						`${reportLinks.groupListReportLink}&ID_DataServers=${ID_DataServers}&FilterMode=${FilterMode}&FilterStr=${FilterStr}&Mode=${Mode}&OrderMode=${OrderMode}&ID_User=${ID_User}`,
					),
				},
				{
					name: 'Список групп и используемых ими каналов',
					onClick: getOpenFunction(
						`${reportLinks.groupsAndChannelsListReportLink}&ID_DataServers=${ID_DataServers}&FilterMode=${FilterMode}&FilterStr=${FilterStr}&Mode=${Mode}&OrderMode=${OrderMode}&ID_User=${ID_User}`,
					),
				},
				{
					name: 'Список каналов групп, и групп, использущих эти каналы',
					onClick: getOpenFunction(
						`${reportLinks.channelsAndGroupsUsingThoseChannelsListReportLink}&ID_DataServers=${ID_DataServers}&FilterMode=${FilterMode}&FilterStr=${FilterStr}&Mode=${Mode}&OrderMode=${OrderMode}&ID_User=${ID_User}`,
					),
				},
				{
					name: 'Диапазоны групп аналитиков',
					onClick: getOpenFunction(
						`${reportLinks.analyticRangesReportLink}&ID_User=${ID_User}`,
					),
				},
			];
		case FiltersTitle.DEVICES:
			return [
				{
					name: 'Список приборов',
					onClick: getOpenFunction(
						`${reportLinks.devicesListReportLink}&ID_DataServers=${ID_DataServers}&FilterMode=${FilterMode}&FilterStr=${FilterStr}&Mode=${Mode}&OrderMode=${OrderMode}&ID_User=${ID_User}`,
					),
				},
				{
					name: 'Список приборов, и их каналов',
					onClick: getOpenFunction(
						`${reportLinks.devicesAndChannelsListReportLink}&ID_DataServers=${ID_DataServers}&FilterMode=${FilterMode}&FilterStr=${FilterStr}&Mode=${Mode}&OrderMode=${OrderMode}&ID_User=${ID_User}`,
					),
				},
			];

		case FiltersTitle.UNUSED_CHANNELS:
			return [
				{
					name: 'Список неподключенных каналов',
					onClick: getOpenFunction(
						`${reportLinks.unusedChannelsListReportLink}&ID_DataServers=${ID_DataServers}&OrderMode=${OrderMode}&ID_User=${ID_User}`,
					),
				},
			];
	}
}
