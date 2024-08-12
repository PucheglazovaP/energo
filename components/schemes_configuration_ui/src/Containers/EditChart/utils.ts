import { XrangePointOptionsObject } from 'highcharts';

type CreateRandomPoints = {
	min?: number;
	max?: number;
	count?: number;
};

/**
 * Creates random value between provided min and max
 */
function createRandomValue(min: number, max: number): number {
	return Math.floor(Math.random() * (max - min) + min);
}

/**
 * Creates list of time
 * @returns list of time with step 30 (0:00, 0:30, ..., 23:30 in milliseconds)
 */
function createTimeSeries(): number[] {
	const times: number[] = [];
	const currentDate = new Date();
	const startTime = new Date(
		currentDate.getFullYear(),
		currentDate.getMonth(),
		currentDate.getDate(),
		0,
		0,
		0,
		0,
	);

	for (let i = 0; i < 48; i++) {
		const time = new Date(startTime.getTime() + i * 30 * 60 * 1000);
		times.push(time.getTime());
	}

	return times;
}

/**
 * Creates array of random points {x,y},
 * where x - time (by milliseconds, 0:00 - 23:30 of current day),
 * y - value between params.min and params.max
 */
export function createRandomPoints(
	params: CreateRandomPoints,
): XrangePointOptionsObject[] {
	const { min = 1, max = 100, count = 48 } = params;
	if (count > 48) {
		throw new Error('Максимально значение count не должно превышать 48');
	}
	const start: Date = new Date();
	start.setHours(0, 0, 0, 0);
	const points: XrangePointOptionsObject[] = [];
	const timeSeries = createTimeSeries();
	for (let i = 0; i < count; i++) {
		const randomValue = createRandomValue(min, max);
		points.push({
			y: randomValue,
			x: timeSeries[i],
		});
	}
	return points;
}

export default {};
