import clsx from 'clsx';

import { IconProps } from './types';

import styles from './Icons.module.css';

function Group(props: IconProps) {
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
				d="M8.67367 2.44687L12.607 4.19354C13.7403 4.69354 13.7403 5.52021 12.607 6.02021L8.67367 7.76687C8.22701 7.96687 7.49367 7.96687 7.04701 7.76687L3.11367 6.02021C1.98034 5.52021 1.98034 4.69354 3.11367 4.19354L7.04701 2.44687C7.49367 2.24688 8.22701 2.24688 8.67367 2.44687Z"
				stroke="#B1B1B2"
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
			<path
				d="M2 7.83301C2 8.39301 2.42 9.03967 2.93333 9.26634L7.46 11.2797C7.80667 11.433 8.2 11.433 8.54 11.2797L13.0667 9.26634C13.58 9.03967 14 8.39301 14 7.83301"
				stroke="#B1B1B2"
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
			<path
				d="M2 11.167C2 11.787 2.36667 12.347 2.93333 12.6003L7.46 14.6137C7.80667 14.767 8.2 14.767 8.54 14.6137L13.0667 12.6003C13.6333 12.347 14 11.787 14 11.167"
				stroke="#B1B1B2"
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
		</svg>
	);
}

export default Group;
