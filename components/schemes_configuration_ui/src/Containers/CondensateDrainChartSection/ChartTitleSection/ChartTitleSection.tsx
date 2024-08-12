import React, { useCallback, useMemo, useState } from 'react';
import { Button, Calendar } from '@evraz/ui-kit';
import clsx from 'clsx';
import d3ToPng from 'd3-svg-to-png';
import { useStore } from 'effector-react';

import { tableDataExcelAdapter } from '../../../Adapters/chart/condensateDrainAdapter';
import EditIcon from '../../../Icons/Edit';
import MoreIcon from '../../../Icons/More';
import PrinterIcon from '../../../Icons/Printer';
import SaveIcon from '../../../Icons/Save';
import { $activeChart } from '../../../Models/ActiveCondensateDrainChart';
import {
	changeDiscrete,
	setDateTimePeriod,
} from '../../../Models/ActiveCondensateDrainChart/events';
import { $user } from '../../../Models/Auth';
import { $editMode } from '../../../Models/EditMode';
import { fetchFormInfoForEditingFx } from '../../../Models/EditMode/effects';
import {
	setDataForEditing,
	setEditMode,
	setHintMode,
} from '../../../Models/EditMode/events';
import {
	disableEditMode,
	setFormSettings,
} from '../../../Models/FormSettings/events';
import { $navigation } from '../../../Models/Navigation';
import { $treeForms } from '../../../Models/TreeForms';
import { FormTreeItem } from '../../../Models/TreeForms/types';
import { CalendarType, FormTypes } from '../../../Shared/types';
import Checkbox from '../../../UI/Checkbox';
import ContextMenu from '../../../UI/ContextMenu';
import {
	ContextMenuItem,
	ContextMenuPosition,
} from '../../../UI/ContextMenu/types';
import Select from '../../../UI/Select';
import { SelectOption } from '../../../UI/Select/types';
import exportInfoTableToExcel from '../../../Utils/exportToExcel';
import NavigationForForms from '../../NavigationForForms';

import SchemeTitleSectionProps from './types';

import styles from './ChartTitleSection.module.css';

function ChartTitleSection({ className }: SchemeTitleSectionProps) {
	const { versionId } = useStore($navigation);
	const {
		isLoading,
		title,
		formType,
		volumeOfMergedCondensate,
		startDateTime,
		endDateTime,
		discreteList,
		id,
	} = useStore($activeChart);
	const { isEditing, isHintModeEnabled } = useStore($editMode);
	const forms = useStore($treeForms);
	const user = useStore($user);

	const [position, setPosition] = useState<ContextMenuPosition | null>(null);

	const handleEditClick = useCallback(() => {
		if (id && versionId && user) {
			setEditMode(true);
			setFormSettings({
				isEditMode: true,
				activeId: id,
				formType,
			});
			setDataForEditing({ id, title });
			fetchFormInfoForEditingFx({
				formId: id,
				versionCode: versionId,
				userId: user.preferredUsername,
			});
		}
		setPosition(null);
	}, [id, versionId, formType, title, user]);

	const handleSaveClick = useCallback(() => {
		d3ToPng('.highcharts-root', title, {
			scale: 1,
			format: 'jpg',
			quality: 1,
			download: true,
		});
		setPosition(null);
	}, [title]);

	const handleExportToExcel = useCallback(() => {
		const { preparedData, columnsForExcel } = tableDataExcelAdapter(
			volumeOfMergedCondensate,
		);
		exportInfoTableToExcel(columnsForExcel, preparedData, title);
		setPosition(null);
	}, [title, volumeOfMergedCondensate]);

	const handlePrintClick = () => {
		window.print();
	};

	const isEditBtnDisabled = () => {
		const selectedForm: FormTreeItem | undefined = forms.find(
			(form) => form.id === id,
		);
		if (!selectedForm) {
			return true;
		}
		return isLoading || !selectedForm.canEdit;
	};

	const contextMenuItems: ContextMenuItem[] = useMemo(
		() => [
			{
				name: 'Редактировать',
				onClick: handleEditClick,
				isDisabled: isEditBtnDisabled(),
				withSeparator: true,
				renderFn: () => (
					<span className={styles.menu_item}>
						<EditIcon className={styles.menu_icon} />
						<span className={styles.menu_name}>Редактировать</span>
					</span>
				),
			},
			{
				name: 'Распечатать форму',
				onClick: handlePrintClick,
				isDisabled: isLoading,
				renderFn: () => (
					<span className={styles.menu_item}>
						<PrinterIcon className={styles.menu_icon} />
						<span className={styles.menu_name}>Распечатать форму</span>
					</span>
				),
			},
			{
				name: 'Сохранить',
				onClick: handleSaveClick,
				isDisabled: isLoading,
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
				name: 'Сохранить в Excel',
				onClick: handleExportToExcel,
				isDisabled: isLoading,
				renderFn: () => (
					<span className={styles.menu_item}>
						<SaveIcon className={styles.menu_icon} />
						<span className={styles.menu_name}>Выгрузить в Excel</span>
					</span>
				),
			},
		],
		[isLoading, handleSaveClick, handleExportToExcel],
	);
	const handleHintModeChange = () => {
		setHintMode(!isHintModeEnabled);
	};
	const contextMenuItemsForEditting: ContextMenuItem[] = [
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
	const handlePeriodSelect = (period: Date[]) => {
		setDateTimePeriod({
			startDateTime: period[0],
			endDateTime: period[1],
		});
	};

	const handleSelectedDiscrete = (discreteList: SelectOption[]) => {
		changeDiscrete(discreteList);
	};

	const handleContextMenu = (evt: React.MouseEvent<HTMLButtonElement>) => {
		evt.stopPropagation();
		if (!position) setPosition({ x: 125, y: 30 });
	};

	return (
		<div className={clsx(styles.root, className)}>
			{!isEditing && <NavigationForForms className={styles.navigation} />}
			<div
				className={clsx(styles.btns, 'chart_title_section_btns', {
					[styles.btns__chart]: formType === FormTypes.Chart,
				})}
			>
				{!isEditing ? (
					<>
						<div className={styles.settings}>
							<Calendar
								dates={[startDateTime, endDateTime]}
								type={CalendarType.Period}
								onClose={handlePeriodSelect}
								className={styles.calendar}
								disableManualInput={false}
								isCloseOnSelect={false}
							/>

							<Select
								options={discreteList}
								onSelect={handleSelectedDiscrete}
								disabled={isLoading}
								className={clsx(styles.selector, styles.selector_discrete)}
							/>
						</div>
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
					</>
				) : (
					<>
						<Button
							className={styles.button}
							onClick={() => {
								setEditMode(false);
								disableEditMode();
							}}
						>
							Завершить
						</Button>
						<Button className={styles.menu_btn} onClick={handleContextMenu}>
							<MoreIcon />
						</Button>
						{position && (
							<ContextMenu
								items={contextMenuItemsForEditting}
								position={position}
								setPosition={setPosition}
								className={styles.edititng_menu}
							/>
						)}
					</>
				)}
			</div>
		</div>
	);
}

export default ChartTitleSection;
