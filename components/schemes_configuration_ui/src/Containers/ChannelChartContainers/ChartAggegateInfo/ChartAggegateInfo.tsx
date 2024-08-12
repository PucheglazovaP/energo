import { useMemo } from 'react';
import { useStore } from 'effector-react';

import { $activeChart } from '../../../Models/ActiveChannelChart';
import {
	calculateTimeWithoutData,
	getAggregateInfo,
} from '../../../Utils/getAggregateInfo';

import styles from './ChartAggegateInfo.module.css';

function ChartAggegateInfo() {
	const {
		isTimeWithoutDataEnabled,
		discreteList,
		methodName,
		isConsumption,
		channelsData,
	} = useStore($activeChart);

	const formData = useMemo(() => {
		if (channelsData.length > 0)
			return channelsData.map((dataItem) => {
				return {
					date: dataItem.date,
					value: dataItem.value != null ? dataItem.value : null,
				};
			});
		return [];
	}, [channelsData]);

	const selectedDiscrete = useMemo(() => {
		return discreteList.find((item) => item.isSelected);
	}, [discreteList]);

	const {
		max,
		sum,
		average,
		currentValue,
		currentForPeriod,
		averageForPeriod,
	} = useMemo(
		() =>
			getAggregateInfo(
				methodName,
				formData,
				isConsumption,
				selectedDiscrete?.secondsValue || 0,
			),
		[methodName, formData, isConsumption, selectedDiscrete?.secondsValue],
	);

	const timeWithoutData = useMemo(() => {
		const result = isTimeWithoutDataEnabled
			? calculateTimeWithoutData(formData)
			: 0;
		return result;
	}, [isTimeWithoutDataEnabled, formData]);

	return (
		<div className={styles.root} id="aggregate-info">
			{max != null && (
				<div className={styles.item}>
					Максимальное, <span className={styles.unit}>{''}</span>
					<span className={styles.value}>{max.toFixed(6)}</span>
				</div>
			)}
			{sum != null && (
				<div className={styles.item}>
					Сумма за период,
					<span className={styles.unit}>{''}</span>{' '}
					<span className={styles.value}>{sum.toFixed(6)}</span>
				</div>
			)}
			{average != null && (
				<div className={styles.item}>
					Среднее,
					<span className={styles.unit}></span>{' '}
					<span className={styles.value}>{average.toFixed(6)}</span>
				</div>
			)}
			{averageForPeriod != null && (
				<div className={styles.item}>
					Итого за период,
					<span className={styles.unit}></span>{' '}
					<span className={styles.value}>{averageForPeriod.toFixed(6)}</span>
				</div>
			)}
			{currentValue != null && (
				<div className={styles.item}>
					Текущее,
					<span className={styles.unit}></span>{' '}
					<span className={styles.value}>{currentValue.toFixed(6)}</span>
				</div>
			)}
			{currentForPeriod != null && (
				<div className={styles.item}>
					Текущее за период,
					<span className={styles.unit}></span>{' '}
					<span className={styles.value}>{currentForPeriod.toFixed(6)}</span>
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
