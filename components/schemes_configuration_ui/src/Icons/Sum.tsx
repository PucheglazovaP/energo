import clsx from 'clsx';

import { IconProps } from './types';

import styles from './Icons.module.css';

function Sum(props: IconProps) {
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
				fillRule="evenodd"
				clipRule="evenodd"
				d="M0.737378 0.368524C0.850306 0.142668 1.08115 0 1.33366 0H8.667C9.03519 0 9.33366 0.298477 9.33366 0.666667C9.33366 1.03486 9.03519 1.33333 8.667 1.33333H2.667L5.867 5.6C6.04477 5.83704 6.04477 6.16296 5.867 6.4L2.667 10.6667H8.667C9.03519 10.6667 9.33366 10.9651 9.33366 11.3333C9.33366 11.7015 9.03519 12 8.667 12H1.33366C1.08115 12 0.850306 11.8573 0.737378 11.6315C0.62445 11.4056 0.648821 11.1353 0.800329 10.9333L4.50033 6L0.800329 1.06667C0.648821 0.864655 0.62445 0.59438 0.737378 0.368524Z"
				className={styles.icon_path}
			/>
		</svg>
	);
}

export default Sum;
