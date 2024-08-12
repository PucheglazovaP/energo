import { useCallback, useEffect, useMemo, useReducer } from 'react';
import { format, subDays } from 'date-fns';
import { useStore } from 'effector-react';

import { $activeForm } from '../../Models/ActiveForm';
import { $navigation } from '../../Models/Navigation';
import { fetchReportLinkListFx } from '../../Models/Report/effects';
import { CalendarType } from '../../Shared/types';
import { ReportLinkType } from '../../Shared/Types/report';
import { SelectOption } from '../../UI/Select/types';

import { ReportActions, ReportForm } from './types';

export default function useReportFormInfo() {
	const discreteList = useMemo(
		() => [
			{
				value: 'C',
				label: '1 мин',
				isSelected: false,
			},
			{
				value: 'HH',
				label: '30 мин',
				isSelected: true,
			},
			{
				value: 'H',
				label: '60 мин',
				isSelected: false,
			},
			{
				value: 'D',
				label: '1 д',
				isSelected: false,
			},
			{
				value: 'M',
				label: '1 мес.',
				isSelected: false,
			},
		],
		[],
	);

	const { id, formType } = useStore($activeForm);
	const { versionId } = useStore($navigation);

	function ReportReducer(state: ReportForm, action: ReportActions) {
		switch (action.type) {
			case 'UPDATE_LIST':
				return { ...state, discreteList: action.payload };
			case 'SET_DATE_PERIOD':
				return {
					...state,
					startDateTime: action.payload[0],
					endDateTime: action.payload[1],
				};
			case 'SET_FLAG':
				return {
					...state,
					[action.flagName]: !state[action.flagName as keyof ReportForm],
				};
			case 'SET_CALENDAR_TYPE':
				return {
					...state,
					selectedCalendarType: action.payload,
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

	const [report, setReportData] = useReducer(ReportReducer, {
		startDateTime: new Date(
			`${format(subDays(new Date(), 7), 'yyyy.MM.dd')} 00:00:00`,
		),
		endDateTime: new Date(`${format(new Date(), 'yyyy.MM.dd')} 00:00:00`),
		discreteList: discreteList
			.filter((item) => item.value !== 'D' && item.value !== 'M')
			.map((item, index) => ({ ...item, isSelected: index === 0 })),
		selectedCalendarType: CalendarType.Period,
		reportLink: '',
		reportPath: '',
	});

	const handleSelectedDiscrete = (discreteList: SelectOption[]) => {
		setReportData({
			type: 'UPDATE_LIST',
			payload: discreteList,
		});
	};

	const usedCalendarTypes = [
		CalendarType.Day,
		CalendarType.Month,
		CalendarType.Period,
		CalendarType.DayTime,
		CalendarType.PeriodWithTime,
	];
	const onCalendarTypeChange = useCallback(
		(type: CalendarType) => {
			setReportData({
				type: 'SET_CALENDAR_TYPE',
				payload: type,
			});
			let allowedDiscreteList = [];
			switch (type) {
				case CalendarType.Day: {
					allowedDiscreteList = discreteList
						.filter((item) => item.value !== 'D' && item.value !== 'M')
						.map((item, index) => ({ ...item, isSelected: index === 0 }));
					break;
				}
				case CalendarType.DayTime: {
					allowedDiscreteList = discreteList
						.filter((item) => item.value !== 'D' && item.value !== 'M')
						.map((item, index) => ({ ...item, isSelected: index === 0 }));
					break;
				}
				case CalendarType.Month: {
					allowedDiscreteList = discreteList
						.filter((item) => item.value !== 'C')
						.map((item, index) => ({ ...item, isSelected: index === 0 }));
					break;
				}
				default:
					allowedDiscreteList = [...discreteList];
			}
			setReportData({
				type: 'UPDATE_LIST',
				payload: allowedDiscreteList,
			});
		},

		[discreteList],
	);
	const handlePeriodSelect = (period: Date[]) => {
		setReportData({
			type: 'SET_DATE_PERIOD',
			payload: period,
		});
	};

	const dateFormat = 'dd.MM.yyyy HH:mm:ss';

	const createReportLink = useCallback(() => {
		const link = `${report.reportPath}&fromd=${format(
			report.startDateTime,
			dateFormat,
		)}&tod=${format(report.endDateTime, dateFormat)}&form_code=${id}&typ=${
			report.discreteList.find((item) => item.isSelected)?.value
		}&version_code=${versionId || 90}&rs:Embed=true`;
		setReportData({
			type: 'UPDATE_REPORT_LINK',
			payload: link,
		});
	}, [
		id,
		report.startDateTime,
		report.endDateTime,
		report.discreteList,
		report.reportPath,
		dateFormat,
		versionId,
	]);

	useEffect(() => {
		fetchReportLinkListFx(ReportLinkType.ReportForm).then((url) => {
			const result = decodeURI(url).split('&')[0];
			setReportData({
				type: 'SET_REPORT_PATH',
				payload: result,
			});
		});
	}, []);

	return {
		handlePeriodSelect,
		onCalendarTypeChange,
		handleSelectedDiscrete,
		createReportLink,
		usedCalendarTypes,
		...report,
		id,
		formType,
		versionId,
	};
}
