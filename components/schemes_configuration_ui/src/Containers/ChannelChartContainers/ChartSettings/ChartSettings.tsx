import React, { useCallback, useMemo, useState } from 'react';
import { toast } from 'react-toastify';
import { Button, Calendar } from '@evraz/ui-kit';
import clsx from 'clsx';
import d3ToPng from 'd3-svg-to-png';
import { useStore } from 'effector-react';

import tableDataExcelAdapter from '../../../Adapters/tableDataExcelAdapter';
import CopyIcon from '../../../Icons/Copy';
import MoreIcon from '../../../Icons/More';
import PrinterIcon from '../../../Icons/Printer';
import SaveIcon from '../../../Icons/Save';
import { $activeChart } from '../../../Models/ActiveChannelChart';
import {
	changeDiscrete,
	changeUpdateDelay,
	setDateTimePeriod,
	setUnitList,
	toggleUpdateChart,
} from '../../../Models/ActiveChannelChart/events';
import {
	setActiveChannelChartParameters,
	toggleArchiveMode,
	toggleTimeZone,
} from '../../../Models/ActiveChannelChart/events';
import { OptionWithCoefficient } from '../../../Models/ActiveChannelChart/types';
import { CalendarType } from '../../../Shared/types';
import Checkbox from '../../../UI/Checkbox';
import ContextMenu from '../../../UI/ContextMenu';
import {
	ContextMenuItem,
	ContextMenuPosition,
} from '../../../UI/ContextMenu/types';
import Input from '../../../UI/Input';
import Select from '../../../UI/Select';
import { SelectOption } from '../../../UI/Select/types';
import exportInfoTableToExcel, {
	createTextContentForClipboard,
} from '../../../Utils/exportToExcel';

import { ChartSettingsProps } from './types';

import styles from './ChartSettings.module.css';

function ChartSettings({ className }: ChartSettingsProps) {
	const {
		isUpdateChartEnabled,
		updateDelay,
		id: chartId,
		startDateTime,
		endDateTime,
		discreteList,
		typeStorage,
		unitList,
		chartData,
		isLoading,
		title,
		isRelativeZeroEnabled,
		isTimeWithoutDataEnabled,
		isMoscowTimeZone,
		isArchiveModeEnabled,
	} = useStore($activeChart);

	const [position, setPosition] = useState<ContextMenuPosition | null>(null);

	const selectedDiscrete = discreteList.find((item) => item.isSelected);

	const onToggleUpdate = () => {
		toggleUpdateChart(!isUpdateChartEnabled);
	};

	const handlePeriodSelect = (period: Date[]) => {
		setDateTimePeriod({
			startDateTime: period[0],
			endDateTime: period[1],
		});
	};

	const handleSelectDiscrete = (discreteList: SelectOption[]) => {
		changeDiscrete(discreteList);
	};

	const handleSelectUnit = (unitList: OptionWithCoefficient[]) => {
		setUnitList(unitList);
	};
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
		const { preparedData } = tableDataExcelAdapter(chartData, 1);
		const columnsForExcel = chartData.map((trend, index) => ({
			key: `col-${index}`,
			header: 'Показатель',
			width: 35,
		}));
		exportInfoTableToExcel(
			[{ header: 'Дата и время', key: 'date', width: 40 }, ...columnsForExcel],
			preparedData,
			title,
		);
		setPosition(null);
	}, [title, chartData]);

	const handleRelativeZeroModeChange = useCallback(() => {
		setActiveChannelChartParameters({
			isRelativeZeroEnabled: !isRelativeZeroEnabled,
		});
	}, [isRelativeZeroEnabled]);

	const handleTimeWithoutDataModeChange = useCallback(() => {
		setActiveChannelChartParameters({
			isTimeWithoutDataEnabled: !isTimeWithoutDataEnabled,
		});
	}, [isTimeWithoutDataEnabled]);

	const handlePrintClick = () => {
		window.print();
	};

	const handleTimeZoneChange = useCallback(() => {
		toggleTimeZone(!isMoscowTimeZone);
	}, [isMoscowTimeZone]);

	const handleArchiveModeChange = useCallback(() => {
		toggleArchiveMode(!isArchiveModeEnabled);
	}, [isArchiveModeEnabled]);
	const handleContextMenu = (evt: React.MouseEvent<HTMLButtonElement>) => {
		evt.stopPropagation();
		if (!position) setPosition({ x: 0, y: 30 });
	};
	const handleCopyTableData = useCallback(() => {
		const { preparedData } = tableDataExcelAdapter(chartData, 1);
		const columnsForExcel = chartData.map((trend, index) => ({
			key: `col-${index}`,
			header: 'Показатель',
			width: 35,
		}));
		const textContent = createTextContentForClipboard(
			[{ header: 'Дата и время', key: 'date', width: 40 }, ...columnsForExcel],
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
	}, [chartData, title]);

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
		],
		[
			isLoading,
			handleSaveClick,
			handleExportToExcel,
			handleRelativeZeroModeChange,
			handleTimeWithoutDataModeChange,
			handleTimeZoneChange,
			handleArchiveModeChange,
			handleCopyTableData,
			isRelativeZeroEnabled,
			isTimeWithoutDataEnabled,
			selectedDiscrete,
			isMoscowTimeZone,
			isArchiveModeEnabled,
		],
	);

	const allowedDiscreteList =
		typeStorage === 'Регламентированные данные'
			? discreteList
			: discreteList.filter((item) => item.label === '1 мин');

	const CALENDAR_USED_TYPES = [
		CalendarType.PeriodWithTime,
		CalendarType.Day,
		CalendarType.Month,
		CalendarType.Period,
		CalendarType.Quarter,
		CalendarType.Year,
	];

	return (
		<div className={clsx(styles.btns, 'chart_title_section_btns', className)}>
			<div className={styles.root}>
				{chartId && (
					<Calendar
						dates={[startDateTime, endDateTime]}
						type={CalendarType.PeriodWithTime}
						onClose={handlePeriodSelect}
						className={styles.calendar}
						disableManualInput={false}
						isCloseOnSelect={false}
						usedTypes={CALENDAR_USED_TYPES}
					/>
				)}
				<Select
					options={allowedDiscreteList}
					onSelect={handleSelectDiscrete}
					className={styles.selector}
				/>
				{unitList.length > 0 && (
					<Select
						options={unitList}
						onSelect={handleSelectUnit}
						className={styles.selector}
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
					onChange={(e) => {
						changeUpdateDelay(Number(e.target.value));
					}}
					disabled={!isUpdateChartEnabled}
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
		</div>
	);
}

export default ChartSettings;
