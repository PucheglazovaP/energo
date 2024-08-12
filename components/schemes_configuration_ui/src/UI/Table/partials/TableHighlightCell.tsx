import clsx from 'clsx';

import TextLine from '../../TextLine/TextLine';
import { TableHighlightCellProps } from '../types';

import styles from '../Table.module.css';

function TableHighlightCell(props: TableHighlightCellProps) {
	const { backgroundColor = 'transparent', text } = props;
	const color = backgroundColor === 'transparent' ? 'black' : 'white';

	return (
		<div className={clsx('table_cell__highlight', styles.cell__highlight)}>
			<TextLine
				className={styles.text}
				textContent={text}
				style={{ backgroundColor, color }}
			/>
		</div>
	);
}

export default TableHighlightCell;
