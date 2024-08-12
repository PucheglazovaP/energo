import React, { useCallback, useMemo, useState } from 'react';
import { useStore } from 'effector-react';

import { ArrowDown, ArrowUp, Bin, Edit, Plus } from '../../Icons';
import { $user } from '../../Models/Auth';
import { $emergencyEventsInfo } from '../../Models/EmergencyEvents';
import { moveParameterFx } from '../../Models/EmergencyEvents/effects';
import { openModal } from '../../Models/Modal/events';
import {
	resetParameterCreationData,
	setInfoForEditing,
	setOperation,
	setSelectedParameterId,
	setSelectedParameterParentId,
} from '../../Models/NewEmergencyEventParameter/events';
import {
	ParameterOperation,
	ParameterPosition,
} from '../../Models/NewEmergencyEventParameter/types';
import { $sidebar } from '../../Models/Sidebar';
import { setContextMenuId } from '../../Models/Sidebar/events';
import { RegisteredModals } from '../../Shared/modalsConfig';
import { ModuleName } from '../../Shared/Types/moduleName';
import {
	ContextMenuItem,
	ContextMenuPosition,
} from '../../UI/ContextMenu/types';

import styles from './TreeEmergencyEvents.module.css';

function useContextMenu() {
	const [position, setPosition] = useState<ContextMenuPosition | null>(null);

	const { contextMenuId } = useStore($sidebar);
	const { tree } = useStore($emergencyEventsInfo);

	const user = useStore($user);

	const activeParameter = tree.find((item) => item.id === contextMenuId);

	const items: ContextMenuItem[] = useMemo(
		() => [
			{
				name: 'Новый узел',
				onClick: () => {
					resetParameterCreationData();
					setOperation(ParameterOperation.New);
					setSelectedParameterId(contextMenuId);
					setSelectedParameterParentId(activeParameter?.parentId || null);
					openModal(RegisteredModals.EditParameter);
				},
				renderFn: () => (
					<span className={styles.context_menu_item}>
						<Plus className={styles.icon} />
						<span>Новый узел</span>
					</span>
				),
			},
			{
				name: 'Редактировать',
				onClick: () => {
					resetParameterCreationData();
					setOperation(ParameterOperation.Edit);
					setSelectedParameterId(contextMenuId);
					setSelectedParameterParentId(activeParameter?.parentId || null);
					setInfoForEditing({
						dataTypeCode: activeParameter?.dataTypeCode || null,
						name: activeParameter?.name || '',
						controlGroupNumber: activeParameter?.controlGroupNumber || null,
						dynamicObjectGroupNumber:
							activeParameter?.dynamicObjectGroupNumber || null,
						lastModified: activeParameter?.lastModified || '',
						unitId: activeParameter?.setpointsUnitCode || null,
					});
					openModal(RegisteredModals.EditParameter);
				},
				withSeparator: true,
				renderFn: () => (
					<span className={styles.context_menu_item}>
						<Edit className={styles.icon} />
						<span>Редактировать</span>
					</span>
				),
			},
			{
				name: 'Удалить',
				onClick: () =>
					openModal(RegisteredModals.DeleteEmergencyEventParameter),
				withSeparator: true,
				separatorName: 'Расположение',
				renderFn: () => (
					<span className={styles.context_menu_item}>
						<Bin className={styles.icon} />
						<span>Удалить</span>
					</span>
				),
			},
			{
				name: 'Передвинуть вверх',
				isDisabled: activeParameter?.order === 1,
				onClick: () =>
					moveParameterFx({
						id: contextMenuId,
						lastModified: activeParameter?.lastModified || '',
						sequenceNumber: ParameterPosition.ABOVE,
						userId: user?.preferredUsername || '',
						moduleName: ModuleName.UseContextMenu_moveParameterFx,
					}),
				renderFn: () => (
					<span className={styles.context_menu_item}>
						<ArrowUp className={styles.icon} />
						<span>Передвинуть вверх</span>
					</span>
				),
			},
			{
				name: 'Передвинуть вниз',
				onClick: () =>
					moveParameterFx({
						id: contextMenuId,
						lastModified: activeParameter?.lastModified || '',
						sequenceNumber: ParameterPosition.UNDER,
						userId: user?.preferredUsername || '',
						moduleName: ModuleName.UseContextMenu_moveParameterFx,
					}),
				renderFn: () => (
					<span className={styles.context_menu_item}>
						<ArrowDown className={styles.icon} />
						<span>Передвинуть вниз</span>
					</span>
				),
			},
		],
		[contextMenuId, user, activeParameter],
	);

	const onOpen = useCallback(
		(evt: React.MouseEvent<HTMLButtonElement>, id: number) => {
			evt.preventDefault();
			setPosition({ x: evt.pageX, y: evt.pageY });
			setContextMenuId(id);
		},
		[],
	);

	return {
		items,
		position,
		setPosition,
		onOpen: onOpen,
	};
}

export default useContextMenu;
