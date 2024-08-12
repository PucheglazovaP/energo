import clsx from 'clsx';

import { IconProps } from './types';

import styles from './Icons.module.css';

function Close(props: IconProps) {
	const { className } = props;
	return (
		<svg
			width="10"
			height="10"
			viewBox="0 0 10 10"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
			className={clsx(styles.root, className)}
		>
			<path
				fillRule="evenodd"
				clipRule="evenodd"
				d="M1.08752 1.08748C1.31533 0.859674 1.68467 0.859674 1.91248 1.08748L5 4.175L8.08752 1.08748C8.31533 0.859674 8.68467 0.859674 8.91248 1.08748C9.14029 1.31529 9.14029 1.68463 8.91248 1.91244L5.82496 4.99996L8.91248 8.08748C9.14029 8.31529 9.14029 8.68463 8.91248 8.91244C8.68467 9.14024 8.31533 9.14024 8.08752 8.91244L5 5.82492L1.91248 8.91244C1.68467 9.14024 1.31533 9.14024 1.08752 8.91244C0.859716 8.68463 0.859716 8.31529 1.08752 8.08748L4.17504 4.99996L1.08752 1.91244C0.859716 1.68463 0.859716 1.31529 1.08752 1.08748Z"
				className={styles.icon_path}
			/>
		</svg>
	);
}

export default Close;
