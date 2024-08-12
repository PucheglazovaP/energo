import clsx from 'clsx';

import { ButtonsInputHistoryProps } from './types';

import styles from './FormulaEditor.module.css';

export default function ButtonsInputHistory({
	className,
	style,
	canRedo = false,
	canUndo = false,
	onUndo = () => {},
	onRedo = () => {},
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
				&lt;
			</button>
			<button
				type="button"
				className={styles.numpad_button}
				onClick={onRedo}
				disabled={!canRedo}
				title="Вернуть"
			>
				&gt;
			</button>
		</div>
	);
}
