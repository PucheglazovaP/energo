import { SeriesOptionsType } from 'highcharts';
import Highcharts from 'highcharts';
export default interface ChartProps {
	className?: string;
	series: SeriesOptionsType[];
	width?: string;
	height?: string;
	chartOptions?: Highcharts.Options;
	isNavigatorEnabled?: boolean;
}

declare module 'highcharts' {
	interface TooltipOptions {
		/**
		 * Delay time in milliseconds before displaying a tooltip.
		 */
		delayForDisplay?: number;
	}
}
