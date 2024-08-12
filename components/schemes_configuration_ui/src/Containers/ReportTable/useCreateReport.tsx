import { useState } from 'react';
import { toast } from 'react-toastify';
import { useStore } from 'effector-react';

import { $deviceReports } from '../../Models/DeviceReports';
import {
	DeviceReport,
	DeviceTypeAndHeatSystem,
} from '../../Models/DeviceReports/types';
import { closeModal } from '../../Models/Modal/events';
import { CalendarType } from '../../Shared/types';
import { SelectOption } from '../../UI/Select/types';
import { RegisteredModals } from '../ChartComparison/types';

import { initialPeriodState } from './constants';
import {
	getDeviceTypeCodeAndHeatSystems,
	getHeatSystemOptions,
	getReportUrl,
} from './utils';

function useCreateReport() {
	const { activeDeviceId, deviceReports, devicesList } =
		useStore($deviceReports);

	const [dates, setDates] = useState<Date[]>(initialPeriodState);
	const [periodType, setPeriodTypeChange] = useState<CalendarType>(
		CalendarType.Day,
	);
	const { deviceTypeCode, heatSystems }: DeviceTypeAndHeatSystem =
		getDeviceTypeCodeAndHeatSystems(devicesList, activeDeviceId);
	const [heatSystemOptions, setHeatSystemOptions] = useState<SelectOption[]>(
		getHeatSystemOptions(heatSystems),
	);

	const onCancel = () => {
		closeModal(RegisteredModals.CreateReport);
	};

	const onConfirm = () => {
		const deviceReport: DeviceReport[] = deviceReports.filter((item) => {
			return item.deviceType === deviceTypeCode;
		});
		const report = deviceReport.find(
			(item) =>
				// reportType бывает 0(Суточный) или 1(Часовой)
				item.reportType === Number(periodType === 'day'),
		);
		if (report) {
			const reportUrl: URL = getReportUrl(
				deviceReports,
				deviceTypeCode,
				activeDeviceId,
				dates,
				periodType,
				heatSystemOptions,
			);
			window.open(reportUrl, '_blank', 'noreferrer');
			closeModal(RegisteredModals.CreateReport);
		} else {
			if (periodType === 'day')
				toast.warn('По данному прибору нет часового отчета');
			else toast.warn('По данному прибору нет суточного отчета');
		}
	};

	return {
		dates,
		setDates,
		onCancel,
		onConfirm,
		periodType,
		setPeriodTypeChange,
		hasHeatSystems: heatSystems.length > 0,
		heatSystemOptions,
		setHeatSystemOptions,
	};
}

export default useCreateReport;
