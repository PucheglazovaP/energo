import { ActiveVersionIdsModel } from '../Models/ActiveIds/types';
import { Channel } from '../Models/ChannelDiagnostic/types';
import { DiagnosticShape } from '../Models/DiagnosticChart/types';
import {
	DiagnosticCurrentModel,
	DiagnosticDevice,
	FilterItem,
	ServersFavoritesSwitcher,
	ToggleBooleanStorageEvent,
} from '../Models/DiagnosticCurrent/types';
import {
	BackendResponse,
	FetchChannelsDiagnosticResponse,
	FetchDiagnosticChartResponse,
	User,
	UserId,
} from '../Shared/types';
import { Module, ModuleName } from '../Shared/Types/moduleName';
import { formatToDefaultDisplayFormat } from '../Utils/dateUtils';
import { getNumber, getString } from '../Utils/guards';

type BackendDiagnosticCurrentStateResponse = {
	Response: {
		Error: unknown;
		OutParameters: {
			'@PageNumber': string;
			'@FirstRow': string;
			'@PageTotalCount': string;
			'@Err': string;
			TextErr: string;
			'@ReturnValue': string;
		}[];
		PrintOutput: string;
		Tables: { Rows: unknown; Structure: unknown }[];
	};
};

type BackendDeviceData = {
	Сервер: string;
	IPИнтерфейса: string;
	СетьПорт: string;
	ИмяПрибора: string;
	НомерПрибора: string;
	'Номер в сети': string;
	Name: string;
	dat: string;
	num_ok: number;
	num_ok_clr: string;
	num_crc: number;
	num_crc_clr: string;
	num_to: number;
	num_to_clr: string;
	num_icp: number;
	num_icp_clr: string;
	daterr: string;
	ОшибкиСети: number;
	ОшибкиИнтерфейса: 3788;
	ErrTime: number;
	ЧЧММБезСвязи: string;
	FAV: boolean;
	RowNumber: number;
	State: string;
	State_clr: string;
};

type BackendInterface = {
	'IP адрес': string;
	Код: number;
};

type BackendPortLine = {
	Name: string;
	Код: number;
};

type BackendState = {
	state: string;
};

type BackendDeviceType = {
	ИмяПрибора: string;
	ТипПрибора: string;
};

type BackendDeviceName = {
	Наименование: string;
	НомерПрибора: string;
};

type BackendServer = {
	Код: number;
	Сервер: string;
};

export type FetchDiagnosticCurrentStateEffectAdapterReturn = {
	devices: DiagnosticDevice[];
	interfaces: FilterItem[];
	portsLines: FilterItem[];
	deviceStatuses: FilterItem[];
	deviceTypes: FilterItem[];
	deviceNames: FilterItem[];
	deviceNumbers: FilterItem[];
	servers: FilterItem[];
	totalPages: number;
	currentRow: number;
};

