import { useCallback, useEffect, useMemo, useReducer } from 'react';
import {
	endOfMonth,
	endOfYear,
	format,
	startOfMonth,
	startOfYear,
	subDays,
} from 'date-fns';
import { useStore } from 'effector-react';

import columnChartDataAdapter from '../../Adapters/chart/columnChartDataAdapter';
import { chartDataAdapter } from '../../Adapters/formDataAdapter';
import { getChartDataQuery } from '../../Const/Queries/chart';
import useInterval from '../../Facades/useIntreval';
import { $activeChart } from '../../Models/ActiveChart';
import { fetchReportLinkListFx } from '../../Models/Report/effects';
import { CalendarType, ChartValue } from '../../Shared/types';
import { ModuleName } from '../../Shared/Types/moduleName';
import { SelectOption } from '../../UI/Select/types';
import { checkResponseOutputWarnings } from '../../Utils/handleToast';
import { rpcQuery } from '../../Utils/requests';

import { ColumnChart, ColumnChartActions } from './types';

const reportTypeID: Record<string, { [discrete: string]: number }> = {
	day: {
		H: 4,
		HH: 3,
		C: 2,
	},
	month: {
		D: 6,
		H: 5,
	},
	year: {
		D: 7,
	},
};

export default function useColumnChartInfo() {
	const { discreteList, asqlGroup, unitList, title, round, typeGraph } =
		useStore($activeChart);
	function columnChartReducer(state: ColumnChart, action: ColumnChartActions) {
		switch (action.type) {
			case 'UPDATE_LIST':
				return { ...state, discreteList: action.payload };
			case 'SET_UPDATE_DELAY':
				return { ...state, updateDelay: action.payload };
			case 'SET_DATE_PERIOD':
				return {
					...state,
					startDateTime: action.payload[0],
					endDateTime: action.payload[1],
				};
			case 'SET_FLAG':
				return {
					...state,
					[action.flagName]: !state[action.flagName as keyof ColumnChart],
				};
			case 'UPDATE_CHART_DATA':
				return {
					...state,
					data: action.payload,
				};
			case 'SET_CALENDAR_TYPE':
				return {
					...state,
					selectedCalendarType: action.payload,
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

	const [columnChart, setColumnChartData] = useReducer(columnChartReducer, {
		isMoscowTimeZone: false,
		startDateTime: new Date(
			`${format(subDays(new Date(), 1), 'yyyy.MM.dd')} 00:00:00`,
		),
		endDateTime: new Date(
			`${format(subDays(new Date(), 1), 'yyyy.MM.dd')} 23:59:59`,
		),
		isUpdateChartEnabled: false,
		updateDelay: 60,
		discreteList: discreteList
			.filter((item) => item.value !== 'D' && item.value !== 'M')
			.map((item, index) => ({ ...item, isSelected: index === 0 })),
		isLoading: false,
		selectedCalendarType: CalendarType.Day,
		data: [],
		isChartVisible: true,
		reportPath: '',
	});

	const updateChart = useCallback(() => {
		setColumnChartData({
			type: 'SET_FLAG',
			flagName: 'isLoading',
		});
		rpcQuery<ChartValue[]>(
			getChartDataQuery({
				gr: asqlGroup,
				startDateTime: columnChart.startDateTime,
				endDateTime: columnChart.endDateTime,
				isMoscowTimeZone: columnChart.isMoscowTimeZone,
				discrete:
					columnChart.discreteList
						.find((item) => item.isSelected)
						?.value.toString() || 'HH',
				round,
				gtype: typeGraph,
				moduleName: ModuleName.UseColumnChartInfo_getChartDataQuery,
			}),
			chartDataAdapter,
			checkResponseOutputWarnings,
		).then((chartData) => {
			setColumnChartData({ type: 'UPDATE_CHART_DATA', payload: chartData });
			setColumnChartData({
				type: 'SET_FLAG',
				flagName: 'isLoading',
			});
		});
	}, [
		asqlGroup,
		columnChart.startDateTime,
		columnChart.endDateTime,
		columnChart.isMoscowTimeZone,
		columnChart.discreteList,
	]);

	useEffect(() => {
		updateChart();
	}, [updateChart]);

	const handleSelectedDiscrete = (discreteList: SelectOption[]) => {
		setColumnChartData({
			type: 'UPDATE_LIST',
			payload: discreteList,
		});
		updateChart();
	};

	const selectedUnit = useMemo(() => {
		return (
			unitList.find((item) => item.isSelected) || {
				label: '',
				coefficient: 1,
				value: '',
				isSelected: true,
			}
		);
	}, [unitList]);

	const series = columnChartDataAdapter(
		columnChart.data,
		selectedUnit,
		title,
		round,
	);

	const usedCalendarTypes = [
		CalendarType.Day,
		CalendarType.Month,
		CalendarType.Year,
	];
	const onCalendarTypeChange = useCallback(
		(type: CalendarType) => {
			setColumnChartData({
				type: 'SET_CALENDAR_TYPE',
				payload: type,
			});
			let allowedDiscreteList = [];
			let startDateTime = new Date();
			let endDateTime = new Date();
			switch (type) {
				case CalendarType.Day: {
					startDateTime = columnChart.startDateTime;
					endDateTime = columnChart.startDateTime;
					allowedDiscreteList = discreteList
						.filter((item) => item.value !== 'D' && item.value !== 'M')
						.map((item, index) => ({ ...item, isSelected: index === 0 }));
					break;
				}
				case CalendarType.Month: {
					startDateTime = startOfMonth(columnChart.startDateTime);
					endDateTime = endOfMonth(columnChart.endDateTime);
					allowedDiscreteList = discreteList
						.filter((item) => item.value === 'D' || item.value === 'H')
						.map((item, index) => ({ ...item, isSelected: index === 0 }));
					break;
				}
				case CalendarType.Year: {
					startDateTime = startOfYear(columnChart.startDateTime);
					endDateTime = endOfYear(columnChart.endDateTime);
					allowedDiscreteList = discreteList
						.filter((item) => item.value === 'D')
						.map((item, index) => ({ ...item, isSelected: index === 0 }));
					break;
				}
				default:
					allowedDiscreteList = [...discreteList];
			}
			setColumnChartData({
				type: 'UPDATE_LIST',
				payload: allowedDiscreteList,
			});
			setColumnChartData({
				type: 'SET_DATE_PERIOD',
				payload: [startDateTime, endDateTime],
			});
			updateChart();
		},

		[discreteList, columnChart.endDateTime, columnChart.startDateTime],
	);
	const handlePeriodSelect = (period: Date[]) => {
		setColumnChartData({
			type: 'SET_DATE_PERIOD',
			payload: period,
		});
		updateChart();
	};

	const onToggleUpdate = () => {
		setColumnChartData({
			type: 'SET_FLAG',
			flagName: 'isUpdateChartEnabled',
		});
	};
	const onChangeUpdateDelay = (updateDelay: number) => {
		setColumnChartData({
			type: 'SET_UPDATE_DELAY',
			payload: updateDelay,
		});
	};

	const onReportBtnClick = () => {
		setColumnChartData({
			type: 'SET_FLAG',
			flagName: 'isChartVisible',
		});
	};
	const onHistogramBtnClick = () => {
		setColumnChartData({
			type: 'SET_FLAG',
			flagName: 'isChartVisible',
		});
	};

	const dateFormat = useMemo(() => {
		switch (columnChart.selectedCalendarType) {
			case CalendarType.Day: {
				return 'dd.MM.yyyy';
			}
			case CalendarType.Month: {
				return '1.MM.yyyy';
			}
			case CalendarType.Year: {
				return '1.01.yyyy';
			}
			default:
				return 'dd.MM.yyyy';
		}
	}, [columnChart.selectedCalendarType]);

	useInterval(() => {
		if (columnChart.isUpdateChartEnabled) updateChart();
	}, columnChart.updateDelay * 1000);

	const reportLink = useMemo(() => {
		return `${columnChart.reportPath}&fromd=${format(
			columnChart.startDateTime,
			dateFormat,
		)}&gr=${asqlGroup}&rs:Embed=true`;
	}, [
		columnChart.startDateTime,
		dateFormat,
		asqlGroup,
		columnChart.reportPath,
	]);

	useEffect(() => {
		const selectedDiscrete =
			columnChart.discreteList.find((item) => item.isSelected)?.value || 'C';
		const id = reportTypeID[columnChart.selectedCalendarType][selectedDiscrete];
		fetchReportLinkListFx(id).then((url) => {
			const result = decodeURI(url).split('&')[0];
			setColumnChartData({
				type: 'SET_REPORT_PATH',
				payload: result,
			});
		});
	}, [columnChart.selectedCalendarType, columnChart.discreteList]);

	return {
		reportLink,
		onHistogramBtnClick,
		onReportBtnClick,
		onChangeUpdateDelay,
		onToggleUpdate,
		handlePeriodSelect,
		onCalendarTypeChange,
		handleSelectedDiscrete,
		usedCalendarTypes,
		series,
		title,
		...columnChart,
	};
}
