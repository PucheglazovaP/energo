import { MouseEvent } from 'react';

import { TreeItem } from '../../UI/Tree/types';

export interface TreeDevicesProps {
	className?: string;
	containerName?: 'nsi';
	onTreeItemClick?: (item: TreeItem) => void;
	onTreeItemContextMenu?: (evt: MouseEvent, item: TreeItem) => void;
}
