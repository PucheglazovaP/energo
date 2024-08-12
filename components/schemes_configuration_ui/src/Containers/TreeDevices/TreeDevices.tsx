import React, {
	MouseEvent,
	useCallback,
	useEffect,
	useLayoutEffect,
	useMemo,
	useRef,
	useState,
} from 'react';
import { useLocation, useSearchParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useStore } from 'effector-react';

import { formattedNSITypes } from '../../Adapters/nodeItems/utils';
import { convertChannelsToTree } from '../../Adapters/Tree/channels';
import {
	convertDevicesToTree,
	convertDeviceToTree,
} from '../../Adapters/Tree/devices';
import { NodeItemsActions } from '../../Const/Queries/nodeItems/types';
import useDebounce from '../../Facades/useDebouce';
import useOptimizedPagination from '../../Facades/useOptimizedPagination';
import AngleDown from '../../Icons/AngleDown';
import { fetchChannelChartById } from '../../Models/ActiveChannelChart/events';
import { $user } from '../../Models/Auth';
import { getChannelsListFx } from '../../Models/Channels/effects';
import { clearChannelsList } from '../../Models/Channels/events';
import { $devices } from '../../Models/Devices';
import { getDevicesListFx } from '../../Models/Devices/effects';
import {
	clearDevicesList,
	clearDevicesPagination,
	openDeviceById,
	rollupDevicesNodes,
	setDevicesActiveNode,
	toggleDevicesNode,
} from '../../Models/Devices/events';
import { Device } from '../../Models/Devices/types';
import { $devicesSearch } from '../../Models/DevicesSearch';
import {
	setSearchOptions,
	setSearchValue,
} from '../../Models/DevicesSearch/events';
import { $navigation } from '../../Models/Navigation';
import { changeDeviceRoute } from '../../Models/NavigationHistory/events';
import { $nodeItems } from '../../Models/NodeItems';
import { getNodeItemsListFx } from '../../Models/NodeItems/effects';
import {
	clearNodeItemsList,
	toggleNodeItemsActiveNode,
} from '../../Models/NodeItems/events';
import { getNodesListFx } from '../../Models/Nodes/effects';
import {
	clearNodesList,
	toggleNodesActiveNode,
} from '../../Models/Nodes/events';
import {
	$areDevicesNotFound,
	$nsiParametersExtendedFilterStr,
	$nsiTreeDevices,
} from '../../Models/NSITreeDevices';
import { getAvailableFiltersNSIFx } from '../../Models/NSITreeDevices/effects';
import { clearNSIParameterFilters } from '../../Models/NSITreeDevices/events';
import { $servers } from '../../Models/Servers';
import { getServersListFx } from '../../Models/Servers/effects';
import {
	resetServersModel,
	rollupServersNodes,
	selectActiveServer,
	setActiveServer,
} from '../../Models/Servers/events';
import { $treeDevices } from '../../Models/TreeDevices';
import { OptimizedPagination } from '../../Shared/types';
import { ModuleName } from '../../Shared/Types/moduleName';
import InputWithSelect from '../../UI/InputWithSelect/InputWithSelect';
import { SelectOption } from '../../UI/Select/types';
import Tree from '../../UI/Tree';
import { ActiveNode, TreeItem } from '../../UI/Tree/types';
import WarningMessage from '../../UI/WarningMessage';
import { updateSearchParams } from '../../Utils/searchParams';

import { TreeDevicesProps } from './types';
import {
	getInputTooltipTextBySelectedFilterMode,
	getSelectTooltipTextBySelectedFilterMode,
} from './utils';

import styles from './TreeDevices.module.css';

