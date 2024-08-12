import clsx from 'clsx';

import { IconProps } from './types';

import styles from './Icons.module.css';

function ArrowUp(props: IconProps) {
	const { className } = props;
	return (
		<svg
			width="12"
			height="11"
			viewBox="0 0 12 11"
			fill="none"
			className={clsx(styles.root, className)}
			xmlns="http://www.w3.org/2000/svg"
		>
			<path
				d="M5.74228 0.159764C5.66799 0.190769 5.59817 0.235811 5.53688 0.294889C5.53351 0.298131 5.53018 0.30141 5.52688 0.304722L0.861278 4.97033C0.600928 5.23068 0.600928 5.65279 0.861278 5.91314C1.12163 6.17349 1.54374 6.17349 1.80409 5.91314L5.33268 2.38454V10.1084C5.33268 10.4766 5.63116 10.7751 5.99935 10.7751C6.36754 10.7751 6.66601 10.4766 6.66601 10.1084V2.38454L10.1946 5.91314C10.455 6.17349 10.8771 6.17349 11.1374 5.91314C11.3978 5.65279 11.3978 5.23068 11.1374 4.97033L6.47075 0.303661C6.34058 0.173484 6.16996 0.108397 5.99935 0.108398C5.90823 0.108398 5.82139 0.126675 5.74228 0.159764Z"
				className={styles.icon_path}
			/>
		</svg>
	);
}

export default ArrowUp;
