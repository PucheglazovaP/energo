import { AggregateTypes, ChartValue } from '../Shared/types';

export function getAggregateInfo(
	methodName: string,
	chartData: ChartValue[],
	isConsumption: boolean,
	secondsValue: number,
) {
	let max,
		sum,
		average,
		currentValue,
		averageForPeriod,
		currentForPeriod = null;

	if (chartData.length > 0)
		switch (methodName) {
			case AggregateTypes.Sum: {
				sum = getSum(chartData);
				max = getMax(chartData);
				break;
			}
			case AggregateTypes.Average: {
				average = calculateAverage(chartData);
				if (chartData.length > 0) {
					currentValue = chartData[chartData.length - 1].value;
					if (isConsumption) {
						const startTimestamp = new Date(chartData[0].date).getTime();
						const endTimestamp = new Date(
							chartData[chartData.length - 1].date,
						).getTime();
						const duration = (endTimestamp - startTimestamp) / 1000;
						averageForPeriod = (average * (duration + secondsValue)) / 3600;
					}
				}
				break;
			}
			case AggregateTypes.Current: {
				currentValue = chartData.length
					? chartData[chartData.length - 1].value
					: 0;
				currentForPeriod = sumValuesInRange(chartData);
				break;
			}
		}

	return {
		max,
		sum,
		average,
		currentValue,
		currentForPeriod,
		averageForPeriod,
	};
}
export function getAggregateSum(
	methodName: string,
	chartData: ChartValue[],
	isConsumption: boolean,
) {
	let aggregateSum = 0;

	switch (methodName) {
		case AggregateTypes.Sum: {
			aggregateSum = getSum(chartData);
			break;
		}
		case AggregateTypes.Average: {
			if (chartData.length > 0) {
				let average = calculateAverage(chartData);
				if (isConsumption) {
					const startTimestamp = new Date(chartData[0].date).getTime();
					const endTimestamp = new Date(
						chartData[chartData.length - 1].date,
					).getTime();
					const duration = (endTimestamp - startTimestamp) / 1000;
					aggregateSum = (average * duration) / 3600;
				} else aggregateSum = average;
			}
			break;
		}
		case AggregateTypes.Current: {
			aggregateSum = sumValuesInRange(chartData);
			break;
		}
	}

	return aggregateSum;
}
// для работы с большим массивом данных метод for оптимальный
function getSum(data: ChartValue[]) {
	let sum = 0;
	if (data.length > 1)
		for (let i = 0; i < data.length; i++) {
			sum += Number(data[i].value);
		}
	else if (data.length === 1) return Number(data[0].value);
	return sum;
}

function getMax(data: ChartValue[]) {
	if (data.length > 1) {
		let max = Number(data[0].value);
		for (let i = 0; i < data.length; i++) {
			const value = Number(data[i].value);
			max = value > max ? value : max;
		}
		return max;
	} else if (data.length === 1) return data[0].value;
	return 0;
}

export function calculateTimeWithoutData(data: ChartValue[]) {
	let timeWithoutData = 0;

	for (let i = 0; i < data.length - 1; i++) {
		if (data[i].value === null) {
			timeWithoutData += getMinutesBetween(data[i].date, data[i + 1].date);
		}
	}
	return timeWithoutData;
}

function getMinutesBetween(startDate: string, endDate: string) {
	const start = new Date(startDate);
	const end = new Date(endDate);
	const diff = end.getTime() - start.getTime();
	return Math.round(diff / (1000 * 60));
}
function calculateAverage(data: ChartValue[]) {
	let sum = 0;
	let count = 0;
	for (let i = 0; i < data.length; i++) {
		if (data[i].value != null) {
			const x = Number(data[i].value);
			count++;
			sum += x;
		}
	}
	return sum / count;
}

function sumValuesInRange(data: ChartValue[]) {
	if (data.length > 0) {
		const startValue = data[0].value;
		const endValue = data[data.length - 1].value;
		// дельты
		const changes = [];
		const nonNegativeChanges = [];
		let possible = [];
		const filteredData = data.filter((item) => item.value != null);
		for (let i = 1; i < filteredData.length; i++) {
			const change =
				Number(filteredData[i]?.value || 0) -
				Number(filteredData[i - 1]?.value || 0);
			if (change >= 0) {
				possible.push(change);
			} else {
				nonNegativeChanges.push(...possible);
				possible = [];
			}
			changes.push(change);
		}
		const negativeChanges = changes.filter((change) => change < 0);

		if (negativeChanges.length === 0) {
			return Number(endValue) - Number(startValue);
		} else {
			const positiveSum = [...nonNegativeChanges, ...possible].reduce(
				(prev, curr) => prev + curr,
				0,
			);
			return positiveSum;
		}
	}
	return 0;
}
