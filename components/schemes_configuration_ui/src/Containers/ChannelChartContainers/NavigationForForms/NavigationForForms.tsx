import React, { useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Button, Tooltip } from '@evraz/ui-kit';
import clsx from 'clsx';
import { useStore } from 'effector-react';

import {
	convertChannelsToTree,
	convertUnconnectedChannelsToTree,
} from '../../../Adapters/Tree/channels';
import LeftArrowIcon from '../../../Icons/ArrowLeft';
import RefreshIcon from '../../../Icons/Refresh';
import { fetchChartData } from '../../../Models/ActiveChannelChart/events';
import { $user } from '../../../Models/Auth';
import { getChannelsListFx } from '../../../Models/Channels/effects';
import { setChannelsActiveNode } from '../../../Models/Channels/events';
import { getDevicesListFx } from '../../../Models/Devices/effects';
import {
	setDevicesActiveNode,
	setDevicesChannelActiveNode,
} from '../../../Models/Devices/events';
import { $navigation } from '../../../Models/Navigation';
import { $navigationHistory } from '../../../Models/NavigationHistory';
import {
	deleteChannelLastRoute,
	deleteDeviceLastRoute,
} from '../../../Models/NavigationHistory/events';
import { toggleServersNode } from '../../../Models/Servers/events';
import { $treeDevices } from '../../../Models/TreeDevices';
import { TooltipDirection, TreeTypes } from '../../../Shared/types';
import { TreeItem } from '../../../UI/Tree/types';
import { updateSearchParams } from '../../../Utils/searchParams';

import NavigationForFormsProps from './types';

import styles from './NavigationForForms.module.css';

function NavigationForForms({ className }: NavigationForFormsProps) {
	const user = useStore($user);
	const { devices: deviceNavigation, channels: channelNavigation } =
		useStore($navigationHistory);
	const { treeType } = useStore($navigation);
	const treeDevices = useStore($treeDevices);
	const [, setSearchParams] = useSearchParams();

	const handleRefreshFormClick = () => {
		fetchChartData();
	};

	const handleBackToPrevFormClick = useCallback(async () => {
		switch (treeType) {
			case TreeTypes.Channels: {
				const prevUrl: URL = new URL(
					channelNavigation[channelNavigation.length - 1],
					window.location.origin,
				);
				const prevSearchParams: URLSearchParams = prevUrl.searchParams;
				const serverId: string | null = prevSearchParams.get('serverId');
				const channelId: string | null = prevSearchParams.get('channelId');

				if (!serverId || !channelId) {
					toast.error('Не могу найти идентификатор сервера либо канала');
					return;
				}
				if (!user) return;
				const { channels } = await getChannelsListFx({
					serverId: Number(serverId),
					searchFrom: String(channelId),
					mode: 3,
					userId: user.preferredUsername,
				});

				if (channels.length > 0) {
					const treeChannels = convertUnconnectedChannelsToTree(channels);
					const foundChannel = treeChannels.find(
						(n) => n.id === Number(channelId),
					);
					if (foundChannel) {
						setChannelsActiveNode(foundChannel as unknown as TreeItem);
						deleteChannelLastRoute();
						const updatedSearchParams = updateSearchParams(
							new URLSearchParams(),
							{
								treeType,
								serverId,
								channelId,
							},
						);
						setSearchParams(updatedSearchParams);
					}
				}
				break;
			}
			case TreeTypes.Devices: {
				const prevUrl: URL = new URL(
					deviceNavigation[deviceNavigation.length - 1],
					window.location.origin,
				);
				const prevSearchParams: URLSearchParams = prevUrl.searchParams;
				const serverId: string | null = prevSearchParams.get('serverId');
				const channelId: string | null = prevSearchParams.get('channelId');
				const deviceId: string | null = prevSearchParams.get('deviceId');

				if (!user) return;
				const { channels } = await getChannelsListFx({
					serverId: Number(serverId),
					deviceId: Number(deviceId),
					searchFrom: channelId ? String(channelId) : null,
					mode: 1,
					userId: user.preferredUsername,
				});
				if (channels.length > 0) {
					const treeChannels = convertChannelsToTree(channels);
					const foundChannel = treeChannels.find(
						(n) => n.id === Number(channelId),
					);
					if (foundChannel) {
						const server = treeDevices.find(
							(node) => node.id === Number(serverId),
						);
						if (server) {
							if (!server.isOpen) toggleServersNode(server);

							if (!user) return;
							getDevicesListFx({
								serverId: Number(serverId),
								pageNumber: 1,
								userId: user.preferredUsername,
							});
						}
						const device = treeDevices.find(
							(node) => node.id === Number(deviceId),
						);
						if (device) {
							setDevicesActiveNode(device as unknown as TreeItem);
							setDevicesChannelActiveNode(foundChannel);
							deleteDeviceLastRoute();
							const updatedSearchParams = updateSearchParams(
								new URLSearchParams(),
								{
									treeType,
									serverId: serverId || 0,
									deviceId: deviceId || 0,
									channelId: channelId || 0,
								},
							);
							setSearchParams(updatedSearchParams);
						}
					}
				}
			}
		}
	}, [treeType, channelNavigation, user, deviceNavigation, treeDevices]);

	const isBackToPrevBtnDisabled = () => {
		switch (treeType) {
			case TreeTypes.Devices: {
				return deviceNavigation.length < 1;
			}
			case TreeTypes.Channels: {
				return channelNavigation.length < 1;
			}
			default:
				return true;
		}
	};

	return (
		<div className={clsx(styles.root, className)}>
			<Tooltip
				tooltip="Обновить график"
				direction={TooltipDirection.Down}
				className={styles.tooltip}
			>
				<Button
					className={styles.item}
					onClick={handleRefreshFormClick}
					key={'refresh-channel'}
				>
					<RefreshIcon className={styles.icon} />
				</Button>
			</Tooltip>
			<Tooltip
				tooltip="Шаг назад"
				direction={TooltipDirection.Down}
				className={styles.tooltip}
			>
				<Button
					className={styles.item}
					onClick={handleBackToPrevFormClick}
					disabled={isBackToPrevBtnDisabled()}
					key={'back-to-prev-channel'}
				>
					<LeftArrowIcon className={styles.icon} />
				</Button>
			</Tooltip>
		</div>
	);
}

export default NavigationForForms;
