import { ChangeEvent, useCallback, useEffect, useMemo, useState } from 'react';
import { useLocation, useSearchParams } from 'react-router-dom';
import { useStore } from 'effector-react';

import useDebounce from '../../Facades/useDebouce';
import { $activeIds } from '../../Models/ActiveIds';
import { $user } from '../../Models/Auth';
import { setFormSettings } from '../../Models/FormSettings/events';
import { $navigation } from '../../Models/Navigation';
import { changeFormRoute } from '../../Models/NavigationHistory/events';
import { $treeForms } from '../../Models/TreeForms';
import { fetchFormTreeDataFx } from '../../Models/TreeForms/effects';
import { getFormInfoById, loadForm } from '../../Models/TreeForms/events';
import { FormTreeItem } from '../../Models/TreeForms/types';
import { TreeTypes } from '../../Shared/types';
import { ModuleName } from '../../Shared/Types/moduleName';
import ContextMenu from '../../UI/ContextMenu';
import Input from '../../UI/Input';
import Spinner from '../../UI/Spinner';
import Tree from '../../UI/Tree';
import { TreeItem } from '../../UI/Tree/types';
import { updateSearchParams } from '../../Utils/searchParams';
import { getFilteredTree } from '../../Utils/treeUtils';

import TreeNode from './TreeNode';
import useContextMenu from './useContextMenu';

import styles from './TreeForms.module.css';

function TreeForms() {
	const treeData = useStore($treeForms);
	const { activeVersion } = useStore($activeIds);
	const { versionId, formId, treeType } = useStore($navigation);
	const user = useStore($user);
	const isLoading = useStore(fetchFormTreeDataFx.pending);

	const [searchParams, setSearchParams] = useSearchParams();

	const [formName, setFormName] = useState<string>('');

	const location = useLocation();

	const {
		onOpen: onOpenContextMenu,
		position,
		setPosition,
		items: itemsContextMenu,
	} = useContextMenu();

	const handleItemClick = useCallback(
		(node: TreeItem) => {
			if (!user) {
				return;
			}
			const { id, formType } = node as FormTreeItem;
			setFormSettings({
				activeId: id,
				formType,
			});
			getFormInfoById({
				formId: id,
				versionCode: activeVersion?.code || 90,
				userId: user.preferredUsername,
			});

			const updatedSearchParams = updateSearchParams(new URLSearchParams(), {
				versionId,
				treeType,
				formId: id,
			});
			changeFormRoute(location.pathname + location.search);
			setSearchParams(updatedSearchParams);
		},
		[activeVersion, location, treeType, versionId, user],
	);

	const handleFormName = useCallback((e: ChangeEvent<HTMLInputElement>) => {
		setFormName(e.target.value);
	}, []);
	const onFormNameChange = useDebounce(handleFormName, 300);

	const customTree = useMemo(() => {
		return treeData.map((node) => ({
			...node,
			renderFn: () => (
				<TreeNode
					name={node.displayName}
					isOwned={node.hasOwner && node.canEdit}
				/>
			),
		}));
	}, [treeData]);

	const filteredTree = useMemo(() => {
		return getFilteredTree(customTree, formName);
	}, [customTree, formName]);

	// Fetch tree data if version is changed
	// INIT first form to load
	useEffect(() => {
		if (!user) {
			return;
		}
		if (versionId)
			fetchFormTreeDataFx({
				versionCode: versionId,
				userId: user.preferredUsername,
				moduleName: ModuleName.TreeForms_fetchFormTreeDataFx,
			}).then(() => {
				loadForm({
					versionId,
					formId,
					userId: user.preferredUsername,
				});
			});
	}, [versionId, user]);

	useEffect(() => {
		const formId = searchParams.get('formId');
		const treeType = searchParams.get('treeType');
		const updatedSearchParams: URLSearchParams = new URLSearchParams(
			searchParams,
		);
		if (Number(formId)) {
			updatedSearchParams.set('formId', String(formId));
		}
		if (!treeType) {
			updatedSearchParams.set('treeType', TreeTypes.Mnemoschemes);
		}
		setSearchParams(updatedSearchParams);
	}, [formId]);

	return (
		<>
			<div className={styles.form__search}>
				<Input
					type="search"
					isSearch
					placeholder="Наименование формы"
					onChange={onFormNameChange}
				/>
			</div>
			{!filteredTree.length && !isLoading && (
				<span className={styles.no_forms}>
					Нет форм, удовлетворяющих критерию поиска
				</span>
			)}
			{isLoading ? (
				<Spinner className={styles.spinner} />
			) : (
				<div className={styles.tree} id="tree">
					<Tree
						activeNode={{ id: formId as number, type: undefined }}
						onItemClick={handleItemClick}
						onContextMenu={onOpenContextMenu}
						treeData={filteredTree}
						needSort
					/>
				</div>
			)}
			<ContextMenu
				items={itemsContextMenu}
				position={position}
				setPosition={setPosition}
			/>
		</>
	);
}

export default TreeForms;
