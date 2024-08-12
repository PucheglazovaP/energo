import { Button, Calendar, Switcher } from '@evraz/ui-kit';
import clsx from 'clsx';

import CheckMark from '../../Icons/CheckMark';
import { CalendarType } from '../../Shared/types';
import Divider from '../../UI/Divider';
import TableAssignedEmergencyEvents from '../TableAssignedEmergencyEvents';

import { statusSwitcherItems } from './constants';
import useAssignedEmergencyEvents from './useAssignedEmergencyEvents';

import styles from './ModalAssignedEmergencyEvents.module.css';

function ModalAssignedEmergencyEvents() {
	const {
		dates,
		acknowledgementStatus,
		isAcknowledgeButtonDisabled,
		handleDatesChange,
		handleAcknowledgementStatusChange,
		handleAcknowledgementButtonClick,
	} = useAssignedEmergencyEvents();
	return (
		<div className={clsx(styles.root)}>
			<div className={styles.filters_row}>
				<Calendar
					type={CalendarType.Period}
					dates={dates}
					onSelect={handleDatesChange}
					className={styles.calendar}
					disableTypeSelector
				/>
				<div className={styles.left_side_content}>
					<Switcher
						items={statusSwitcherItems}
						selectedId={acknowledgementStatus}
						onSelect={handleAcknowledgementStatusChange}
						className={styles.switcher}
					/>
					<Divider />
					<Button
						className={styles.acknowledge_button}
						primary
						onClick={handleAcknowledgementButtonClick}
						disabled={isAcknowledgeButtonDisabled}
					>
						<CheckMark className={styles.check_icon} />
						<span>Квитировать события</span>
					</Button>
				</div>
			</div>

			<TableAssignedEmergencyEvents />
		</div>
	);
}

export default ModalAssignedEmergencyEvents;
