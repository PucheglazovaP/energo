import React, { useMemo, useState } from 'react';
import { toast } from 'react-toastify';
import { useStore } from 'effector-react';

import { Bin, Copy, FilePlus, LinkOff } from '../../Icons';
import ArrowRight from '../../Icons/ArrowRight';
import Hierarchy from '../../Icons/Hierarchy';
import Image from '../../Icons/Image';
import { $user } from '../../Models/Auth';
import { $editMode, $selectedObjectsState } from '../../Models/EditMode';
import { deleteObjectFx } from '../../Models/EditMode/effects';
import { $formContextMenu } from '../../Models/FormContextMenu';
import {
	copyDynamicObject,
	copyStatusIndicator,
	copyTransparent,
	setContextMenuObjectForCopy,
	switchToSubForm,
} from '../../Models/FormContextMenu/events';
import { $formLayers } from '../../Models/FormLayers';
import { changeFormObjectLayerFx } from '../../Models/FormLayers/effects';
import { openModal } from '../../Models/Modal/events';
import { RegisteredModals } from '../../Shared/modalsConfig';
import { ConfigurationTypes } from '../../Shared/types';
import { ObjectTypes } from '../../Shared/Types/formObject';
import { ModuleName } from '../../Shared/Types/moduleName';
import {
	ContextMenuItem,
	ContextMenuPosition,
} from '../../UI/ContextMenu/types';
import {
	isDynamicObject,
	isStatusIndicator,
	isTransparant,
} from '../../Utils/guards';

import { getReshapeRectangle } from './utils';

import styles from './EditForm.module.css';

