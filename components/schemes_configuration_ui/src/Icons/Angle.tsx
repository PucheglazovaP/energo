import clsx from 'clsx';

import { AngleProps, Direction } from './types';

import styles from './Icons.module.css';

function Angle(props: AngleProps) {
	const { className, direction } = props;

	const directionClassName = {
		[styles.direction__left]: direction === Direction.LEFT,
		[styles.direction__right]: direction === Direction.RIGHT,
		[styles.direction__up]: direction === Direction.UP,
		[styles.direction__down]: direction === Direction.DOWN,
	};

	return (
		<svg
			width="6"
			height="10"
			viewBox="0 0 6 10"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
			className={clsx(styles.root, directionClassName, className)}
		>
			<path
				fillRule="evenodd"
				clipRule="evenodd"
				d="M0.837847 1.08748C1.06565 0.859674 1.435 0.859674 1.6628 1.08748L5.1628 4.58748C5.39061 4.81529 5.39061 5.18463 5.1628 5.41244L1.6628 8.91244C1.435 9.14024 1.06565 9.14024 0.837847 8.91244C0.610041 8.68463 0.610041 8.31529 0.837847 8.08748L3.92537 4.99996L0.837847 1.91244C0.610041 1.68463 0.610041 1.31529 0.837847 1.08748Z"
				className={styles.icon_path}
			/>
		</svg>
	);
}

export default Angle;
