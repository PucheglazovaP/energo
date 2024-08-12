import ReactDOMServer from 'react-dom/server';
import { format } from 'date-fns';
import { TooltipFormatterCallbackFunction } from 'highcharts';

import { statusColors } from '../../../Shared/types';
import { DateFormat } from '../../../Utils/dateUtils';

import styles from '../../../UI/Chart/Chart.module.css';

export const tooltipFormatter: TooltipFormatterCallbackFunction = function (
	this,
) {
	return ReactDOMServer.renderToString(
		<div className={styles.tooltip}>
			<div className={styles.tooltip_title}>
				<span>Дата </span>
				{this.x &&
					format(new Date(this.x), DateFormat.DefaultDisplayFormatWithSeconds)}
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
								{statusColors[point.color as keyof typeof statusColors]}
							</div>
							<div className={styles.tooltip__item_value}>{point.y}</div>
						</div>
					);
				})}
		</div>,
	);
};
