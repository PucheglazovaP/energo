import React, { memo } from 'react';

import headerItem from '../../Components/TreeItem/ItemHeader';
import TreeItem from '../../Components/TreeItem/TreeItem';
import { CHANNEL, DEVICE, FORWARD_TREE, GROUP, SERVER } from '../../Const';
import { useConfiguratorTree } from '../../Hooks/ConfiguratorTree/useConfiguratorTree';
import {
	ChannelsListItemType,
	DevicesListItemType,
	GroupsListItemType,
	ServersListItemType,
	TreePropsType,
} from '../../Types';
import {
	CHANNEL_IN_GROUP_CONTEXT_MENU,
	DEVICE_IN_CHANNEL_CONTEXT_MENU,
	GROUP_DEFAULT_CONTEXT_MENU,
	GROUPS_SERVER_CONTEXT_MENU,
} from '../../Types/ContextMenuTypes';

function ForwardTree({
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
					key={`${SERVER}_${serverItem.ID}_forward`}
					number={serverItem.ID}
					renderHeader={headerItem}
					treeType={FORWARD_TREE}
					renderChildren={
						!!serverItem.HaveDevices ||
						!!serverItem.HaveGroups ||
						!!serverItem.HaveUnConnCh
					}
					setContextMenu={setContextMenu}
					contextMenuType={GROUPS_SERVER_CONTEXT_MENU}
					serverId={null}
				>
					{groupsList
						.filter((groupItem) => groupItem.FK_DataServers === serverItem.ID)
						// .filter((groupItem) => groupItem.Number < 100)
						.map((groupItem: GroupsListItemType) => (
							<TreeItem
								treeItemType={GROUP}
								count={groupItem.ChannelsCount}
								hasFormula={groupItem.Formula}
								activeFormula={groupItem.ActiveFormula}
								isFavourite={groupItem.isFavorite}
								title={groupItem.Name}
								key={`${GROUP}_${groupItem.Number}_${serverItem.ID}`}
								number={groupItem.Number}
								eWorkNumber={groupItem.Number_EWork}
								onClick={onClick}
								renderHeader={headerItem}
								treeType={FORWARD_TREE}
								setContextMenu={setContextMenu}
								contextMenuType={GROUP_DEFAULT_CONTEXT_MENU}
								updateElementsLists={updateElementsList}
								serverId={serverItem.ID}
							>
								{channelsList
									.filter((channelItem) =>
										channelItem.GroupsList.includes(groupItem.Number),
									)
									.map((channelItem: ChannelsListItemType) => (
										<TreeItem
											treeItemType={CHANNEL}
											key={`${CHANNEL}_${channelItem.Number}_${groupItem.Number}`}
											number={channelItem.Number}
											title={channelItem.Name}
											treeType={FORWARD_TREE}
											coefficient={
												channelItem.KoefList[
													channelItem.GroupsList.indexOf(groupItem.Number)
												]
											}
											renderHeader={headerItem}
											onClick={onClick}
											setContextMenu={setContextMenu}
											contextMenuType={CHANNEL_IN_GROUP_CONTEXT_MENU}
											updateElementsLists={updateElementsList}
											serverId={serverItem.ID}
											currentParent={groupItem.Number}
										>
											{devicesList
												.filter((deviceItem) => {
													if (!deviceItem.ChannelsList) return false;
													return deviceItem.ChannelsList.split(',').includes(
														channelItem.Number.toString(),
													);
												})
												.map((deviceItem: DevicesListItemType) => {
													return (
														<TreeItem
															treeItemType={DEVICE}
															key={`${DEVICE}_${deviceItem.Number}_${channelItem.Number}_${groupItem.Number}`}
															title={deviceItem.Name}
															number={deviceItem.Number}
															isDropdownDisabled={true}
															onClick={onClick}
															renderHeader={headerItem}
															treeType={FORWARD_TREE}
															setContextMenu={setContextMenu}
															contextMenuType={DEVICE_IN_CHANNEL_CONTEXT_MENU}
															serverId={serverItem.ID}
														/>
													);
												})}
										</TreeItem>
									))}
							</TreeItem>
						))}
				</TreeItem>
			))}
		</>
	);
}

export default memo(ForwardTree);
