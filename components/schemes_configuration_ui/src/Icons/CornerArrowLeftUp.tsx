import clsx from 'clsx';

import { IconProps } from './types';

import styles from './Icons.module.css';

function CornerArrowLeftUp(props: IconProps) {
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
				className={styles.icon_path}
				fillRule="evenodd"
				clipRule="evenodd"
				d="M4.83752 1.92085C5.06533 1.69305 5.43467 1.69305 5.66248 1.92085L8.57915 4.83752C8.80695 5.06533 8.80695 5.43467 8.57915 5.66248C8.35134 5.89028 7.98199 5.89028 7.75419 5.66248L5.83333 3.74162V9.33333C5.83333 9.79746 6.01771 10.2426 6.3459 10.5708C6.67409 10.899 7.1192 11.0833 7.58333 11.0833H11.6667C11.9888 11.0833 12.25 11.3445 12.25 11.6667C12.25 11.9888 11.9888 12.25 11.6667 12.25H7.58333C6.80978 12.25 6.06792 11.9427 5.52094 11.3957C4.97396 10.8487 4.66667 10.1069 4.66667 9.33333V3.74162L2.74581 5.66248C2.51801 5.89028 2.14866 5.89028 1.92085 5.66248C1.69305 5.43467 1.69305 5.06533 1.92085 4.83752L4.83752 1.92085Z"
			/>
		</svg>
	);
}

export default CornerArrowLeftUp;
