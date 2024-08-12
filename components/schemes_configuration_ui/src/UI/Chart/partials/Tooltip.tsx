import ReactDOMServer from 'react-dom/server';
import { format } from 'date-fns';
import { TooltipFormatterCallbackFunction } from 'highcharts';

import styles from '../Chart.module.css';

export const tooltipFormatter: TooltipFormatterCallbackFunction = function (
	this,
) {
	return ReactDOMServer.renderToString(
		<div className={styles.tooltip}>
			<div className={styles.tooltip_title}>
				<span>Дата </span>
				{this.x && format(new Date(this.x), 'dd.MM.yyyy, HH:mm:ss')}
			</div>
			{this.points &&
				this.points.map((point) => {
					return (
						<div key={this.x} className={styles.tooltip__item}>
							<div
								style={{
									backgroundColor: `${point.color || '#000000'}`,
								}}
								className={styles.tooltip__item_color}
							/>
							<div className={styles.tooltip__item_name}>
								{point.series.name}
							</div>
							<div className={styles.tooltip__item_value}>{point.y}</div>
						</div>
					);
				})}
		</div>,
	);
};