export function fetchDiagnosticCurrentStateEffectAdapter(
	response: string,
): FetchDiagnosticCurrentStateEffectAdapterReturn {
	const parsedResponse: BackendDiagnosticCurrentStateResponse =
		JSON.parse(response);

	const [
		backendServersRaw,
		backendInterfacesRaw,
		backendPortLineRaw,
		backendDevicesTypesRaw,
		backendDevicesNamesRaw,
		backendDevicesStatusesRaw,
		backendDevicesDataRaw,
	] = parsedResponse.Response.Tables;
	const [outParameters] = parsedResponse.Response.OutParameters;
	const backendDevicesData =
		(backendDevicesDataRaw?.Rows as BackendDeviceData[]) || [];
	const backendInterfaces =
		(backendInterfacesRaw?.Rows as BackendInterface[]) || [];
	const backendPortsLines =
		(backendPortLineRaw?.Rows as BackendPortLine[]) || [];
	const backendStatuses =
		(backendDevicesStatusesRaw?.Rows as BackendState[]) || [];
	const backendDevicesTypes =
		(backendDevicesTypesRaw?.Rows as BackendDeviceType[]) || [];
	const backendDevicesNames =
		(backendDevicesNamesRaw?.Rows as BackendDeviceName[]) || [];
	const backendServers = (backendServersRaw?.Rows as BackendServer[]) || [];

	const devices: DiagnosticDevice[] = backendDevicesData.map((device) => ({
		server: device['Сервер'],
		interface: device['IPИнтерфейса'],
		portLine: device['СетьПорт'],
		status: device['State'],
		statusColor: device['State_clr'],
		number: device['НомерПрибора'],
		type: device['ИмяПрибора'],
		networkNumber: device['Номер в сети'],
		name: device['Name'],
		ok: device['num_ok'],
		okColor: device['num_ok_clr'],
		crc: device['num_crc'],
		crcColor: device['num_crc_clr'],
		to: device['num_to'],
		toColor: device['num_to_clr'],
		icpTo: device['num_icp'],
		icpToColor: device['num_icp_clr'],
		date: formatToDefaultDisplayFormat(device['dat']),
		withoutConnection: device['ЧЧММБезСвязи'],
		isFavorite: device.FAV,
	}));

	const interfaces: FilterItem[] = backendInterfaces.map((item) => ({
		code: item.Код?.toString(),
		name: item['IP адрес'],
	}));

	const portsLines: FilterItem[] = backendPortsLines.map((item) => ({
		code: item.Код?.toString(),
		name: item.Name,
	}));

	const deviceStatuses: FilterItem[] = backendStatuses.map((item) => ({
		code: item.state,
		name: item.state,
	}));

	const deviceTypes: FilterItem[] = backendDevicesTypes.map((item) => ({
		code: item.ТипПрибора,
		name: item.ИмяПрибора,
	}));

	const deviceNames: FilterItem[] = backendDevicesNames.map((item) => ({
		code: item.НомерПрибора,
		name: item.Наименование,
	}));

	const deviceNumbers: FilterItem[] = backendDevicesNames.map((item) => ({
		code: item.НомерПрибора,
		name: item.НомерПрибора,
	}));

	const servers: FilterItem[] = backendServers.map((item) => ({
		code: item.Код.toString(),
		name: item.Сервер,
	}));

	const firstRow = Number(outParameters['@FirstRow']);

	return {
		devices,
		interfaces,
		portsLines,
		deviceStatuses,
		deviceTypes,
		deviceNames,
		deviceNumbers,
		servers,
		totalPages: Number(outParameters['@PageTotalCount']),
		currentRow: firstRow < 0 ? 0 : firstRow,
	};
}

function mapFilterStorage(storage: Record<string, boolean>): string {
	return Object.entries(storage)
		.reduce((accumulator: string[], entry) => {
			const [key, isActive] = entry;

			if (isActive) {
				accumulator.push(key);
			}

			return accumulator;
		}, [])
		.join(',');
}

export interface FetchDiagnosticCurrentStateSampleAdapterReturn extends UserId {
	currentPage: number;
	interfaces: string;
	portsLines: string;
	deviceTypes: string;
	deviceStatuses: string;
	deviceNumbers: string;
	deviceNames: string;
	crcExpression: string;
	icpToExpression: string;
	okExpression: string;
	toExpression: string;
	serverId: string;
	isFavoriteOnly: boolean;
	version?: number;
}

export function fetchDiagnosticCurrentStateSampleAdapter(
	states: Array<DiagnosticCurrentModel | ActiveVersionIdsModel | User | null>,
): FetchDiagnosticCurrentStateSampleAdapterReturn {
	const [diagnostic, activeVersion, user] = states as [
		DiagnosticCurrentModel,
		ActiveVersionIdsModel,
		User,
	];
	const { activeVersionId } = activeVersion as ActiveVersionIdsModel;

	const {
		currentPage,
		interfaceFilterStorage,
		portLineFilterStorage,
		deviceTypeFilterStorage,
		deviceStatusFilterStorage,
		deviceNumberFilterStorage,
		deviceNameFilterStorage,
		deviceCrcFilterExpression,
		deviceOkFilterExpression,
		deviceToFilterExpression,
		deviceIcpToFilterExpression,
		selectedSwitcherItem,
		selectedServerId,
	} = diagnostic as DiagnosticCurrentModel;
	const interfaces = mapFilterStorage(interfaceFilterStorage);
	const portsLines = mapFilterStorage(portLineFilterStorage);
	const deviceTypes = mapFilterStorage(deviceTypeFilterStorage);
	const deviceStatuses = mapFilterStorage(deviceStatusFilterStorage);
	const deviceNumbers = mapFilterStorage(deviceNumberFilterStorage);
	const deviceNames = mapFilterStorage(deviceNameFilterStorage);

	const serverId =
		selectedSwitcherItem === ServersFavoritesSwitcher.Servers
			? selectedServerId
			: '';

	const isFavoriteOnly =
		selectedSwitcherItem === ServersFavoritesSwitcher.Favorites;

	return {
		currentPage,
		interfaces,
		portsLines,
		deviceTypes,
		deviceStatuses,
		deviceNumbers,
		deviceNames,
		serverId,
		isFavoriteOnly,
		crcExpression: deviceCrcFilterExpression,
		icpToExpression: deviceIcpToFilterExpression,
		okExpression: deviceOkFilterExpression,
		toExpression: deviceToFilterExpression,
		version: activeVersionId,
		userId: user.preferredUsername || '',
	};
}

