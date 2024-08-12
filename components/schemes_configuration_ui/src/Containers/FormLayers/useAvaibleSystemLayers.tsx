import React, { useEffect, useState } from 'react';
import { Checkbox, Search, Tooltip, TooltipDirection } from '@evraz/ui-kit';
import clsx from 'clsx';
import { useStore } from 'effector-react';

import { Bin, Comment } from '../../Icons';
import EditIcon from '../../Icons/Edit';
import { $activeIds } from '../../Models/ActiveIds';
import { $user } from '../../Models/Auth';
import { $editMode } from '../../Models/EditMode';
import { $formLayers } from '../../Models/FormLayers';
import {
	createFormLayerFx,
	deleteFormLayerFx,
	getSystemLayersFx,
} from '../../Models/FormLayers/effects';
import {
	changeCheckedSystemLayers,
	setSystemLayerActionType,
	setSystemLayerEditData,
} from '../../Models/FormLayers/events';
import { openModal } from '../../Models/Modal/events';
import { RegisteredModals } from '../../Shared/modalsConfig';
import { Action, SystemLayer } from '../../Shared/types';
import { ModuleName } from '../../Shared/Types/moduleName';
import {
	ContextMenuItem,
	ContextMenuPosition,
} from '../../UI/ContextMenu/types';
import MultiselectDropdownSearchAndSortRender from '../../UI/MultiselectDropdown/MultiselectDropdownSearchAndSortRender';
import { ITableBody, ITableColumn } from '../../UI/Table/types';

import styles from './FormLayers.module.css';