/*
    Context menu logic for edit form
*/
function useContextMenu() {
	const [position, setPosition] = useState<ContextMenuPosition | null>(null);
	const {
		object: contextMenuObject,
		objectsForCopy,
		pasteCoord,
	} = useStore($formContextMenu);
	const user = useStore($user);
	const { selectedConfigurationType } = useStore($editMode);
	const { selectedObjects } = useStore($selectedObjectsState);
	const { formLayers, mainLayer, checkedFormLayers } = useStore($formLayers);

	const mainLayerId = formLayers.find(
		(item) => item.name === mainLayer.name,
	)?.id;

	const filteredSelectedObjects = selectedObjects.filter((item) =>
		checkedFormLayers.includes(item.layerId),
	);
	/* 	const filteredObjectsForCopy = objectsForCopy.filter((item) =>
		checkedFormLayers.includes(item.layerId),
	); */
	const handleDeleteBtnClick = () => {
		if (!user) {
			return;
		}
		const newObjectsForCopy = objectsForCopy.filter(
			(item) =>
				!filteredSelectedObjects.some((object) => object.id === item.id),
		);
		Promise.allSettled(
			filteredSelectedObjects.map((item) =>
				deleteObjectFx({
					objectId: item.id,
					userId: user.preferredUsername,
					moduleName: ModuleName.UseContextMenu_deleteObjectFx,
				}),
			),
		).then(() => setContextMenuObjectForCopy(newObjectsForCopy));
	};
	const handleCopyObjectClick = () => {
		setContextMenuObjectForCopy(filteredSelectedObjects);
	};

	const handleUnbindObject = () => {
		if (!user) return;
		if (contextMenuObject)
			changeFormObjectLayerFx({
				objectId: contextMenuObject?.id,
				layerId: mainLayerId || 1,
				userId: user.preferredUsername,
				moduleName: ModuleName.EditForm_useContextMenu_changeFormObjectLayerFx,
			}).then(() => toast.success('Объект отвязан от слоя'));
	};

	const handlePasteObjectClick = () => {
		if (!user) {
			return;
		}

		if (pasteCoord.x != null && pasteCoord.y != null && objectsForCopy.length) {
			const reshapeRectanglePos = getReshapeRectangle(objectsForCopy);
			for (const selectedObject of objectsForCopy) {
				/* 				const deltaX: number = Math.round(objectsForCopy[0].x - pasteCoord.x);
				const deltaY: number = Math.round(objectsForCopy[0].y - pasteCoord.y); */
				const deltaX: number = Math.round(
					reshapeRectanglePos.startX - pasteCoord.x,
				);
				const deltaY: number = Math.round(
					reshapeRectanglePos.startY - pasteCoord.y,
				);
				let newXCoord = Math.round(Number(selectedObject.x || 0) - deltaX);
				let newYCoord = Math.round(Number(selectedObject.y || 0) - deltaY);

				if (newXCoord >= 791 || newXCoord < 0) newXCoord = 0;
				if (newYCoord >= 528 || newYCoord < 0) newYCoord = 0;
				switch (selectedObject.objectType) {
					case ObjectTypes.Transparent: {
						copyTransparent({
							x: newXCoord,
							y: newYCoord,
							objectId: selectedObject.id,
							userId: user.preferredUsername,
						});
						break;
					}
					case ObjectTypes.DynamicObject: {
						copyDynamicObject({
							x: newXCoord,
							y: newYCoord,
							objectId: selectedObject.id,
							userId: user.preferredUsername,
						});
						break;
					}
					case ObjectTypes.StatusIndicator: {
						copyStatusIndicator({
							x: newXCoord,
							y: newYCoord,
							objectId: selectedObject.id,
							userId: user.preferredUsername,
						});
						break;
					}
				}
			}
		}
	};

	const isObjectHasSubForm = useMemo(() => {
		if (contextMenuObject) {
			const gotonCode = contextMenuObject.gotonCode;
			const flag: boolean = gotonCode !== null && gotonCode !== -1;
			return flag;
		}
		return true;
	}, [contextMenuObject]);

	const isObjectBindedToMainLayer = useMemo(() => {
		if (contextMenuObject) {
			return (
				mainLayerId === contextMenuObject.layerId ||
				mainLayer.id === contextMenuObject.layerId
			);
		}
		return true;
	}, [contextMenuObject, mainLayerId]);

	const handleSubFormClick = () => {
		if (contextMenuObject) switchToSubForm(contextMenuObject.id);
	};

	const getDefaultItems = (): ContextMenuItem[] => [
		{
			name: 'Вставить',
			onClick: () => handlePasteObjectClick(),
			renderFn: () => (
				<div className={styles.context_menu_item}>
					<FilePlus className={styles.context_menu_icon} />
					<span>Вставить</span>
				</div>
			),
		},
	];

	const getTransparantItems = (): // transparant: TransparentConfiguration,
	ContextMenuItem[] => [
		{
			name: 'Копировать',
			onClick: handleCopyObjectClick,
			renderFn: () => (
				<div className={styles.context_menu_item}>
					<Copy className={styles.context_menu_icon} />
					<span>Копировать</span>
				</div>
			),
		},
		{
			name: 'Удалить',
			isDisabled: contextMenuObject == null,
			onClick: handleDeleteBtnClick,
			renderFn: () => (
				<div className={styles.context_menu_item}>
					<Bin className={styles.context_menu_icon} />
					<span>Удалить</span>
				</div>
			),
		},
		{
			name: 'Создать подчиненную форму',
			isDisabled: isObjectHasSubForm || filteredSelectedObjects.length > 1,
			onClick: () => openModal(RegisteredModals.CreateNewFormFromTransparent),
			renderFn: () => (
				<div className={styles.context_menu_item}>
					<Hierarchy className={styles.context_menu_icon} />
					<span>Создать подчиненную форму</span>
				</div>
			),
		},
		{
			name: 'Перейти на подчиненную форму',
			onClick: handleSubFormClick,
			isDisabled: !isObjectHasSubForm || filteredSelectedObjects.length > 1,
			renderFn: () => (
				<div className={styles.context_menu_item}>
					<ArrowRight className={styles.context_menu_icon} />
					<span>Перейти на подчиненную форму</span>
				</div>
			),
		},
	];

	const getStatusIndicatorItems = (): ContextMenuItem[] => [
		{
			name: 'Копировать',
			onClick: handleCopyObjectClick,
			renderFn: () => (
				<div className={styles.context_menu_item}>
					<Copy className={styles.context_menu_icon} />
					<span>Копировать</span>
				</div>
			),
		},
		{
			name: 'Удалить',
			isDisabled: contextMenuObject == null,
			onClick: handleDeleteBtnClick,
			renderFn: () => (
				<div className={styles.context_menu_item}>
					<Bin className={styles.context_menu_icon} />
					<span>Удалить</span>
				</div>
			),
		},
	];

	const layerMenuItems: ContextMenuItem[] = [
		{
			name: 'Отвязать от слоя',
			onClick: handleUnbindObject,
			isDisabled: isObjectBindedToMainLayer,
			renderFn: () => (
				<span className={styles.context_menu_item}>
					<LinkOff className={styles.context_menu_icon} />
					<span>Отвязать от слоя</span>
				</span>
			),
		},
	];

	const getDynamicObjectItems =
		(): // dynamicObject: DynamicObjectConfiguration,
		ContextMenuItem[] => [
			{
				name: 'Копировать',
				onClick: handleCopyObjectClick,
				renderFn: () => (
					<div className={styles.context_menu_item}>
						<Copy className={styles.context_menu_icon} />
						<span>Копировать</span>
					</div>
				),
			},
			{
				name: 'Удалить',
				isDisabled: contextMenuObject == null,
				onClick: handleDeleteBtnClick,
				renderFn: () => (
					<div className={styles.context_menu_item}>
						<Bin className={styles.context_menu_icon} />
						<span>Удалить</span>
					</div>
				),
			},
			{
				name: 'Прикреплённые изображения',
				onClick: () => openModal(RegisteredModals.DynamicObjectImages),
				isDisabled: filteredSelectedObjects.length > 1,
				renderFn: () => (
					<div className={styles.context_menu_item}>
						<Image className={styles.context_menu_icon} />
						<span>Прикреплённые изображения</span>
					</div>
				),
			},
			{
				name: 'Создать подчиненную форму',
				isDisabled: isObjectHasSubForm || filteredSelectedObjects.length > 1,
				onClick: () =>
					openModal(RegisteredModals.CreateNewFormFromDynamicObject),
				renderFn: () => (
					<div className={styles.context_menu_item}>
						<Hierarchy className={styles.context_menu_icon} />
						<span>Создать подчиненную форму</span>
					</div>
				),
			},
			{
				name: 'Перейти на подчиненную форму',
				onClick: handleSubFormClick,
				isDisabled: !isObjectHasSubForm || filteredSelectedObjects.length > 1,
				renderFn: () => (
					<div className={styles.context_menu_item}>
						<ArrowRight className={styles.context_menu_icon} />
						<span>Перейти на подчиненную форму</span>
					</div>
				),
			},
		];

	const getContextMenuItems = (): ContextMenuItem[] => {
		if (isStatusIndicator(contextMenuObject)) {
			const statusIndicatorContextMenuItems = getStatusIndicatorItems();
			if (selectedConfigurationType === ConfigurationTypes.Layers)
				return [...statusIndicatorContextMenuItems, ...layerMenuItems];
			return statusIndicatorContextMenuItems;
		}
		if (isDynamicObject(contextMenuObject)) {
			// TODO: when we will add more context properties to the DO, we will need it
			// return getDynamicObjectItems(contextMenuObject);
			const dynamicObjectContextMenuItems = getDynamicObjectItems();
			if (selectedConfigurationType === ConfigurationTypes.Layers)
				return [...dynamicObjectContextMenuItems, ...layerMenuItems];
			return dynamicObjectContextMenuItems;
		}
		if (isTransparant(contextMenuObject)) {
			// TODO: the same applies here
			const transparentContextMenuItems = getTransparantItems();
			if (selectedConfigurationType === ConfigurationTypes.Layers)
				return [...transparentContextMenuItems, ...layerMenuItems];
			return transparentContextMenuItems;
		}

		if (objectsForCopy && objectsForCopy.length > 0) return getDefaultItems();
		// возвращаю такой список чтобы контейнер контекстного меню был всегда полон
		// в логике контекстного меню getBoundingClientRect возвращает размеры пустого списка меню
		return getTransparantItems();
	};

	return {
		position,
		setPosition,
		contextMenuObject,
		items: getContextMenuItems(),
		objectsForCopy,
	};
}

export default useContextMenu;
