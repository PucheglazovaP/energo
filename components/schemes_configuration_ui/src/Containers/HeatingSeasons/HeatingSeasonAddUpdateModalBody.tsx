import { Button, Calendar } from '@evraz/ui-kit';
import clsx from 'clsx';

import Checkbox from '../../UI/Checkbox';

import { HeatingSeasonModalBodyProps } from './types';
import { useHeatingSeasonAddUpdate } from './useHeatingSeasonAddUpdate';

import styles from './HeatingSeasons.module.css';

function HeatingSeasonAddUpdateModalBody({
	modalMode,
}: HeatingSeasonModalBodyProps) {
	const {
		startDates,
		setStartDates,
		endDates,
		setEndDates,
		isNotValidDate,
		onCloseModal,
		onEndDataCheck,
		onConfirm,
		isEndDataChecked,
	} = useHeatingSeasonAddUpdate(modalMode);

	return (
		<div className={styles.modal_body}>
			<div className={styles.calendars}>
				<div className={styles.calendar_container}>
					<div className={styles.calendar_body}>
						<div className={styles.calendar_label}>
							<span>Начало</span>
							<span>*</span>
						</div>
						<Calendar
							className={clsx(
								styles.calendar,
								isNotValidDate && isEndDataChecked && styles.calendar_error,
							)}
							dates={startDates}
							onSelect={setStartDates}
							disableTypeSelector
							disableManualInput={false}
							isCloseOnSelect={false}
						/>
					</div>
					{isNotValidDate && isEndDataChecked && (
						<span className={styles.error_message}>
							Начало отопительного сезона не может быть позже его окончания
						</span>
					)}
				</div>
				<div className={styles.calendar_container}>
					<div className={styles.calendar_body}>
						<span className={styles.calendar_label}>Окончание</span>
						<div className={styles.calendar_with_checkbox}>
							<Calendar
								className={styles.calendar}
								dates={endDates}
								onSelect={setEndDates}
								disableTypeSelector
								disabled={!isEndDataChecked}
								disableManualInput={false}
								isCloseOnSelect={false}
							/>
							<div title={'Отобразить дату окончания'}>
								<Checkbox
									name={'check'}
									checked={isEndDataChecked}
									onChange={onEndDataCheck}
									className={styles.checkbox}
								/>
							</div>
						</div>
					</div>
				</div>
			</div>
			<div className={styles.buttons}>
				<Button onClick={onCloseModal}>Отмена</Button>
				<Button
					onClick={onConfirm}
					disabled={isNotValidDate && isEndDataChecked}
				>
					Подтвердить
				</Button>
			</div>
		</div>
	);
}

export default HeatingSeasonAddUpdateModalBody;
