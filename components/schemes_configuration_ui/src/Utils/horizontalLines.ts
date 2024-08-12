import { YAxisPlotLinesOptions } from 'highcharts';

import { FormParameters } from '../Models/EditMode/types';
import {
	HorizontalLine,
	HorizontalLineColorProp,
	HorizontalLineProperties,
	HorizontalLineValueProp,
	HorizontalLineVisibleProp,
	HorizontalLineWidthProp,
} from '../Shared/types';

function findHorizontalLineByProp(
	params: FormParameters[],
	prop: string,
): FormParameters | undefined {
	return params.find((param) => param.parameterName === prop);
}

function createHorizontalLine(
	params: FormParameters[],
	idx: number,
): HorizontalLine {
	const colorKey =
		idx === 0
			? HorizontalLineColorProp.hlineColor
			: `${HorizontalLineColorProp.hlineColor}${idx}`;
	const widthKey =
		idx === 0
			? HorizontalLineWidthProp.hlineWidth
			: `${HorizontalLineWidthProp.hlineWidth}${idx}`;
	const valueKey =
		idx === 0
			? HorizontalLineValueProp.hlineValue
			: `${HorizontalLineValueProp.hlineValue}${idx}`;
	const visibleKey =
		idx === 0
			? HorizontalLineVisibleProp.hlineVisible
			: `${HorizontalLineVisibleProp.hlineVisible}${idx}`;
	return {
		id: idx,
		color: findHorizontalLineByProp(params, colorKey)?.value || '',
		width: findHorizontalLineByProp(params, widthKey)?.value,
		value: findHorizontalLineByProp(params, valueKey)?.value as number,
		visible: Boolean(findHorizontalLineByProp(params, visibleKey)?.value),
		name: '',
	};
}

export function getActiveHorizontalLines(
	formParams: FormParameters[],
): HorizontalLine[] {
	const hlineKeys = Object.keys(HorizontalLineProperties);
	const hlineVisibleKeys = Object.keys(HorizontalLineVisibleProp);
	const horizontalLinesAll: FormParameters[] = formParams.filter((param) =>
		hlineKeys.includes(param.parameterName),
	);
	const horizontalLinesVisible: HorizontalLine[] = hlineVisibleKeys.reduce<
		HorizontalLine[]
	>((acc, key, idx) => {
		if (
			horizontalLinesAll.find(
				(param) => param.parameterName === key && Boolean(Number(param.value)),
			)
		) {
			const newLine: HorizontalLine = createHorizontalLine(
				horizontalLinesAll,
				idx,
			);
			acc.push(newLine);
		}
		return acc;
	}, [] as HorizontalLine[]);
	return horizontalLinesVisible;
}

export function getHorizontalLine(
	hlines: FormParameters[],
	property: HorizontalLineProperties,
) {
	return hlines.find((hline) => hline.parameterName === property);
}

export function createPlotLines(
	hlines: HorizontalLine[],
): YAxisPlotLinesOptions[] {
	const plotLines: YAxisPlotLinesOptions[] = hlines.map((hl) => {
		const lineColor =
			hl.color.toString() === '0' ? '#000000' : hl.color.toString();
		return {
			value: hl.value,
			color: lineColor,
			dashStyle: 'Solid',
			width: Number(hl.width) ? Number(hl.width) : 1,
			zIndex: 10,
			label: {
				text: hl.name,
				align: 'left',
				style: {
					color: lineColor,
				},
			},
		};
	});
	return plotLines;
}

export default {};
