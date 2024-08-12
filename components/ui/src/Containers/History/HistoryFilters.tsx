import { useCallback } from 'react';
import { Button, Calendar } from '@evraz/ui-kit';

import Select from '../../Components/Select';
import { useHistory } from '../../Hooks/useHistory';
import { CalendarType } from '../../Shared/types';

import styles from './History.module.scss';

function HistoryFilters() {
	const {
		filters,
		getGeneralHistory,
		setHistoryDates,
		setHistoryTypes,
		clearHistory,
	} = useHistory();

	const applyFilters = useCallback(() => {
		clearHistory();
		getGeneralHistory();
	}, [clearHistory, getGeneralHistory]);
	return (
		<div className={styles.filters}>
			<Calendar
				dates={filters.dates}
				onSelect={setHistoryDates}
				type={CalendarType.Period}
				max={new Date()}
				className={styles.calendar}
			/>
			<div className={styles.types}>
				<span className={styles.types__title}>Тип объекта</span>
				<span className={styles.types__select}>
					<Select
						options={filters.types}
						onSelect={setHistoryTypes}
						isMultiple
					/>
				</span>
			</div>
			<div className={styles.filters__apply}>
				<Button onClick={applyFilters}>Применить</Button>
			</div>
		</div>
	);
}

export default HistoryFilters;
