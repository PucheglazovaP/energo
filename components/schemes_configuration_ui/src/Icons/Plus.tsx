import clsx from 'clsx';

import { IconProps } from './types';

import styles from './Icons.module.css';

function Plus(props: IconProps) {
	const { className } = props;
	return (
		<svg
			width="12"
			height="12"
			viewBox="0 0 12 12"
			fill="none"
			className={clsx(styles.root, className)}
			xmlns="http://www.w3.org/2000/svg"
		>
			<path
				d="M6.66602 1.33366C6.66602 0.965469 6.36754 0.666992 5.99935 0.666992C5.63116 0.666992 5.33268 0.965469 5.33268 1.33366V5.33366H1.33268C0.964492 5.33366 0.666016 5.63214 0.666016 6.00033C0.666016 6.36852 0.964492 6.66699 1.33268 6.66699H5.33268V10.667C5.33268 11.0352 5.63116 11.3337 5.99935 11.3337C6.36754 11.3337 6.66602 11.0352 6.66602 10.667V6.66699H10.666C11.0342 6.66699 11.3327 6.36852 11.3327 6.00033C11.3327 5.63214 11.0342 5.33366 10.666 5.33366H6.66602V1.33366Z"
				className={styles.icon_path}
			/>
		</svg>
	);
}

export default Plus;
