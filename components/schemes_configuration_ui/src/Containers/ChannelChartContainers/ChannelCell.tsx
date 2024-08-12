import styles from './ChartSection/ChartSection.module.css';

function ChannelCell({
	value,
	status,
	color,
}: {
	value: number | string;
	status: string;
	color: string;
}) {
	function getStatus(status: string) {
		switch (status) {
			case 'Норма': {
				return '';
			}
			case 'Ниже минимального': {
				return 'MIN';
			}
			case 'Больше Максимального': {
				return 'MAX';
			}
			case 'Ошибка конвертирования FLOAT': {
				return 'FLOAT';
			}
			case 'Ошибка приема с OPC': {
				return 'OPC';
			}
		}
	}
	return (
		<div className={styles.channel__cell}>
			<div className={styles.channel__cell_value}>{value}</div>
			{status !== 'Норма' && (
				<div
					className={styles.channel__cell_status}
					style={{ backgroundColor: color === '#616160' ? 'none' : color }}
				>
					{getStatus(status)}
				</div>
			)}
		</div>
	);
}

export default ChannelCell;
