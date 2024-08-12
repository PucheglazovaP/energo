import {
	DeviceReport,
	DeviceReportsTypes,
	DevicesList,
	DeviceTypeAndHeatSystem,
	HeatSystem,
} from '../../Models/DeviceReports/types';
import { CalendarType, FilterOptions } from '../../Shared/types';
import { SelectOption } from '../../UI/Select/types';
import { DateFormat, formatDate } from '../../Utils/dateUtils';

/**
 * Словарь, чтобы соотнести названия колонок в таблице и поле объекта devicesList в модели
 * @returns поле объекта devicesList в модели
 */
export function getFieldByAccessor(accessor: string): keyof DevicesList {
	switch (accessor) {
		case 'interface':
			return 'deviceId';
		case 'accounting':
			return 'device';
		case 'status':
			return 'deviceType';

		default:
			return 'deviceId';
	}
}

/**
 * Function to filter devicesList's raw data by some text
 * @returns only devicesList's raw data whose objects includes text
 */
export function filterDevicesListByText(
	devicesList: DevicesList[],
	accessor: string,
	text: string,
): DevicesList[] {
	const result = devicesList.filter((item) => {
		return String(item[getFieldByAccessor(accessor) as keyof DevicesList])
			.toLowerCase()
			.includes(text.toLowerCase());
	});

	return result;
}

/**
 * Берёт из модели номер активного переключателя
 * @returns номер активного переключателя
 */
export function getSelectedReportType(
	reportTypes: DeviceReportsTypes[],
): string {
	const [{ id }]: DeviceReportsTypes[] = reportTypes.filter(
		(item) => item.isChecked,
	);

	return id;
}

export default {};

/**
 * Получаем усеченный url отчёта по прибору в зависимости от типа периода "Часовой/Суточный"
 * без поисковых параметров
 * @returns url отчёта в зависимости от типа периода "Часовой/Суточный" без поисковых параметров
 */
export function getTruncatedDeviceReportUrl(
	deviceReports: DeviceReport[],
	deviceTypeCode: number,
	periodType: CalendarType,
): string {
	// находим нужные приборы по deviceType
	const deviceReport: DeviceReport[] = deviceReports.filter((item) => {
		return item.deviceType === deviceTypeCode;
	});

	// выбираем из отфильтрованных данных суточный или часовой в зависимости от выбранного периода
	const [{ reportUrl }]: DeviceReport[] = deviceReport.filter(
		(item) =>
			// reportType бывает 0(Суточный) или 1(Часовой)
			item.reportType === Number(periodType === 'day'),
	);

	// усеченный url отчета без поисковых параметров
	const [truncatedDeviceReportUrl] = reportUrl.split('&');

	return truncatedDeviceReportUrl;
}

/**
 * Получаем код типа прибора и теплосистемы прибора из devicesList по deviceId
 * @returns код типа прибора и теплосистемы прибора
 */
export function getDeviceTypeCodeAndHeatSystems(
	devicesList: DevicesList[],
	deviceId: number,
): DeviceTypeAndHeatSystem {
	const [{ deviceTypeCode, heatSystems }]: DevicesList[] = devicesList.filter(
		(item) => item.deviceId === deviceId,
	);

	return { deviceTypeCode, heatSystems };
}

/**
 * Готовит url для получения отчета в зависимости от типа периода
 * @returns отформатированный url
 */
export function getReportUrl(
	deviceReports: DeviceReport[],
	deviceTypeCode: number,
	deviceId: number,
	dates: Date[],
	periodType: CalendarType,
	heatSystemOptions: SelectOption[],
): URL {
	const truncatedDeviceReportUrl: string = getTruncatedDeviceReportUrl(
		deviceReports,
		deviceTypeCode,
		periodType,
	);

	const searchParams: URLSearchParams = new URLSearchParams({
		fromd: formatDate(dates[0], DateFormat.DisplayFormatWithoutTime),
		num_pr: String(deviceId),
	});

	if (periodType === CalendarType.Period)
		searchParams.set(
			'tod',
			formatDate(dates[1], DateFormat.DisplayFormatWithoutTime),
		);

	if (heatSystemOptions.length > 0)
		searchParams.set('tsys', getSelectedOption(heatSystemOptions));

	const reportUrl: URL = new URL(`${truncatedDeviceReportUrl}&${searchParams}`);

	return reportUrl;
}

/**
 * Из теплосистем активного прибора формируем массив опций для переключателя теплосистем
 * @returns массив опций для переключателя теплосистем
 */
export function getHeatSystemOptions(
	deviceHeatSystems: HeatSystem[],
): SelectOption[] {
	const heatSystemOptions: SelectOption[] =
		deviceHeatSystems.length > 0
			? deviceHeatSystems.map(({ tsys }, index) => ({
					label: String(tsys),
					value: tsys,
					isSelected: !index,
			  }))
			: [];

	return heatSystemOptions;
}

/**
 * Получаем номер выбранной теплосистемы из переключателя теплосистем
 * @returns номер выбранной теплосистемы
 */
export function getSelectedOption(heatSystemOptions: SelectOption[]): string {
	const [{ value: heatSystemSelectedOption }]: SelectOption[] =
		heatSystemOptions.filter(({ isSelected }) => isSelected);

	return String(heatSystemSelectedOption);
}

/**
 * Получаем набор уникальных типов приборов из списка всех приборов
 * и преобразуем в опции для фильтра по типу приборов
 * @returns набор опций для фильтра колонки таблицы по типу приборов
 */
export function getFilterOptionsByDeviceType(
	devicesList: DevicesList[],
): FilterOptions[] {
	const filterOptions: FilterOptions[] = [];

	const deviceTypesList: string[] = devicesList.map(
		({ deviceType }: DevicesList) => deviceType,
	);

	/* При помощи объекта Set получаем уникальный список типов приборов
	и преобразуем в опции для фильтра по типу приборов */
	new Set(deviceTypesList).forEach((deviceType: string) =>
		filterOptions.push({
			name: deviceType,
			key: deviceType,
			isChecked: true,
		}),
	);

	return filterOptions;
}
