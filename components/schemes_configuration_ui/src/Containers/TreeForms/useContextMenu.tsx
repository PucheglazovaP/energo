import React, { useCallback, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Send } from '@evraz/ui-kit';
import { useStore } from 'effector-react';

import {
	Angle,
	ArrowDown,
	ArrowUp,
	Bin,
	Copy,
	FilePlus,
	Plus,
} from '../../Icons';
import EditIcon from '../../Icons/Edit';
import { Direction } from '../../Icons/types';
import { $activeIds } from '../../Models/ActiveIds';
import { $roles, $user } from '../../Models/Auth';
import { fetchFormInfoForEditingFx } from '../../Models/EditMode/effects';
import { setEditMode } from '../../Models/EditMode/events';
import { setFormSettings } from '../../Models/FormSettings/events';
import { openModal } from '../../Models/Modal/events';
import { $navigation } from '../../Models/Navigation';
import { changeFormRoute } from '../../Models/NavigationHistory/events';
import { $newForm } from '../../Models/NewForm';
import {
	setCopiedId,
	setCopiedIdChildrenFlag,
	setFormOperation,
} from '../../Models/NewForm/events';
import { FormOperation, FormPosition } from '../../Models/NewForm/types';
import { $sidebar } from '../../Models/Sidebar';
import { setContextMenuId } from '../../Models/Sidebar/events';
import { $treeForms } from '../../Models/TreeForms';
import { moveFormFx } from '../../Models/TreeForms/effects';
import { getFormInfoById } from '../../Models/TreeForms/events';
import { FormTreeItem } from '../../Models/TreeForms/types';
import { Permissions } from '../../packages/KeycloakInstance/types';
import usePermissions from '../../packages/KeycloakInstance/usePermissions';
import { checkPermission } from '../../packages/KeycloakInstance/utils';
import { RegisteredModals } from '../../Shared/modalsConfig';
import { FormTypes, Role } from '../../Shared/types';
import { ModuleName } from '../../Shared/Types/moduleName';
import {
	ContextMenuItem,
	ContextMenuPosition,
} from '../../UI/ContextMenu/types';
import { updateSearchParams } from '../../Utils/searchParams';

import { getSelectedForm } from './utils';

import styles from './TreeForms.module.css';

