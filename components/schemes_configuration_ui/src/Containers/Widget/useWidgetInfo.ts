import { useCallback, useEffect, useMemo, useState } from 'react';
import { format } from 'date-fns';
import { useStore } from 'effector-react';

import chartDataAdapter, {
	createYaxes,
} from '../../Adapters/chart/chartDataAdapter';
import {
	modifyHeaders,
	tableDataAdapter,
} from '../../Adapters/chart/convertChartDataToTable';
import useInterval from '../../Facades/useIntreval';
import { $activeIds } from '../../Models/ActiveIds';
import { $user } from '../../Models/Auth';
import { fetchChartDataFx } from '../../Models/DynamicChart/effects';
import { getFormInfoById } from '../../Models/TreeForms/events';
import { $widget } from '../../Models/Widget';
import { resetWidget } from '../../Models/Widget/events';
import { Trend } from '../../Shared/types';
import { ModuleName } from '../../Shared/Types/moduleName';
import { getYAxisRangeConfig } from '../../Utils/trends';

export default function useWidgetInfo() {
	const {
		chartData,
		updateDelay,
		isUpdateEnabled,
		isMultiYaxesEnabled,
		discreteList,
		startDateTime,
		endDateTime,
		isMoscowTimeZone,
		unitList,
		title,
		isRelativeZeroEnabled,
		tableHeader,
		formId,
		isWidgetOpen,
	} = useStore($widget);
	const user = useStore($user);
	/* 
	const activePlotLines = useMemo(() => {
		const horizontalLines = convertActiveChartToHorizontalLines(activeChart);
		activeHorizontalLines.push(...filterActiveHorizontalLines(horizontalLines));
		activePlotLines.push(...createPlotLines(activeHorizontalLines));
	}, []); */

	const [isLoading, setLoadingStatus] = useState(false);
	const [isChartVisible, setChartVisible] = useState(true);
	const [isBodyVisible, setBodyVisible] = useState(true);
	const [trendData, setTrendData] = useState<Trend[]>([]);

	const { activeVersion } = useStore($activeIds);

	const updateChart = useCallback(() => {
		setLoadingStatus(true);
		Promise.allSettled(
			chartData.map((item) => {
				if (item.asqlGroup)
					fetchChartDataFx({
						gr: item.asqlGroup,
						startDateTime: startDateTime,
						endDateTime: endDateTime,
						isMoscowTimeZone: isMoscowTimeZone,
						discrete:
							discreteList.find((item) => item.isSelected)?.value.toString() ||
							'HH',
						round: item.round,
						gtype: item.typeGraph,
						moduleName: ModuleName.UseWidgetInfo_fetchChartDataFx,
					}).then(({ chartData: data }) => {
						const result = chartData.map((trend) => {
							if (trend.asqlGroup === item.asqlGroup)
								return {
									...item,
									data,
								};
							return trend;
						});
						setTrendData(result);
					});
			}),
		).then(() => {
			setLoadingStatus(false);
		});
	}, [startDateTime, endDateTime, isMoscowTimeZone, discreteList, chartData]);

	useEffect(() => {
		updateChart();
	}, [updateChart]);

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
	const tableData = tableDataAdapter(trendData, selectedUnit.coefficient);
	const series = chartDataAdapter(trendData, isMultiYaxesEnabled, selectedUnit);

	const yAxisRangeConfig = getYAxisRangeConfig(
		chartData,
		isRelativeZeroEnabled,
	);
	const yAxes = isMultiYaxesEnabled
		? createYaxes(trendData, isRelativeZeroEnabled)
		: [
				{
					allowDecimals: true,
					title: {
						text: null,
					},
					...yAxisRangeConfig,
				},
		  ];

	const chartOptions = {
		yAxis: {
			...yAxes,
			/* 			plotLines: activePlotLines, */
		},
	};

	const dynamicHeaders = modifyHeaders(tableHeader, trendData);

	const onChartBtnClick = () => {
		setChartVisible(true);
	};
	const onTableBtnClick = () => {
		setChartVisible(false);
	};
	const onMaxSizeBtnClick = () => {
		if (formId && user) {
			resetWidget();
			getFormInfoById({
				formId: formId,
				versionCode: activeVersion?.code || 90,
				userId: user.preferredUsername,
			});
		}
	};
	const onHideBtnClick = () => {
		setBodyVisible((prev) => !prev);
	};
	const onCloseBtnClick = () => {
		resetWidget();
	};
	const date = useMemo(
		() =>
			`${format(startDateTime, 'yyyy.MM.dd')} - ${format(
				endDateTime,
				'yyyy.MM.dd',
			)}`,
		[startDateTime, endDateTime],
	);
	const discrete = useMemo(() => {
		const selectedDiscrete =
			discreteList.find((item) => item.isSelected)?.value.toString() || 'HH';
		let result = '';
		switch (selectedDiscrete) {
			case 'HH': {
				result = 'Получасовые';
				break;
			}
			case 'C': {
				result = 'Минутные';
				break;
			}
			case 'H': {
				result = 'Часовые';
				break;
			}
			case 'D': {
				result = 'Суточные';
				break;
			}
			case 'M': {
				result = 'За месяц';
				break;
			}
		}
		return result;
	}, [discreteList]);
	useInterval(() => {
		if (isUpdateEnabled) updateChart();
	}, updateDelay * 1000);

	return {
		onTableBtnClick,
		onChartBtnClick,
		onMaxSizeBtnClick,
		onHideBtnClick,
		onCloseBtnClick,
		series,
		title,
		isLoading,
		chartOptions,
		isChartVisible,
		dynamicHeaders,
		tableData,
		date,
		discrete,
		isBodyVisible,
		isWidgetOpen,
	};
}
