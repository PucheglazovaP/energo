import { BasketFirst } from '@evraz/ui-kit';
import clsx from 'clsx';

import Redo from '../../Icons/Redo';
import Undo from '../../Icons/Undo';

import { ButtonsInputHistoryProps } from './types';

import styles from './FormulaEditor.module.css';

export default function ButtonsInputHistory({
	className,
	style,
	canRedo = false,
	canUndo = false,
	onUndo = () => {},
	onRedo = () => {},
	onClear = () => {},
}: ButtonsInputHistoryProps) {
	return (
		<div className={clsx(styles.input_history, className)} style={style}>
			<button
				type="button"
				className={styles.numpad_button}
				onClick={onUndo}
				disabled={!canUndo}
				title="Отменить"
			>
				<Undo />
			</button>
			<button
				type="button"
				className={styles.numpad_button}
				onClick={onRedo}
				disabled={!canRedo}
				title="Вернуть"
			>
				<Redo />
			</button>
			<button
				type="button"
				className={styles.numpad_button}
				onClick={onClear}
				title="Очистить"
			>
				<BasketFirst className={styles.basket_icon} />
			</button>
		</div>
	);
}
