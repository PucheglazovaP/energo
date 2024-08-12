import React, { useCallback, useMemo, useState } from 'react';
import { Button, Calendar } from '@evraz/ui-kit';
import clsx from 'clsx';
import d3ToPng from 'd3-svg-to-png';
import { useStore } from 'effector-react';

import EditIcon from '../../Icons/Edit';
import MoreIcon from '../../Icons/More';
import SaveIcon from '../../Icons/Save';
import { $activeForm, $activeFormLayers } from '../../Models/ActiveForm';
import {
	changeCheckedFormLayers,
	setDateTime,
	setEmegnecyEventsModeFlag,
	setFormProportionsMode,
} from '../../Models/ActiveForm/events';
import { $user } from '../../Models/Auth';
import { $dynamicChart } from '../../Models/DynamicChart';
import { getDataForDynamicChart } from '../../Models/DynamicChart/events';
import { $editMode } from '../../Models/EditMode';
import { fetchFormInfoForEditingFx } from '../../Models/EditMode/effects';
import { setEditMode } from '../../Models/EditMode/events';
import { setMainLayerInfo } from '../../Models/FormLayers/events';
import { setFormSettings } from '../../Models/FormSettings/events';
import { $formWithEditInfo } from '../../Models/FormWithEditInfo';
import { openModal } from '../../Models/Modal/events';
import { $navigation } from '../../Models/Navigation';
import { $treeForms } from '../../Models/TreeForms';
import { FormTreeItem } from '../../Models/TreeForms/types';
import { RegisteredModals } from '../../Shared/modalsConfig';
import { CalendarType, FormTypes } from '../../Shared/types';
import Checkbox from '../../UI/Checkbox';
import ContextMenu from '../../UI/ContextMenu';
import {
	ContextMenuItem,
	ContextMenuPosition,
} from '../../UI/ContextMenu/types';
import Tree from '../../UI/Tree';
import NavigationForForms from '../NavigationForForms';

import SchemeTitleSectionProps from './types';

import styles from './SchemeTitleSection.module.css';

