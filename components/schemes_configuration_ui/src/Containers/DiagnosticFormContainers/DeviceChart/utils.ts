import { SeriesColumnOptions } from 'highcharts';

import { DeviceCallColor, DeviceCallNames, DeviceCallStatuses } from './types';

export function createDefaultSeries(
	id: DeviceCallStatuses,
): SeriesColumnOptions {
	return {
		type: 'column',
		id,
		name: DeviceCallNames[id],
		color: DeviceCallColor[id],
		data: [],
		visible: true,
	};
}
