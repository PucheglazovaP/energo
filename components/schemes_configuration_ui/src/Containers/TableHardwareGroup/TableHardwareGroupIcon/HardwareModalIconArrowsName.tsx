import clsx from 'clsx';

import { ModalIconSearchProps } from '../type';

import styles from '../../../UI/TablePair/TablePair.module.css';

function HardwareModalIconArrowsName({
	className,
	style,
	sortingList,
	order,
}: ModalIconSearchProps) {
	let arrow: string;
	let arrowToo: string;
	if (order === 4) {
		arrow = '#d8D8D8';
		arrowToo = '#fcb53b';
	} else {
		arrow = '#fcb53b';
		arrowToo = '#d8D8D8';
	}

	return (
		<button
			onClick={() => sortingList(4)}
			className={clsx(styles.icon_arrows, className)}
			style={style}
		>
			<svg
				width="9"
				height="13"
				viewBox="0 0 9 13"
				fill="none"
				xmlns="http://www.w3.org/2000/svg"
			>
				<path
					fillRule="evenodd"
					clipRule="evenodd"
					d="M0.933077 9.44194L4.05808 12.5669C4.30215 12.811 4.69788 12.811 4.94196 12.5669L8.06696 9.44194C8.24571 9.26319 8.29918 8.99437 8.20244 8.76082C8.1057 8.52728 7.87781 8.375 7.62502 8.375H1.37502C1.12223 8.375 0.894332 8.52728 0.797594 8.76082C0.700855 8.99437 0.754328 9.26319 0.933077 9.44194Z"
					fill={`${arrowToo}`}
				/>
				<path
					d="M4.94196 0.433058C4.69788 0.188981 4.30215 0.188981 4.05808 0.433058L0.933077 3.55806C0.754328 3.73681 0.700855 4.00563 0.797594 4.23918C0.894332 4.47272 1.12223 4.625 1.37502 4.625H7.62502C7.87781 4.625 8.1057 4.47272 8.20244 4.23918C8.29918 4.00563 8.24571 3.73681 8.06696 3.55806L4.94196 0.433058Z"
					fill={`${arrow}`}
				/>
			</svg>
		</button>
	);
}

export default HardwareModalIconArrowsName;
