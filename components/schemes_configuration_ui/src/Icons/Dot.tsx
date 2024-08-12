import clsx from 'clsx';

import { IconProps } from './types';

import styles from './Icons.module.css';

function Dot(props: IconProps) {
	const { className } = props;
	return (
		<svg
			width="4"
			height="4"
			viewBox="0 0 4 4"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
			className={clsx(styles.root, className)}
		>
			<circle cx="2.00065" cy="1.99967" r="1.16667" fill="#565655" />
		</svg>
	);
}

export default Dot;
