import React, {
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

import { convertChannelToTree } from '../../Adapters/Tree/channels';
import useDebounce from '../../Facades/useDebouce';
import useOptimizedPagination from '../../Facades/useOptimizedPagination';
import { AngleDown } from '../../Icons/';
import { fetchChannelChartById } from '../../Models/ActiveChannelChart/events';
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
import { $navigation } from '../../Models/Navigation';
import { changeChannelRoute } from '../../Models/NavigationHistory/events';
import { $servers } from '../../Models/Servers';
import { getServersListFx } from '../../Models/Servers/effects';
import {
	resetServersModel,
	rollupServersNodes,
	setActiveServer,
	toggleServersNode,
} from '../../Models/Servers/events';
import { $treeChannels } from '../../Models/TreeChannels';
import { OptimizedPagination } from '../../Shared/types';
import Input from '../../UI/Input';
import Tree from '../../UI/Tree';
import { ActiveNode, TreeItem } from '../../UI/Tree/types';
import { updateSearchParams } from '../../Utils/searchParams';

import styles from './TreeChannels.module.css';

function TreeChannels() {
	const user = useStore($user);
	const { list: serversList } = useStore($servers);
	const treeChannels = useStore($treeChannels);
	const {
		pagination,
		list: channelsList,
		search,
		activeNode: activeChannelsNode,
	} = useStore($channels);
	const { serverId, channelId } = useStore($navigation);

	const [prevPagination, setPrevPagination] =
		useState<OptimizedPagination>(pagination);
	const [prevChannelsList, setPrevChannelsList] =
		useState<Channel[]>(channelsList);
	const [lastPositionedNode, setLastPositionedNode] = useState<TreeItem>();

	const [searchParams, setSearchParams] = useSearchParams();
	const location = useLocation();

	const treeRef = useRef<HTMLDivElement | null>(null);

	const activeServer = useMemo(() => {
		const server = serversList.find((server) => server.id === serverId);
		return server;
	}, [serversList]);

	const activeNode: ActiveNode = useMemo(() => {
		if (activeChannelsNode)
			return { id: activeChannelsNode.id, type: 'channel' };
		if (channelId) return { id: channelId, type: 'channel' };
		return { id: serverId, type: 'server' };
	}, [serverId, channelId, activeChannelsNode]);

	const onNodeClick = (node: TreeItem) => {
		const stringifiedId: string = String(node.id);
		let updatedSearchParams: URLSearchParams = new URLSearchParams(
			searchParams,
		);
		if (node.type === 'server') {
			updatedSearchParams = updateSearchParams(updatedSearchParams, {
				serverId: stringifiedId,
				channelId: undefined,
			});
		}
		if (node.type === 'channel') {
			updatedSearchParams = updateSearchParams(updatedSearchParams, {
				serverId: node.parentId,
				channelId: stringifiedId,
			});
		}
		setSearchParams(updatedSearchParams);
	};

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
		}).then(() => {
			if (channelId) {
				fetchChannelChartById(channelId);
			}
		});
	}, [serverId, user]);

	useEffect(() => {
		if (channelId) {
			fetchChannelChartById(channelId);
			changeChannelRoute(location.pathname + location.search);
		}
	}, [channelId, user]);

	useEffect(() => {
		if (!serversList.length && user) {
			getServersListFx(user.preferredUsername).then((servers) => {
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
			const lastNode = convertChannelToTree(lastChannel);
			setLastPositionedNode(lastNode);
		}
		if (pagination.pageNumber < prevPagination.pageNumber) {
			const firstChannel = prevChannelsList[0];
			if (!firstChannel) {
				setLastPositionedNode(undefined);
				return;
			}
			const firstNode = convertChannelToTree(firstChannel);
			setLastPositionedNode(firstNode);
		}
		setPrevPagination(pagination);
		setPrevChannelsList(channelsList);
	}, [channelsList, pagination, user]);

	return (
		<div className={styles.channels}>
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
			<div className={styles.tree} ref={treeRef} onScroll={onScroll}>
				<Tree
					activeNode={activeNode}
					lastPositionNode={lastPositionedNode}
					onItemClick={onNodeClick}
					onExpand={onToggleNode}
					treeData={treeChannels}
					withExpand
				/>
			</div>
		</div>
	);
}

export default TreeChannels;
