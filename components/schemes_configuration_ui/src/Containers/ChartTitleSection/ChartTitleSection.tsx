import React, { useCallback, useMemo, useState } from 'react';
import { toast } from 'react-toastify';
import { Button } from '@evraz/ui-kit';
import clsx from 'clsx';
import d3ToPng from 'd3-svg-to-png';
import { useStore } from 'effector-react';

import tableDataExcelAdapter from '../../Adapters/tableDataExcelAdapter';
import CopyIcon from '../../Icons/Copy';
import EditIcon from '../../Icons/Edit';
import MoreIcon from '../../Icons/More';
import PrinterIcon from '../../Icons/Printer';
import SaveIcon from '../../Icons/Save';
import { $activeChart } from '../../Models/ActiveChart';
import {
	setActiveChartParameters,
	toggleArchiveMode,
	toggleMultipleCount,
	toggleTimeZone,
} from '../../Models/ActiveChart/events';
import { $user } from '../../Models/Auth';
import { $editMode } from '../../Models/EditMode';
import { fetchFormInfoForEditingFx } from '../../Models/EditMode/effects';
import {
	setDataForEditing,
	setEditMode,
	setHintMode,
} from '../../Models/EditMode/events';
import {
	disableEditMode,
	setFormSettings,
} from '../../Models/FormSettings/events';
import { $navigation } from '../../Models/Navigation';
import { $treeForms } from '../../Models/TreeForms';
import { FormTreeItem } from '../../Models/TreeForms/types';
import { FormTypes, TypesStorage } from '../../Shared/types';
import Checkbox from '../../UI/Checkbox';
import ContextMenu from '../../UI/ContextMenu';
import {
	ContextMenuItem,
	ContextMenuPosition,
} from '../../UI/ContextMenu/types';
import exportInfoTableToExcel, {
	createTextContentForClipboard,
} from '../../Utils/exportToExcel';
import ChartSettings from '../ChartSettings';
import NavigationForForms from '../NavigationForForms';

import MultichartController from './MultichartController';
import SchemeTitleSectionProps from './types';

import styles from './ChartTitleSection.module.css';

