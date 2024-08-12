import { ChangeEvent, useEffect, useMemo, useState } from 'react';
import { Button } from '@evraz/ui-kit';
import clsx from 'clsx';
import { useStore } from 'effector-react';

import useDebounce from '../../Facades/useDebouce';
import AngleDown from '../../Icons/AngleDown';
import { $activeIds } from '../../Models/ActiveIds';
import { $editMode, $selectedObjectsState } from '../../Models/EditMode';
import { $emergencyEventsInfo } from '../../Models/EmergencyEvents';
import { getEmergencyEventsTreeFx } from '../../Models/EmergencyEvents/effects';
import { rollupNodes, toggleNode } from '../../Models/EmergencyEvents/events';
import { closeModal } from '../../Models/Modal/events';
import { RegisteredModals } from '../../Shared/modalsConfig';
import { TransparentConfiguration } from '../../Shared/Types/formObject';
import Input from '../../UI/Input';
import Tree from '../../UI/Tree';
import { TreeItem } from '../../UI/Tree/types';

import { Props } from './types';

import styles from './TransparentEmergencyEventsParameterSelect.module.css';

function TransparentEmergencyEventsParameterSelect({
	className,
	style,
	onConfirm,
}: Props) {
	const [parameterName, setParameterName] = useState<string>('');
	const [activeParameter, setActiveNode] = useState<TreeItem>();

	const { tree } = useStore($emergencyEventsInfo);
	const { objectParameters } = useStore($editMode);
	const { selectedObjects } = useStore($selectedObjectsState);
	const { activeVersion } = useStore($activeIds);
	const activeNode = {
		id:
			activeParameter?.id !== undefined
				? activeParameter?.id
				: (selectedObjects[0] as TransparentConfiguration).metricId ||
				  undefined,
		type: undefined,
	};

	const onNodeClick = (node: TreeItem) => {
		setActiveNode(node);
	};

	const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
		setParameterName(e.target.value);
	};
	const handleReset = () => {
		closeModal(RegisteredModals.EmergencyEventsTree);
	};

	const onSearch = useDebounce(handleSearch, 300);

	const parameterCode = useMemo(() => {
		if (selectedObjects.length > 0) {
			const parameters = objectParameters.get(selectedObjects[0].id);
			return parameters?.find((item) => item.parameterName === 'metricName')
				?.parameterCode;
		}
		return null;
	}, [selectedObjects, objectParameters]);
	const handleExpand = (node: TreeItem) => {
		toggleNode(node.id);
	};
	const onRollup = () => {
		setActiveNode(undefined);
		rollupNodes();
	};

	const confirmTransition = () => {
		if (!activeParameter?.id || !parameterCode) return;
		onConfirm(
			activeParameter.id,
			activeParameter.displayName,
			parameterCode,
			activeVersion?.code || 0,
			selectedObjects[0].id,
		);
	};

	const filteredTree = useMemo(() => {
		if (parameterName === '') return tree;
		const nameMask: RegExp = new RegExp(`${parameterName}`, 'gi');
		const rootNodes = tree
			.filter((node) => nameMask.test(node.displayName))
			.map((node) => ({ ...node, parentId: undefined }));
		const subNodes = tree.filter((node) => node.parentId);
		return rootNodes.length ? [...rootNodes, ...subNodes] : [];
	}, [parameterName, tree]);

	useEffect(() => {
		const metricId = (selectedObjects[0] as TransparentConfiguration).metricId;
		const node = tree.find((n) => n.id === metricId);
		if (node) {
			setActiveNode(node);
		}
	}, [selectedObjects, tree]);

	useEffect(() => {
		getEmergencyEventsTreeFx();
	}, []);

	return (
		<div className={clsx(styles.root, className)} style={style}>
			<div className={styles.form_search}>
				<button onClick={onRollup} className={styles.rollup}>
					<AngleDown />
				</button>
				<Input
					type="search"
					isSearch
					placeholder="Поиск по дереву"
					onChange={onSearch}
					className={styles.search_input}
				/>
			</div>
			<div className={clsx(styles.body)}>
				<Tree
					onItemClick={onNodeClick}
					treeData={filteredTree}
					activeNode={activeNode}
					needSort
					className={styles.tree}
					onExpand={handleExpand}
				/>
			</div>

			<div className={styles.modal_buttons}>
				<Button onClick={handleReset}>Отменить</Button>
				<Button onClick={confirmTransition} primary disabled={!activeNode?.id}>
					Применить
				</Button>
			</div>
		</div>
	);
}

export default TransparentEmergencyEventsParameterSelect;
