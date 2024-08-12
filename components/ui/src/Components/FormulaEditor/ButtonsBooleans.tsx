import clsx from 'clsx';

import { ButtonsBooleansProps } from './types';

import styles from './FormulaEditor.module.css';

function ButtonsBooleans({ className, style, onClick }: ButtonsBooleansProps) {
	return (
		<div className={clsx(styles.numpad, className)} style={style}>
			<button
				type="button"
				className={styles.numpad_button}
				onClick={() => onClick && onClick('+')}
				title="Плюс"
			>
				+
			</button>
			<button
				type="button"
				className={styles.numpad_button}
				onClick={() => onClick && onClick('=')}
				title="Равно"
			>
				=
			</button>
			<button
				type="button"
				className={styles.numpad_button}
				onClick={() => onClick && onClick('<>')}
				title="Не равно"
			>
				≠
			</button>
			<button
				type="button"
				className={styles.numpad_button}
				onClick={() => onClick && onClick('-')}
				title="Минус"
			>
				−
			</button>
			<button
				type="button"
				className={styles.numpad_button}
				onClick={() => onClick && onClick('<')}
				title="Меньше"
			>
				&lt;
			</button>
			<button
				type="button"
				className={styles.numpad_button}
				onClick={() => onClick && onClick('<=')}
				title="Меньше или равно"
			>
				≤
			</button>
			<button
				type="button"
				className={styles.numpad_button}
				onClick={() => onClick && onClick('*')}
				title="Умножить"
			>
				×
			</button>
			<button
				type="button"
				className={styles.numpad_button}
				onClick={() => onClick && onClick('>')}
				title="Больше"
			>
				&gt;
			</button>
			<button
				type="button"
				className={styles.numpad_button}
				onClick={() => onClick && onClick('>=')}
				title="Больше или равно"
			>
				≥
			</button>
			<button
				type="button"
				className={styles.numpad_button}
				onClick={() => onClick && onClick('/')}
				title="Разделить"
			>
				÷
			</button>
			<button
				type="button"
				className={styles.numpad_button}
				onClick={() => onClick && onClick('and')}
				title="Логическое И"
			>
				И
			</button>
			<button
				type="button"
				className={styles.numpad_button}
				onClick={() => onClick && onClick('or')}
				title="Логическое ИЛИ"
			>
				ИЛИ
			</button>
		</div>
	);
}

export default ButtonsBooleans;
