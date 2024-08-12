import clsx from 'clsx';

import { IconProps } from './types';

import styles from './Icons.module.css';

function Channel(props: IconProps) {
	const { className } = props;
	return (
		<svg
			width="16"
			height="17"
			viewBox="0 0 16 17"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
			className={clsx(styles.root, className)}
		>
			<path
				d="M14.6667 12.167H10"
				stroke="#B1B1B2"
				strokeMiterlimit="10"
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
			<path
				d="M3.33301 12.167H1.33301"
				stroke="#B1B1B2"
				strokeMiterlimit="10"
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
			<path
				d="M14.666 4.83301H12.666"
				stroke="#B1B1B2"
				strokeMiterlimit="10"
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
			<path
				d="M5.99967 4.83301H1.33301"
				stroke="#B1B1B2"
				strokeMiterlimit="10"
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
			<path
				d="M4.66634 10.167H8.66634C9.39967 10.167 9.99967 10.5003 9.99967 11.5003V12.8337C9.99967 13.8337 9.39967 14.167 8.66634 14.167H4.66634C3.93301 14.167 3.33301 13.8337 3.33301 12.8337V11.5003C3.33301 10.5003 3.93301 10.167 4.66634 10.167Z"
				stroke="#B1B1B2"
				strokeMiterlimit="10"
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
			<path
				d="M7.33333 2.83301H11.3333C12.0667 2.83301 12.6667 3.16634 12.6667 4.16634V5.49967C12.6667 6.49967 12.0667 6.83301 11.3333 6.83301H7.33333C6.6 6.83301 6 6.49967 6 5.49967V4.16634C6 3.16634 6.6 2.83301 7.33333 2.83301Z"
				stroke="#B1B1B2"
				strokeMiterlimit="10"
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
		</svg>
	);
}

export default Channel;