function SchemeTitleSection({ className }: SchemeTitleSectionProps) {
	const { id, isLoading } = useStore($formWithEditInfo);
	const { versionId } = useStore($navigation);
	const { chartData } = useStore($dynamicChart);
	const { dateTime, isEmergencyEventsModeEnabled, isFormProportionsSaved } =
		useStore($activeForm);
	const { formLayers, checkedFormLayers, mainLayer } =
		useStore($activeFormLayers);
	const forms = useStore($treeForms);
	const { isEditing } = useStore($editMode);
	const user = useStore($user);

	const [position, setPosition] = useState<ContextMenuPosition | null>(null);

	const handleCompareClick = () => {
		if (!user) {
			return;
		}
		openModal(RegisteredModals.DynamicChart);
		getDataForDynamicChart();
	};

	const handleContextMenu = (evt: React.MouseEvent<HTMLButtonElement>) => {
		evt.stopPropagation();
		if (!position) setPosition({ x: 0, y: 30 });
		else setPosition(null);
	};
	const handlePeriodSelect = (period: Date[]) => {
		setDateTime(period[0]);
	};
	const handleEditClick = useCallback(() => {
		if (!user) {
			return;
		}
		if (id && versionId) {
			setEditMode(true);
			setMainLayerInfo(mainLayer);
			setFormSettings({
				isEditMode: true,
				activeId: id,
				formType: FormTypes.Form,
			});
			fetchFormInfoForEditingFx({
				formId: id,
				versionCode: versionId,
				userId: user.preferredUsername,
			});
		}
		setPosition(null);
	}, [versionId, id, user, mainLayer]);

	const handleSaveClick = useCallback(() => {
		d3ToPng('#scheme', 'name', {
			scale: 1,
			format: 'jpg',
			quality: 1,
			download: true,
		});
	}, []);

	const handleEmergencyEventsModeChange = () => {
		setEmegnecyEventsModeFlag();
	};
	const handleFormProportionsChangeChange = () => {
		setFormProportionsMode(!isFormProportionsSaved);
	};

	const isEditDisabled = () => {
		const selectedForm: FormTreeItem | undefined = forms.find(
			(form) => form.id === id,
		);
		if (!selectedForm) {
			return true;
		}
		return isLoading || !selectedForm.canEdit;
	};

	const treeData = formLayers.map((item) => ({
		id: item.id,
		order: item.order || 1,
		parentId: item.parentId,
		displayName: item.name,
		name: item.name,
		isOpen: true,
		isLast: !formLayers.some((form) => form.parentId === item.id),
		renderFn: () => {
			const isChecked = checkedFormLayers.includes(item.id);
			return (
				<div className={styles.tree_item}>
					<Checkbox
						name={clsx(item.name, item.id)}
						title={item.name}
						checked={isChecked}
						onChange={() => {
							setPosition({ x: 0, y: 30 });
							handleShowLayerClick(item.id, !isChecked);
						}}
						className={styles.checkbox}
					/>
				</div>
			);
		},
	}));

	const contextMenuItems: ContextMenuItem[] = useMemo(
		() => [
			{
				name: 'Редактировать',
				onClick: handleEditClick,
				isDisabled: isEditDisabled(),
				renderFn: () => (
					<span className={styles.menu_item}>
						<EditIcon className={styles.menu_icon} />
						<span className={styles.menu_name}>Редактировать</span>
					</span>
				),
			},
			{
				name: 'Сохранить',
				onClick: handleSaveClick,
				disabled: isLoading,
				withSeparator: true,
				renderFn: () => (
					<span className={styles.menu_item}>
						<SaveIcon className={styles.menu_icon} />
						<span className={styles.menu_name}>
							Сохранить форму как картинку
						</span>
					</span>
				),
			},
			{
				onClick: handleFormProportionsChangeChange,
				isDisabled: isLoading,
				name: 'Сохранять пропорции схемы',
				renderFn: () => (
					<span className={styles.menu_item}>
						<Checkbox
							name={'form-proportions-check'}
							title="Сохранять пропорции схемы"
							checked={isFormProportionsSaved}
							onChange={handleFormProportionsChangeChange}
							className={styles.checkbox}
						/>
					</span>
				),
			},
			{
				onClick: handleEmergencyEventsModeChange,
				isDisabled: isLoading,
				name: 'Аварийные события',
				isNotCloseOnClick: true,
				withSeparator: true,
				separatorName: 'Слои',
				renderFn: () => (
					<span className={styles.menu_item}>
						<Checkbox
							name={'emergency-events-check'}
							title="Аварийные события"
							checked={isEmergencyEventsModeEnabled}
							onChange={handleEmergencyEventsModeChange}
							className={styles.checkbox}
						/>
					</span>
				),
			},
			{
				isDisabled: isLoading,
				name: 'Слои',
				isNotCloseOnClick: true,
				className: styles.form_layers_container,
				isNotButton: true,
				renderFn: () => (
					<Tree
						onItemClick={() => {}}
						treeData={treeData}
						isExpandable={false}
						className={styles.tree}
						activeNode={{ id: undefined, type: 'node' }}
						needSort
					/>
				),
			},
		],
		[
			isLoading,
			handleEditClick,
			handleSaveClick,
			isEditDisabled,
			isEmergencyEventsModeEnabled,
		],
	);

	const handleShowLayerClick = (id: number, isChecked: boolean) => {
		changeCheckedFormLayers({ id, isChecked });
	};

	return !isEditing ? (
		<div className={clsx(styles.root, className)}>
			<NavigationForForms className={styles.navigation} />
			<div className={styles.btns}>
				<Calendar
					dates={[dateTime, dateTime]}
					type={CalendarType.DayTime}
					onClose={handlePeriodSelect}
					className={styles.calendar}
					disableManualInput={false}
					isCloseOnSelect={false}
					disableTypeSelector
				/>
				<Button
					className={styles.btn}
					onClick={handleCompareClick}
					disabled={chartData.length === 0}
				>
					Сравнить
				</Button>
				<Button
					className={styles.menu_btn}
					onClick={handleContextMenu}
					disabled={isLoading}
				>
					<MoreIcon />
				</Button>
				{position && (
					<ContextMenu
						items={contextMenuItems}
						position={position}
						setPosition={setPosition}
						className={styles.menu}
					/>
				)}
			</div>
		</div>
	) : null;
}

export default SchemeTitleSection;
