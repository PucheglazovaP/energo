import styles from './DevicesStateTable.module.css';

function DevicesStateTableFilterHeaderNumberTooltip() {
	return (
		<div className={styles.tooltip_body}>
			<p>
				{
					'“>” перед значением отобразит данные меньше указанного условия. Например: >5'
				}
			</p>
			<div className={styles.tooltip_body_separator} />
			<p>
				{
					'“<” перед значением отобразит данные больше указанного условия. Например: <5'
				}
			</p>
		</div>
	);
}

export default DevicesStateTableFilterHeaderNumberTooltip;