/* 
    Context menu logic for tree of forms
*/
function useContextMenu() {
	const [position, setPosition] = useState<ContextMenuPosition | null>(null);

	const { contextMenuId } = useStore($sidebar);
	const { treeType } = useStore($navigation);
	const { activeVersion } = useStore($activeIds);

	const { copiedId, withChildren } = useStore($newForm);

	const forms = useStore($treeForms);
	const user = useStore($user);
	const userRoles = useStore($roles);

	const permissions = usePermissions();
	const [, setSearchParams] = useSearchParams();

	/* 	const withChildren = useMemo(() => {
		const copiedForm = forms.find((form) => form.id === copiedId);
		if (copiedForm) {
			const test = forms.some((form) => form.parentId === copiedForm.id);
			return test;
		}
		return false;
	}, [forms, copiedId]); */

	const isDeleteDisabled = () => {
		const selectedForm: FormTreeItem | undefined = forms.find(
			(form) => form.id === contextMenuId,
		);
		if (!selectedForm) {
			return true;
		}
		return !selectedForm.canEdit;
	};

	const isPublishDisabled = () => {
		if (!userRoles.includes(Role.EM_ADMIN)) {
			return true;
		}
		const selectedForm: FormTreeItem | undefined = getSelectedForm(
			forms,
			contextMenuId,
		);
		if (!selectedForm) {
			return true;
		}
		return !selectedForm.hasOwner;
	};

	const handleEditClick = () => {
		if (!user) {
			return;
		}
		setEditMode(true);
		getFormInfoById({
			formId: contextMenuId,
			versionCode: activeVersion?.code || 90,
			userId: user.preferredUsername,
		});
		const selectedForm = forms.find((form) => form.id === contextMenuId);
		setFormSettings({
			isEditMode: true,
			activeId: contextMenuId,
			formType: selectedForm?.formType || FormTypes.Form,
		});
		fetchFormInfoForEditingFx({
			formId: contextMenuId,
			versionCode: activeVersion?.code || 90,
			userId: user.preferredUsername,
		});
		const updatedSearchParams = updateSearchParams(new URLSearchParams(), {
			versionId: activeVersion?.code || 90,
			treeType,
			formId: contextMenuId,
		});
		changeFormRoute(location.pathname + location.search);
		setSearchParams(updatedSearchParams);
	};

	const handleCopyClick = (id: number) => {
		const copiedForm = forms.find((form) => form.id === id);
		let withChildren = false;
		if (copiedForm) {
			const test = forms.some((form) => form.parentId === copiedForm.id);
			withChildren = test;
		}

		setCopiedIdChildrenFlag(withChildren);
		setCopiedId(id);
	};

	const items: ContextMenuItem[] = useMemo(
		() => [
			{
				name: 'Новая форма',
				onClick: () => {
					setFormOperation(FormOperation.NEW);
					openModal(RegisteredModals.CreateNewForm);
				},
				isDisabled: !checkPermission(permissions, Permissions.CanCreateNewForm),
				renderFn: () => (
					<span className={styles.context_menu_item}>
						<Plus className={styles.icon} />
						<span>Новая форма</span>
					</span>
				),
			},
			{
				name: 'Опубликовать',
				onClick: () => openModal(RegisteredModals.PublishForm),
				isDisabled: isPublishDisabled(),
				withSeparator: true,
				renderFn: () => (
					<span className={styles.context_menu_item}>
						<Send className={styles.icon} />
						<span>Опубликовать</span>
					</span>
				),
			},
			{
				name: 'Редактировать',
				onClick: () => handleEditClick(),
				isDisabled: !checkPermission(permissions, Permissions.CanEditForm),
				renderFn: () => (
					<span className={styles.context_menu_item}>
						<EditIcon className={styles.icon} />
						<span>Редактировать</span>
					</span>
				),
			},
			{
				name: 'Копировать',
				onClick: () => handleCopyClick(contextMenuId),
				isDisabled: !checkPermission(permissions, Permissions.CanCopyForm),
				renderFn: () => (
					<span className={styles.context_menu_item}>
						<Copy className={styles.icon} />
						<span>Копировать</span>
					</span>
				),
			},
			{
				name: 'Вставить',
				isDisabled:
					!checkPermission(permissions, Permissions.CanPasteForm) || !copiedId,
				renderFn: () => (
					<span className={styles.context_menu_item}>
						<FilePlus className={styles.icon} />
						<span className={styles.context_menu_item_name}>Вставить</span>
						<Angle
							className={styles.icon_intermediate}
							direction={Direction.RIGHT}
						/>
					</span>
				),
				children: [
					{
						name: 'Без потомков',
						onClick: () => {
							setFormOperation(FormOperation.COPY);
							openModal(RegisteredModals.CreateNewForm);
						},
					},
					{
						name: 'Со всеми потомками',
						isDisabled: !withChildren,
						onClick: () => {
							setFormOperation(FormOperation.COPY_WITH_CHILDREN);
							openModal(RegisteredModals.CreateNewForm);
						},
					},
				],
			},
			{
				name: 'Удалить',
				onClick: () => openModal(RegisteredModals.ConfirmFormDeletion),
				withSeparator: true,
				separatorName: 'Расположение',
				isDisabled: isDeleteDisabled(),
				renderFn: () => (
					<span className={styles.context_menu_item}>
						<Bin className={styles.icon} />
						<span>Удалить</span>
					</span>
				),
			},
			{
				name: 'Передвинуть вверх',
				onClick: () =>
					moveFormFx({
						formId: contextMenuId,
						versionCode: activeVersion?.code || 0,
						move: FormPosition.ABOVE,
						userId: user?.preferredUsername || '',
						moduleName: ModuleName.UseContextMenu_moveFormFx,
					}),
				isDisabled: !checkPermission(permissions, Permissions.CanMoveForm),
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
					moveFormFx({
						formId: contextMenuId,
						versionCode: activeVersion?.code || 0,
						move: FormPosition.UNDER,
						userId: user?.preferredUsername || '',
						moduleName: ModuleName.UseContextMenu_moveFormFx,
					}),
				isDisabled: !checkPermission(permissions, Permissions.CanMoveForm),
				renderFn: () => (
					<span className={styles.context_menu_item}>
						<ArrowDown className={styles.icon} />
						<span>Передвинуть вниз</span>
					</span>
				),
			},
		],
		[
			contextMenuId,
			activeVersion,
			copiedId,
			isDeleteDisabled,
			user,
			isPublishDisabled,
			permissions,
		],
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
		onOpen: checkPermission(permissions, Permissions.CanSeeFormContextMenu)
			? onOpen
			: undefined,
	};
}

export default useContextMenu;
