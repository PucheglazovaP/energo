import clsx from 'clsx';

import { IconProps } from './types';

import styles from './Icons.module.css';

function TextBold(props: IconProps) {
	const { className } = props;
	return (
		<svg
			width="12"
			height="12"
			viewBox="0 0 12 12"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
			className={clsx(styles.root, className)}
		>
			<path
				d="M0 0.666667C0 0.298477 0.298477 0 0.666667 0H11.3333C11.7015 0 12 0.298477 12 0.666667V2.66667C12 3.03486 11.7015 3.33333 11.3333 3.33333C10.9651 3.33333 10.6667 3.03486 10.6667 2.66667V1.33333H6.66667V10.6667H8C8.36819 10.6667 8.66667 10.9651 8.66667 11.3333C8.66667 11.7015 8.36819 12 8 12H4C3.63181 12 3.33333 11.7015 3.33333 11.3333C3.33333 10.9651 3.63181 10.6667 4 10.6667H5.33333V1.33333H1.33333V2.66667C1.33333 3.03486 1.03486 3.33333 0.666667 3.33333C0.298477 3.33333 0 3.03486 0 2.66667V0.666667Z"
				className={styles.icon_path}
			/>
		</svg>
	);
}

export default TextBold;
