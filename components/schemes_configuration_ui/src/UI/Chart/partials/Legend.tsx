import ReactDOMServer from 'react-dom/server';
import {
	FormatterCallbackFunction,
	Point,
	Series,
	SeriesOptionsType,
} from 'highcharts';

import Checkbox from './Checkbox';

export const seriesCheckboxFormatter: FormatterCallbackFunction<
	Point | Series
> = function (this) {
	const series: SeriesOptionsType = (this as Series).userOptions;
	const seriesColor = series?.color || this.color;
	const isVisible = series?.visible != null ? series.visible : true;
	return ReactDOMServer.renderToString(
		<div style={{ display: 'flex', alignItems: 'center' }}>
			<Checkbox
				visible={isVisible}
				onChange={() => {}}
				color={seriesColor as string}
			/>
			<div style={{ marginLeft: '10px' }}>{series?.name || ''}</div>
		</div>,
	);
};
