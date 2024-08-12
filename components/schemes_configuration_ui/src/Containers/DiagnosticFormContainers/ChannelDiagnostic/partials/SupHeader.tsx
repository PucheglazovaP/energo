import styles from '../ChannelDiagnostic.module.css';
function SupHeader() {
	return (
		<tr className={styles.supheader}>
			<th colSpan={2} className={styles.supheader__grouped}>
				Канал
			</th>
			<th></th>
			<th colSpan={2} className={styles.supheader__grouped}>
				Прибор
			</th>
			<th></th>
			<th></th>
		</tr>
	);
}

export default SupHeader;
