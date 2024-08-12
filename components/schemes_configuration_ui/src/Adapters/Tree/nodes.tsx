import { TechHierarchy, Tooltip, TooltipDirection } from '@evraz/ui-kit';

import { NSINode } from '../../Models/Nodes/types';
import { TreeItem } from '../../UI/Tree/types';

import styles from './Tree.module.css';

export function convertNodesToTree(nodes: NSINode[]): TreeItem[] {
	const tree: TreeItem[] = nodes.map(
		({ id, name, deviceId, isOpen }, nodeIndex) => ({
			id,
			displayName: name,
			name,
			parentId: deviceId,
			parentType: 'device',
			type: 'node',
			order: nodeIndex,
			isLast: false,
			isOpen,
			renderFn: () => (
				<div className={styles.display_name}>
					<Tooltip tooltip="Узел учета" forceDirection={TooltipDirection.Down}>
						<div>
							<TechHierarchy className={styles.display_name_icon} />
						</div>
					</Tooltip>
					{name}
				</div>
			),
		}),
	);

	return tree;
}
