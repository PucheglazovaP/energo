export enum DeviceCallStatuses {
	Crc = 'crc',
	Good = 'good',
	Lost = 'lost',
	Timeout = 'timeout',
	TimeoutICPCON = 'timeoutICPCON',
}

export const DeviceCallColor = {
	[DeviceCallStatuses.Crc]: '#FAB82E',
	[DeviceCallStatuses.Good]: '#B7D2B3',
	[DeviceCallStatuses.Lost]: '#2B2B2A',
	[DeviceCallStatuses.Timeout]: '#E32112',
	[DeviceCallStatuses.TimeoutICPCON]: '#B47DB6',
};

export const DeviceCallNames = {
	[DeviceCallStatuses.Good]: 'Нормально',
	[DeviceCallStatuses.Crc]: 'Ошибка CRC',
	[DeviceCallStatuses.Timeout]: 'Timeout',
	[DeviceCallStatuses.TimeoutICPCON]: 'Timeout ICP-CONa',
	[DeviceCallStatuses.Lost]: 'Ошибка драйвера',
};

export interface DeviceChartProps {
	id: number;
}
