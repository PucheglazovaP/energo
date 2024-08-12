import { useMemo } from 'react';
import { useStore } from 'effector-react';

import { $activeChart } from '../../Models/ActiveChart';
import {
	calculateTimeWithoutData,
	getAggregateInfo,
} from '../../Utils/getAggregateInfo';

import styles from './ChartAggegateInfo.module.css';

function ChartAggegateInfo() {
	const {
		chartData,
		methodName,
		unitList,
		round,
		isTimeWithoutDataEnabled,
		discreteList,
		isConsumption,
	} = useStore($activeChart);

	const selectedUnit = useMemo(() => {
		return unitList.find((item) => item.isSelected);
	}, [unitList]);

	const selectedDiscrete = useMemo(() => {
		return discreteList.find((item) => item.isSelected);
	}, [discreteList]);

	const formData = useMemo(() => {
		if (chartData.length > 0)
			return chartData[0].data.map((item) => ({
				...item,
				value:
					item.value != null
						? item.value * (selectedUnit?.coefficient || 1)
						: null,
			}));
		return [];
	}, [selectedUnit, chartData]);

	const {
		max,
		sum,
		average,
		currentValue,
		currentForPeriod,
		averageForPeriod,
	} = getAggregateInfo(
		methodName,
		formData,
		isConsumption,
		selectedDiscrete?.secondsValue || 0,
	);
	const timeWithoutData = useMemo(() => {
		const result = isTimeWithoutDataEnabled
			? calculateTimeWithoutData(formData)
			: 0;
		return result;
	}, [isTimeWithoutDataEnabled, formData]);
	return (
		<div className={styles.root} id="aggregate-info">
			{max != null && !Number.isNaN(max) && (
				<div className={styles.item}>
					Максимальное,{' '}
					<span className={styles.unit}>{selectedUnit?.label}</span>
					<span className={styles.value}>{max.toFixed(round)}</span>
				</div>
			)}
			{sum != null && !Number.isNaN(sum) && (
				<div className={styles.item}>
					Сумма за период,
					<span className={styles.unit}>{selectedUnit?.label || ''}</span>{' '}
					<span className={styles.value}>{sum.toFixed(round)}</span>
				</div>
			)}
			{average != null && !Number.isNaN(average) && (
				<div className={styles.item}>
					Среднее,
					<span className={styles.unit}>{selectedUnit?.label || ''}</span>{' '}
					<span className={styles.value}>{average.toFixed(round)}</span>
				</div>
			)}
			{averageForPeriod != null && !Number.isNaN(averageForPeriod) && (
				<div className={styles.item}>
					Итого за период,
					<span className={styles.unit}>{selectedUnit?.label || ''}</span>{' '}
					<span className={styles.value}>
						{averageForPeriod.toFixed(round)}
					</span>
				</div>
			)}
			{currentValue != null && !Number.isNaN(currentValue) && (
				<div className={styles.item}>
					Текущее,
					<span className={styles.unit}>{selectedUnit?.label || ''}</span>{' '}
					<span className={styles.value}>{currentValue.toFixed(round)}</span>
				</div>
			)}
			{currentForPeriod != null && !Number.isNaN(currentForPeriod) && (
				<div className={styles.item}>
					Текущее за период,
					<span className={styles.unit}>{selectedUnit?.label || ''}</span>{' '}
					<span className={styles.value}>
						{currentForPeriod.toFixed(round)}
					</span>
				</div>
			)}
			{isTimeWithoutDataEnabled && selectedDiscrete?.value === 'C' && (
				<div className={styles.item}>
					Время без данных {timeWithoutData} мин
				</div>
			)}
		</div>
	);
}

export default ChartAggegateInfo;
