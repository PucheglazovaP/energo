import { Button, Calendar } from '@evraz/ui-kit';

import { Close } from '../../Icons';

import { PeriodItemProps } from './types';

import styles from './PeriodsList.module.css';

function PeriodItem({
	item,
	onDelete,
	onSelect,
	onTypeChange,
}: PeriodItemProps) {
	return (
		<div className={styles.item}>
			<div
				style={{
					backgroundColor: `${item.color || '#000000'}`,
				}}
				className={styles.color}
			/>
			<Calendar
				dates={[item.startDateTime, item.endDateTime]}
				type={item.type}
				onTypeChange={(type) => onTypeChange(type, item.id)}
				onSelect={(period) => onSelect(period, item.id)}
				className={styles.calendar}
				disableManualInput={false}
				isCloseOnSelect={false}
			/>
			<Button
				onClick={() => {
					onDelete(item.id);
				}}
				className={styles.close_btn}
			>
				<Close className={styles.close_icon} />
			</Button>
		</div>
	);
}

export default PeriodItem;
