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
						onClick('sin');
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
						onClick('asin');
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
						onClick('square');
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
						onClick('cos');
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
						onClick('acos');
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
						onClick('power');
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
						onClick('tg');
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
						onClick('atg');
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
						onClick('sqrt');
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
						onClick('(');
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
