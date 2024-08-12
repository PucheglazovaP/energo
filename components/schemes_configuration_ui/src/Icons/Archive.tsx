import clsx from 'clsx';

import { IconProps } from './types';

import styles from './Icons.module.css';

function Archive(props: IconProps) {
	const { className } = props;
	return (
		<svg
			width="16"
			height="14"
			viewBox="0 0 16 14"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
			className={clsx(styles.root, className)}
		>
			<path
				fillRule="evenodd"
				clipRule="evenodd"
				d="M0 1.00016C0 0.631973 0.298477 0.333496 0.666667 0.333496H15.3333C15.7015 0.333496 16 0.631973 16 1.00016V4.3335C16 4.70169 15.7015 5.00016 15.3333 5.00016H14.6667V13.0002C14.6667 13.3684 14.3682 13.6668 14 13.6668H2C1.63181 13.6668 1.33333 13.3684 1.33333 13.0002V5.00016H0.666667C0.298477 5.00016 0 4.70169 0 4.3335V1.00016ZM2.66667 5.00016V12.3335H13.3333V5.00016H2.66667ZM14.6667 3.66683H1.33333V1.66683H14.6667V3.66683ZM6 7.00016C6 6.63197 6.29848 6.3335 6.66667 6.3335H9.33333C9.70152 6.3335 10 6.63197 10 7.00016C10 7.36835 9.70152 7.66683 9.33333 7.66683H6.66667C6.29848 7.66683 6 7.36835 6 7.00016Z"
				className={styles.icon_path}
			/>
		</svg>
	);
}

export default Archive;
