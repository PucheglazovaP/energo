import React, {
	useCallback,
	useEffect,
	useLayoutEffect,
	useMemo,
	useRef,
	useState,
} from 'react';
import { toast } from 'react-toastify';
import { useStore } from 'effector-react';

import { convertChannelsToTreeModal } from '../../Adapters/Tree/channelsModal';
import {
	convertDevicesToTree,
	convertDeviceToTree,
} from '../../Adapters/Tree/devices';
import useDebounce from '../../Facades/useDebouce';
import useOptimizedPagination from '../../Facades/useOptimizedPagination';
import { Filter } from '../../Icons';
import AngleDown from '../../Icons/AngleDown';
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
import { $servers } from '../../Models/Servers';
import { getServersListFx } from '../../Models/Servers/effects';
import {
	resetServersModel,
	rollupServersNodes,
	setActiveServer,
} from '../../Models/Servers/events';
import {
	$treeDevicesModal,
	$treePickableDevices,
} from '../../Models/TreeDevicesModal';
import { $treeModal } from '../../Models/TreeModal';
import { setTreeModal } from '../../Models/TreeModal/events';
import { TreeModal } from '../../Models/TreeModal/types';
import { OptimizedPagination, TreeTypes } from '../../Shared/types';
import InputWithSelect from '../../UI/InputWithSelect/InputWithSelect';
import MultiselectDropdown from '../../UI/MultiselectDropdown';
import { SelectOption } from '../../UI/Select/types';
import Tree from '../../UI/Tree';
import { ActiveNode, TreeItem } from '../../UI/Tree/types';

import { FilterMethodOption, SelectedFilterMethodOption } from './types';

import styles from './PointChannelsTreeModal.module.css';

type PointDevicesTreeProps = {
	mappedBy?: TreeTypes;
};

