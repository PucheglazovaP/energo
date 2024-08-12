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

import { convertChannelToTreeModal } from '../../Adapters/Tree/channelsModal';
import useDebounce from '../../Facades/useDebouce';
import useOptimizedPagination from '../../Facades/useOptimizedPagination';
import { AngleDown, Filter } from '../../Icons/';
import { $user } from '../../Models/Auth';
import { $channels } from '../../Models/Channels';
import { getChannelsListFx } from '../../Models/Channels/effects';
import {
	clearChannelsList,
	clearChannelsPagination,
	setChannelsActiveNode,
	setChannelsSearch,
} from '../../Models/Channels/events';
import { Channel } from '../../Models/Channels/types';
import { $servers } from '../../Models/Servers';
import { getServersListFx } from '../../Models/Servers/effects';
import {
	resetServersModel,
	rollupServersNodes,
	setActiveServer,
	toggleServersNode,
} from '../../Models/Servers/events';
import { $treeChannelsModal } from '../../Models/TreeChannelsModal';
import { $treeModal } from '../../Models/TreeModal';
import { setTreeModal } from '../../Models/TreeModal/events';
import { TreeModal } from '../../Models/TreeModal/types';
import { OptimizedPagination } from '../../Shared/types';
import Input from '../../UI/Input';
import MultiselectDropdown from '../../UI/MultiselectDropdown';
import Tree from '../../UI/Tree';
import { ActiveNode, TreeItem } from '../../UI/Tree/types';

import { FilterMethodOption, SelectedFilterMethodOption } from './types';

import styles from './PointChannelsTreeModal.module.css';

function PointUnconnectedChannelsTree() {
	const user = useStore($user);
	const { list: serversList } = useStore($servers);
	const treeChannels = useStore($treeChannelsModal);
	const { pagination, list: channelsList, search } = useStore($channels);
	const { serverId, channelId } = useStore($treeModal);

	const [prevPagination, setPrevPagination] =
		useState<OptimizedPagination>(pagination);
	const [prevChannelsList, setPrevChannelsList] =
		useState<Channel[]>(channelsList);
	const [lastPositionedNode, setLastPositionedNode] = useState<TreeItem>();

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
	const [filteredTree, setFilteredTree] = useState<TreeItem[]>(treeChannels);

	const treeRef = useRef<HTMLDivElement | null>(null);

	const activeServer = useMemo(() => {
		const server = serversList.find((server) => server.id === serverId);
		return server;
	}, [serversList]);

	const activeNode: ActiveNode = useMemo(() => {
		if (channelId) return { id: channelId, type: 'channel' };
		return { id: serverId, type: 'server' };
	}, [serverId, channelId]);

	const fetchChannelsList = useCallback(
		(pagination: OptimizedPagination) => {
			if (!user) return;
			getChannelsListFx({
				serverId: activeServer?.id,
				pageNumber: pagination.pageNumber,
				operation: 'set',
				mode: 3,
				searchFrom: search ? search : null,
				userId: user.preferredUsername,
			});
		},
		[activeServer, search, user],
	);

	const { onScroll } = useOptimizedPagination(
		treeRef,
		pagination,
		fetchChannelsList,
	);

	const onSearchChange = useCallback(
		async (evt: React.ChangeEvent<HTMLInputElement>) => {
			setChannelsSearch(evt.target.value);
			clearChannelsPagination();
			if (!user) return;
			const { channels } = await getChannelsListFx({
				mode: 3,
				operation: 'set',
				serverId: activeServer?.id,
				pageNumber: 1,
				searchFrom: evt.target.value ? evt.target.value : null,
				userId: user.preferredUsername,
			});
			const foundNode = channels.find(
				(channel) => channel.id === Number(evt.target.value),
			);
			if (foundNode) {
				setChannelsActiveNode(foundNode as unknown as TreeItem);
			}
			if (!foundNode && evt.target.value) {
				toast.warn('Канал не найден');
			}
		},
		[activeServer, user],
	);

	const debouncedSearchChange = useDebounce(onSearchChange, 300);

	const onToggleNode = useCallback(
		(node: TreeItem) => {
			if (node.type === 'server' && user) {
				getChannelsListFx({
					mode: 3,
					operation: 'set',
					serverId: node.id,
					userId: user.preferredUsername,
				}).then(({ channels }) => {
					if (!channels.length) {
						toast.warning('На данном сервере нет неподключенных каналов');
					} else {
						toggleServersNode(node);
					}
				});
			}
		},
		[user],
	);

	const onRollup = useCallback(() => {
		rollupServersNodes();
		setChannelsActiveNode(undefined);
	}, []);

	const onNodeClick = (node: TreeItem) => {
		const id = node.id;
		let treeParams: TreeModal = {
			serverId: undefined,
			channelId: undefined,
		};
		if (node.type === 'server') {
			treeParams = {
				serverId: id,
				channelId: undefined,
			};
		}
		if (node.type === 'channel') {
			treeParams = {
				serverId: node.parentId,
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

	// If server id changed:
	// 1. set active server id;
	// 2. clear channels pagination;
	// 3. fetch channels list;
	// 4. if channel id exist, fetch data for this channel;
	useEffect(() => {
		setActiveServer(Number(serverId));
		clearChannelsPagination();
		if (!user) return;
		getChannelsListFx({
			mode: 3,
			operation: 'set',
			serverId: Number(serverId),
			pageNumber: 1,
			searchFrom: null,
			userId: user.preferredUsername,
		});
	}, [serverId, user]);

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

	useEffect(() => {
		const filteredTree = treeChannels.filter((treeItem) => {
			if (treeItem.type !== 'channel') {
				return true;
			}
			return selectedMethodOptions.includes(
				treeItem.method as SelectedFilterMethodOption,
			);
		});
		setFilteredTree(filteredTree);
	}, [treeChannels, selectedMethodOptions]);

	useEffect(() => {
		return () => {
			clearChannelsPagination();
			clearChannelsList();
			resetServersModel();
		};
	}, []);

	useLayoutEffect(() => {
		if (pagination.pageNumber > prevPagination.pageNumber) {
			const lastChannel = prevChannelsList[prevChannelsList.length - 1];
			if (!lastChannel) {
				setLastPositionedNode(undefined);
				return;
			}
			const lastNode = convertChannelToTreeModal(lastChannel, channelId);
			setLastPositionedNode(lastNode);
		}
		if (pagination.pageNumber < prevPagination.pageNumber) {
			const firstChannel = prevChannelsList[0];
			if (!firstChannel) {
				setLastPositionedNode(undefined);
				return;
			}
			const firstNode = convertChannelToTreeModal(firstChannel, channelId);
			setLastPositionedNode(firstNode);
		}
		setPrevPagination(pagination);
		setPrevChannelsList(channelsList);
	}, [channelsList, pagination]);

	return (
		<div className={styles.channels}>
			<div className={styles.header}>
				<div className={styles.search}>
					<button onClick={onRollup} className={styles.rollup}>
						<AngleDown />
					</button>
					<Input
						type="search"
						isSearch
						placeholder="Номер канала"
						onChange={debouncedSearchChange}
						disabled={!activeServer}
						className={styles.field}
					/>
				</div>
				<div className={styles.filter}>
					<span>Связ. канал</span>
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
					activeNode={activeNode}
					lastPositionNode={lastPositionedNode}
					onItemClick={onNodeClick}
					onExpand={onToggleNode}
					treeData={filteredTree}
					withExpand
				/>
			</div>
		</div>
	);
}

export default PointUnconnectedChannelsTree;
