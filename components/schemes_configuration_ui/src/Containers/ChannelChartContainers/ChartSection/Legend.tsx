import ReactDOMServer from 'react-dom/server';
import {
	FormatterCallbackFunction,
	Point,
	Series,
	SeriesOptionsType,
} from 'highcharts';

export const seriesCheckboxFormatter: FormatterCallbackFunction<
	Point | Series
> = function (this) {
	const series: SeriesOptionsType = (this as Series).userOptions;
	const seriesColor = series.color || this.color;
	return ReactDOMServer.renderToString(
		<div style={{ display: 'flex', alignItems: 'center' }}>
			<div
				style={{
					backgroundColor: seriesColor as string,
					width: '15px',
					height: '15px',
				}}
			/>
			<div style={{ marginLeft: '10px' }}>{series.name}</div>
		</div>,
	);
};
