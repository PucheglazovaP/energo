import { DiagnosticCurrentModel, ServersFavoritesSwitcher } from './types';

export const START_DIAGNOSTIC_PAGE = 0;

export const DEFAULT_MODEL: DiagnosticCurrentModel = {
	devices: [],
	devicesExpandStorage: {},
	currentPage: START_DIAGNOSTIC_PAGE,
	totalPages: 0,
	currentRow: 0,
	interfaces: [],
	portsLines: [],
	deviceStatuses: [],
	deviceTypes: [],
	deviceNames: [],
	deviceNumbers: [],
	servers: [],
	interfaceFilterStorage: {},
	portLineFilterStorage: {},
	deviceStatusFilterStorage: {},
	deviceTypeFilterStorage: {},
	deviceNameFilterStorage: {},
	deviceNumberFilterStorage: {},
	deviceCrcFilterExpression: '',
	deviceIcpToFilterExpression: '',
	deviceOkFilterExpression: '',
	deviceToFilterExpression: '',
	selectedServerId: '',
	selectedSwitcherItem: ServersFavoritesSwitcher.Servers,
	devicesFavoriteStorage: {},
	selectedDeviceId: '',
};

export default {};
