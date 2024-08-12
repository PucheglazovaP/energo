import { ReactNode } from 'react';
import { Folder, TechCpu, Tooltip, TooltipDirection } from '@evraz/ui-kit';
import clsx from 'clsx';

import { ChannelGroup, ChannelIcon } from '../../../Icons';
import { NSINodeItem } from '../../../Models/NodeItems/types';
import { TreeItem } from '../../../UI/Tree/types';

import styles from '../Tree.module.css';
export function convertNodeItemsToTree(
	nodeItems: NSINodeItem[],
	selectedItemNumber: string = '',
): TreeItem[] {
	const staticItemsList = [...nodeItems];

	const tree: TreeItem[] = nodeItems.map(
		(
			{ id, defaultId, itemNumber, name, parentId, parentType, type, isOpen },
			nodeItemIndex,
		) => {
			return {
				id,
				defaultId,
				itemNumber,
				displayName: name,
				name,
				parentId,
				parentType,
				type,
				order: nodeItemIndex,
				isLast:
					nodeItems.length === 1 ||
					!staticItemsList.some((staticItem) => {
						return staticItem.parentId === id;
					}),
				isOpen,
				renderFn: () => {
					let Icon: ReactNode = <></>;
					switch (type) {
						case 'channels':
						case 'equipment_pieces':
						case 'channel_groups':
							Icon = <Folder className={styles.display_name_icon} />;
							break;
						case 'equipment_piece':
							Icon = (
								<Tooltip
									tooltip="Оборудование"
									forceDirection={TooltipDirection.Down}
								>
									<div>
										<TechCpu className={styles.display_name_icon} />
									</div>
								</Tooltip>
							);
							break;
						case 'nsi_channel':
							Icon = (
								<Tooltip tooltip="Канал" forceDirection={TooltipDirection.Down}>
									<div>
										<ChannelIcon className={styles.display_name_icon} />
									</div>
								</Tooltip>
							);
							break;
						case 'channel_group':
							Icon = (
								<Tooltip
									tooltip="Группа канала"
									forceDirection={TooltipDirection.Down}
								>
									<div>
										<ChannelGroup className={styles.display_name_icon} />
									</div>
								</Tooltip>
							);
							break;
						default:
							Icon = <></>;
							break;
					}
					return (
						<div
							className={clsx(styles.display_name, {
								tree_item__selected: selectedItemNumber === itemNumber,
							})}
						>
							{Icon}
							{name}
						</div>
					);
				},
			};
		},
	);

	return tree;
}
