import clsx from 'clsx';

import { IconProps } from './types';

import styles from './Icons.module.css';

function Crosshair(props: IconProps) {
	const { className } = props;
	return (
		<svg
			width="13"
			height="14"
			viewBox="0 0 13 14"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
			className={clsx(styles.root, className)}
		>
			<path
				fillRule="evenodd"
				clipRule="evenodd"
				d="M1.28172 6.41671H2.99967C3.32184 6.41671 3.58301 6.67787 3.58301 7.00004C3.58301 7.32221 3.32184 7.58337 2.99967 7.58337H1.28172C1.55072 10.0168 3.4829 11.949 5.91634 12.218V10.5C5.91634 10.1779 6.17751 9.91671 6.49967 9.91671C6.82184 9.91671 7.08301 10.1779 7.08301 10.5V12.218C9.51645 11.949 11.4486 10.0168 11.7176 7.58337H9.99967C9.67751 7.58337 9.41634 7.32221 9.41634 7.00004C9.41634 6.67787 9.67751 6.41671 9.99967 6.41671H11.7176C11.4486 3.98326 9.51645 2.05109 7.08301 1.78208V3.50004C7.08301 3.82221 6.82184 4.08337 6.49967 4.08337C6.17751 4.08337 5.91634 3.82221 5.91634 3.50004V1.78208C3.4829 2.05109 1.55072 3.98326 1.28172 6.41671ZM0.0830078 7.00004C0.0830078 3.45621 2.95585 0.583374 6.49967 0.583374C10.0435 0.583374 12.9163 3.45621 12.9163 7.00004C12.9163 10.5439 10.0435 13.4167 6.49967 13.4167C2.95585 13.4167 0.0830078 10.5439 0.0830078 7.00004Z"
				className={styles.icon_path}
			/>
		</svg>
	);
}

export default Crosshair;
