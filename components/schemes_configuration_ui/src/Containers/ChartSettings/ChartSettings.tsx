import { useState } from 'react';
import { Button, Calendar } from '@evraz/ui-kit';
import clsx from 'clsx';
import { useStore } from 'effector-react';

import HistogramIcon from '../../Icons/Histogram';
import WidgetIcon from '../../Icons/Widget';
import { $activeChart } from '../../Models/ActiveChart';
import {
	changeDiscrete,
	changeUnit,
	changeUpdateDelay,
	openWidgetFromChart,
	setActiveChartParameters,
	setDateTimePeriod,
	setTypeGraphList,
	toggleUpdateChart,
} from '../../Models/ActiveChart/events';
import { OptionWithCoefficient } from '../../Models/ActiveChart/types';
import { openModal } from '../../Models/Modal/events';
import { RegisteredModals } from '../../Shared/modalsConfig';
import { CalendarType, FormTypes, TypesStorage } from '../../Shared/types';
import Checkbox from '../../UI/Checkbox';
import Input from '../../UI/Input';
import Select from '../../UI/Select';
import { SelectOption } from '../../UI/Select/types';

import styles from './ChartSettings.module.css';

function ChartSettings() {
	const {
		isUpdateChartEnabled,
		updateDelay,
		discreteList,
		unitList,
		isLoading,
		id: chartId,
		startDateTime,
		endDateTime,
		isMultiYaxesEnabled,
		formType,
		typesStorage,
		typeGraphList,
	} = useStore($activeChart);

	const [activeCalendarType, setActiveCalendarType] = useState(
		CalendarType.PeriodWithTime,
	);

	const onToggleUpdate = () => {
		toggleUpdateChart(!isUpdateChartEnabled);
	};

	const handlePeriodSelect = (period: Date[]) => {
		setDateTimePeriod({
			startDateTime: period[0],
			endDateTime: period[1],
		});
	};

	const handleSelectedUnit = (unitsList: OptionWithCoefficient[]) => {
		changeUnit(unitsList);
	};

	const handleSelectedDiscrete = (discreteList: SelectOption[]) => {
		changeDiscrete(discreteList);
	};

	const handleMultiYaxesStatusChange = () => {
		setActiveChartParameters({ isMultiYaxesEnabled: !isMultiYaxesEnabled });
	};
	const onHistogramBtnClick = () => {
		openModal(RegisteredModals.HistogramChart);
	};
	const onWidgetBtnClick = () => {
		openWidgetFromChart();
	};

	const onCompareBtnClick = () => {
		openModal(RegisteredModals.CompareWithPeriods);
	};

	const handleTypeChange = (type: CalendarType) => {
		setActiveCalendarType(type);
	};
	const handleSelectedTypeGraph = (options: SelectOption[]) => {
		setTypeGraphList(options);
	};

	const CALENDAR_USED_TYPES = [
		CalendarType.PeriodWithTime,
		CalendarType.Day,
		CalendarType.Month,
		CalendarType.Period,
		CalendarType.Quarter,
		CalendarType.Year,
	];

	const filteredDiscreteList =
		typesStorage === TypesStorage.Regulated
			? discreteList
			: discreteList
					.filter((item) => item.label === '1 мин')
					.map((item) => ({ ...item, isSelected: true }));

	return (
		<div className={styles.root}>
			{chartId && (
				<Calendar
					dates={[startDateTime, endDateTime]}
					type={activeCalendarType}
					onClose={handlePeriodSelect}
					className={styles.calendar}
					disableManualInput={false}
					isCloseOnSelect={false}
					onTypeChange={handleTypeChange}
					usedTypes={CALENDAR_USED_TYPES}
				/>
			)}
			{formType === FormTypes.MultiChart && (
				<Checkbox
					name={'multi-yaxes'}
					title="На разные оси"
					checked={isMultiYaxesEnabled}
					onChange={handleMultiYaxesStatusChange}
					className={styles.checkbox}
				/>
			)}
			{formType === FormTypes.Chart && (
				<>
					<Select
						options={unitList}
						onSelect={handleSelectedUnit}
						disabled={isLoading}
						className={clsx(styles.selector, styles['selector_unit'])}
					/>
					<Select
						options={typeGraphList}
						onSelect={handleSelectedTypeGraph}
						disabled={isLoading}
						className={styles.selector}
					/>
				</>
			)}
			<Select
				options={filteredDiscreteList}
				onSelect={handleSelectedDiscrete}
				disabled={isLoading}
				className={clsx(styles.selector, styles['selector_discrete'])}
			/>
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
			{formType === FormTypes.Chart && (
				<Button className={styles.btn} onClick={onCompareBtnClick}>
					Сравнить
				</Button>
			)}
			<Button className={styles.btn} onClick={onWidgetBtnClick}>
				<WidgetIcon className={styles.icon} />
				Виджет
			</Button>
			{formType === FormTypes.Chart && (
				<Button className={styles.btn} onClick={onHistogramBtnClick}>
					<HistogramIcon className={styles.icon} />
					Гистограмма
				</Button>
			)}
		</div>
	);
}

export default ChartSettings;
