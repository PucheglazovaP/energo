import { AggregateTypes } from '../../Shared/types';
import { getAggregateSum } from '../../Utils/getAggregateInfo';

import { ComparisonChartData } from './types';

import styles from './ChartComparison.module.css';

function getMethodNameSumLabel(methodName: string) {
	switch (methodName) {
		case AggregateTypes.Current: {
			return 'За период';
		}
		case AggregateTypes.Average: {
			return 'Среднее за период';
		}
		case AggregateTypes.Sum: {
			return 'Сумма за период';
		}
	}
}

function BottomTableHeader({
	data,
	methodName,
	isConsumption,
	round = 2,
}: {
	data: ComparisonChartData[];
	methodName: string;
	isConsumption: boolean;
	round: number;
}) {
	const label = getMethodNameSumLabel(methodName);
	return (
		<div className={styles.bottom_header}>
			{data.length === 2 && <div className={styles.supHeader_delta}></div>}
			{data.map((item, index) => {
				if (item.isVisibleOnChart) {
					const sum = getAggregateSum(methodName, item.data, isConsumption);
					return (
						<div
							key={`${item.startDateTime}-${index}`}
							className={styles.bottom_header__item}
						>
							<div className={styles.bottom_header__item_wrapper}>
								<div className={styles.bottom_header__item_label}>{label}</div>
								<div className={styles.bottom_header__item_value}>
									{sum.toFixed(round)}
								</div>
							</div>
						</div>
					);
				} else return null;
			})}
		</div>
	);
}

export default BottomTableHeader;
