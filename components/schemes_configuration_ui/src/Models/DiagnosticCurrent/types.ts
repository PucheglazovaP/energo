export type DiagnosticDevice = {
	server: string;
	interface: string;
	portLine: string;
	status: string;
	statusColor: string;
	number: string;
	type: string;
	networkNumber: string;
	name: string;
	ok: number;
	okColor: string;
	crc: number;
	crcColor: string;
	to: number;
	toColor: string;
	icpTo: number;
	icpToColor: string;
	date: string;
	withoutConnection: string;
	isFavorite: boolean;
};

export type FilterItem = {
	code: string;
	name: string;
};

export enum StorageFieldName {
	DevicesExpandStorage = 'devicesExpandStorage',
	InterfaceFilterStorage = 'interfaceFilterStorage',
	PortLineFilterStorage = 'portLineFilterStorage',
	DeviceStatusFilterStorage = 'deviceStatusFilterStorage',
	DeviceTypeFilterStorage = 'deviceTypeFilterStorage',
	DeviceNameFilterStorage = 'deviceNameFilterStorage',
	DeviceNumberFilterStorage = 'deviceNumberFilterStorage',
	DevicesFavoriteStorage = 'devicesFavoriteStorage',
}

export type ToggleBooleanStorageEvent = {
	storageFieldName: StorageFieldName;
	dictionaryKey: string;
	initialValue?: boolean;
};

export type SelectAllBooleanStorageEvent = {
	storageFieldName: StorageFieldName;
	dictionaryKeys: string[];
	initialValue?: boolean;
};

export enum ExpressionFieldName {
	DeviceCrcFilterExpression = 'deviceCrcFilterExpression',
	DeviceOkFilterExpression = 'deviceOkFilterExpression',
	DeviceToFilterExpression = 'deviceToFilterExpression',
	DeviceIcpToFilterExpression = 'deviceIcpToFilterExpression',
}

export type FilterExpressionEvent = {
	expressionFieldName: ExpressionFieldName;
	expressionValue: string;
};

export enum ServersFavoritesSwitcher {
	Servers = 'servers',
	Favorites = 'favorites',
}

export interface DiagnosticCurrentModel {
	devices: DiagnosticDevice[];
	// Expand/collapse section below: {server/interface: isExpanded}
	devicesExpandStorage: Record<string, boolean>;
	// Pagination below
	currentPage: number;
	totalPages: number;
	currentRow: number;
	// Filters below
	interfaces: FilterItem[];
	portsLines: FilterItem[];
	deviceStatuses: FilterItem[];
	deviceTypes: FilterItem[];
	deviceNames: FilterItem[];
	deviceNumbers: FilterItem[];
	servers: FilterItem[];
	// Filters storages: {filterCode: isChecked}
	interfaceFilterStorage: Record<string, boolean>;
	portLineFilterStorage: Record<string, boolean>;
	deviceStatusFilterStorage: Record<string, boolean>;
	deviceTypeFilterStorage: Record<string, boolean>;
	deviceNameFilterStorage: Record<string, boolean>;
	deviceNumberFilterStorage: Record<string, boolean>;
	// Filters expressions: Number/<Number/>Number
	deviceCrcFilterExpression: string;
	deviceOkFilterExpression: string;
	deviceToFilterExpression: string;
	deviceIcpToFilterExpression: string;
	// ServersFavorites switcher
	selectedSwitcherItem: ServersFavoritesSwitcher;
	selectedServerId: string;
	// Favorite state storage below: {deviceNumber: isFavorite}
	devicesFavoriteStorage: Record<string, boolean>;
	// Selected device (for chart displaying)
	selectedDeviceId: string;
}

/*
TODO: ПРИМЕЧАНИЕ: Для того чтобы программно выделить устройство необходимо:
1. Установить значение поля number устройства в поле selectedDeviceId
2. Убедиться что нужное устройство будет в списке, можно использовать фильтр deviceNumberFilterStorage,
	 добавить запись вида значение поля number: true, например: deviceNumberFilterStorage['3212512'] = true
3. Возможно потребуется вызов getCurrentDiagnosticDevicesDataEvent, если предыдущие шаги выполнены до загрузки страницы
4. Можно создать event или sample для упрощения описанной выше логики
*/

export default {};
