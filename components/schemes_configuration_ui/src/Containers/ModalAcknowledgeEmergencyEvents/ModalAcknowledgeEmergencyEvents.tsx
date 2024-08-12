import { Button, Textarea } from '@evraz/ui-kit';
import clsx from 'clsx';

import Divider from '../../UI/Divider';
import Table from '../../UI/Table';

import { ModalAcknowledgeEmergencyEventsProps } from './types';
import useAcknowledgeEmergencyEvents from './useAcknowledgeEmergencyEvents';

import styles from './ModalAcknowledgeEmergencyEvents.module.css';

function ModalAcknowledgeEmergencyEvents({
	className,
	style,
}: ModalAcknowledgeEmergencyEventsProps) {
	const {
		header,
		data,
		userName,
		comment,
		handleCommentChange,
		handleConfirm,
		handleCancel,
	} = useAcknowledgeEmergencyEvents();

	return (
		<div className={clsx(styles.root, className)} style={style}>
			<div className={styles.info_row}>
				<div className={styles.left_col}>
					<div className={styles.field_wrapper}>
						<div className={styles.label}>ФИО квитирующего</div>
						<div className={styles.title}>{userName}</div>
					</div>
					<div className={styles.field_wrapper}>
						<div className={clsx(styles.label, styles.label__required)}>
							Комментарий
						</div>
						<Textarea
							value={comment}
							className={styles.textarea}
							onChange={handleCommentChange}
							placeholder="Введите комментарий..."
						/>
					</div>
				</div>
				<Divider className={styles.divider} />
				<div className={styles.right_col}>
					<div className={styles.title}>Список квитирования</div>
					<Table headers={header} data={data} className={styles.table} />
				</div>
			</div>
			<div className={styles.buttons_row}>
				<Button className={styles.button} onClick={handleCancel}>
					Отменить
				</Button>
				<Button
					className={styles.button}
					primary
					onClick={handleConfirm}
					disabled={!comment}
				>
					Подтвердить
				</Button>
			</div>
		</div>
	);
}

export default ModalAcknowledgeEmergencyEvents;
