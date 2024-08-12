import ChannelNode from '../../Containers/PointChannelsTreeModal/parts/ChannelNode';
import { Channel } from '../../Models/Channels/types';
import { TreeModal } from '../../Models/TreeModal/types';
import { TreeItem } from '../../UI/Tree/types';

export function convertChannelToTreeModal(
	channel: Channel,
	selectedChannelId: number | undefined,
): TreeItem {
	return {
		id: channel.id,
		displayName: channel.name,
		name: channel.name,
		parentId: channel.deviceId,
		parentType: 'device',
		type: 'channel',
		isLast: true,
		method: channel.method,
		renderFn: () => (
			<ChannelNode channel={channel} selectedChannelId={selectedChannelId} />
		),
	};
}

export function convertChannelsToTreeModal(
	channels: Channel[],
	treeParams: TreeModal,
): TreeItem[] {
	const { channelId } = treeParams;
	const tree: TreeItem[] = channels.map((channel) =>
		convertChannelToTreeModal(channel, channelId),
	);
	return tree;
}

export function convertUnconnectedChannelsToTreeModal(
	channels: Channel[],
	treeParams: TreeModal,
): TreeItem[] {
	const { channelId } = treeParams;
	const tree: TreeItem[] = channels.map((channel) => ({
		id: channel.id,
		displayName: channel.name,
		name: channel.name,
		parentId: channel.serverId,
		parentType: 'server',
		type: 'channel',
		isLast: true,
		isOpen: channel.isOpen,
		method: channel.method,
		renderFn: () => (
			<ChannelNode channel={channel} selectedChannelId={channelId} />
		),
	}));
	return tree;
}
