import clsx from 'clsx';

import { IconProps } from './types';

import styles from './Icons.module.css';

function FilePlus(props: IconProps) {
	const { className } = props;
	return (
		<svg
			width="12"
			height="15"
			viewBox="0 0 12 15"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
			className={clsx(styles.root, className)}
		>
			<path
				fillRule="evenodd"
				clipRule="evenodd"
				d="M0.585786 0.733247C0.960859 0.358174 1.46957 0.147461 2 0.147461H7.33333C7.51014 0.147461 7.67971 0.217699 7.80474 0.342723L11.8047 4.34272C11.9298 4.46775 12 4.63732 12 4.81413V12.8141C12 13.3446 11.7893 13.8533 11.4142 14.2283C11.0391 14.6034 10.5304 14.8141 10 14.8141H2C1.46957 14.8141 0.960859 14.6034 0.585786 14.2283C0.210714 13.8533 0 13.3446 0 12.8141V2.14746C0 1.61703 0.210714 1.10832 0.585786 0.733247ZM2 1.48079C1.82319 1.48079 1.65362 1.55103 1.5286 1.67606C1.40357 1.80108 1.33333 1.97065 1.33333 2.14746V12.8141C1.33333 12.9909 1.40357 13.1605 1.5286 13.2855C1.65362 13.4106 1.82319 13.4808 2 13.4808H10C10.1768 13.4808 10.3464 13.4106 10.4714 13.2855C10.5964 13.1605 10.6667 12.9909 10.6667 12.8141V5.48079H7.33333C6.96514 5.48079 6.66667 5.18232 6.66667 4.81413V1.48079H2ZM8 2.4236L9.72386 4.14746H8V2.4236ZM6 6.81413C6.36819 6.81413 6.66667 7.1126 6.66667 7.48079V8.81413H8C8.36819 8.81413 8.66667 9.1126 8.66667 9.48079C8.66667 9.84898 8.36819 10.1475 8 10.1475H6.66667V11.4808C6.66667 11.849 6.36819 12.1475 6 12.1475C5.63181 12.1475 5.33333 11.849 5.33333 11.4808V10.1475H4C3.63181 10.1475 3.33333 9.84898 3.33333 9.48079C3.33333 9.1126 3.63181 8.81413 4 8.81413H5.33333V7.48079C5.33333 7.1126 5.63181 6.81413 6 6.81413Z"
				className={styles.icon_path}
			/>
		</svg>
	);
}

export default FilePlus;
