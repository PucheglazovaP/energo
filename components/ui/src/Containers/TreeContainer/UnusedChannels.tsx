import React from 'react';

import headerItem from '../../Components/TreeItem/ItemHeader';
import TreeItem from '../../Components/TreeItem/TreeItem';
import { CHANNEL, GROUP, SERVER, UNUSED_CHANNELS_TREE } from '../../Const';
import { useConfiguratorTree } from '../../Hooks/ConfiguratorTree/useConfiguratorTree';
import {
	ChannelsListItemType,
	GroupsListItemType,
	ServersListItemType,
	TreePropsType,
} from '../../Types';
import {
	GROUP_IN_CHANNEL_CONTEXT_MENU,
	UNUSED_CHANNEL_CONTEXT_MENU,
	UNUSED_CHANNELS_SERVER_CONTEXT_MENU,
} from '../../Types/ContextMenuTypes';

function UnusedChannels({
	serversList,
	channelsList,
	onClick,
	setContextMenu,
	groupsList,
}: TreePropsType): JSX.Element {
	const { updateElementsList } = useConfiguratorTree();

	return (
		<>
			{serversList.map((serverItem: ServersListItemType) => (
				<TreeItem
					treeItemType={SERVER}
					onClick={onClick}
					key={`${SERVER}_${serverItem.ID}_${UNUSED_CHANNELS_TREE}`}
					number={serverItem.ID}
					renderHeader={headerItem}
					treeType={UNUSED_CHANNELS_TREE}
					renderChildren={
						!!serverItem.HaveDevices ||
						!!serverItem.HaveGroups ||
						!!serverItem.HaveUnConnCh
					}
					setContextMenu={setContextMenu}
					contextMenuType={UNUSED_CHANNELS_SERVER_CONTEXT_MENU}
					serverId={null}
				>
					{channelsList
						.filter(
							(channelItem) => channelItem.FK_DataServers === serverItem.ID,
						)
						.map((channelItem: ChannelsListItemType) => (
							<TreeItem
								treeItemType={CHANNEL}
								key={`${CHANNEL}_${channelItem.Number}_${serverItem.ID}_${UNUSED_CHANNELS_TREE}`}
								number={channelItem.Number}
								title={channelItem.Name}
								treeType={UNUSED_CHANNELS_TREE}
								renderHeader={headerItem}
								onClick={onClick}
								renderChildren={false}
								serverId={serverItem.ID}
								setContextMenu={setContextMenu}
								contextMenuType={UNUSED_CHANNEL_CONTEXT_MENU}
								isIncluded={!!channelItem.GroupsList.length}
								updateElementsLists={updateElementsList}
							>
								{groupsList
									.filter((groupItem: GroupsListItemType) => {
										if (!channelItem.GroupsList.length) return false;
										return channelItem.GroupsList.includes(groupItem.Number);
									})
									.map((groupItem: GroupsListItemType) => {
										return (
											<TreeItem
												treeItemType={GROUP}
												key={`${GROUP}_${groupItem.Number}_${channelItem.Number}`}
												title={groupItem.Name}
												number={groupItem.Number}
												isDropdownDisabled={true}
												onClick={onClick}
												renderHeader={headerItem}
												treeType={UNUSED_CHANNELS_TREE}
												serverId={serverItem.ID}
												contextMenuType={GROUP_IN_CHANNEL_CONTEXT_MENU}
												setContextMenu={setContextMenu}
											/>
										);
									})}
							</TreeItem>
						))}
				</TreeItem>
			))}
		</>
	);
}

export default UnusedChannels;
