import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { Button, Eye, EyeClosed } from '@evraz/ui-kit';
import clsx from 'clsx';
import { useStore } from 'effector-react';

import {
	ArrowDown,
	ArrowsOpposite,
	ArrowUp,
	Bin,
	Close,
	LinkOff,
} from '../../Icons';
import Hierarchy from '../../Icons/Hierarchy';
import LinkOn from '../../Icons/LinkOn';
import { $user } from '../../Models/Auth';
import { $selectedObjectsState } from '../../Models/EditMode';
import { setSelectedObjects } from '../../Models/EditMode/events';
import { $formLayers } from '../../Models/FormLayers';
import {
	changeFormObjectLayerFx,
	deleteFormLayerFx,
	getCurrentFormLayersFx,
	replaceFormLayerFx,
} from '../../Models/FormLayers/effects';
import {
	changeCheckedFormLayers,
	setActiveFormLayer,
	setReplacedFormLayerId,
} from '../../Models/FormLayers/events';
import { ModuleName } from '../../Shared/Types/moduleName';
import {
	ContextMenuItem,
	ContextMenuPosition,
} from '../../UI/ContextMenu/types';
import { TreeItem } from '../../UI/Tree/types';

import { ReplaceActionType } from './const';

import styles from './FormLayers.module.css';

