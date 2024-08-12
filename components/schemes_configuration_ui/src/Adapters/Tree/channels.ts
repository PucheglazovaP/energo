import { Channel } from '../../Models/Channels/types';
import { TreeItem } from '../../UI/Tree/types';

export function convertChannelsToTree(channels: Channel[]): TreeItem[] {
	const tree: TreeItem[] = channels.map((channel) => ({
		id: channel.id,
		displayName: channel.name,
		name: channel.name,
		parentId: channel.deviceId,
		parentType: 'device',
		type: 'channel',
		isLast: true,
	}));
	return tree;
}

export function convertChannelToTree(channel: Channel): TreeItem {
	return {
		id: channel.id,
		displayName: channel.name,
		name: channel.name,
		parentId: channel.deviceId,
		parentType: 'device',
		type: 'channel',
		isLast: true,
	};
}

export function convertUnconnectedChannelsToTree(
	channels: Channel[],
): TreeItem[] {
	const tree: TreeItem[] = channels.map((channel) => ({
		id: channel.id,
		displayName: channel.name,
		name: channel.name,
		parentId: channel.serverId,
		parentType: 'server',
		type: 'channel',
		isLast: true,
		isOpen: channel.isOpen,
	}));
	return tree;
}