function ChartTitleSection({ className }: SchemeTitleSectionProps) {
	const { versionId } = useStore($navigation);
	const {
		id: chartId,
		isLoading,
		chartData,
		title,
		unitList,
		isRelativeZeroEnabled,
		isTimeWithoutDataEnabled,
		discreteList,
		isMoscowTimeZone,
		isArchiveModeEnabled,
		formType,
		typesStorage,
		multipleCount,
	} = useStore($activeChart);
	const user = useStore($user);
	const { isEditing, isHintModeEnabled } = useStore($editMode);
	const forms = useStore($treeForms);

	const [position, setPosition] = useState<ContextMenuPosition | null>(null);

	const selectedUnit = useMemo(
		() => unitList.find((item) => item.isSelected),
		[unitList],
	);

	const filteredDiscreteList =
		typesStorage === TypesStorage.Regulated
			? discreteList
			: discreteList
					.filter((item) => item.label === '1 мин')
					.map((item) => ({ ...item, isSelected: true }));

	const selectedDiscrete = filteredDiscreteList.find((item) => item.isSelected);

	const handleEditClick = useCallback(() => {
		if (!user) {
			return;
		}
		if (chartId && versionId) {
			setEditMode(true);
			setFormSettings({
				isEditMode: true,
				activeId: chartId,
				formType,
			});
			setDataForEditing({ id: chartId });
			fetchFormInfoForEditingFx({
				formId: chartId,
				versionCode: versionId,
				userId: user.preferredUsername,
			});
		}
		setPosition(null);
	}, [chartId, versionId, formType, user]);

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
			chartData,
			selectedUnit?.coefficient || 1,
		);
		exportInfoTableToExcel(columnsForExcel, preparedData, title);
		setPosition(null);
	}, [title, chartData, selectedUnit?.coefficient]);

	const handleRelativeZeroModeChange = useCallback(() => {
		setActiveChartParameters({
			isRelativeZeroEnabled: !isRelativeZeroEnabled,
		});
	}, [isRelativeZeroEnabled]);

	const handleTimeWithoutDataModeChange = useCallback(() => {
		setActiveChartParameters({
			isTimeWithoutDataEnabled: !isTimeWithoutDataEnabled,
		});
	}, [isTimeWithoutDataEnabled]);

	const handlePrintClick = () => {
		window.print();
	};

	const handleMultipleCountChange = useCallback(() => {
		toggleMultipleCount(!multipleCount);
	}, [multipleCount]);

	const handleTimeZoneChange = useCallback(() => {
		toggleTimeZone(!isMoscowTimeZone);
	}, [isMoscowTimeZone]);

	const handleArchiveModeChange = useCallback(() => {
		toggleArchiveMode(!isArchiveModeEnabled);
	}, [isArchiveModeEnabled]);

	const handleCopyTableData = useCallback(() => {
		const { preparedData, columnsForExcel } = tableDataExcelAdapter(
			chartData,
			selectedUnit?.coefficient || 1,
		);
		const textContent = createTextContentForClipboard(
			columnsForExcel,
			preparedData,
			title,
		);
		navigator.clipboard
			.writeText(textContent)
			.then(() => {
				toast.success('Данные скопированы в буфер обмена!');
			})
			.catch((error) => {
				toast.error('Ошибка копирования данных:', error);
			});
	}, [chartData, selectedUnit, title]);

	// Check if user can edit form
	const isEditDisabled = () => {
		const selectedForm: FormTreeItem | undefined = forms.find(
			(form) => form.id === chartId,
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
				isDisabled: isEditDisabled(),
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
				name: 'Скопировать таблицу',
				onClick: handleCopyTableData,
				renderFn: () => (
					<span className={styles.menu_item}>
						<CopyIcon className={styles.menu_icon} />
						<span className={styles.menu_name}>Скопировать таблицу</span>
					</span>
				),
			},
			{
				name: 'Сохранить в Excel',
				onClick: handleExportToExcel,
				isDisabled: isLoading,
				withSeparator: true,
				separatorName: 'Отображение данных',
				renderFn: () => (
					<span className={styles.menu_item}>
						<SaveIcon className={styles.menu_icon} />
						<span className={styles.menu_name}>Выгрузить в Excel</span>
					</span>
				),
			},
			{
				onClick: handleRelativeZeroModeChange,
				isDisabled: isLoading,
				name: 'Относительно нуля',
				renderFn: () => (
					<span className={styles.menu_item}>
						<Checkbox
							name={'relative-to-zero'}
							title="Относительно нуля"
							checked={isRelativeZeroEnabled}
							onChange={handleRelativeZeroModeChange}
							className={styles.checkbox}
						/>
					</span>
				),
			},
			{
				onClick: handleTimeWithoutDataModeChange,
				isDisabled: selectedDiscrete?.value !== 'C',
				name: 'Нет данных',
				renderFn: () => (
					<span className={styles.menu_item}>
						<Checkbox
							name={'no-data'}
							title="Нет данных"
							checked={isTimeWithoutDataEnabled}
							onChange={handleTimeWithoutDataModeChange}
							className={styles.checkbox}
						/>
					</span>
				),
			},
			{
				onClick: handleTimeZoneChange,
				isDisabled: isLoading,
				name: 'Московское время',
				renderFn: () => (
					<span className={styles.menu_item}>
						<Checkbox
							name={'moscow-timezone'}
							title="Московское время"
							checked={isMoscowTimeZone}
							onChange={handleTimeZoneChange}
							className={styles.checkbox}
						/>
					</span>
				),
			},
			{
				onClick: handleArchiveModeChange,
				isDisabled: selectedDiscrete?.value !== 'H',
				name: 'Архив',
				renderFn: () => (
					<span className={styles.menu_item}>
						<Checkbox
							name={'archive'}
							title="Архив"
							checked={isArchiveModeEnabled}
							onChange={handleArchiveModeChange}
							className={styles.checkbox}
						/>
					</span>
				),
			},
			{
				onClick: handleMultipleCountChange,
				name: 'Считать накопительно',
				isVisible: formType === FormTypes.Chart,
				renderFn: () => (
					<span className={styles.menu_item}>
						<Checkbox
							name={'multipleCount'}
							title="Считать накопительно"
							checked={multipleCount}
							onChange={handleMultipleCountChange}
							className={styles.checkbox}
						/>
					</span>
				),
			},
		],
		[
			isLoading,
			handleEditClick,
			handleSaveClick,
			handleExportToExcel,
			handleRelativeZeroModeChange,
			handleTimeWithoutDataModeChange,
			handleTimeZoneChange,
			handleArchiveModeChange,
			handleMultipleCountChange,
			isRelativeZeroEnabled,
			isTimeWithoutDataEnabled,
			selectedDiscrete,
			isMoscowTimeZone,
			multipleCount,
			isArchiveModeEnabled,
			isEditDisabled,
			handleCopyTableData,
		],
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

	const handleContextMenu = (evt: React.MouseEvent<HTMLButtonElement>) => {
		evt.stopPropagation();
		if (!position) setPosition({ x: 0, y: 30 });
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
						<ChartSettings />
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
						{formType === FormTypes.MultiChart && <MultichartController />}
						<Button
							className={styles.button}
							onClick={() => {
								setEditMode(false);
								disableEditMode();
							}}
						>
							Завершить
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