function useAvaibleSystemLayers() {
	const user = useStore($user);
	const { checkedSystemLayers, avaibleSystemLayers, formLayers, mainLayer } =
		useStore($formLayers);
	const { id: formId } = useStore($editMode);
	const activeIds = useStore($activeIds);
	const isLoading = useStore(getSystemLayersFx.pending);

	const [searchValue, setSearchValue] = useState('');
	const [contextMenuId, setContextMenuId] = useState<number | null>(null);
	const [position, setPosition] = useState<ContextMenuPosition | null>(null);

	const handleDeleteSystemLayer = async () => {
		const layer = avaibleSystemLayers.find((item) => item.id === contextMenuId);
		if (layer) {
			setSystemLayerEditData(layer);
			openModal(RegisteredModals.ConfirmSystemLayerDeletion);
		}
	};
	const handleEditSystemLayer = () => {
		setSystemLayerActionType(Action.Update);
		const layer = avaibleSystemLayers.find((item) => item.id === contextMenuId);
		if (layer) {
			setSystemLayerEditData(layer);
			openModal(RegisteredModals.CreateSystemLayer);
		}
	};

	const contextMenuItems: ContextMenuItem[] = [
		{
			name: 'Редактировать',
			onClick: handleEditSystemLayer,
			isDisabled: false,
			renderFn: () => (
				<span className={styles.context_menu_item}>
					<EditIcon className={styles.context_menu_icon} />
					<span>Редактировать</span>
				</span>
			),
		},
		{
			name: 'Удалить',
			onClick: handleDeleteSystemLayer,
			isDisabled: false,
			renderFn: () => (
				<span className={styles.context_menu_item}>
					<Bin className={styles.context_menu_icon} />
					<span>Удалить</span>
				</span>
			),
		},
	];

	const handleSearch = (value: string) => {
		setSearchValue(value);
	};
	const handleContextMenu = (evt: React.MouseEvent, id: number) => {
		evt.preventDefault();
		setPosition({
			x: evt.pageX,
			y: evt.pageY,
		});
		setContextMenuId(id);
	};

	const header: ITableColumn[] = [
		{
			accessor: 'checkbox',
			text: ' ',
			sortOrder: 0,
			renderHeaderCell: () => {
				const isIndeterminate =
					checkedSystemLayers.length > 0 &&
					checkedSystemLayers.length < avaibleSystemLayers.length;
				const isChecked =
					avaibleSystemLayers.length === checkedSystemLayers.length &&
					checkedSystemLayers.length !== 0;
				return (
					<Checkbox
						isIndeterminate={isIndeterminate}
						isChecked={isChecked}
						onChange={handleHeaderCheckboxChange}
						className={clsx(styles.checkbox, {
							[styles.indeterminate]: isIndeterminate,
							[styles.checked]: isChecked,
						})}
					/>
				);
			},
		},
		{
			accessor: 'name',
			text: 'name',
			sortOrder: 0,
			renderHeaderCell: MultiselectDropdownSearchAndSortRender({
				placeholder: 'Наименование слоя',
				searchValue,
				onSearch: handleSearch,
				isSearchable: true,
				isSortable: false,
				accessor: 'name',
				glyph: <Search className={styles.search_icon} />,
				className: styles.header_searchable,
			}),
		},
		{
			accessor: 'comment',
			text: 'Коммент.',
			isResizable: false,
			isSortable: false,
			sortOrder: 0,
			minWidth: 30,
			width: 50,
			renderHeaderCell: () => (
				<div className={styles.header_comment}>
					<Comment className={styles.comment_icon} />
				</div>
			),
		},
	];
	const filteredData = avaibleSystemLayers.filter((item) =>
		item.name.toLowerCase().includes(searchValue.toLowerCase()),
	);
	const tableData: ITableBody[] = filteredData.map((item: SystemLayer) => ({
		dataLine: [
			{
				accessor: 'checkbox',
				text: '',
				renderCell: () => {
					const isChecked = checkedSystemLayers.includes(item.id);
					// основной слой нельзя отключить/удалить
					const isDisabled = item.id === mainLayer.id;
					return (
						<Checkbox
							isChecked={isChecked}
							isDisabled={isDisabled}
							onChange={() => handleCheckboxCheck(item.id, !isChecked)}
							className={clsx(styles.checkbox, {
								[styles.checked]: isChecked,
							})}
						/>
					);
				},
			},
			{
				accessor: 'name',
				text: item.name,
			},
			{
				accessor: 'comment',
				text: '',
				renderCell: () =>
					item.comment ? (
						<Tooltip
							tooltip={item.comment}
							forceDirection={TooltipDirection.Left}
						>
							<div>
								<Comment
									className={clsx(
										styles.comment_icon,
										styles.comment_icon__active,
									)}
								/>
							</div>
						</Tooltip>
					) : (
						<Comment className={clsx(styles.comment_icon)} />
					),
			},
		],
		onContextMenu: (evt) => handleContextMenu(evt, item.id),
	}));

	const handleCreateLayer = () => {
		setSystemLayerActionType(Action.Create);
		openModal(RegisteredModals.CreateSystemLayer);
	};
	const handleHeaderCheckboxChange = () => {};

	const handleCheckboxCheck = (id: number, isChecked: boolean) => {
		if (!user) return;
		changeCheckedSystemLayers({ id, isChecked });
		const parentLayerId = formLayers.find((item) => item.parentId == null)?.id;
		if (isChecked) {
			createFormLayerFx({
				formId: formId || 0,
				userId: user.preferredUsername,
				layerId: id,
				parentLayerId: parentLayerId || 0,
				moduleName: ModuleName.UseAvaibleSystemLayers_createFormLayerFx,
			});
		} else {
			const formLayer = formLayers.find((item) => item.layerId === id);
			if (formLayer) {
				deleteFormLayerFx({
					layerId: formLayer.id,
					lastModified: formLayer.lastModified,
					userId: user.preferredUsername,
					moduleName: ModuleName.UseAvaibleSystemLayers_deleteFormLayerFx,
				});
			}
		}
	};

	useEffect(() => {
		if (!user) return;
		getSystemLayersFx({
			userId: user.preferredUsername,
			systemCode: activeIds.activeVersion?.systemCode || 0,
			moduleName: ModuleName.UseAvaibleSystemLayers_getSystemLayersFx,
		});
	}, []);
	return {
		header,
		tableData,
		isLoading,
		handleCreateLayer,
		setPosition,
		position,
		contextMenuItems,
	};
}

export default useAvaibleSystemLayers;
