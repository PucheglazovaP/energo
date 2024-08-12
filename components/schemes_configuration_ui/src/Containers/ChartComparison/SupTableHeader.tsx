import { format } from 'date-fns';

import { DateFormat, getDatesForAggregateValues } from '../../Utils/dateUtils';

import { ComparisonChartData } from './types';

import styles from './ChartComparison.module.css';

function SupTableHeader({
	data,
	isSumColumnVisible,
	methodName,
}: {
	data: ComparisonChartData[];
	isSumColumnVisible: boolean;
	methodName: string;
}) {
	return (
		<div className={styles.supHeader}>
			{data.length === 2 && <div className={styles.supHeader_delta}></div>}
			{data.map((item, index) => {
				const [startDateTime, endDateTime] = getDatesForAggregateValues({
					startDateTime: item.startDateTime,
					endDateTime: item.endDateTime,
					methodName,
				});
				return item.isVisibleOnChart ? (
					<div
						key={`${item.startDateTime}-${index}`}
						className={styles.supHeader__item}
					>
						<div className={styles.supHeader__item_wrapper}>
							<div
								style={{
									backgroundColor: `${item.color || '#000000'}`,
								}}
								className={styles.supHeader__item_color}
							/>
							<div className={styles.supHeader__item_value}>{`${format(
								startDateTime,
								DateFormat.DefaultDisplayFormatWithSeconds,
							)} - ${format(
								endDateTime,
								DateFormat.DefaultDisplayFormatWithSeconds,
							)}`}</div>
						</div>
					</div>
				) : null;
			})}
			{isSumColumnVisible && <div className={styles.supHeader_sum}></div>}
		</div>
	);
}

export default SupTableHeader;
