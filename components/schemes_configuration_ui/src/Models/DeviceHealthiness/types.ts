export type DeviceHealthinessModel = {
	devices: DeviceHealthiness[];
	expandedDevices: Map<number, boolean>;
};
export type DeviceHealthiness = {
	name: string;
	id: number;
	ok: number;
	okColor: string;
	crc: number;
	crcColor: string;
	timeout: number;
	timeoutColor: string;
	timeoutICP: number;
	timeoutICPColor: string;
	date: string;
};
