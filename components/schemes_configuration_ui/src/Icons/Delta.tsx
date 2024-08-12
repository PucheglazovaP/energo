import clsx from 'clsx';

import { IconProps } from './types';

import styles from './Icons.module.css';

function Delta(props: IconProps) {
	const { className } = props;
	return (
		<svg
			width="10"
			height="9"
			viewBox="0 0 10 9"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
			className={clsx(styles.root, className)}
		>
			<path
				className={styles.icon_path}
				id="Polygon 2 (Stroke)"
				fillRule="evenodd"
				clipRule="evenodd"
				d="M4.50086 1.97081L1.60338 7.76572H7.39834L4.50086 1.97081ZM5.07189 0.352911C4.83661 -0.117637 4.16511 -0.117637 3.92983 0.352911L0.0682242 8.07607C-0.144021 8.50055 0.164656 9 0.639251 9H8.36247C8.83706 9 9.14574 8.50055 8.9335 8.07607L5.07189 0.352911Z"
				fill="#444444"
			/>
		</svg>
	);
}

export default Delta;
