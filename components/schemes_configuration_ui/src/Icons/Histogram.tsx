import clsx from 'clsx';

import { IconProps } from './types';

import styles from './Icons.module.css';

function Histogram(props: IconProps) {
	const { className } = props;
	return (
		<svg
			width="14"
			height="14"
			viewBox="0 0 14 14"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
			className={clsx(styles.root, className)}
		>
			<path
				fillRule="evenodd"
				clipRule="evenodd"
				d="M7.00033 1.75C7.32249 1.75 7.58366 2.01117 7.58366 2.33333V11.6667C7.58366 11.9888 7.32249 12.25 7.00033 12.25C6.67816 12.25 6.41699 11.9888 6.41699 11.6667V2.33333C6.41699 2.01117 6.67816 1.75 7.00033 1.75ZM10.5003 5.25C10.8225 5.25 11.0837 5.51117 11.0837 5.83333V11.6667C11.0837 11.9888 10.8225 12.25 10.5003 12.25C10.1782 12.25 9.91699 11.9888 9.91699 11.6667V5.83333C9.91699 5.51117 10.1782 5.25 10.5003 5.25ZM3.50033 7.58333C3.82249 7.58333 4.08366 7.8445 4.08366 8.16667V11.6667C4.08366 11.9888 3.82249 12.25 3.50033 12.25C3.17816 12.25 2.91699 11.9888 2.91699 11.6667V8.16667C2.91699 7.8445 3.17816 7.58333 3.50033 7.58333Z"
				className={styles.icon_path}
			/>
		</svg>
	);
}

export default Histogram;
