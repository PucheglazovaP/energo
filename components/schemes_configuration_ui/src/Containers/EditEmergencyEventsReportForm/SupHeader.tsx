import styles from './EditEmergencyEventsReportForm.module.css';
function SupHeader() {
	return (
		<tr className={styles.supheader}>
			<th colSpan={2} className={styles.supheader_cell}>
				Контролируемая величина
			</th>
			<th className={styles.supheader_cell}>Сигнал</th>
			<th colSpan={2} className={styles.supheader_cell}>
				Уставка
			</th>
			<th style={{ backgroundColor: 'white' }}></th>
			<th style={{ backgroundColor: 'white' }}></th>
			<th colSpan={2} className={styles.supheader_cell}>
				Время действия
			</th>
			<th style={{ width: '30px', backgroundColor: 'white' }}></th>
		</tr>
	);
}

export default SupHeader;
