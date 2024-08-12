import { Button, Calendar } from '@evraz/ui-kit';
import clsx from 'clsx';

import NotificationIcon from '../../Icons/Notification';
import { CalendarType } from '../../Shared/types';
import Checkbox from '../../UI/Checkbox';
import NavigationForForms from '../NavigationForForms';

import ActivePowerFormProps from './types';
import useActivePowerFormInfo from './useActivePowerFormInfo';

import styles from './ActivePowerForm.module.css';

function ActivePowerForm({ className }: ActivePowerFormProps) {
	const {
		reportLink,
		handlePeriodSelect,
		usedCalendarTypes,
		date,
		createReportLink,
		isMoscowTimeZone,
		handleTimeZoneChange,
	} = useActivePowerFormInfo();

	return (
		<div className={clsx(styles.root, className)}>
			<div className={styles.btns}>
				<NavigationForForms className={styles.navigation} />
				<Calendar
					dates={[date]}
					type={CalendarType.Month}
					usedTypes={usedCalendarTypes}
					onClose={handlePeriodSelect}
					className={styles.calendar}
					disableManualInput={false}
					isCloseOnSelect={false}
				/>
				<Checkbox
					name={'report-time-zone'}
					title="Московское время"
					checked={isMoscowTimeZone}
					onChange={handleTimeZoneChange}
					className={styles.checkbox}
				/>
				<Button className={styles.btn} onClick={createReportLink}>
					Запросить
				</Button>
			</div>
			{reportLink ? (
				<iframe title="Отчет" src={reportLink} className={styles.report} />
			) : (
				<div className={styles.no_info}>
					<NotificationIcon className={styles.notification_icon} />
					<p>
						Отчет не сформирован. Для отображения отчета введите данные для
						запроса и нажмите кнопку “Запросить”
					</p>
				</div>
			)}
		</div>
	);
}

export default ActivePowerForm;