function TreeDevices({
	className,
	containerName,
	onTreeItemClick,
	onTreeItemContextMenu,
}: TreeDevicesProps) {
	const user = useStore($user);
	const tree = useStore(
		containerName === 'nsi' ? $nsiTreeDevices : $treeDevices,
	);
	const areDevicesNotFound = useStore($areDevicesNotFound);
	const nsiParametersExtendedFilterStr = useStore(
		$nsiParametersExtendedFilterStr,
	);
	const search = useStore($devicesSearch);
	const filterStr =
		containerName === 'nsi' ? nsiParametersExtendedFilterStr : '';
	const isNotFoundMessageShown: boolean =
		containerName === 'nsi' && areDevicesNotFound;
	const {
		pagination,
		list: devicesList,
		activeNode: activeInDeviceTree,
	} = useStore($devices);
	const { list: serversList } = useStore($servers);
	const { list: nodeItemsList } = useStore($nodeItems);
	const { serverId, channelId, deviceId, nodeId, nodeItemId } =
		useStore($navigation);

	const [prevPagination, setPrevPagination] =
		useState<OptimizedPagination>(pagination);
	const [prevDevicesList, setPrevDevicesList] = useState<Device[]>(devicesList);
	const [lastPositionNode, setLastPositionNode] = useState<TreeItem>();

	const [searchParams, setSearchParams] = useSearchParams();
	const location = useLocation();

	const treeRef = useRef<HTMLDivElement | null>(null);
	const inputRef = useRef<HTMLInputElement | null>(null);
	const filterMode = useMemo(() => {
		const selectedOption = search.options.find((opt) => opt.isSelected);
		if (selectedOption) {
			return Number(selectedOption.value);
		}
		return undefined;
	}, [search.options]);

	const activeServer = useMemo(() => {
		const activeServer = serversList.find((server) => server.id === serverId);
		return activeServer;
	}, [serversList, serverId]);

	const inputTooltipText = getInputTooltipTextBySelectedFilterMode(
		filterMode || 1,
	);
	const selectTooltipText = getSelectTooltipTextBySelectedFilterMode(
		filterMode || 1,
	);

	const isAncestor = useCallback(
		(nodeId: number, nodeType?: string) => {
			return tree.some((node) => {
				if (nodeType) {
					return node.parentId === nodeId && node.parentType === nodeType;
				}
				return node.parentId === nodeId;
			});
		},
		[tree],
	);

	// Update search params when node is clicked
	// SIDE EFFECT: update navigation with formType
	const onNodeClick = (node: TreeItem) => {
		if (onTreeItemClick) {
			onTreeItemClick(node);
		}

		const stringifiedId: string = String(node.id);

		let updatedSearchParams: URLSearchParams = new URLSearchParams(
			searchParams,
		);

		if (node.type === 'server') {
			updatedSearchParams = updateSearchParams(updatedSearchParams, {
				serverId: stringifiedId,
				deviceId: undefined,
				nodeId: undefined,
				nodeItemId: undefined,
				channelId: undefined,
			});
		}
		if (node.type === 'device') {
			updatedSearchParams = updateSearchParams(updatedSearchParams, {
				serverId: node.parentId,
				deviceId: stringifiedId,
				nodeId: undefined,
				nodeItemId: undefined,
				channelId: undefined,
			});
		}

		if (node.type === 'node') {
			const device = devicesList.find((device) => device.id === node.parentId);

			updatedSearchParams = updateSearchParams(updatedSearchParams, {
				serverId: device?.serverId,
				deviceId: node.parentId,
				nodeId: stringifiedId,
				nodeItemId: undefined,
				channelId: undefined,
			});
		}

		if (
			node.type === 'accounting_node' ||
			node.type === 'channels' ||
			node.type === 'nsi_channel' ||
			node.type === 'channel_groups' ||
			node.type === 'channel_group' ||
			node.type === 'equipment_pieces' ||
			node.type === 'equipment_piece'
		) {
			const selectedNodeItem = nodeItemsList.find((NSINodeItem) => {
				return NSINodeItem.id === node.id;
			});

			updatedSearchParams = updateSearchParams(updatedSearchParams, {
				serverId: selectedNodeItem?.serverId,
				deviceId: selectedNodeItem?.deviceId,
				nodeId: selectedNodeItem?.nodeId,
				nodeItemId: stringifiedId,
				channelId: undefined,
			});
		}

		if (node.type === 'channel') {
			changeDeviceRoute(location.pathname + location.search);
			const device = devicesList.find((device) => device.id === node.parentId);
			updatedSearchParams = updateSearchParams(updatedSearchParams, {
				serverId: device?.serverId,
				deviceId: String(node.parentId),
				channelId: stringifiedId,
			});
		}
		setSearchParams(updatedSearchParams);
	};

	const onNodeContextMenu = (evt: MouseEvent, id: number, node: TreeItem) => {
		if (onTreeItemContextMenu) {
			onTreeItemContextMenu(evt, node);
		}
	};

	const activeNode: ActiveNode | undefined = useMemo(() => {
		if (activeInDeviceTree)
			return {
				id: activeInDeviceTree.id,
				type: activeInDeviceTree.type,
			};
		if (nodeItemId !== undefined) {
			const selectedNodeItem = nodeItemsList.find((NSINodeItem) => {
				return NSINodeItem.id === nodeItemId;
			});

			return {
				id: nodeItemId,
				type: selectedNodeItem
					? formattedNSITypes[selectedNodeItem.type]
					: 'node',
			};
		}

		if (nodeId !== undefined) {
			return {
				id: nodeId,
				type: 'node',
			};
		}

		if (channelId) return { id: channelId, type: 'channel' };
		if (deviceId) return { id: deviceId, type: 'device' };
		if (serverId) return { id: serverId, type: 'server' };

		return undefined;
	}, [
		serverId,
		deviceId,
		channelId,
		nodeId,
		nodeItemId,
		nodeItemsList,
		activeInDeviceTree,
	]);

	const onSearchChange = useCallback(
		async (evt: React.ChangeEvent<HTMLInputElement>) => {
			const id: string = evt.target.value;
			setSearchValue(evt.target.value);
			clearDevicesPagination();
			if (containerName === 'nsi') clearNSIParameterFilters();
			if (!user) return;
			const { devices, pagination: devicesPagination } = await getDevicesListFx(
				{
					filterStr: id,
					filterMode: filterMode,
					serverId: activeServer?.id,
					pageNumber: 1,
					userId: user.preferredUsername,
				},
			);

			if (!devicesPagination.positionRow && id) {
				toast.warn(
					'Прибор или канал не найден. Попробуйте поискать в другом дереве',
				);
			} else {
				const treeDevices = convertDevicesToTree(devices);
				const foundNode = devices.find(
					(n) => n.order === devicesPagination.positionRow,
				);
				if (foundNode) {
					toggleDevicesNode(foundNode as unknown as TreeItem);
					const foundDevice = treeDevices.find(
						(n) => n.order === devicesPagination.positionRow,
					);
					if (filterMode === 1 || filterMode === 2)
						setDevicesActiveNode(foundDevice);
					// временно убрала условие для теста
					// to do выяснить зачем это условие
					/* 					if (!tree.some((n) => n.parentId === foundNode.id)) { */
					const { channels } = await getChannelsListFx({
						serverId: foundNode.serverId,
						deviceId: foundNode.id,
						operation: 'set',
						userId: user.preferredUsername,
					});
					const treeChannels = convertChannelsToTree(channels);
					const foundChannel = treeChannels.find((n) => n.id === Number(id));
					if (foundChannel) {
						setDevicesActiveNode(foundChannel);
					}
					/* 					} */
				}
			}
		},
		[user, filterMode, activeServer, containerName],
	);

	const debouncedOnSearchChange = useDebounce(onSearchChange, 1000);

	const onSearchSelect = useCallback(
		async (options: SelectOption[]) => {
			setSearchOptions(options);
			setSearchValue('');
			if (inputRef && inputRef.current) {
				inputRef.current.value = '';
			}
			clearDevicesPagination();
			if (containerName === 'nsi') clearNSIParameterFilters();
			if (!user) return;
			const { devices, pagination: devicesPagination } = await getDevicesListFx(
				{
					filterMode: filterMode,
					serverId: activeServer?.id,
					pageNumber: 1,
					userId: user.preferredUsername,
				},
			);
			const adaptedDevices = convertDevicesToTree(devices);

			const device = adaptedDevices.find(
				(device) => device.order === devicesPagination.positionRow,
			);
			if (device) {
				setDevicesActiveNode(device);
				getChannelsListFx({
					serverId: activeServer?.id,
					deviceId: device.id,
					userId: user.preferredUsername,
				});
			}
		},
		[user, filterMode, activeServer],
	);

	const fetchDevicesList = useCallback(
		(pagination: OptimizedPagination) => {
			if (!user) return;
			if (filterStr) {
				getDevicesListFx({
					serverId: activeServer?.id,
					pageNumber: pagination.pageNumber,
					userId: user.preferredUsername,
					filterMode: 1,
					filterStr,
				});
			} else {
				getDevicesListFx({
					serverId: activeServer?.id,
					pageNumber: pagination.pageNumber,
					userId: user.preferredUsername,
					filterMode: filterMode || 1,
					filterStr: search.value,
				});
			}
		},
		[activeServer, user, filterStr, filterMode, search.value],
	);

	const onToggleNode = useCallback(
		async (node: TreeItem) => {
			if (node.type === 'server') {
				if (!node.isOpen) {
					onNodeClick(node);
					selectActiveServer(node.id);
				} else selectActiveServer(node.id);
			}

			if (node.type === 'device') {
				toggleDevicesNode(node);

				if (!isAncestor(node.id)) {
					if (containerName === 'nsi') {
						if (!user) return;
						const nodes = await getNodesListFx({
							deviceId: node.id,
							action: 'add',
							userId: user.preferredUsername,
							moduleName: ModuleName.TreeDevices_getNodesListFx,
						});

						if (!nodes.length) {
							toast.warn('В данном приборе нет узлов учета');
						}
					} else {
						if (!user) return;
						const { channels } = await getChannelsListFx({
							serverId: node.parentId,
							deviceId: node.id,
							operation: 'add',
							userId: user.preferredUsername,
						});

						if (!channels.length) {
							toast.warn('В данном приборе нет подключенных каналов');
						}
					}
				}
			}

			if (node.type === 'node') {
				toggleNodesActiveNode(node);

				if (!isAncestor(node.id, node.type)) {
					if (user !== null) {
						const nodeItems = await getNodeItemsListFx({
							nodeId: node.id,
							action: NodeItemsActions.Add,
							userId: user.preferredUsername,
							moduleName: ModuleName.TreeDevices_getNodeItemsListFx,
						});

						if (!nodeItems.length) {
							toast.warn('В данном узле нет каналов и оборудования');
						}
					}
				}
			}

			if (
				node.type === 'accounting_node' ||
				node.type === 'channels' ||
				node.type === 'nsi_channel' ||
				node.type === 'channel_groups' ||
				node.type === 'equipment_pieces'
			) {
				toggleNodeItemsActiveNode(node);
			}
		},
		[containerName, isAncestor, user, location],
	);

	const onRollup = useCallback(() => {
		rollupServersNodes();
		rollupDevicesNodes();
		setDevicesActiveNode(undefined);
		const updatedSearchParams: URLSearchParams = updateSearchParams(
			searchParams,
			{
				serverId: undefined,
				deviceId: undefined,
				channelId: undefined,
			},
		);
		setSearchParams(updatedSearchParams);
	}, [searchParams]);

	const { onScroll } = useOptimizedPagination(
		treeRef,
		pagination,
		fetchDevicesList,
	);

	useEffect(() => {
		if (!serversList.length) {
			if (!user) return;
			getServersListFx(user.preferredUsername).then((servers) => {
				const serverId: string | null = searchParams.get('serverId');
				if (serverId) {
					setActiveServer(Number(serverId));
				} else {
					const fetchedServerId: number = servers[0].id;
					const updatedSearchParams: URLSearchParams = updateSearchParams(
						searchParams,
						{ serverId: fetchedServerId },
					);
					setSearchParams(updatedSearchParams);
					setActiveServer(fetchedServerId);
				}
			});
		}
	}, [serversList, user]);

	// When server id is changed:
	// 1. set active server id;
	// 2. clear devices pagination;
	// 3. fetch devices list for this server;
	// 4. If device id exist, open this device;
	// 5. If channel id exist, fetch data for this channel.
	useEffect(() => {
		setActiveServer(Number(serverId));
		clearDevicesPagination();
		if (!user) return;
		getDevicesListFx({
			serverId: serverId,
			pageNumber: 1,
			filterStr: deviceId ? String(deviceId) : filterStr || undefined,
			userId: user.preferredUsername,
		}).then(() => {
			if (deviceId) {
				openDeviceById(Number(deviceId));
			}
			if (channelId) {
				fetchChannelChartById(channelId);
			}
		});
	}, [serverId, user]);

	// When device id is changed:
	// 1. open it in the tree;
	// 2. add route for device navigation;
	// 3. fetch channels for this device
	useEffect(() => {
		if (deviceId) {
			openDeviceById(Number(deviceId));

			if (!isAncestor(deviceId)) {
				if (containerName === 'nsi') {
					if (!user) return;
					getNodesListFx({
						deviceId,
						action: 'add',
						userId: user.preferredUsername,
						moduleName: ModuleName.TreeDevices_getNodesListFx,
					}).then((nodes) => {
						if (!nodes.length) {
							toast.warn('В данном приборе нет узлов учета');
						}
					});
				} else {
					if (!user) return;
					getChannelsListFx({
						serverId: serverId,
						deviceId: deviceId,
						operation: 'set',
						userId: user.preferredUsername,
					}).then(({ channels }) => {
						if (!channels.length) {
							toast.warn('В данном приборе нет подключенных каналов');
						}
					});
				}
			}
		}
	}, [deviceId, user]);

	// When channel id is changed - add route for device navigation
	useEffect(() => {
		if (channelId) {
			fetchChannelChartById(channelId);
		}
	}, [channelId]);

	useEffect(() => {
		return () => {
			clearDevicesList();
			clearDevicesPagination();
			clearChannelsList();
			resetServersModel();
			clearNodesList();
			clearNodeItemsList();
		};
	}, []);
	useEffect(() => {
		if (user) {
			getAvailableFiltersNSIFx({
				userId: user.preferredUsername,
				moduleName: ModuleName.TreeDevices_getAvailableFiltersNSIFx,
			});
		}
	}, [user]);

	/**
	 * Position on node that was before pagination nor received
	 * from request (positionRow)
	 */
	useLayoutEffect(() => {
		if (pagination.positionRow) {
			const device = devicesList.find(
				(device) => device.order === pagination.positionRow,
			);
			if (!device) {
				setLastPositionNode(undefined);
				return;
			}
			const node = convertDeviceToTree(device);
			setLastPositionNode(node);
		} else {
			if (pagination.pageNumber > prevPagination.pageNumber) {
				let lastNode: TreeItem | undefined;
				const lastDevice = prevDevicesList[prevDevicesList.length - 1];
				if (!lastDevice) {
					setLastPositionNode(lastNode);
					return;
				}
				lastNode = convertDeviceToTree(lastDevice);
				setLastPositionNode(lastNode);
			}
			if (pagination.pageNumber < prevPagination.pageNumber) {
				let firstNode: TreeItem | undefined;
				const firstDevice = prevDevicesList[0];
				if (!firstDevice) {
					setLastPositionNode(firstNode);
					return;
				}
				firstNode = convertDeviceToTree(firstDevice);
				setLastPositionNode(firstNode);
			}
			if (pagination.pageNumber === prevPagination.pageNumber) {
				setLastPositionNode(undefined);
			}
		}
		setPrevPagination(pagination);
		setPrevDevicesList(devicesList);
	}, [devicesList, pagination]);

	if (isNotFoundMessageShown && containerName == 'nsi') {
		return (
			<WarningMessage text="Нет приборов, удовлетворяющих выбранным фильтрам" />
		);
	}

	return (
		<div className={`${styles.devices} ${className || ''}`}>
			<div className={styles.search}>
				<button onClick={onRollup} className={styles.rollup}>
					<AngleDown />
				</button>
				<InputWithSelect
					onChange={debouncedOnSearchChange}
					options={search.options}
					onSelect={onSearchSelect}
					className={styles.search}
					isDisabled={!activeServer}
					ref={inputRef}
					tooltipTextForSelector={selectTooltipText}
					tooltipTextForInput={inputTooltipText}
				/>
			</div>
			<div className={styles.tree} ref={treeRef} onScroll={onScroll}>
				<Tree
					treeData={tree}
					onItemClick={onNodeClick}
					onExpand={onToggleNode}
					onContextMenu={onNodeContextMenu}
					activeNode={activeNode}
					lastPositionNode={lastPositionNode}
					withExpand
				/>
			</div>
		</div>
	);
}

export default TreeDevices;
