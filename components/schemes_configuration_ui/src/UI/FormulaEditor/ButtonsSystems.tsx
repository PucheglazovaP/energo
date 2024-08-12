import clsx from 'clsx';

import { ButtonsSystemsProps } from './types';

import styles from './FormulaEditor.module.css';

function ButtonsSystems({ className, style, onClick }: ButtonsSystemsProps) {
	return (
		<div className={clsx(styles.buttons_group, className)} style={style}>
			<button
				type="button"
				className={clsx(styles.numpad_button, styles.systems_button)}
				onClick={() => {
					if (onClick) {
						onClick('casewhen(0)then(0)end');
					}
				}}
				title="Система уравнений"
			>
				<span className={styles.systems_sign}>⎨</span>
				<span className={styles.numpad_empty_space}></span>
				<span>,</span>
				<span className={styles.numpad_empty_space}></span>
				<span className={styles.numpad_empty_space}></span>
				<span>,</span>
				<span className={styles.numpad_empty_space}></span>
			</button>
			<button
				type="button"
				className={clsx(styles.numpad_button, styles.fraction_button)}
				onClick={() => {
					if (onClick) {
						onClick('(0)/(0)');
					}
				}}
				title="Дробь"
			>
				<span className={styles.numpad_empty_space}></span>
				<div className={styles.fraction_separator} />
				<span className={styles.numpad_empty_space}></span>
			</button>
		</div>
	);
}

export default ButtonsSystems;
