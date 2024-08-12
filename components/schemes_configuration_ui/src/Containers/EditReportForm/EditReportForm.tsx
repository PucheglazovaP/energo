import React, { useEffect, useState } from 'react';
import { Button } from '@evraz/ui-kit';
import { useStore } from 'effector-react';

import CheckMarkIcon from '../../Icons/CheckMark';
import MoreIcon from '../../Icons/More';
import { $user } from '../../Models/Auth';
import { $editMode } from '../../Models/EditMode';
import { setEditMode, setHintMode } from '../../Models/EditMode/events';
import { disableEditMode } from '../../Models/FormSettings/events';
import { $reportForm } from '../../Models/ReportFormProperties';
import { getReportFormGroupListFx } from '../../Models/ReportFormProperties/effects';
import { ModuleName } from '../../Shared/Types/moduleName';
import Checkbox from '../../UI/Checkbox';
import ContextMenu from '../../UI/ContextMenu';
import {
	ContextMenuItem,
	ContextMenuPosition,
} from '../../UI/ContextMenu/types';
import ConfigurationBlock from '../ConfigurationBlock';

import GroupList from './GroupList';
import GroupListInReportForm from './GroupListInReportForm';

import styles from './EditReportForm.module.css';

function EditReportForm() {
	const { formId } = useStore($reportForm);
	const user = useStore($user);
	const { isHintModeEnabled } = useStore($editMode);
	const [position, setPosition] = useState<ContextMenuPosition | null>(null);

	const handleContextMenu = (evt: React.MouseEvent<HTMLButtonElement>) => {
		evt.stopPropagation();
		if (!position) setPosition({ x: 0, y: 30 });
	};

	const handleHintModeChange = () => {
		setHintMode(!isHintModeEnabled);
	};

	const contextMenuItems: ContextMenuItem[] = [
		{
			name: '',
			withSeparator: true,
			separatorName: 'Отображение данных',
			renderFn: () => null,
		},
		{
			onClick: handleHintModeChange,
			name: 'Скрыть подсказки',
			renderFn: () => (
				<span className={styles.menu_item}>
					<Checkbox
						name={'hint'}
						title="Скрыть подсказки"
						checked={!isHintModeEnabled}
						onChange={handleHintModeChange}
						className={styles.checkbox}
					/>
				</span>
			),
		},
	];

	useEffect(() => {
		if (formId && user)
			getReportFormGroupListFx({
				formId,
				userId: user.preferredUsername,
				moduleName: ModuleName.EditReportForm_getReportFormGroupListFx,
			});
	}, []);
	return (
		<div className={styles.root}>
			<ConfigurationBlock />
			<div className={styles.wrapper}>
				<div className={styles.btns}>
					<Button
						className={styles.close}
						onClick={() => {
							setEditMode(false);
							disableEditMode();
						}}
					>
						<CheckMarkIcon />
						<p>Завершить</p>
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
				<div className={styles.groups}>
					<GroupListInReportForm />
					<GroupList />
				</div>
			</div>
		</div>
	);
}

export default EditReportForm;
