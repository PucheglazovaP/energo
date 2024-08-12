import React, { useCallback, useMemo, useState } from 'react';
import { Button, Calendar } from '@evraz/ui-kit';
import clsx from 'clsx';
import { useStore } from 'effector-react';

import EditIcon from '../../Icons/Edit';
import MoreIcon from '../../Icons/More';
import NotificationIcon from '../../Icons/Notification';
import { $user } from '../../Models/Auth';
import { $editMode } from '../../Models/EditMode';
import { fetchFormInfoForEditingFx } from '../../Models/EditMode/effects';
import {
	setDataForEditing,
	setEditMode,
	setFormSelectedStatus,
} from '../../Models/EditMode/events';
import { setFormSettings } from '../../Models/FormSettings/events';
import { $treeForms } from '../../Models/TreeForms';
import { FormTreeItem } from '../../Models/TreeForms/types';
import ContextMenu from '../../UI/ContextMenu';
import {
	ContextMenuItem,
	ContextMenuPosition,
} from '../../UI/ContextMenu/types';
import Select from '../../UI/Select';
import NavigationForForms from '../NavigationForForms';

import ReportFormProps from './types';
import useReportFormInfo from './useReportFormInfo';

import styles from './ReportForm.module.css';

function ReportForm({ className }: ReportFormProps) {
	const {
		reportLink,
		handlePeriodSelect,
		onCalendarTypeChange,
		handleSelectedDiscrete,
		usedCalendarTypes,
		startDateTime,
		endDateTime,
		selectedCalendarType,
		discreteList,
		createReportLink,
		id,
		formType,
		versionId,
	} = useReportFormInfo();
	const user = useStore($user);

	const [position, setPosition] = useState<ContextMenuPosition | null>(null);

	const { isEditing } = useStore($editMode);

	const forms = useStore($treeForms);

	const handleContextMenu = (evt: React.MouseEvent<HTMLButtonElement>) => {
		evt.stopPropagation();
		if (!position) setPosition({ x: 0, y: 30 });
		else setPosition(null);
	};

	const handleEditClick = useCallback(() => {
		if (!user) {
			return;
		}
		if (id && versionId) {
			setEditMode(true);
			setFormSettings({
				isEditMode: true,
				activeId: id,
				formType,
			});
			setDataForEditing({ id, formType });
			setFormSelectedStatus(true);
			fetchFormInfoForEditingFx({
				formId: id,
				versionCode: versionId,
				userId: user.preferredUsername,
			});
		}
		setPosition(null);
	}, [id, versionId, formType, user]);

	const isEditDisabled = () => {
		const selectedForm: FormTreeItem | undefined = forms.find(
			(form) => form.id === id,
		);
		if (!selectedForm) {
			return true;
		}
		return !selectedForm.canEdit;
	};

	const contextMenuItems: ContextMenuItem[] = useMemo(
		() => [
			{
				name: 'Редактировать',
				isDisabled: isEditDisabled(),
				renderFn: () => (
					<span className={styles.menu_item}>
						<EditIcon className={styles.menu_icon} />
						<span className={styles.menu_name}>Редактировать</span>
					</span>
				),
				onClick: handleEditClick,
			},
		],
		[handleEditClick, isEditDisabled],
	);

	return (
		<div className={clsx(styles.root, className)}>
			<div className={styles.btns}>
				{!isEditing && <NavigationForForms className={styles.navigation} />}
				<Calendar
					dates={[startDateTime, endDateTime]}
					type={selectedCalendarType}
					usedTypes={usedCalendarTypes}
					onClose={handlePeriodSelect}
					className={styles.calendar}
					onTypeChange={onCalendarTypeChange}
					disableManualInput={false}
					isCloseOnSelect={false}
				/>
				<Select
					options={discreteList}
					onSelect={handleSelectedDiscrete}
					className={clsx(
						styles.selector,
						styles['selector_discrete'],
						'selector_discrete',
					)}
				/>
				<Button className={styles.btn} onClick={createReportLink}>
					Запросить
				</Button>
				<Button className={styles.menu_btn} onClick={handleContextMenu}>
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
			{reportLink ? (
				<iframe title="Отчет" src={reportLink} className={styles.report} />
			) : (
				<div className={styles.no_info}>
					<NotificationIcon className={styles.notification_icon} />
					<p>
						Отчет не сформирован. Для отображения отчета введите данные для
						запроса и нажмите кнопку “Запросить”
					</p>
				</div>
			)}
		</div>
	);
}

export default ReportForm;
