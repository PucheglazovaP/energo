import React, {
	useCallback,
	useEffect,
	useMemo,
	useReducer,
	useState,
} from 'react';
import { toast } from 'react-toastify';
import d3ToPng from 'd3-svg-to-png';
import { useStore } from 'effector-react';
import { Options, SeriesLegendItemClickCallbackFunction } from 'highcharts';
import { v4 as uuidv4 } from 'uuid';

import comparisonChartDataAdapter, {
	modifyHeaders,
	tableDataAdapter,
	tableDataExcelAdapter,
} from '../../Adapters/chart/comparisonChartDataAdapter';
import { chartDataAdapter } from '../../Adapters/formDataAdapter';
import { getChartDataQuery } from '../../Const/Queries/chart';
import CopyIcon from '../../Icons/Copy';
import PrinterIcon from '../../Icons/Printer';
import SaveIcon from '../../Icons/Save';
import { $activeChart } from '../../Models/ActiveChart';
import { OptionWithCoefficient } from '../../Models/ActiveChart/types';
import { $formTabs } from '../../Models/FormTabs';
import { openModal } from '../../Models/Modal/events';
import { $periodsForChartComparison } from '../../Models/PeriodsForChartComparison';
import { setPeriods } from '../../Models/PeriodsForChartComparison/events';
import { YAXIS_LINE_COLORS } from '../../Shared/const';
import { CalendarType, ChartValue } from '../../Shared/types';
import { ModuleName } from '../../Shared/Types/moduleName';
import Checkbox from '../../UI/Checkbox';
import {
	ContextMenuItem,
	ContextMenuPosition,
} from '../../UI/ContextMenu/types';
import { SelectOption } from '../../UI/Select/types';
import { getDatesForAggregateValues } from '../../Utils/dateUtils';
import exportInfoTableToExcel, {
	createTextContentForClipboard,
} from '../../Utils/exportToExcel';
import { generateRandomColor } from '../../Utils/generateRandomColor';
import { checkResponseOutputWarnings } from '../../Utils/handleToast';
import { rpcQuery } from '../../Utils/requests';
import { getYAxisRangeConfig } from '../../Utils/trends';

import { tooltipFormatter } from './Tooltip';
import {
	ChartActionsType,
	ComparisonChart,
	ComparisonChartActions,
	RegisteredModals,
} from './types';

import styles from './ChartComparison.module.css';