function PointDevicesTree(props: PointDevicesTreeProps) {
	const { mappedBy = TreeTypes.Channels } = props;
	const user = useStore($user);
	const tree = useStore(
		mappedBy === TreeTypes.Channels ? $treeDevicesModal : $treePickableDevices,
	);
	const { pagination, list: devicesList } = useStore($devices);
	const { list: serversList } = useStore($servers);
	const search = useStore($devicesSearch);
	const { serverId, channelId, deviceId } = useStore($treeModal);

	const [prevPagination, setPrevPagination] =
		useState<OptimizedPagination>(pagination);
	const [prevDevicesList, setPrevDevicesList] = useState<Device[]>(devicesList);
	const [lastPositionNode, setLastPositionNode] = useState<TreeItem>();

	const [methodOptions, setMethodOptions] = useState<FilterMethodOption[]>([
		{ name: 'Сумма', key: '1', isChecked: true },
		{ name: 'Среднее', key: '2', isChecked: true },
		{ name: 'Текущее', key: '3', isChecked: true },
	]);

	// Выбранные опции фильтра метода канала
	const [selectedMethodOptions, setSelectedMethodOptions] = useState<
		SelectedFilterMethodOption[]
	>(['Сумма', 'Среднее', 'Текущее']);

	// Отфильтрованное дерево по методу
	const [filteredTree, setFilteredTree] = useState<TreeItem[]>(tree);

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

	const isAncestor = useCallback(
		(nodeId: number) => {
			return tree.some((node) => node.parentId === nodeId);
		},
		[tree],
	);

	const activeNode: ActiveNode | undefined = useMemo(() => {
		if (channelId) return { id: channelId, type: 'channel' };
		if (deviceId) return { id: deviceId, type: 'device' };
		if (serverId) return { id: serverId, type: 'server' };
		return undefined;
	}, [serverId, deviceId, channelId]);

	const onSearchChange = useCallback(
		async (evt: React.ChangeEvent<HTMLInputElement>) => {
			const id: string = evt.target.value;
			setSearchValue(evt.target.value);
			clearDevicesPagination();
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
				const foundNode = devices.find(
					(n) => n.order === devicesPagination.positionRow,
				);
				if (foundNode) {
					toggleDevicesNode(foundNode as unknown as TreeItem);
					if (!tree.some((n) => n.parentId === foundNode.id)) {
						const { channels } = await getChannelsListFx({
							serverId: foundNode.serverId,
							deviceId: foundNode.id,
							operation: 'add',
							userId: user.preferredUsername,
						});
						const treeChannels = convertChannelsToTreeModal(channels, {
							channelId,
						});
						const foundChannel = treeChannels.find((n) => n.id === Number(id));
						if (foundChannel) {
							setDevicesActiveNode(foundChannel as unknown as TreeItem);
						}
					}
				}
			}
		},
		[filterMode, activeServer, tree, user],
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
		[filterMode, activeServer, search.value, user],
	);

	const fetchDevicesList = useCallback(
		(pagination: OptimizedPagination) => {
			if (!user) return;
			getDevicesListFx({
				serverId: activeServer?.id,
				pageNumber: pagination.pageNumber,
				userId: user.preferredUsername,
			});
		},
		[activeServer, user],
	);

	const onToggleNode = useCallback(
		async (node: TreeItem) => {
			if (node.type === 'server') {
				setActiveServer(node.id);
				if (!node.isOpen && user) {
					getDevicesListFx({
						serverId: node.id,
						pageNumber: 1,
						userId: user.preferredUsername,
					});
				}
			}
			if (node.type === 'device') {
				toggleDevicesNode(node);
				if (!isAncestor(node.id) && user) {
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
		},
		[devicesList, isAncestor, user],
	);

	const onRollup = useCallback(() => {
		rollupServersNodes();
		rollupDevicesNodes();
		setDevicesActiveNode(undefined);
	}, []);

	const { onScroll } = useOptimizedPagination(
		treeRef,
		pagination,
		fetchDevicesList,
	);

	const onNodeClick = (node: TreeItem) => {
		const id = node.id;
		let treeParams: TreeModal = {
			serverId: undefined,
			deviceId: undefined,
			channelId: undefined,
		};
		if (node.type === 'server') {
			treeParams = {
				serverId: id,
				deviceId: undefined,
				channelId: undefined,
			};
		}
		if (node.type === 'device') {
			treeParams = {
				serverId: node.parentId,
				deviceId: id,
				channelId: undefined,
			};
		}
		if (node.type === 'channel') {
			const device = devicesList.find((device) => device.id === node.parentId);
			treeParams = {
				serverId: device?.serverId,
				deviceId: node.parentId,
				channelId: id,
			};
		}
		setTreeModal(treeParams);
	};

	const changeMethodOption = useCallback(
		(key: string) => {
			return methodOptions.map((option) => {
				if (option.key === key)
					return { ...option, isChecked: !option.isChecked };
				return option;
			});
		},
		[methodOptions],
	);

	const onSelectMethodOption = (key: string) => {
		setMethodOptions(changeMethodOption(key));
	};

	const onApplyMethodOptions = () => {
		const confirmedMethodOptions = methodOptions
			.filter((item) => item.isChecked)
			.map((item) => item.name);
		const linkedOptionsCount = confirmedMethodOptions.length;
		setSelectedMethodOptions(
			linkedOptionsCount
				? confirmedMethodOptions
				: ['Сумма', 'Среднее', 'Текущее'],
		);
	};

	useEffect(() => {
		if (!serversList.length && user) {
			getServersListFx(user.preferredUsername).then((servers) => {
				if (serverId) {
					setActiveServer(Number(serverId));
				} else {
					const fetchedServerId: number = servers[0].id;
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
			filterStr: deviceId ? String(deviceId) : undefined,
			userId: user.preferredUsername,
		}).then(() => {
			if (deviceId) {
				openDeviceById(Number(deviceId));
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
			if (!isAncestor(deviceId) && user) {
				getChannelsListFx({
					serverId: serverId,
					deviceId: deviceId,
					/* 					operation: 'add', */
					userId: user.preferredUsername,
				}).then(({ channels }) => {
					if (!channels.length) {
						toast.warn('В данном приборе нет подключенных каналов');
					}
				});
			}
		}
	}, [deviceId, user]);

	useEffect(() => {
		return () => {
			clearDevicesList();
			clearDevicesPagination();
			clearChannelsList();
			resetServersModel();
		};
	}, []);

	useEffect(() => {
		const filteredTree = tree.filter((treeItem) => {
			if (treeItem.type !== 'channel') {
				return true;
			}
			return selectedMethodOptions.includes(
				treeItem.method as SelectedFilterMethodOption,
			);
		});
		setFilteredTree(filteredTree);
	}, [tree, selectedMethodOptions]);

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
	}, [devicesList, pagination, prevDevicesList, prevPagination.pageNumber]);

	return (
		<div className={styles.devices}>
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
				/>
				<div className={styles.filter}>
					<span>Метод канала</span>
					<MultiselectDropdown
						title={''}
						className={styles.filter_header}
						rightIcon={<Filter className={styles.filter_icon} />}
						onApply={onApplyMethodOptions}
						isItemsListVisible
						items={methodOptions}
						onSelect={onSelectMethodOption}
					/>
				</div>
			</div>
			<div className={styles.tree} ref={treeRef} onScroll={onScroll}>
				<Tree
					treeData={filteredTree}
					onItemClick={onNodeClick}
					onExpand={onToggleNode}
					activeNode={activeNode}
					lastPositionNode={lastPositionNode}
					withExpand
				/>
			</div>
		</div>
	);
}

export default PointDevicesTree;