function useCurrentFormTreeLayers() {
	const user = useStore($user);
	const {
		checkedFormLayers,
		formLayers,
		replacedFormLayerId,
		activeFormLayerId,
		mainLayer,
	} = useStore($formLayers);
	const { selectedObjects } = useStore($selectedObjectsState);
	const isLoading = useStore(getCurrentFormLayersFx.pending);

	const [position, setPosition] = useState<ContextMenuPosition | null>(null);
	const [contextMenuId, setContextMenuId] = useState<number | null>(null);
	const [isReplaceMode, setReplaceMode] = useState<boolean>(false);

	const mainLayerId = formLayers.find(
		(item) => item.name === mainLayer.name,
	)?.id;
	const filteredSelectedObjects = selectedObjects.filter((item) =>
		checkedFormLayers.includes(item.layerId),
	);

	const treeData = formLayers.map((item) => ({
		id: item.id,
		order: item.order || 1,
		parentId: item.parentId,
		displayName: item.name,
		name: item.name,
		isLast: !formLayers.some((form) => form.parentId === item.id),
		renderFn: () => {
			const isChecked = checkedFormLayers.includes(item.id);
			return (
				<div className={styles.tree_item}>
					<div> {item.name}</div>
					<div className={styles.tree_item_buttons}>
						<Button
							className={clsx(
								styles.link_btn,
								filteredSelectedObjects.length > 0 && styles.link_btn__visible,
							)}
							onClick={() => {
								handleBindFormObjectToLayer(item.id);
							}}
						>
							<LinkOn className={styles.icon} />
						</Button>
						<Button
							className={styles.show_btn}
							onClick={(event) => {
								event.stopPropagation();
								handleShowLayerClick(item.id, !isChecked);
								if (item.name === mainLayer.name)
									handleShowLayerClick(1, !isChecked);
							}}
						>
							{isChecked ? (
								<Eye className={styles.eye_icon} />
							) : (
								<EyeClosed className={styles.eye_icon} />
							)}
						</Button>
					</div>
				</div>
			);
		},
	}));

	const defaultContextMenuItems: ContextMenuItem[] = [
		{
			name: 'Отвязать все объекты',
			onClick: () => handleUnbindAllObjects(),
			isDisabled: activeFormLayerId === mainLayerId,
			renderFn: () => (
				<span className={styles.context_menu_item}>
					<LinkOff className={styles.context_menu_icon} />
					<span>Отвязать все объекты</span>
				</span>
			),
		},
		{
			name: 'Переместить',
			onClick: () => {
				setReplacedFormLayerId(contextMenuId);
				setReplaceMode(true);
			},
			isDisabled: activeFormLayerId === mainLayerId,
			withSeparator: true,
			renderFn: () => (
				<span className={styles.context_menu_item}>
					<ArrowsOpposite className={styles.context_menu_icon} />
					<span>Переместить</span>
				</span>
			),
		},
		{
			name: 'Исключить из дерева',
			onClick: () => handleDeleteFormLayer(),
			isDisabled: activeFormLayerId === mainLayerId,
			renderFn: () => (
				<span className={styles.context_menu_item}>
					<Bin className={styles.context_menu_icon} />
					<span>Исключить из дерева</span>
				</span>
			),
		},
	];
	const replaceModeContextMenuItems: ContextMenuItem[] = [
		{
			name: 'Выше текущего узла',
			onClick: () => {
				handleReplaceNode(ReplaceActionType.Higher);
			},
			isDisabled: false,
			renderFn: () => (
				<span className={styles.context_menu_item}>
					<ArrowUp className={styles.context_menu_icon} />
					<span>Выше текущего узла</span>
				</span>
			),
		},
		{
			name: 'Ниже текущего узла',
			onClick: () => {
				handleReplaceNode(ReplaceActionType.Lower);
			},
			isDisabled: false,
			renderFn: () => (
				<span className={styles.context_menu_item}>
					<ArrowDown className={styles.context_menu_icon} />
					<span>Ниже текущего узла</span>
				</span>
			),
		},
		{
			name: 'Вставить потомком текущего узла',
			onClick: () => {
				handleReplaceNode(ReplaceActionType.Child);
			},
			isDisabled: false,
			withSeparator: true,
			renderFn: () => (
				<span className={styles.context_menu_item}>
					<Hierarchy className={styles.context_menu_icon} />
					<span>Вставить потомком текущего узла</span>
				</span>
			),
		},
		{
			name: 'Отменить перенос',
			onClick: () => {
				setReplaceMode(false);
				setReplacedFormLayerId(null);
			},
			isDisabled: false,
			renderFn: () => (
				<span className={styles.context_menu_item}>
					<Close className={styles.context_menu_icon} />
					<span>Отменить перенос</span>
				</span>
			),
		},
	];

	const handleItemClick = (node: TreeItem) => {
		setActiveFormLayer(node.id);
	};
	const handleUnbindAllObjects = () => {
		if (!user) return;
		const formLayer = formLayers.find((item) => item.id === contextMenuId);
		const formObjects = filteredSelectedObjects.filter(
			(item) =>
				item.layerId === formLayer?.layerId || item.layerId === formLayer?.id,
		);
		Promise.allSettled(
			formObjects.map((formObject) =>
				changeFormObjectLayerFx({
					objectId: formObject.id,
					layerId: mainLayerId || 1,
					userId: user.preferredUsername,
					moduleName:
						ModuleName.UseCurrentFormTreeLayers_changeFormObjectLayerFx,
				}),
			),
		).then(() => toast.success('Объекты отвязаны от слоя'));
	};

	const handleReplaceNode = async (actionType: ReplaceActionType) => {
		if (!user) return;
		const replacedFormLayer = formLayers.find(
			(item) => item.id === replacedFormLayerId,
		);
		if (replacedFormLayer) {
			let parentLayerId = 0;
			let prevLayerId = 0;
			switch (actionType) {
				case ReplaceActionType.Higher: {
					const formLayer = formLayers.find(
						(item) => item.id === contextMenuId,
					);
					parentLayerId = replacedFormLayer?.parentId || 0;
					prevLayerId =
						formLayers.find(
							(item) => item.order === (formLayer?.order || 1) - 1,
						)?.id || 0;
					break;
				}
				case ReplaceActionType.Lower: {
					const formLayer = formLayers.find(
						(item) => item.id === contextMenuId,
					);
					parentLayerId = replacedFormLayer?.parentId || 0;
					prevLayerId = formLayer?.order || 1;
					break;
				}
				case ReplaceActionType.Child: {
					const formLayer = formLayers.find(
						(item) => item.id === contextMenuId,
					);
					parentLayerId = formLayer?.id || 0;
					prevLayerId = 0;
					break;
				}
			}
			replaceFormLayerFx({
				lastModified: replacedFormLayer.lastModified,
				layerId: replacedFormLayer.id,
				parentLayerId,
				prevLayerId,
				userId: user.preferredUsername,
				moduleName: ModuleName.UseCurrentFormTreeLayers_getCurrentFormLayersFx,
			});
		}
		setReplaceMode(false);
		setReplacedFormLayerId(null);
	};
	const handleOpenContextMenu = (
		evt: React.MouseEvent<HTMLButtonElement>,
		id: number,
	) => {
		evt.preventDefault();
		setPosition({ x: evt.pageX, y: evt.pageY });
		setContextMenuId(id);
		setActiveFormLayer(id);
	};
	const handleShowLayerClick = (id: number, isChecked: boolean) => {
		changeCheckedFormLayers({ id, isChecked });
	};
	const handleDeleteFormLayer = async () => {
		if (!user) return;
		const formLayer = formLayers.find((item) => item.id === contextMenuId);
		if (formLayer) {
			await Promise.allSettled(
				filteredSelectedObjects.map((formObject) =>
					changeFormObjectLayerFx({
						objectId: formObject.id,
						layerId: mainLayerId || 1,
						userId: user.preferredUsername,
						moduleName:
							ModuleName.UseCurrentFormTreeLayers_changeFormObjectLayerFx,
					}),
				),
			);
			await deleteFormLayerFx({
				layerId: formLayer.id,
				lastModified: formLayer.lastModified,
				userId: user.preferredUsername,
				moduleName: ModuleName.UseCurrentFormTreeLayers_deleteFormLayerFx,
			});
			setSelectedObjects([]);
		}
	};
	const handleBindFormObjectToLayer = (id: number) => {
		if (!user) return;
		Promise.allSettled(
			filteredSelectedObjects.map((formObject) =>
				changeFormObjectLayerFx({
					objectId: formObject.id,
					layerId: id,
					userId: user.preferredUsername,
					moduleName:
						ModuleName.UseCurrentFormTreeLayers_changeFormObjectLayerFx,
				}),
			),
		).then(() => toast.success('Объекты связаны со слоем'));
	};

	return {
		isLoading,
		treeData,
		position,
		contextMenuItems: isReplaceMode
			? replaceModeContextMenuItems
			: defaultContextMenuItems,
		activeFormLayerId,
		setPosition,
		handleItemClick,
		handleOpenContextMenu,
	};
}

export default useCurrentFormTreeLayers;
