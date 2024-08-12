import clsx from 'clsx';

import { ButtonsFunctionsProps } from './types';

import styles from './FormulaEditor.module.css';

function ButtonsFunctions({
	className,
	style,
	onClick,
}: ButtonsFunctionsProps) {
	return (
		<div className={clsx(styles.numpad, className)} style={style}>
			<button
				type="button"
				className={styles.numpad_button}
				onClick={() => {
					if (onClick) {
						onClick('sin(0)');
					}
				}}
				title="Синус"
			>
				sin(<span className={styles.numpad_empty_space}>◻</span>)
			</button>
			<button
				type="button"
				className={styles.numpad_button}
				onClick={() => {
					if (onClick) {
						onClick('asin(0)');
					}
				}}
				title="Арк Синус"
			>
				arcsin(<span className={styles.numpad_empty_space}>◻</span>)
			</button>
			<button
				type="button"
				className={styles.numpad_button}
				onClick={() => {
					if (onClick) {
						onClick('square(0)');
					}
				}}
				title="Квадрат числа"
			>
				x²
			</button>
			<button
				type="button"
				className={styles.numpad_button}
				onClick={() => {
					if (onClick) {
						onClick('cos(0)');
					}
				}}
				title="Косинус"
			>
				cos(<span className={styles.numpad_empty_space}>◻</span>)
			</button>
			<button
				type="button"
				className={styles.numpad_button}
				onClick={() => {
					if (onClick) {
						onClick('acos(0)');
					}
				}}
				title="Арк Косинус"
			>
				arccos(<span className={styles.numpad_empty_space}>◻</span>)
			</button>
			<button
				type="button"
				className={styles.numpad_button}
				onClick={() => {
					if (onClick) {
						onClick('power(0,0)');
					}
				}}
				title="Возведение в степень"
			>
				x<sup className={styles.sup}>y</sup>
			</button>
			<button
				type="button"
				className={styles.numpad_button}
				onClick={() => {
					if (onClick) {
						onClick('tg(0)');
					}
				}}
				title="Тангенс"
			>
				tg(<span className={styles.numpad_empty_space}>◻</span>)
			</button>
			<button
				type="button"
				className={styles.numpad_button}
				onClick={() => {
					if (onClick) {
						onClick('atg(0)');
					}
				}}
				title="Арк Тангенс"
			>
				arctg(<span className={styles.numpad_empty_space}>◻</span>)
			</button>
			<button
				type="button"
				className={styles.numpad_button}
				onClick={() => {
					if (onClick) {
						onClick('sqrt(0)');
					}
				}}
				title="Квадратный корень"
			>
				√<span className={styles.numpad_empty_space}>◻</span>
			</button>
			<button
				type="button"
				className={styles.numpad_button}
				onClick={() => {
					if (onClick) {
						onClick('(0)');
					}
				}}
				title="Скобки"
			>
				(<span className={styles.numpad_empty_space}>◻</span>)
			</button>
			<button
				type="button"
				className={styles.numpad_button}
				onClick={() => {
					if (onClick) {
						onClick('<fun_1>(0)');
					}
				}}
				title="Мощность"
			>
				P(<span className={styles.numpad_empty_space}>◻</span>)
			</button>
			<button
				type="button"
				className={styles.numpad_button}
				onClick={() => {
					if (onClick) {
						onClick('sign(0)');
					}
				}}
			>
				sign(<span className={styles.numpad_empty_space}>◻</span>)
			</button>
		</div>
	);
}

export default ButtonsFunctions;
