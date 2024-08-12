import clsx from 'clsx';

import { IconProps } from './types';

import styles from './Icons.module.css';

function TextThick(props: IconProps) {
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
				d="M0.266602 0.666602C0.266602 0.445688 0.445688 0.266602 0.666602 0.266602H11.3333C11.5542 0.266602 11.7333 0.445688 11.7333 0.666602V2.6666C11.7333 2.88752 11.5542 3.0666 11.3333 3.0666C11.1124 3.0666 10.9333 2.88752 10.9333 2.6666V1.0666H6.39994V10.9333H7.99994C8.22085 10.9333 8.39993 11.1124 8.39993 11.3333C8.39993 11.5542 8.22085 11.7333 7.99994 11.7333H3.99993C3.77902 11.7333 3.59994 11.5542 3.59994 11.3333C3.59994 11.1124 3.77902 10.9333 3.99993 10.9333H5.59994V1.0666H1.0666V2.6666C1.0666 2.88752 0.887515 3.0666 0.666602 3.0666C0.445688 3.0666 0.266602 2.88752 0.266602 2.6666V0.666602Z"
				className={styles.icon_path}
			/>
		</svg>
	);
}

export default TextThick;
