import clsx from 'clsx';

import { IconProps } from './types';

import styles from './Icons.module.css';

function DragDrop(props: IconProps) {
	const { className } = props;
	return (
		<svg
			width="5"
			height="12"
			viewBox="0 0 5 12"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
			className={clsx(styles.root, className)}
		>
			<path
				d="M0.666992 0.166504H2.33366V1.83317H0.666992V0.166504Z"
				fill="#B1B1B2"
			/>
			<path d="M0.667 2.6665H2.33367V4.33317H0.667V2.6665Z" fill="#B1B1B2" />
			<path d="M0.667 5.1665H2.33367V6.83317H0.667V5.1665Z" fill="#B1B1B2" />
			<path d="M0.667 7.6665H2.33367V9.33317H0.667V7.6665Z" fill="#B1B1B2" />
			<path
				d="M3.167 0.166504H4.83367V1.83317H3.167V0.166504Z"
				fill="#B1B1B2"
			/>
			<path d="M3.167 2.6665H4.83367V4.33317H3.167V2.6665Z" fill="#B1B1B2" />
			<path d="M3.167 5.1665H4.83367V6.83317H3.167V5.1665Z" fill="#B1B1B2" />
			<path d="M3.167 7.6665H4.83367V9.33317H3.167V7.6665Z" fill="#B1B1B2" />
			<path d="M0.667 10.1665H2.33367V11.8332H0.667V10.1665Z" fill="#B1B1B2" />
			<path d="M3.167 10.1665H4.83367V11.8332H3.167V10.1665Z" fill="#B1B1B2" />
		</svg>
	);
}

export default DragDrop;
