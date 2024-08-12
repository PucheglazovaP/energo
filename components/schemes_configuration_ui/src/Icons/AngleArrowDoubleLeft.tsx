import clsx from 'clsx';

import { IconProps } from './types';

import styles from './Icons.module.css';

function AngleArrowDoubleLeft(props: IconProps) {
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
				d="M6.83045 3.67085C7.05825 3.89866 7.05825 4.26801 6.83045 4.49581L4.32626 7L6.83045 9.50419C7.05825 9.73199 7.05825 10.1013 6.83045 10.3291C6.60264 10.557 6.2333 10.557 6.00549 10.3291L3.08882 7.41248C2.86102 7.18467 2.86102 6.81533 3.08882 6.58752L6.00549 3.67085C6.2333 3.44305 6.60264 3.44305 6.83045 3.67085ZM10.9138 3.67085C11.1416 3.89866 11.1416 4.26801 10.9138 4.49581L8.40959 7L10.9138 9.50419C11.1416 9.73199 11.1416 10.1013 10.9138 10.3291C10.686 10.557 10.3166 10.557 10.0888 10.3291L7.17216 7.41248C6.94435 7.18467 6.94435 6.81533 7.17216 6.58752L10.0888 3.67085C10.3166 3.44305 10.686 3.44305 10.9138 3.67085Z"
				fill="none"
				className={styles.icon_path}
			/>
		</svg>
	);
}

export default AngleArrowDoubleLeft;
