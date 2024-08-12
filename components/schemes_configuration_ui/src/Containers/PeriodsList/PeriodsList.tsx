import { useEffect, useState } from 'react';
import { Button } from '@evraz/ui-kit';
import { useStore } from 'effector-react';
import { v4 as uuidv4 } from 'uuid';

import AddIcon from '../../Icons/Plus';
import { closeModal } from '../../Models/Modal/events';
import { $periodsForChartComparison } from '../../Models/PeriodsForChartComparison';
import { setPeriods } from '../../Models/PeriodsForChartComparison/events';
import { PeriodList } from '../../Models/PeriodsForChartComparison/types';
import { YAXIS_LINE_COLORS } from '../../Shared/const';
import { RegisteredModals } from '../../Shared/modalsConfig';
import { CalendarType } from '../../Shared/types';
import { generateRandomColor } from '../../Utils/generateRandomColor';

import PeriodItem from './PeriodItem';
import { getDatePeriodByCalendarType } from './utils';

import styles from './PeriodsList.module.css';

function PeriodsList() {
	const periodsForChartComparison = useStore($periodsForChartComparison);

	const [periods, setPeriod] = useState<PeriodList[]>([]);

	useEffect(() => {
		setPeriod([...periodsForChartComparison]);
	}, []);
	const handleAddTrend = () => {
		const uniqueId = uuidv4();
		const color =
			periods.length <= 10
				? YAXIS_LINE_COLORS[periods.length]
				: generateRandomColor([
						'#EB5835',
						...YAXIS_LINE_COLORS,
						...periods.map((item) => item.color),
				  ]);
		setPeriod((periods) => [
			...periods,
			{
				startDateTime: new Date(),
				endDateTime: new Date(),
				id: uniqueId,
				color,
				type: CalendarType.PeriodWithTime,
			},
		]);
	};
	const handleDeleteTrend = (id: string) => {
		setPeriod((periods) => periods.filter((item) => item.id !== id));
	};
	const handlePeriodSelect = (period: Date[], id: string) => {
		setPeriod((periods) =>
			periods.map((item) => {
				if (item.id === id)
					return { ...item, startDateTime: period[0], endDateTime: period[1] };
				return item;
			}),
		);
	};
	const handleTypeChange = (type: CalendarType, id: string) => {
		setPeriod((periods) =>
			periods.map((item) => {
				if (item.id === id) {
					const { startDateTime, endDateTime } = getDatePeriodByCalendarType(
						type,
						{
							startDateTime: item.startDateTime,
							endDateTime: item.endDateTime,
						},
					);
					return { ...item, type, startDateTime, endDateTime };
				}

				return item;
			}),
		);
	};
	const onResetBtnClick = () => {
		closeModal(RegisteredModals.PeriodsList);
	};

	const onApplyBtnClick = () => {
		setPeriods([...periods]);
		closeModal(RegisteredModals.PeriodsList);
	};
	return (
		<div className={styles.container}>
			<div className={styles.body}>
				{periods.map((item, index) => (
					<PeriodItem
						key={`${item.startDateTime}-${index}`}
						item={item}
						onDelete={handleDeleteTrend}
						onSelect={handlePeriodSelect}
						onTypeChange={handleTypeChange}
					/>
				))}
			</div>
			<Button onClick={handleAddTrend} className={styles.add_button}>
				<AddIcon className={styles.add_icon} />
				Добавить серию
			</Button>
			<div className={styles.footer}>
				<Button className={styles.reset_button} onClick={onResetBtnClick}>
					Отменить
				</Button>
				<Button className={styles.button} primary onClick={onApplyBtnClick}>
					Применить
				</Button>
			</div>
		</div>
	);
}

export default PeriodsList;
