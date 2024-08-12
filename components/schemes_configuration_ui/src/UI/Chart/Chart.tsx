import { memo, useEffect, useRef, useState } from 'react';
import clsx from 'clsx';
import {
	AlignValue,
	OptionsLayoutValue,
	Tooltip,
	VerticalAlignValue,
	wrap,
} from 'highcharts';
import HighchartsMore from 'highcharts/highcharts-more';
import Highcharts from 'highcharts/highstock';
import Boost from 'highcharts/modules/boost';
import SolidGauge from 'highcharts/modules/solid-gauge';
import xrange from 'highcharts/modules/xrange';
import HighchartsReact from 'highcharts-react-official';

import { seriesCheckboxFormatter } from './partials/Legend';
import { tooltipFormatter } from './partials/Tooltip';
import { refreshWrapper } from './tooltipDelay';
import ChartProps from './types';

import styles from './Chart.module.css';
const _tooltip = Highcharts.Tooltip as typeof Tooltip;
wrap(_tooltip.prototype, 'refresh', refreshWrapper);
Boost(Highcharts);
xrange(Highcharts);
HighchartsMore(Highcharts);
SolidGauge(Highcharts);

function Chart({
	className,
	series,
	width = '100%',
	height = '100%',
	chartOptions = {},
	isNavigatorEnabled = true,
}: ChartProps) {
	const [showNavigator, setShowNavigator] = useState(false);
	const [options, setOptions] = useState<Highcharts.Options>({
		accessibility: { enabled: false },
		title: {
			text: '',
		},
		boost: {
			enabled: true,
			useGPUTranslations: true,
			allowForce: true,
		},
		navigator: {
			enabled: isNavigatorEnabled ? showNavigator : false,
		},
		chart: {
			animation: false,
			inverted: false,
			marginTop: 50,
			style: {
				fontFamily: 'GT Eesti Pro Text',
			},
			events: {
				// Событие отслеживания зума
				selection: function (event) {
					if (event.resetSelection) setShowNavigator(false);
					else setShowNavigator(true);
					return true;
				},
			},
			zooming: {
				type: 'xy',
				resetButton: {
					position: {
						align: 'left',
						x: -10,
						y: -40,
					},
				},
			},
		},
		plotOptions: {
			series: {
				boostThreshold: 2000,
				animation: false,
				states: {
					hover: {
						opacity: 1,
					},
				},
				stickyTracking: true,
				marker: {
					enabled: false,
					states: {
						hover: {
							enabled: false,
						},
					},
				},
			},
			column: {
				centerInCategory: true,
				states: {
					hover: {
						color: '#000000',
					},
				},
			},
		},
		legend: {
			enabled: true,
			align: 'right' as AlignValue,
			verticalAlign: 'top' as VerticalAlignValue,
			layout: 'horizontal' as OptionsLayoutValue,
			x: 0,
			y: 0,
			floating: true,
			backgroundColor: '#FFFFFF',
			useHTML: true,
			borderWidth: 0,
			itemStyle: {
				fontWeight: 'normal',
			},
			padding: 0,
		},
		tooltip: {
			borderWidth: 0,
			enabled: true,
			borderColor: 'transparent',
			shadow: false,
			shared: true,
			formatter: tooltipFormatter,
			delayForDisplay: 500,
			useHTML: true,
			backgroundColor: 'transparent',
			style: {
				fontWeight: '375',
				fontSize: '14px',
				zIndex: 1000,
				color: '#FFFFFF',
			},
		},
		xAxis: {
			tickWidth: 1,
			tickLength: 24,
			tickColor: '#EBEBEB',
			crosshair: {
				label: {
					enabled: true,
					borderColor: '#EBEBEB',
					borderWidth: 1,
				},
			},
			dateTimeLabelFormats: {
				day: '%d.%m',
			},
			type: 'datetime',
			labels: {
				rotation: 0,
				style: { fontSize: '12px' },
			},
			plotBands: [
				{
					borderWidth: 1,
					borderColor: '#EBEBEB',
				},
			],
		},
		credits: {
			enabled: false,
		},
		time: {
			useUTC: false,
		},
		loading: {
			hideDuration: 100,
			style: { backgroundColor: 'transparent', opacity: 1 },
		},
		yAxis: [
			{
				allowDecimals: true,
				title: {
					text: null,
				},
				labels: {
					format: '{value}',
				},
			},
		],
	});

	const chartRef = useRef<HighchartsReact.RefObject>(null);

	const containerRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (chartRef.current && containerRef.current) {
			const chart = chartRef.current.chart;
			const observer = new ResizeObserver(([entry]) => {
				if (
					containerRef.current?.offsetHeight !== chart.chartHeight ||
					containerRef.current?.offsetWidth !== chart.chartWidth
				) {
					const height = entry.contentRect.height;
					const width = entry.contentRect.width;
					chart.setSize(width, height, false);
				}
			});
			observer.observe(containerRef.current);
			return () => {
				observer.disconnect();
			};
		}
	}, []);

	useEffect(() => {
		Highcharts.setOptions({
			lang: {
				resetZoom: 'Сбросить масштаб',
				loading: 'Загрузка...',
				months: [
					'Январь',
					'Февраль',
					'Март',
					'Апрель',
					'Май',
					'Июнь',
					'Июль',
					'Август',
					'Сентябрь',
					'Октябрь',
					'Ноябрь',
					'Декабрь',
				],
				weekdays: [
					'Воскресенье',
					'Понедельник',
					'Вторник',
					'Среда',
					'Четверг',
					'Пятница',
					'Суббота',
				],
				shortMonths: [
					'Янв',
					'Фев',
					'Март',
					'Апр',
					'Май',
					'Июнь',
					'Июль',
					'Авг',
					'Сент',
					'Окт',
					'Нояб',
					'Дек',
				],
			},
		});
		setOptions((prevOptions) => ({ ...prevOptions, ...chartOptions, series }));
	}, [chartOptions, series]);
	useEffect(() => {
		setOptions((prevOptions) => ({
			...prevOptions,
			navigator: {
				enabled: isNavigatorEnabled ? showNavigator : false,
			},
		}));
	}, [showNavigator, isNavigatorEnabled]);

	useEffect(() => {
		if (chartRef.current) {
			chartRef.current.chart.update({
				legend: {
					labelFormatter: seriesCheckboxFormatter,
				},
			});
		}
	}, []);

	return (
		<div className={clsx(styles.root, className)} ref={containerRef} id="chart">
			<HighchartsReact
				highcharts={Highcharts}
				options={options}
				containerProps={{
					style: { width, height },
				}}
				ref={chartRef}
			/>
		</div>
	);
}

export default memo(Chart);
