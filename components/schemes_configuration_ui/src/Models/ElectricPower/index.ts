import { createStore } from 'effector';

import { ReportType } from '../../Pages/PageElectricPower/types';

import { setReportTypeEvent } from './events';
import { ElectricPower } from './types';

export const $electricPower = createStore<ElectricPower>({
	selectedReportType: ReportType.Day,
});

$electricPower.on(setReportTypeEvent, (state, selectedReportType) => {
	return { ...state, selectedReportType };
});
