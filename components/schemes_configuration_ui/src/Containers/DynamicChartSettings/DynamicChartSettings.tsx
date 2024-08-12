import React, { useCallback, useMemo, useState } from 'react';
import { toast } from 'react-toastify';
import { Button, Calendar } from '@evraz/ui-kit';
import clsx from 'clsx';
import { useStore } from 'effector-react';
import { toPng } from 'html-to-image';

import tableDataExcelAdapter from '../../Adapters/tableDataExcelAdapter';
import { Plus } from '../../Icons';
import CopyIcon from '../../Icons/Copy';
import MoreIcon from '../../Icons/More';
import PrinterIcon from '../../Icons/Printer';
import SaveIcon from '../../Icons/Save';
import { $dynamicChart } from '../../Models/DynamicChart';
import {
	changeDiscrete,
	changeUpdateDelay,
	setDateTimePeriod,
	setDynamicChartParameters,
	toggleTimeZone,
	toggleUpdateChart,
} from '../../Models/DynamicChart/events';
import { openModal } from '../../Models/Modal/events';
import { RegisteredModals } from '../../Shared/modalsConfig';
import { CalendarType } from '../../Shared/types';
import Checkbox from '../../UI/Checkbox';
import ContextMenu from '../../UI/ContextMenu';
import {
	ContextMenuItem,
	ContextMenuPosition,
} from '../../UI/ContextMenu/types';
import Input from '../../UI/Input';
import Select from '../../UI/Select';
import { SelectOption } from '../../UI/Select/types';
import exportInfoTableToExcel, {
	createTextContentForClipboard,
} from '../../Utils/exportToExcel';

import { DynamicChartSettingsProps } from './types';

import styles from './DynamicChartSettings.module.css';

function DynamicChartSettings({ className }: DynamicChartSettingsProps) {
	const {
		isUpdateChartEnabled,
		updateDelay,
		startDateTime,
		endDateTime,
		isMultiYaxesEnabled,
		discreteList,
		isLoading,
		chartData,
		isMoscowTimeZone,
		isRelativeZeroEnabled,
	} = useStore($dynamicChart);

	const onToggleUpdate = () => {
		toggleUpdateChart(!isUpdateChartEnabled);
	};

	const handlePeriodSelect = (period: Date[]) => {
		setDateTimePeriod({
			startDateTime: period[0],
			endDateTime: period[1],
		});
	};

	const handleMultiYaxesStatusChange = () => {
		setDynamicChartParameters({ isMultiYaxesEnabled: !isMultiYaxesEnabled });
	};

	const handleSelectedDiscrete = (discreteList: SelectOption[]) => {
		changeDiscrete(discreteList);
	};

	const CALENDAR_USED_TYPES = [
		CalendarType.PeriodWithTime,
		CalendarType.Day,
		CalendarType.Month,
		CalendarType.Period,
		CalendarType.Quarter,
		CalendarType.Year,
	];

	const [position, setPosition] = useState<ContextMenuPosition | null>(null);

	const handleSaveClick = useCallback(() => {
		const chartElement = document.getElementById('chart');
		if (chartElement) {
			toPng(chartElement).then(function (dataUrl) {
				var link = document.createElement('a');
				link.download = 'chart.jpeg';
				link.href = dataUrl;
				link.click();
			});
			setPosition(null);
		}
	}, []);

	const handleRelativeZeroModeChange = useCallback(() => {
		setDynamicChartParameters({
			isRelativeZeroEnabled: !isRelativeZeroEnabled,
		});
	}, [isRelativeZeroEnabled]);

	const handlePrintClick = () => {
		window.print();
	};

	const handleTimeZoneChange = useCallback(() => {
		toggleTimeZone(!isMoscowTimeZone);
	}, [isMoscowTimeZone]);

	const handleContextMenu = (evt: React.MouseEvent<HTMLButtonElement>) => {
		evt.stopPropagation();
		if (!position) setPosition({ x: 0, y: 30 });
	};

	const handleExportToExcel = useCallback(() => {
		const { preparedData, columnsForExcel } = tableDataExcelAdapter(
			chartData,
			1,
		);
		exportInfoTableToExcel(
			columnsForExcel,
			preparedData,
			'Динамический мультиграфик',
		);
		setPosition(null);
	}, [chartData]);
	const handleCopyTableData = useCallback(() => {
		const { preparedData, columnsForExcel } = tableDataExcelAdapter(
			chartData,
			1,
		);
		const textContent = createTextContentForClipboard(
			columnsForExcel,
			preparedData,
			'',
		);
		navigator.clipboard
			.writeText(textContent)
			.then(() => {
				toast.success('Данные скопированы в буфер обмена!');
			})
			.catch((error) => {
				toast.error('Ошибка копирования данных:', error);
			});
	}, [chartData]);

	const contextMenuItems: ContextMenuItem[] = useMemo(
		() => [
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
				renderFn: () => (
					<span className={styles.menu_item}>
						<SaveIcon className={styles.menu_icon} />
						<span className={styles.menu_name}>Выгрузить в Excel</span>
					</span>
				),
			},
			{
				name: 'Сохранить',
				onClick: handleSaveClick,
				isDisabled: isLoading,
				withSeparator: true,
				separatorName: 'Отображение данных',
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
				onClick: handleRelativeZeroModeChange,
				isDisabled: isLoading,
				name: 'Относительно нуля',
				renderFn: () => (
					<span className={styles.menu_item}>
						<Checkbox
							name="dynamic-relative-to-zero"
							title="Относительно нуля"
							checked={isRelativeZeroEnabled}
							onChange={handleRelativeZeroModeChange}
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
							name="dynamic-moscow-timezone"
							title="Московское время"
							checked={isMoscowTimeZone}
							onChange={handleTimeZoneChange}
							className={styles.checkbox}
						/>
					</span>
				),
			},
		],
		[
			isLoading,
			handleSaveClick,
			handleRelativeZeroModeChange,
			handleTimeZoneChange,
			handleExportToExcel,
			handleCopyTableData,
			isRelativeZeroEnabled,
			isMoscowTimeZone,
		],
	);

	return (
		<div className={clsx(styles.root, className)}>
			<Calendar
				dates={[startDateTime, endDateTime]}
				type={CalendarType.PeriodWithTime}
				onClose={handlePeriodSelect}
				className={styles.calendar}
				disableManualInput={false}
				isCloseOnSelect={false}
				usedTypes={CALENDAR_USED_TYPES}
			/>
			<Select
				options={discreteList}
				onSelect={handleSelectedDiscrete}
				disabled={isLoading}
				className={clsx(styles.selector, styles['selector_discrete'])}
			/>
			<div className={styles.right}>
				{chartData.length > 1 && (
					<Checkbox
						name={'multi-yaxes'}
						title="На разные оси"
						checked={isMultiYaxesEnabled}
						onChange={handleMultiYaxesStatusChange}
						className={styles.checkbox}
					/>
				)}
				<Checkbox
					name={'reload'}
					title="Обновление"
					checked={isUpdateChartEnabled}
					onChange={onToggleUpdate}
					className={styles.checkbox}
				/>
				<Input
					type={'number'}
					className={styles.input}
					value={updateDelay}
					disabled={!isUpdateChartEnabled}
					onChange={(e) => {
						changeUpdateDelay(Number(e.target.value));
					}}
				/>
				<Button
					className={clsx(styles.button, styles.multichart_button)}
					onClick={() => {
						openModal(RegisteredModals.DynamicChartSelectGroup);
					}}
				>
					<Plus className={styles.multichart_icon} />
					Группа данных
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
	);
}

export default DynamicChartSettings;
