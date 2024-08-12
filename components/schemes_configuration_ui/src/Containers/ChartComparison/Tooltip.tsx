import ReactDOMServer from 'react-dom/server';
import { format } from 'date-fns';
import { TooltipFormatterCallbackFunction } from 'highcharts';

import { DateFormat } from '../../Utils/dateUtils';

import styles from './ChartComparison.module.css';

export const tooltipFormatter: TooltipFormatterCallbackFunction = function (
	this,
) {
	return ReactDOMServer.renderToString(
		<div className={styles.tooltip}>
			{this.points &&
				this.points.map((item) => {
					return (
						<div key={this.x} className={styles.tooltip__item}>
							<div
								style={{
									backgroundColor: `${item.color || '#000000'}`,
								}}
								className={styles.tooltip__item_color}
							/>
							<div className={styles.tooltip__item_name}>
								{format(
									new Date(Number(item.point.x2 || item.x)),
									DateFormat.DefaultDisplayFormatWithSeconds,
								)}
							</div>
							<div className={styles.tooltip__item_value}>{item.y}</div>
						</div>
					);
				})}
		</div>,
	);
};
