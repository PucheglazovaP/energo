import { combine } from 'effector';
import { YAxisPlotLinesOptions } from 'highcharts';

import { HorizontalLine } from '../../Shared/types';
import {
	createPlotLines,
	getActiveHorizontalLines,
} from '../../Utils/horizontalLines';
import { $activeChart } from '../ActiveChart';
import { ActiveChart } from '../ActiveChart/types';
import { $editMode, $selectedObjectsState } from '../EditMode';
import { $editModeSettings } from '../EditModeSettings';
import { $formSettings } from '../FormSettings';
import { $multichartSettings } from '../MultichartSettings';

/**
 * Construct horizontal lines from active chart model
 */
export function convertActiveChartToHorizontalLines(
	model: ActiveChart,
): HorizontalLine[] {
	const horizontalLines: HorizontalLine[] = [
		{
			id: 0,
			color: model.hlineColor,
			name: '',
			value: model.hlineValue,
			visible: model.hlineVisible,
			width: model.hlineWidth,
		},
		{
			id: 1,
			color: model.hlineColor1,
			name: '',
			value: model.hlineValue1,
			visible: model.hlineVisible1,
			width: model.hlineWidth1,
		},
		{
			id: 2,
			color: model.hlineColor2,
			name: '',
			value: model.hlineValue2,
			visible: model.hlineVisible2,
			width: model.hlineWidth2,
		},
	];
	return horizontalLines;
}

/**
 * Filter horizontal lines by visible
 */
function filterActiveHorizontalLines(
	hlines: HorizontalLine[],
): HorizontalLine[] {
	return hlines.filter((hline) => hline.visible);
}

function isGroupChosen(...conditions: boolean[]): boolean {
	return conditions.some((condition) => condition === true);
}

/**
 * Store that consist of different type of shapes
 * used on the chart
 */
export const $chartProperties = combine(
	$editMode,
	$editModeSettings,
	$activeChart,
	$formSettings,
	$multichartSettings,
	$selectedObjectsState,
	(
		editMode,
		editModeSettings,
		activeChart,
		formSettings,
		multichartSettings,
		selectedObjectsState,
	) => {
		const { activeId: multichartActiveId } = multichartSettings;
		const { formParameters, objectParameters, chartPoints } = editMode;
		const { isFormSelected } = selectedObjectsState;
		const { formType, activeId } = editModeSettings;
		const { chartData } = activeChart;
		const { isEditMode } = formSettings;
		const activeHorizontalLines: HorizontalLine[] = [];
		const activePlotLines: YAxisPlotLinesOptions[] = [];
		const multichartActiveTrend = chartData.find(
			(trend) => trend.id === multichartActiveId,
		);
		// if edit mode enabled - construct lines using edit mode store
		if (isEditMode) {
			activeHorizontalLines.push(...getActiveHorizontalLines(formParameters));
			activePlotLines.push(...createPlotLines(activeHorizontalLines));
		} else {
			// else - use activeChart store
			const horizontalLines = convertActiveChartToHorizontalLines(activeChart);
			activeHorizontalLines.push(
				...filterActiveHorizontalLines(horizontalLines),
			);
			activePlotLines.push(...createPlotLines(activeHorizontalLines));
		}
		return {
			activeHorizontalLines,
			activePlotLines,
			isGroupChosen: isGroupChosen(),
			chartData,
			formParameters,
			formType,
			multichartActiveId,
			multichartActiveTrend,
			formId: activeId,
			objectParameters,
			isFormSelected,
			chartPoints,
		};
	},
);
