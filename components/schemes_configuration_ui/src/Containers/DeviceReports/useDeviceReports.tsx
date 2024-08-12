import { useCallback, useEffect, useMemo } from 'react';
import { useStore } from 'effector-react';

import { $user } from '../../Models/Auth';
import {
	$deviceReports,
	initialSearchFiltersStore,
	initialSortFilterStore,
} from '../../Models/DeviceReports';
import {
	getDeviceParametersFx,
	updateDeviceParameterFx,
} from '../../Models/DeviceReports/effects';
import {
	setActiveDeviceIdEvent,
	setChangeTypeEvent,
	setDeviceParametersEvent,
	setDevicesIsLoading,
	setDeviceTypeOptionsEvent,
	setEditModeEvent,
	setSelectedDeviceTypesEvent,
	setTableSearchFiltersEvent,
	setTableSortFilterEvent,
} from '../../Models/DeviceReports/events';
import { openModal } from '../../Models/Modal/events';
import { DeviceParams } from '../../Shared/types';
import { ModuleName } from '../../Shared/Types/moduleName';
import { RegisteredModals } from '../ChartComparison/types';
import ReportTable from '../ReportTable';

import { DeviceParameters } from './DeviceParameters';
import { DevicesReportTitle } from './types';

export function useDeviceReports() {
	const user = useStore($user);
	const { reportTypes, isEditMode, deviceParameters, activeDeviceId } =
		useStore($deviceReports);

	// Изменение типа отчета
	const onChangeType = useCallback((id: string) => {
		setDevicesIsLoading(true);
		setChangeTypeEvent(id as DevicesReportTitle);
		setActiveDeviceIdEvent(0);
		setDeviceTypeOptionsEvent([]);
		setSelectedDeviceTypesEvent([]);
		setTableSortFilterEvent(initialSortFilterStore);
		setTableSearchFiltersEvent(initialSearchFiltersStore);
	}, []);

	// Включение режима редактирования параметров выбранного прибора
	const onDeviceEdit = useCallback(async () => {
		if (!user) return;
		setEditModeEvent(true);
		await getDeviceParametersFx({
			number: activeDeviceId,
			userId: user.preferredUsername,
			moduleName: ModuleName.UseDeviceReports_getDeviceParametersFx,
		});
	}, [activeDeviceId, user]);

	// Обработка нажатия кнопки "Сформировать отчет"
	const onGenerateReport = useCallback(() => {
		openModal(RegisteredModals.CreateReport);
	}, []);

	// Обработка нажатия кнопки "Завершить"
	const onCloseParameters = useCallback(() => {
		setEditModeEvent(false);
		setDeviceParametersEvent([]);
	}, []);

	// Изменение значения параметра прибора
	const onEditDeviceParameter = useCallback(
		async ({ name, value }: DeviceParams) => {
			if (!user) return;
			await updateDeviceParameterFx({
				value: value,
				name: name,
				number: activeDeviceId,
				userId: user.preferredUsername,
				moduleName: ModuleName.UseDeviceReports_updateDeviceParameterFx,
			});
		},
		[activeDeviceId, user],
	);

	// Функция рендера Блока Параметров
	const renderDeviceParameters = useMemo(
		() => (
			<DeviceParameters
				deviceParameters={deviceParameters}
				onEditDeviceParameter={onEditDeviceParameter}
			/>
		),
		[deviceParameters, onEditDeviceParameter],
	);

	// Функция рендера Таблицы Приборов
	const renderReportTable = useMemo(
		() => (
			<ReportTable
				isEditMode={isEditMode}
				onCloseParameters={onCloseParameters}
			/>
		),
		[isEditMode, onCloseParameters],
	);

	useEffect(() => {
		setDevicesIsLoading(true);
	}, []);

	return {
		isEditMode,
		reportTypes,
		onChangeType,
		onDeviceEdit,
		onGenerateReport,
		renderDeviceParameters,
		renderReportTable,
	};
}
