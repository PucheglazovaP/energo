import { ChangeEvent, useCallback, useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useStore } from 'effector-react';

import useDebounce from '../../Facades/useDebouce';
import AngleDown from '../../Icons/AngleDown';
import { $emergencyEventsInfo } from '../../Models/EmergencyEvents';
import { getEmergencyEventsTreeFx } from '../../Models/EmergencyEvents/effects';
import {
	rollupNodes,
	setActiveNode,
	setActiveNodeInfo,
	toggleNode,
} from '../../Models/EmergencyEvents/events';
import { FormTreeItem } from '../../Models/TreeForms/types';
import { SearchParameters } from '../../Shared/types';
import ContextMenu from '../../UI/ContextMenu';
import Input from '../../UI/Input';
import Spinner from '../../UI/Spinner';
import Tree from '../../UI/Tree';
import { TreeItem } from '../../UI/Tree/types';
import { updateSearchParams } from '../../Utils/searchParams';
import { getFilteredTree } from '../../Utils/treeUtils';

import useContextMenu from './useContextMenu';

import styles from './TreeEmergencyEvents.module.css';

function TreeEmergencyEvents() {
	const [searchParams, setSearchParams] = useSearchParams();
	const { tree, activeNode, isEditing } = useStore($emergencyEventsInfo);
	const isLoading = useStore(getEmergencyEventsTreeFx.pending);

	const [formName, setFormName] = useState<string>('');

	const handleFormName = useCallback((e: ChangeEvent<HTMLInputElement>) => {
		setFormName(e.target.value);
	}, []);
	const onFormNameChange = useDebounce(handleFormName, 300);

	const handleItemClick = (node: TreeItem) => {
		const { id } = node as FormTreeItem;
		setActiveNode(id);
		const updatedSearchParams: URLSearchParams = updateSearchParams(
			searchParams,
			{
				controlParameterId: id,
			},
		);
		setSearchParams(updatedSearchParams);
	};
	const handleExpand = (node: TreeItem) => {
		toggleNode(node.id);
	};
	const onRollup = () => {
		setActiveNode(undefined);
		rollupNodes();
	};

	const filteredTree = useMemo(() => {
		return getFilteredTree(tree, formName);
	}, [tree, formName]);

	const {
		onOpen: onOpenContextMenu,
		position,
		setPosition,
		items: itemsContextMenu,
	} = useContextMenu();

	useEffect(() => {
		getEmergencyEventsTreeFx();
	}, []);

	useEffect(() => {
		const paramControlParameterId = searchParams.get(
			SearchParameters.ControlParameterId,
		);
		const controlParameterId = paramControlParameterId
			? Number(paramControlParameterId)
			: undefined;
		if (controlParameterId) setActiveNode(controlParameterId);
	}, []);

	useEffect(() => {
		const treeItem = tree.find((item) => item.id === activeNode);
		if (treeItem) setActiveNodeInfo(treeItem);
	}, [activeNode, tree]);

	return (
		<>
			<div className={styles.form_search}>
				<button onClick={onRollup} className={styles.rollup}>
					<AngleDown />
				</button>
				<Input
					type="search"
					isSearch
					placeholder="Поиск по дереву"
					onChange={onFormNameChange}
					className={styles.search_input}
				/>
			</div>
			{!filteredTree.length && !isLoading && (
				<span className={styles.no_forms}>
					Нет элементов, удовлетворяющих критерию поиска
				</span>
			)}
			{isLoading ? (
				<Spinner className={styles.spinner} />
			) : (
				<div className={styles.tree} id="tree">
					<Tree
						activeNode={{ id: activeNode as number, type: undefined }}
						onItemClick={handleItemClick}
						treeData={filteredTree}
						needSort
						onContextMenu={onOpenContextMenu}
						onExpand={handleExpand}
					/>
				</div>
			)}
			{isEditing && (
				<ContextMenu
					items={itemsContextMenu}
					position={position}
					setPosition={setPosition}
				/>
			)}
		</>
	);
}

export default TreeEmergencyEvents;
