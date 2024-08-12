import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useStore } from 'effector-react';

import ButtonToggleSideBar from '../../Containers/ButtonToggleSideBar';
import { $user } from '../../Models/Auth';
import { $devices } from '../../Models/Devices';
import { getDevicesListFx } from '../../Models/Devices/effects';
import { openModal } from '../../Models/Modal/events';
import { setNavigation } from '../../Models/Navigation/events';
import { setSelectedUnit } from '../../Models/NSISelectedUnit/events';
import {
	$nsiCurrentAvailableFilters,
	$nsiParametersExtendedFilterStr,
} from '../../Models/NSITreeDevices';
import { setNSICurrentObjectType } from '../../Models/NSITreeDevices/events';
import { $sidebar } from '../../Models/Sidebar';
import { Permissions } from '../../packages/KeycloakInstance/types';
import usePermissions from '../../packages/KeycloakInstance/usePermissions';
import { checkPermission } from '../../packages/KeycloakInstance/utils';
import { RegisteredModals } from '../../Shared/modalsConfig';
import { SearchParameters } from '../../Shared/types';
import { TreeItem } from '../../UI/Tree/types';

import { $pageNSIModel } from './model';

import styles from './PageNSI.module.css';
function usePageNSI() {
	const navigate = useNavigate();
	const extendedFilters: TreeItem[] | null = useStore(
		$nsiCurrentAvailableFilters,
	);
	const nsiParametersExtendedFilterStr = useStore(
		$nsiParametersExtendedFilterStr,
	);
	const user = useStore($user);
	const { pagination } = useStore($devices);
	const areDevicesLoading = useStore(getDevicesListFx.pending);
	const sidebar = useStore($sidebar);
	const { nodesList, nodeItemsList } = useStore($pageNSIModel);
	const permissions = usePermissions();
	const hasNSIReadingPermission: boolean = checkPermission(
		permissions,
		Permissions.CanAccessNSIPage,
	);

	const [searchParams] = useSearchParams();

	const [selectedUnitTitle, setSelectedUnitTitle] = useState<string | null>(
		null,
	);

	const handleFilterButtonClick = () => {
		openModal(RegisteredModals.TreeNSIExtendedFilters);
	};
	const handleRefreshButtonClick = () => {
		if (user) {
			const paramServerId = searchParams.get(SearchParameters.ServerId);
			const serverId = paramServerId ? Number(paramServerId) : undefined;

			if (nsiParametersExtendedFilterStr) {
				getDevicesListFx({
					serverId,
					pageNumber: pagination.pageNumber,
					userId: user.preferredUsername,
					filterMode: 1,
					filterStr: nsiParametersExtendedFilterStr,
				});
			} else {
				getDevicesListFx({
					serverId,
					pageNumber: pagination.pageNumber,
					userId: user.preferredUsername,
				});
			}
		}
	};

	const renderTitleLeftFn = () => {
		return (
			<div className={styles.top_section}>
				<ButtonToggleSideBar className={styles.toggle_sidebar_btn} />
				НСИ
				{selectedUnitTitle !== null ? (
					<p className={styles.breadcrumb}>{selectedUnitTitle}</p>
				) : null}
			</div>
		);
	};
	const handleTreeItemClick = (treeItem: TreeItem) => {
		setNSICurrentObjectType(treeItem.type || '');

		if (treeItem.type !== 'server') {
			const unitBreadcrumb = `/ ${treeItem.displayName}`;

			if (selectedUnitTitle === null || selectedUnitTitle !== unitBreadcrumb) {
				setSelectedUnitTitle(unitBreadcrumb);
			}
		} else {
			setSelectedUnit(null);
			setSelectedUnitTitle(null);
		}

		if (
			treeItem.type === 'channels' ||
			treeItem.type === 'channel_groups' ||
			treeItem.type === 'equipment_pieces'
		) {
			setSelectedUnit(null);
		}

		if (treeItem.type === 'device') {
			setSelectedUnit({
				itemNumber: String(treeItem.id),
				typeId: 2,
			});
		}

		if (treeItem.type === 'node') {
			const nodeData = nodesList.find((node) => {
				return node.id === treeItem.id;
			});

			if (nodeData) {
				setSelectedUnit({
					itemNumber: String(nodeData.id),
					typeId: nodeData.typeId,
				});
			}
		}

		if (
			treeItem.type === 'accounting_node' ||
			treeItem.type === 'nsi_channel' ||
			treeItem.type === 'channel_group' ||
			treeItem.type === 'equipment_piece'
		) {
			const nodeItemData = nodeItemsList.find((nodeItem) => {
				return nodeItem.id === treeItem.id;
			});

			if (nodeItemData) {
				setSelectedUnit({
					itemNumber: nodeItemData.itemNumber ?? '',
					typeId: nodeItemData.typeId,
				});
			}
		}
	};

	const isFilterButtonDisabled = extendedFilters === null;

	useEffect(() => {
		if (!hasNSIReadingPermission) {
			navigate('/');
		}
	}, [hasNSIReadingPermission]);

	useEffect(() => {
		return () => {
			setSelectedUnit(null);
		};
	}, []);

	useEffect(() => {
		const paramDeviceId = searchParams.get(SearchParameters.DeviceId);
		const deviceId = paramDeviceId ? Number(paramDeviceId) : undefined;

		const paramChannelId = searchParams.get(SearchParameters.ChannelId);
		const channelId = paramChannelId ? Number(paramChannelId) : undefined;

		const paramServerId = searchParams.get(SearchParameters.ServerId);
		const serverId = paramServerId ? Number(paramServerId) : undefined;

		const paramNodeId = searchParams.get(SearchParameters.NodeId);
		const nodeId = paramNodeId !== null ? Number(paramNodeId) : undefined;

		const paramNodeItemId = searchParams.get(SearchParameters.NodeItemId);
		const nodeItemId =
			paramNodeItemId !== null ? Number(paramNodeItemId) : undefined;

		setNavigation({
			channelId,
			serverId,
			deviceId,
			nodeId,
			nodeItemId,
		});
	}, [searchParams]);

	return {
		sidebar,
		isFilterButtonDisabled,
		areDevicesLoading,
		renderTitleLeftFn,
		handleTreeItemClick,
		handleFilterButtonClick,
		handleRefreshButtonClick,
	};
}

export default usePageNSI;
