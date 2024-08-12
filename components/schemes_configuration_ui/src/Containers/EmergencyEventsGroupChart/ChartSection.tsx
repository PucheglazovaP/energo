import { useEffect, useMemo, useReducer, useState } from 'react';
import { Button, Calendar } from '@evraz/ui-kit';
import clsx from 'clsx';
import { addDays, format, parse, subDays } from 'date-fns';
import { useStore } from 'effector-react';
import { AlignValue, AxisTitleAlignValue, Options } from 'highcharts';

import groupInfoChartDataAdapter, {
	tableDataAdapter,
} from '../../Adapters/emergencyEvents/modalGroupChartAdapter';
import { chartDataAdapter } from '../../Adapters/formDataAdapter';
import { getChartDataQuery } from '../../Const/Queries/chart';
import { Close } from '../../Icons';
import { $activeEventInfo } from '../../Models/EmergencyEvents';
import { closeModal } from '../../Models/Modal/events';
import { RegisteredModals } from '../../Shared/modalsConfig';
import { CalendarType, ChartValue } from '../../Shared/types';
import { ModuleName } from '../../Shared/Types/moduleName';
import Chart from '../../UI/Chart';
import HorizontalResizer from '../../UI/HorizontalResizer';
import Spinner from '../../UI/Spinner';
import Table from '../../UI/Table';
import { DateFormat } from '../../Utils/dateUtils';
import { checkResponseOutputWarnings } from '../../Utils/handleToast';
import { rpcQuery } from '../../Utils/requests';

import ChartSectionProps, {
	ChartActions,
	ChartActionsType,
	ChartState,
} from './types';

import styles from './ChartSection.module.css';

function chartReducer(state: ChartState, action: ChartActions) {
	switch (action.type) {
		case ChartActionsType.SetFlag:
			return {
				...state,
				isLoading: !state.isLoading,
			};
		case ChartActionsType.UpdateChartData:
			return {
				...state,
				data: action.payload,
			};
		case ChartActionsType.SetDatePeriod:
			return {
				...state,
				startDateTime: action.payload[0],
				endDateTime: action.payload[1],
			};
		default:
			return state;
	}
}

function ChartSection({ className }: ChartSectionProps) {
	const {
		groupNumber,
		maxSetpoint,
		minSetpoint,
		name,
		unitName,
		gtype,
		multipleCount,
	} = useStore($activeEventInfo);
	const [chart, setChartData] = useReducer(chartReducer, {
		isLoading: false,
		data: [],
		startDateTime: new Date(
			`${format(subDays(new Date(), 1), 'yyyy.MM.dd')} 00:00:00`,
		),
		endDateTime: new Date(
			`${format(addDays(new Date(), 1), 'yyyy.MM.dd')} 00:00:00`,
		),
	});
	const [selectedDate, setActiveDate] = useState<Date | null>(null);

	const updateChart = (startDateTime: Date, endDateTime: Date) => {
		if (groupNumber) {
			setChartData({
				type: ChartActionsType.SetFlag,
				flagName: 'isLoading',
			});
			rpcQuery<ChartValue[]>(
				getChartDataQuery({
					gr: groupNumber,
					startDateTime: startDateTime,
					endDateTime: endDateTime,
					isMoscowTimeZone: false,
					discrete: 'C',
					round: 2,
					gtype: gtype,
					multipleCount: multipleCount,
					moduleName: ModuleName.ChartSection_getChartDataQuery,
				}),
				chartDataAdapter,
				checkResponseOutputWarnings,
			).then((result) => {
				setChartData({
					type: ChartActionsType.UpdateChartData,
					payload: result,
				});
				setChartData({
					type: ChartActionsType.SetFlag,
					flagName: 'isLoading',
				});
			});
		}
	};

	const handlePeriodSelect = (period: Date[]) => {
		setChartData({
			type: ChartActionsType.SetDatePeriod,
			payload: period,
		});
	};

	const tableData = tableDataAdapter(chart.data);
	const series = groupInfoChartDataAdapter(
		chart.data,
		maxSetpoint,
		minSetpoint,
	);

	const activeIndex = useMemo(() => {
		let rowIndex = -1;
		if (selectedDate != null)
			rowIndex = tableData.findIndex((row) => {
				const date = row.dataLine.find((item) => item.accessor === 'date');
				if (date) {
					const formattedDate = parse(
						date.text as string,
						DateFormat.DefaultDisplayFormatWithSeconds,
						new Date(),
					);
					return formattedDate.getTime() === selectedDate?.getTime();
				}
			});
		return rowIndex;
	}, [selectedDate, tableData]);

	const yAxes = [
		{
			allowDecimals: true,
			title: {
				text: unitName,
				align: 'high' as AxisTitleAlignValue,
				y: -30,
				x: -30,
				rotation: 0,
				offset: 0,
				textAlign: 'left' as AlignValue,
				style: {
					fontWeight: '500',
					color: '#000000',
				},
			},
			min: null,
		},
	];

	const chartOptions: Options = {
		yAxis: yAxes,
		tooltip: {
			borderWidth: 0,
			enabled: true,
			borderColor: 'transparent',
			shadow: false,
			shared: true,
			useHTML: true,
			backgroundColor: 'transparent',
			style: {
				fontWeight: '375',
				fontSize: '14px',
				zIndex: 1000,
				color: '#FFFFFF',
			},
		},
		plotOptions: {
			series: {
				point: {
					events: {
						click: function () {
							const point = this;
							setActiveDate(new Date(point.x));
						},
					},
				},
			},
		},
		chart: {
			events: {
				click: function () {
					setActiveDate(
						this.hoverPoint?.category
							? new Date(this.hoverPoint?.category)
							: new Date(),
					);
				},
			},
		},
	};
	const tableHeader = [
		{
			accessor: 'date',
			text: 'Дата и время',
			isResizable: false,
			isSortable: false,
			sortOrder: 0,
			type: 'string',
			minWidth: 100,
			maxWidth: 150,
			width: 150,
		},
		{
			accessor: 'unit',
			text: unitName,
			isResizable: false,
			isSortable: false,
			sortOrder: 0,
			type: 'string',
		},
	];

	useEffect(() => {
		updateChart(chart.startDateTime, chart.endDateTime);
	}, [chart.startDateTime, chart.endDateTime]);

	return (
		<div className={clsx(styles.root, className)}>
			<div className={styles.title_section}>
				{' '}
				<h3 className={styles.title}>График / {name}</h3>
				<Button
					onClick={() => {
						closeModal(RegisteredModals.EmergencyEventsGroupChart);
					}}
					className={styles.close_btn}
				>
					<Close className={styles.icon} />
				</Button>
			</div>

			<div className={styles.wrapper}>
				{chart.isLoading ? (
					<div className={styles.spinner}>
						<Spinner className={styles.loading} />
					</div>
				) : (
					groupNumber && (
						<>
							<div className={styles.chart_settings}>
								<Calendar
									type={CalendarType.Period}
									dates={[chart.startDateTime, chart.endDateTime]}
									onSelect={handlePeriodSelect}
									className={styles.calendar}
									disableTypeSelector
								/>
							</div>
							<HorizontalResizer
								firstElementMinHeight={160}
								secondElementMinHeight={150}
								className={styles.resizer}
							>
								<Chart series={series} chartOptions={chartOptions} />
								<Table
									data={tableData}
									headers={tableHeader}
									className={styles.table}
									activeIndex={activeIndex}
								/>
							</HorizontalResizer>
						</>
					)
				)}
			</div>
		</div>
	);
}

export default ChartSection;
