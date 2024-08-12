import React from 'react';

import headerItem from '../../Components/TreeItem/ItemHeader';
import TreeItem from '../../Components/TreeItem/TreeItem';
import { CHANNEL, DEVICE, GROUP, REVERSE_TREE, SERVER } from '../../Const';
import { useConfiguratorTree } from '../../Hooks/ConfiguratorTree/useConfiguratorTree';
import {
	ChannelsListItemType,
	DevicesListItemType,
	GroupsListItemType,
	ServersListItemType,
	TreePropsType,
} from '../../Types';
import {
	CHANNEL_IN_DEVICE_CONTEXT_MENU,
	DEVICE_DEFAULT_CONTEXT_MENU,
	DEVICES_SERVER_CONTEXT_MENU,
	GROUP_IN_CHANNEL_CONTEXT_MENU,
} from '../../Types/ContextMenuTypes';

function ReverseTree({
	serversList,
	groupsList,
	channelsList,
	devicesList,
	onClick,
	setContextMenu,
}: TreePropsType): JSX.Element {
	const { updateElementsList } = useConfiguratorTree();
	return (
		<>
			{serversList.map((serverItem: ServersListItemType) => (
				<TreeItem
					treeItemType={SERVER}
					onClick={onClick}
					key={`server_${serverItem.ID}_reverse`}
					number={serverItem.ID}
					renderHeader={headerItem}
					treeType={REVERSE_TREE}
					renderChildren={
						!!serverItem.HaveDevices ||
						!!serverItem.HaveGroups ||
						!!serverItem.HaveUnConnCh
					}
					setContextMenu={setContextMenu}
					contextMenuType={DEVICES_SERVER_CONTEXT_MENU}
					serverId={null}
				>
					{devicesList
						.filter(
							(deviceItem: DevicesListItemType) =>
								deviceItem.FK_DataServers === serverItem.ID,
						)
						.map((deviceItem: DevicesListItemType) => {
							return (
								<TreeItem
									treeItemType={DEVICE}
									key={`${DEVICE}_${deviceItem.Number}_${serverItem.ID}`}
									title={deviceItem.Name}
									number={deviceItem.Number}
									onClick={onClick}
									renderHeader={headerItem}
									treeType={REVERSE_TREE}
									count={deviceItem.ChannelsCount}
									setContextMenu={setContextMenu}
									updateElementsLists={updateElementsList}
									serverId={serverItem.ID}
									isFavourite={deviceItem.isFavorite}
									contextMenuType={DEVICE_DEFAULT_CONTEXT_MENU}
								>
									{channelsList
										.filter((channelItem: ChannelsListItemType) => {
											if (!deviceItem.ChannelsList) return false;
											return deviceItem.ChannelsList.split(',').includes(
												channelItem.Number.toString(),
											);
										})
										.map((channelItem: ChannelsListItemType) => {
											return (
												<TreeItem
													treeItemType={CHANNEL}
													key={`${CHANNEL}_${channelItem.Number}_${deviceItem.Number}`}
													title={channelItem.Name}
													number={channelItem.Number}
													onClick={onClick}
													renderHeader={headerItem}
													treeType={REVERSE_TREE}
													isIncluded={!!channelItem.GroupsList.length}
													currentParent={channelItem.FK_Devices}
													updateElementsLists={updateElementsList}
													serverId={serverItem.ID}
													contextMenuType={CHANNEL_IN_DEVICE_CONTEXT_MENU}
													setContextMenu={setContextMenu}
												>
													{groupsList
														.filter((groupItem: GroupsListItemType) => {
															if (!channelItem.GroupsList.length) return false;
															return channelItem.GroupsList.includes(
																groupItem.Number,
															);
														})
														.map((groupItem: GroupsListItemType) => {
															return (
																<TreeItem
																	treeItemType={GROUP}
																	key={`${GROUP}_${groupItem.Number}_${channelItem.Number}_${deviceItem.Number}`}
																	title={groupItem.Name}
																	number={groupItem.Number}
																	isDropdownDisabled={true}
																	onClick={onClick}
																	renderHeader={headerItem}
																	treeType={REVERSE_TREE}
																	serverId={serverItem.ID}
																	contextMenuType={
																		GROUP_IN_CHANNEL_CONTEXT_MENU
																	}
																	setContextMenu={setContextMenu}
																/>
															);
														})}
												</TreeItem>
											);
										})}
								</TreeItem>
							);
						})}
				</TreeItem>
			))}
		</>
	);
}

export default ReverseTree;