export default function useChartComparison() {
	const { formTabs, selectedVersion } = useStore($formTabs);
	const {
		chartData,
		isMoscowTimeZone,
		discreteList,
		unitList,
		id,
		title,
		round,
		typeGraph,
		methodName,
		isConsumption,
	} = useStore($activeChart);

	const periodsForChartComparison = useStore($periodsForChartComparison);

	const asqlGroup = chartData.length > 0 ? chartData[0].asqlGroup : null;

	function comparisonChartReducer(
		state: ComparisonChart,
		action: ComparisonChartActions,
	) {
		switch (action.type) {
			case ChartActionsType.UpdateDiscreteList:
				return { ...state, discreteList: action.payload };
			case ChartActionsType.UpdateUnitList:
				return { ...state, unitList: action.payload };
			case ChartActionsType.SetFlag:
				return {
					...state,
					[action.flagName]: action.value,
				};
			case ChartActionsType.UpdateChartData:
				return {
					...state,
					chartsData: [...state.chartsData, action.payload],
				};
			case ChartActionsType.ResetChartData:
				return {
					...state,
					chartsData: [],
				};
			case ChartActionsType.SetTrendVisibleState:
				return {
					...state,
					chartsData: state.chartsData.map((item) => {
						if (item.id === action.payload)
							return { ...item, isVisibleOnChart: !item.isVisibleOnChart };
						return item;
					}),
				};
			default:
				return state;
		}
	}

	const [comparisonChart, setComparisonChartData] = useReducer(
		comparisonChartReducer,
		{
			isMoscowTimeZone: isMoscowTimeZone,
			discreteList: discreteList,
			isLoading: false,
			chartsData: [],
			unitList: unitList,
			isRelativeZeroEnabled: false,
			isTimeWithoutDataEnabled: false,
			isSumColumnVisible: false,
		},
	);

	const handleItemClick: SeriesLegendItemClickCallbackFunction = function (
		this,
	) {
		const {
			userOptions: { name, visible, id },
		} = this;
		if (name === 'Сумма') {
			setComparisonChartData({
				type: ChartActionsType.SetFlag,
				flagName: 'isSumColumnVisible',
				value: !visible,
			});
		} else
			setComparisonChartData({
				type: ChartActionsType.SetTrendVisibleState,
				payload: String(id),
			});
	};

	const selectedUnit = useMemo(() => {
		return (
			comparisonChart.unitList.find((item) => item.isSelected) || {
				label: '',
				coefficient: 1,
				value: '',
				isSelected: true,
			}
		);
	}, [comparisonChart.unitList]);

	const selectedDiscrete = comparisonChart.discreteList.find(
		(item) => item.isSelected,
	);
	const updateChart = useCallback(() => {
		setComparisonChartData({
			type: ChartActionsType.SetFlag,
			flagName: 'isLoading',
			value: true,
		});
		setComparisonChartData({
			type: ChartActionsType.ResetChartData,
		});
		const requests = periodsForChartComparison.map((item) => {
			const discrete = (selectedDiscrete?.value as string) || 'HH';
			const [startDateTimeForRequest, endDateTimeForRequest] =
				getDatesForAggregateValues({
					startDateTime: item.startDateTime,
					endDateTime: item.endDateTime,
					methodName,
				});

			if (asqlGroup && item.startDateTime && item.endDateTime)
				return rpcQuery<ChartValue[]>(
					getChartDataQuery({
						gr: asqlGroup,
						startDateTime: startDateTimeForRequest,
						endDateTime: endDateTimeForRequest,
						isMoscowTimeZone: comparisonChart.isMoscowTimeZone,
						discrete,
						round,
						gtype: typeGraph,
						moduleName: ModuleName.UseChartComparison_getChartDataQuery,
					}),
					chartDataAdapter,
					checkResponseOutputWarnings,
				).then((chartData) => {
					const uniqueId = uuidv4();
					setComparisonChartData({
						type: ChartActionsType.UpdateChartData,
						payload: {
							color: item.color,
							data: [...chartData],
							startDateTime: item.startDateTime,
							endDateTime: item.endDateTime,
							isVisibleOnChart: true,
							id: uniqueId,
						},
					});
				});
		});
		Promise.allSettled([...requests]).then(() => {
			setComparisonChartData({
				type: ChartActionsType.SetFlag,
				flagName: 'isLoading',
				value: false,
			});
		});
	}, [
		selectedDiscrete,
		periodsForChartComparison,
		comparisonChart.isMoscowTimeZone,
		asqlGroup,
		round,
		typeGraph,
		methodName,
	]);

	useEffect(() => {
		const tabs = formTabs.get(selectedVersion);
		if (tabs) {
			const periodsFromTabs = tabs
				.filter(
					(item) =>
						item.formId === id &&
						item.formSettings.startDateTime &&
						item.formSettings.endDateTime,
				)
				.map((item) => ({
					startDateTime: item.formSettings.startDateTime || new Date(),
					endDateTime: item.formSettings.endDateTime || new Date(),
				}));
			const uniqueId = uuidv4();
			setPeriods(
				periodsFromTabs.map((item, index) => ({
					...item,
					color:
						index <= 10
							? YAXIS_LINE_COLORS[index]
							: generateRandomColor(['#EB5835', ...YAXIS_LINE_COLORS]),
					type: CalendarType.PeriodWithTime,
					id: uniqueId,
				})),
			);
		}
		return () => {
			setPeriods([]);
		};
	}, []);

	useEffect(() => {
		updateChart();
	}, [updateChart]);

	const handleExportToExcel = useCallback(() => {
		const { preparedData, columnsForExcel } = tableDataExcelAdapter(
			comparisonChart.chartsData,
			1,
		);
		exportInfoTableToExcel(columnsForExcel, preparedData, title);
		setPosition(null);
	}, [title, comparisonChart.chartsData]);

	const series = comparisonChartDataAdapter(
		comparisonChart.chartsData,
		selectedUnit,
		round,
		comparisonChart.isSumColumnVisible,
		methodName,
	);

	const dynamicHeaders = modifyHeaders(comparisonChart.chartsData);
	const tableData = tableDataAdapter(
		comparisonChart.chartsData,
		selectedUnit,
		round,
	);

	const dynamicHeadersWithSum = useMemo(() => {
		return dynamicHeaders.map((item) => {
			if (item.accessor === 'sum')
				return {
					...item,
					isVisible: comparisonChart.isSumColumnVisible,
				};
			return {
				...item,
			};
		});
	}, [dynamicHeaders, comparisonChart.isSumColumnVisible]);

	const onPeriodsListBtnClick = () => {
		openModal(RegisteredModals.PeriodsList);
	};
	const handlePrintClick = () => {
		window.print();
	};
	const handleSaveClick = useCallback(() => {
		d3ToPng('.chart-comparison .highcharts-root', `Сравнение серий ${title}`, {
			scale: 1,
			format: 'jpg',
			quality: 1,
			download: true,
		});
		setPosition(null);
	}, [title]);

	const handleRelativeZeroModeChange = () => {
		setComparisonChartData({
			type: ChartActionsType.SetFlag,
			flagName: 'isRelativeZeroEnabled',
			value: !comparisonChart.isRelativeZeroEnabled,
		});
	};
	const handleCopyTableData = () => {
		const { preparedData, columnsForExcel } = tableDataExcelAdapter(
			comparisonChart.chartsData,
			selectedUnit?.coefficient || 1,
		);
		const textContent = createTextContentForClipboard(
			columnsForExcel,
			preparedData,
			title,
		);
		navigator.clipboard
			.writeText(textContent)
			.then(() => {
				toast.success('Данные скопированы в буфер обмена!');
			})
			.catch((error) => {
				toast.error('Ошибка копирования данных:', error);
			});
	};

	const handleTimeZoneChange = () => {
		setComparisonChartData({
			type: ChartActionsType.SetFlag,
			flagName: 'isMoscowTimeZone',
			value: !comparisonChart.isMoscowTimeZone,
		});
	};
	const [position, setPosition] = useState<ContextMenuPosition | null>(null);
	const contextMenuItems: ContextMenuItem[] = useMemo(
		() => [
			{
				name: 'Распечатать форму',
				onClick: handlePrintClick,
				renderFn: () => (
					<span className={styles.menu_item}>
						<PrinterIcon className={styles.menu_icon} />
						<span className={styles.menu_name}>Распечатать форму</span>
					</span>
				),
			},
			{
				name: 'Скопировать таблицу',
				onClick: handleCopyTableData,
				renderFn: () => (
					<span className={styles.menu_item}>
						<CopyIcon className={styles.menu_icon} />
						<span className={styles.menu_name}>Скопировать таблицу</span>
					</span>
				),
			},
			{
				name: 'Сохранить в Excel',
				onClick: handleExportToExcel,
				withSeparator: true,
				separatorName: 'Отображение данных',
				renderFn: () => (
					<span className={styles.menu_item}>
						<SaveIcon className={styles.menu_icon} />
						<span className={styles.menu_name}>Выгрузить в Excel</span>
					</span>
				),
			},
			{
				name: 'Сохранить',
				onClick: handleSaveClick,
				withSeparator: true,
				separatorName: 'Отображение данных',
				renderFn: () => (
					<span className={styles.menu_item}>
						<SaveIcon className={styles.menu_icon} />
						<span className={styles.menu_name}>
							Сохранить форму как картинку
						</span>
					</span>
				),
			},
			{
				onClick: handleRelativeZeroModeChange,
				name: 'Относительно нуля',
				renderFn: () => (
					<span className={styles.menu_item}>
						<Checkbox
							name={'relative-to-zero'}
							title="Относительно нуля"
							checked={comparisonChart.isRelativeZeroEnabled}
							onChange={handleRelativeZeroModeChange}
							className={styles.menu_checkbox}
						/>
					</span>
				),
			},
			{
				onClick: handleTimeZoneChange,
				name: 'Московское время',
				renderFn: () => (
					<span className={styles.menu_item}>
						<Checkbox
							name={'moscow-timezone'}
							title="Московское время"
							checked={comparisonChart.isMoscowTimeZone}
							onChange={handleTimeZoneChange}
							className={styles.menu_checkbox}
						/>
					</span>
				),
			},
		],
		[
			handleSaveClick,
			handlePrintClick,
			comparisonChart.isRelativeZeroEnabled,
			comparisonChart.isTimeWithoutDataEnabled,
			selectedDiscrete,
			comparisonChart.isMoscowTimeZone,
		],
	);

	const yAxisRangeConfig = getYAxisRangeConfig(
		chartData,
		comparisonChart.isRelativeZeroEnabled,
	);

	const [activeIndex, setActiveIndex] = useState<number>(-1);

	const chartOptions: Options = useMemo(
		() => ({
			xAxis:
				series.length > 1
					? {
							visible: false,
							labels: {
								rotation: 0,
								useHTML: true,
							},
							crosshair: {
								label: {
									enabled: false,
								},
							},
					  }
					: {},
			yAxis: {
				...yAxisRangeConfig,
			},
			tooltip: {
				formatter: tooltipFormatter,
			},
			plotOptions: {
				line: {
					events: {
						legendItemClick: handleItemClick,
					},
					showInLegend: true,
				},
				series: {
					point: {
						events: {
							click: function () {
								const point = this;
								setActiveIndex(point.index);
							},
						},
					},
				},
			},
			chart: {
				events: {
					click: function () {
						setActiveIndex(this.hoverPoint?.index || 0);
					},
				},
			},
		}),
		[series.length, yAxisRangeConfig],
	);
	const handleSelectedDiscrete = (discreteList: SelectOption[]) => {
		setComparisonChartData({
			type: ChartActionsType.UpdateDiscreteList,
			payload: discreteList,
		});
	};

	const handleSelectedUnit = (unitList: OptionWithCoefficient[]) => {
		setComparisonChartData({
			type: ChartActionsType.UpdateUnitList,
			payload: unitList,
		});
	};

	const handleContextMenu = (evt: React.MouseEvent<HTMLButtonElement>) => {
		evt.stopPropagation();
		if (!position) setPosition({ x: 0, y: 30 });
	};
	return {
		position,
		contextMenuItems,
		dynamicHeaders: dynamicHeadersWithSum,
		series,
		tableData,
		chartOptions,
		comparisonChart,
		title,
		activeIndex,
		methodName,
		isConsumption,
		round,
		setActiveIndex,
		setPosition,
		handleSelectedDiscrete,
		handleSelectedUnit,
		handleContextMenu,
		onPeriodsListBtnClick,
		handleCopyTableData,
	};
}
