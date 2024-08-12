import clsx from 'clsx';

import { IconProps } from './types';

import styles from './Icons.module.css';

function BarChart(props: IconProps) {
	const { className } = props;
	return (
		<svg
			width="10"
			height="12"
			viewBox="0 0 10 12"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
			className={clsx(styles.root, className)}
		>
			<path
				className={styles.icon_path}
				fillRule="evenodd"
				clipRule="evenodd"
				d="M5.00033 0.75C5.32249 0.75 5.58366 1.01117 5.58366 1.33333V10.6667C5.58366 10.9888 5.32249 11.25 5.00033 11.25C4.67816 11.25 4.41699 10.9888 4.41699 10.6667V1.33333C4.41699 1.01117 4.67816 0.75 5.00033 0.75ZM8.50033 4.25C8.82249 4.25 9.08366 4.51117 9.08366 4.83333V10.6667C9.08366 10.9888 8.82249 11.25 8.50033 11.25C8.17816 11.25 7.91699 10.9888 7.91699 10.6667V4.83333C7.91699 4.51117 8.17816 4.25 8.50033 4.25ZM1.50033 6.58333C1.82249 6.58333 2.08366 6.8445 2.08366 7.16667V10.6667C2.08366 10.9888 1.82249 11.25 1.50033 11.25C1.17816 11.25 0.916992 10.9888 0.916992 10.6667V7.16667C0.916992 6.8445 1.17816 6.58333 1.50033 6.58333Z"
			/>
		</svg>
	);
}

export default BarChart;
