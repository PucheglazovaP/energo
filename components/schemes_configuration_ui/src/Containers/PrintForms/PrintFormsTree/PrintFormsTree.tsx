import { ChangeEvent, useEffect, useState } from 'react';
import { AngleDown, Search } from '@evraz/ui-kit';
import clsx from 'clsx';
import { useStore } from 'effector-react';

import useDebounce from '../../../Facades/useDebouce';
import { $user } from '../../../Models/Auth';
import { openModal } from '../../../Models/Modal/events';
import {
	$printFormPositioningNodeId,
	$printFormTree,
	$selectedPrintFormId,
} from '../../../Models/PrintForms';
import { fetchPrintFormTreeFx } from '../../../Models/PrintForms/effects';
import {
	setSelectedPrintFormTreeNode,
	togglePrintFormNode,
} from '../../../Models/PrintForms/events';
import { RegisteredModals } from '../../../Shared/modalsConfig';
import { PrintFormTree } from '../../../Shared/types';
import { ModuleName } from '../../../Shared/Types/moduleName';
import Input from '../../../UI/Input';
import Tree from '../../../UI/Tree';
import { TreeItem } from '../../../UI/Tree/types';
import { getFilteredTree } from '../../../Utils/treeUtils';

import PrintFormsTreeItem from './partials/PrintFormsTreeItem';

import styles from './PrintFormsTree.module.css';

function PrintFormsTree() {
	const tree = useStore($printFormTree);
	const printFormId = useStore($selectedPrintFormId);
	const printFormPositioningNodeId = useStore($printFormPositioningNodeId);
	const user = useStore($user);
	const [search, setSearch] = useState<string>('');

	const handleSync = (node: PrintFormTree) => {
		openModal(RegisteredModals.PrintFormPositionSync);
		setSelectedPrintFormTreeNode(node);
	};

	const handleUnsync = (node: PrintFormTree) => {
		openModal(RegisteredModals.PrintFormPositionUnsync);
		setSelectedPrintFormTreeNode(node);
	};

	const handleChange = (evt: ChangeEvent<HTMLInputElement>) => {
		setSearch(evt.target.value);
	};

	const debouncedHandleChange = useDebounce(handleChange, 300);

	const handleExpandNode = (node: TreeItem) => {
		togglePrintFormNode(node.id);
	};

	const treeData: TreeItem[] = tree.map((node, _idx, self) => ({
		...node,
		id: node.nodeId,
		parentId: node.parentNodeId,
		name: node.nodeName,
		displayName: node.nodeName,
		isLast: !self.some((n) => n.parentNodeId === node.nodeId),
		renderFn: () => (
			<PrintFormsTreeItem
				node={node}
				onSync={handleSync}
				onUnsync={handleUnsync}
			/>
		),
	}));

	const filteredTree: TreeItem[] = getFilteredTree(treeData, search);

	useEffect(() => {
		if (user && printFormId) {
			fetchPrintFormTreeFx({
				printFormId,
				userId: user?.preferredUsername || '',
				moduleName: ModuleName.PrintFormsTree_fetchPrintFormTreeFx,
			});
		}
	}, [printFormId, user]);

	if (!printFormId) {
		return <div>Печатная форма не выбрана</div>;
	}

	return (
		<div className={styles.container}>
			<div className={styles.controllers}>
				<button className={clsx('button__empty', styles.collapse)}>
					<AngleDown className={styles.collapse__icon} />
				</button>
				<Input
					onChange={debouncedHandleChange}
					className={styles.search}
					placeholder="Наименование"
					glyph={<Search className={styles.search__icon} />}
				/>
			</div>
			<Tree
				treeData={filteredTree}
				className={styles.tree}
				onExpand={handleExpandNode}
				lastPositionNode={treeData.find(
					(node) => node.id === printFormPositioningNodeId,
				)}
			/>
		</div>
	);
}

export default PrintFormsTree;
