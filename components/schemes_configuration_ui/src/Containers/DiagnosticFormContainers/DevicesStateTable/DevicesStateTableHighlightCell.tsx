import TextLine from '../../../UI/TextLine/TextLine';

import { DevicesStateTableHighlightCellProps } from './types';

import styles from './DevicesStateTable.module.css';

function DevicesStateTableHighlightCell({
	data,
}: DevicesStateTableHighlightCellProps) {
	const { backgroundColor = 'transparent', text } = data;
	const color = backgroundColor === 'transparent' ? 'black' : 'white';

	return (
		<div className={styles.devices_radio_button_cell}>
			<TextLine
				className={styles.contrast_text}
				textContent={text}
				style={{ backgroundColor, color }}
			/>
		</div>
	);
}

export default DevicesStateTableHighlightCell;
