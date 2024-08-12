import { ChangeEvent, useEffect, useMemo, useState } from 'react';
import { Button } from '@evraz/ui-kit';
import clsx from 'clsx';
import { useStore } from 'effector-react';

import useDebounce from '../../Facades/useDebouce';
import { $activeIds } from '../../Models/ActiveIds';
import { $editMode, $selectedObjectsState } from '../../Models/EditMode';
import { $treeForms } from '../../Models/TreeForms';
import Input from '../../UI/Input';
import Tree from '../../UI/Tree';
import { TreeItem } from '../../UI/Tree/types';

import { FormRelationsProps } from './types';

import styles from './FormRelations.module.css';

function FormRelations({ className, style, onConfirm }: FormRelationsProps) {
	const [formName, setFormName] = useState<string>('');
	const [activeForm, setActiveForm] = useState<TreeItem>();

	const treeData = useStore($treeForms);
	const { objectParameters } = useStore($editMode);
	const { selectedObjects } = useStore($selectedObjectsState);
	const { activeVersion } = useStore($activeIds);
	const { id: parentFormId } = useStore($editMode);

	const activeNode = {
		id:
			(activeForm?.id !== undefined ? activeForm?.id : parentFormId) ||
			undefined,
		type: undefined,
	};

	const onNodeClick = (node: TreeItem) => {
		setActiveForm(node);
	};

	const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
		setFormName(e.target.value);
	};

	const onSearch = useDebounce(handleSearch, 300);

	const parameterCode = useMemo(() => {
		if (selectedObjects.length > 0) {
			const parameters = objectParameters.get(selectedObjects[0].id);
			return parameters?.find((item) => item.parameterName === 'goton')
				?.parameterCode;
		}
		return null;
	}, [selectedObjects, objectParameters]);

	const confirmTransition = () => {
		if (!activeForm?.id || !parameterCode) return;
		onConfirm(
			activeForm.id,
			activeForm.displayName,
			parameterCode,
			activeVersion?.code || 0,
			selectedObjects[0].id,
		);
	};

	const filteredTree = useMemo(() => {
		if (formName === '') return treeData;
		const nameMask: RegExp = new RegExp(`${formName}`, 'gi');
		const rootNodes = treeData
			.filter((node) => nameMask.test(node.displayName))
			.map((node) => ({ ...node, parentId: undefined }));
		const subNodes = treeData.filter((node) => node.parentId);
		// If there is no overlap by name, return empty array
		return rootNodes.length ? [...rootNodes, ...subNodes] : [];
	}, [formName, treeData]);

	useEffect(() => {
		if (selectedObjects.length) {
			const nodeId = selectedObjects[0].gotonCode;
			const node = treeData.find((n) => n.id === nodeId);
			if (node) {
				setActiveForm(node);
			}
		}
	}, [selectedObjects]);
	return (
		<div className={clsx(styles.root, className)} style={style}>
			<div className={clsx(styles.search)}>
				<Input
					type="search"
					isSearch
					placeholder="Наименование формы"
					onChange={onSearch}
				/>
			</div>
			<div className={clsx(styles.body)}>
				<Tree
					onItemClick={onNodeClick}
					treeData={filteredTree}
					activeNode={activeNode}
					needSort
					className={styles.tree}
				/>
			</div>

			<div className={clsx(styles.modal_buttons)}>
				<Button onClick={confirmTransition} disabled={!activeForm?.id}>
					Подтвердить переход
				</Button>
			</div>
		</div>
	);
}

export default FormRelations;
