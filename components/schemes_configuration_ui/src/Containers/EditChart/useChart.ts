import { useEffect, useMemo } from 'react';
import { useStore } from 'effector-react';
import {
	Options,
	SeriesOptionsType,
	XrangePointOptionsObject,
} from 'highcharts';

import { $chartProperties } from '../../Models/ChartProperties';
import { fetchFormObjectsParametersQuerysFx } from '../../Models/EditMode/effects';
import { setFormSelectedStatus } from '../../Models/EditMode/events';
import { FormObjectParameters } from '../../Models/EditMode/types';
import { setMultichartActiveId } from '../../Models/MultichartSettings/events';
import { $navigation } from '../../Models/Navigation';
import { YAXIS_LINE_COLORS } from '../../Shared/const';
import { FormTypes, Trend } from '../../Shared/types';
import { getParameterValue } from '../../Utils/objectParameters';
import { GroupProperty } from '../TableHardwareGroup/type';

const getSeriesOpacity = (
	formId: number,
	trendId: number,
	activeId: number,
): number => {
	if (formId === activeId) {
		return 1;
	}
	if (trendId === activeId) {
		return 1;
	}
	return 0.3;
};

function useChart() {
	const {
		activeHorizontalLines,
		activePlotLines,
		formParameters,
		objectParameters,
		formType,
		formId,
		multichartActiveId,
		chartData: viewSeries,
		chartPoints,
	} = useStore($chartProperties);
	const { versionId } = useStore($navigation);

	const isChartEnabled: boolean = useMemo(() => {
		// If multichart - enable chart by default
		if (formType === FormTypes.MultiChart) {
			return true;
		}
		const parameter = formParameters.find(
			(param) => param.parameterName === GroupProperty.asqlGroupName,
		);
		return !!parameter?.value;
	}, [formParameters, formType]);

	const calculatePoints = (
		points: XrangePointOptionsObject[],
	): XrangePointOptionsObject[] => {
		const yValues: number[] = points.map((point) => point.y || 0);
		const maxY: number = Math.max(...yValues);
		const hlinesValues: number[] = activeHorizontalLines.map(
			(hline) => hline.value || 0,
		);
		const maxH: number = Math.max(...hlinesValues);
		let koefficient: number = 1;
		if (maxH !== Number.NEGATIVE_INFINITY) {
			koefficient = Number((maxH / maxY).toPrecision(1)) || 1;
		}
		const newPoints: XrangePointOptionsObject[] = points.map((point) => ({
			...point,
			y: point.y ? Number((point.y * koefficient).toPrecision(1)) : point.y,
		}));
		return newPoints;
	};

	const createMultichartTrend = (
		params: FormObjectParameters[],
		points: XrangePointOptionsObject[],
		trendId: number,
	): SeriesOptionsType => {
		const getParameterValueFn = getParameterValue(params);
		return {
			type: 'line',
			name: String(getParameterValueFn('name')),
			data: calculatePoints(points),
			color: String(getParameterValueFn('color')),
			step: 'left',
			opacity: getSeriesOpacity(Number(formId), trendId, multichartActiveId),
			lineWidth: Number(getParameterValueFn('width')),
			visible:
				Boolean(getParameterValueFn('visibility')) &&
				Number(getParameterValueFn('asqlGroupId')) !== 9999,
			events: {
				click: () => {
					onTrendClick(trendId);
				},
			},
		};
	};

	const createChartTrend = (
		points: XrangePointOptionsObject[],
		trend: Trend | undefined,
	): SeriesOptionsType => {
		return {
			type: 'line',
			name: trend?.name,
			data: calculatePoints(points),
			color: trend?.color || YAXIS_LINE_COLORS[0],
			step: 'left',
			lineWidth: trend?.width ? Number(trend.width) : 2,
			visible: !!trend?.asqlGroup || trend?.asqlGroup !== 9999,
		};
	};

	const onTrendClick = (trendId: number) => {
		setMultichartActiveId(trendId);
		setFormSelectedStatus(false);
	};

	const series: SeriesOptionsType[] = Array.from(
		chartPoints,
		([key, points]) => {
			const originTrend: Trend | undefined = viewSeries.find(
				(origin) => origin.id === key,
			);
			const trendParameters = objectParameters.get(key || 0);
			if (trendParameters) {
				return createMultichartTrend(trendParameters, points, key);
			}
			return createChartTrend(points, originTrend);
		},
	);

	const onChartClick = () => {
		setFormSelectedStatus(true);
		setMultichartActiveId(formId || 0);
	};

	const createChartEvents = (): Pick<Options, 'chart'> => {
		return {
			chart: {
				events: {
					click: onChartClick,
				},
			},
		};
	};

	const chartOptions: Options = {
		legend: {
			enabled: false,
		},
		yAxis: {
			plotLines: activePlotLines,
		},
		...(formType === FormTypes.MultiChart ? createChartEvents() : undefined),
	};

	// Fetch series information when form type is multichart
	useEffect(() => {
		if (formType === FormTypes.MultiChart && viewSeries.length) {
			Promise.allSettled(
				viewSeries.map((trend) =>
					fetchFormObjectsParametersQuerysFx({
						objectId: Number(trend?.id),
						versionCode: Number(versionId),
					}),
				),
			);
		}
	}, []);

	return {
		series: isChartEnabled ? series : [],
		chartOptions: isChartEnabled ? chartOptions : {},
	};
}

export default useChart;
