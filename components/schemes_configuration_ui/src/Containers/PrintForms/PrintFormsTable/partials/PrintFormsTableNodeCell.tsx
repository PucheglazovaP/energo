import { MouseEvent } from 'react';

import { Crosshair } from '../../../../Icons';
import { PrintFormPosition } from '../../../../Shared/types';

import styles from '../PrintFormsTable.module.css';

export type PrintFormsTableNodeCellProps = {
	position: PrintFormPosition;
	handleClick: (
		evt: MouseEvent<HTMLButtonElement>,
		position: PrintFormPosition,
	) => void;
};

function PrintFormsTableNodeCell(props: PrintFormsTableNodeCellProps) {
	const { position, handleClick } = props;

	return (
		<div className={styles.node__container}>
			<button
				className={'button__empty'}
				onClick={(evt) => handleClick(evt, position)}
			>
				<Crosshair className={styles.node__icon} />
			</button>
			<span>{position.treeName}</span>
		</div>
	);
}

export default PrintFormsTableNodeCell;