export interface UpdateDeviceFavoriteStateAdapterReturn extends UserId, Module {
	isAdding: boolean;
	deviceNumber: string;
}

export function updateDeviceFavoriteStateAdapter(
	state: Array<DiagnosticCurrentModel | User | null>,
	data: ToggleBooleanStorageEvent,
): UpdateDeviceFavoriteStateAdapterReturn {
	const [diagnosticState, user] = state as [DiagnosticCurrentModel, User];
	const { devicesFavoriteStorage } = diagnosticState;
	const { dictionaryKey } = data;

	return {
		isAdding: devicesFavoriteStorage[dictionaryKey],
		deviceNumber: dictionaryKey,
		userId: user.preferredUsername || '',
		moduleName:
			ModuleName.ToggleBooleanStorageEvent_sample_updateDeviceFavoriteStateAdapter,
	};
}

export type UpdateDeviceFavoriteStateEffectAdapterReturn = {
	isSuccess: boolean;
	deviceNumber: string;
};

type BackendUpdateDeviceFavoriteStateResponse = {
	Response: {
		Error: null;
	};
};

export function updateDeviceFavoriteStateEffectAdapter(deviceNumber: string) {
	return function Adapter(
		response: string,
	): UpdateDeviceFavoriteStateEffectAdapterReturn {
		const parsedResponse: BackendUpdateDeviceFavoriteStateResponse =
			JSON.parse(response);

		return { isSuccess: parsedResponse.Response.Error === null, deviceNumber };
	};
}

export function fetchDiagnosticChartAdapter(
	message: string,
): DiagnosticShape[] {
	const { Response }: BackendResponse = JSON.parse(message);
	const backendChart = Response.Tables[0]
		.Rows as FetchDiagnosticChartResponse[];
	const chart: DiagnosticShape[] = backendChart.map((bChart) => ({
		date: new Date(bChart.ДатаВремя).getTime(),
		lost: getNumber(bChart.lost_value, 'lost_value'),
		timeoutICPCON: getNumber(bChart['ТО ICP'], 'ТО ICP'),
		timeout: getNumber(bChart['ТО прибора'], 'ТО прибора'),
		crc: getNumber(bChart.CRC, 'CRC'),
		good: getNumber(bChart.Ok, 'Ok'),
	}));
	return chart;
}

export function fetchChannelsDiagnosticAdapter(message: string): Channel[] {
	const { Response }: BackendResponse = JSON.parse(message);
	const backendChannels: FetchChannelsDiagnosticResponse[] = Response.Tables[0]
		.Rows as FetchChannelsDiagnosticResponse[];
	const channels: Channel[] = backendChannels.map((channel) => {
		return {
			channelId: getString(channel.ChNumber, 'ChNumber'),
			channelName: getString(channel.ChName, 'ChName'),
			deviceId: getString(channel.DevNumber, 'DevNumber'),
			deviceName: getString(channel.DevName, 'DevName'),
			errCode: getNumber(channel.diag_code, 'diag_code'),
			errName: getString(channel.diag_name, 'diag_name'),
			errCount: getNumber(channel.ErrPercLast24H, 'ErrPercLast24H'),
			errDate: getString(channel.dat, 'dat'),
			serverId: getNumber(channel.FK_DataServers, 'FK_DataServers'),
		};
	});
	return channels;
}

export default {};
