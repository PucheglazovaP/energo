import clsx from 'clsx';

import { IconProps } from './types';

import styles from './Icons.module.css';

function ArrowLeft(props: IconProps) {
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
				d="M7.41215 3.32906C7.63996 3.10126 7.63996 2.73191 7.41215 2.50411C7.18435 2.2763 6.815 2.2763 6.5872 2.50411L2.50479 6.58651C2.50189 6.5894 2.49902 6.59231 2.49619 6.59526C2.39514 6.70015 2.33301 6.84277 2.33301 6.99992C2.33301 7.07874 2.34864 7.15391 2.37698 7.2225C2.40545 7.29157 2.44774 7.35628 2.50386 7.4124L6.5872 11.4957C6.815 11.7235 7.18435 11.7235 7.41215 11.4957C7.63996 11.2679 7.63996 10.8986 7.41215 10.6708L4.32463 7.58325H11.083C11.4052 7.58325 11.6663 7.32208 11.6663 6.99992C11.6663 6.67775 11.4052 6.41658 11.083 6.41658H4.32463L7.41215 3.32906Z"
			/>
		</svg>
	);
}

export default ArrowLeft;
