import clsx from 'clsx';

import styles from './Icons.module.css';
function AngleDown({ className }: { className?: string }) {
	return (
		<svg
			width="16"
			height="15"
			viewBox="0 0 16 15"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
			className={clsx('icon', className)}
		>
			<path
				d="M4.95605 11.4437H9.95605C11.6811 11.4437 13.0811 10.0437 13.0811 8.31873C13.0811 6.59373 11.6811 5.19373 9.95605 5.19373H3.08105"
				strokeMiterlimit="10"
				strokeLinecap="round"
				strokeLinejoin="round"
				className={styles.icon_path}
				stroke="#595959"
			/>
			<path
				d="M4.51895 6.75627L2.91895 5.15627L4.51895 3.55627"
				strokeLinecap="round"
				strokeLinejoin="round"
				className={styles.icon_path}
				stroke="#595959"
			/>
		</svg>
	);
}

export default AngleDown;
