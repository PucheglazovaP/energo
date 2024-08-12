import clsx from 'clsx';

import { IconProps } from './types';

import styles from './Icons.module.css';

function CircleYes(props: IconProps) {
	const { className } = props;
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width="14"
			height="14"
			viewBox="0 0 14 14"
			fill="none"
			className={clsx(styles.root, className)}
		>
			<path
				fillRule="evenodd"
				clipRule="evenodd"
				d="M13.4167 6.99998C13.4167 10.5438 10.5439 13.4166 7.00004 13.4166C3.45621 13.4166 0.583374 10.5438 0.583374 6.99998C0.583374 3.45615 3.45621 0.583313 7.00004 0.583313C10.5439 0.583313 13.4167 3.45615 13.4167 6.99998ZM10.3289 4.83716C10.5568 5.06477 10.5572 5.43412 10.3295 5.66212L6.82954 9.16795C6.72017 9.2775 6.57175 9.33908 6.41696 9.33915C6.26217 9.33921 6.11369 9.27775 6.00424 9.16829L4.25424 7.41829C4.02643 7.19049 4.02643 6.82114 4.25424 6.59333C4.48204 6.36553 4.85139 6.36553 5.0792 6.59333L6.41637 7.93051L9.50389 4.83784C9.73151 4.60985 10.1009 4.60954 10.3289 4.83716Z"
				className={styles.icon_path}
			/>
		</svg>
	);
}

export default CircleYes;
