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
				d="M11.0439 11.4437H6.04395C4.31895 11.4437 2.91895 10.0437 2.91895 8.31873C2.91895 6.59373 4.31895 5.19373 6.04395 5.19373H12.9189"
				stroke="#595959"
				strokeMiterlimit="10"
				strokeLinecap="round"
				strokeLinejoin="round"
				className={styles.icon_path}
			/>
			<path
				d="M11.4814 6.75627L13.0814 5.15627L11.4814 3.55627"
				stroke="#595959"
				strokeLinecap="round"
				strokeLinejoin="round"
				className={styles.icon_path}
			/>
		</svg>
	);
}

export default AngleDown;
