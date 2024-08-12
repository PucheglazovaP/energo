import { useCallback, useEffect, useReducer } from 'react';
import { format } from 'date-fns';

import { fetchReportLinkListFx } from '../../Models/Report/effects';
import { CalendarType } from '../../Shared/types';
import { ReportLinkType } from '../../Shared/Types/report';

import { ReportActions, ReportForm } from './types';

function ReportReducer(state: ReportForm, action: ReportActions) {
	switch (action.type) {
		case 'SET_DATE_PERIOD':
			return {
				...state,
				date: action.payload[0],
			};
		case 'SET_FLAG':
			return {
				...state,
				[action.flagName]: !state[action.flagName as keyof ReportForm],
			};
		case 'UPDATE_REPORT_LINK':
			return {
				...state,
				reportLink: action.payload,
			};
		case 'SET_REPORT_PATH':
			return {
				...state,
				reportPath: action.payload,
			};
		default:
			return state;
	}
}

export default function useReportFormInfo() {
	const [report, setReportData] = useReducer(ReportReducer, {
		date: new Date(`${format(new Date(), 'yyyy.MM.dd')} 00:00:00`),
		reportLink: '',
		isMoscowTimeZone: false,
		reportPath: '',
	});

	const handlePeriodSelect = (period: Date[]) => {
		setReportData({
			type: 'SET_DATE_PERIOD',
			payload: period,
		});
	};
	const handleTimeZoneChange = () => {
		setReportData({
			type: 'SET_FLAG',
			flagName: 'isMoscowTimeZone',
		});
	};

	const dateFormat = 'dd.MM.yyyy';

	const createReportLink = useCallback(() => {
		const link = `${report.reportPath}&fromd=${format(
			report.date,
			dateFormat,
		)}&hour_shift=${Number(report.isMoscowTimeZone)}&rs:Embed=true`;
		setReportData({
			type: 'UPDATE_REPORT_LINK',
			payload: link,
		});
	}, [report.date, dateFormat, report.isMoscowTimeZone, report.reportPath]);

	const usedCalendarTypes = [CalendarType.Month];

	useEffect(() => {
		fetchReportLinkListFx(ReportLinkType.ActivePowerConsumption).then((url) => {
			const result = decodeURI(url).split('&')[0];
			setReportData({
				type: 'SET_REPORT_PATH',
				payload: result,
			});
		});
	}, []);

	return {
		handlePeriodSelect,
		createReportLink,
		handleTimeZoneChange,
		usedCalendarTypes,
		...report,
	};
}
