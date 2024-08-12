import clsx from 'clsx';

import RadioButton from '../../UI/RadioButton';

import { ReportTableRadioButtonCellProps } from './types';

import styles from './ReportTable.module.css';

function ReportTableRadioButtonCell({
	title,
	selected,
	className,
	style,
}: ReportTableRadioButtonCellProps) {
	return (
		<div className={clsx(styles.root, className)} style={style}>
			<RadioButton checked={selected} readOnly />
			<p title={title} className={styles.devices_radio_button_text}>
				{title}
			</p>
		</div>
	);
}

export default ReportTableRadioButtonCell;
