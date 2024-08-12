import clsx from 'clsx';

import { IconProps } from './types';

import styles from './Icons.module.css';

function Send(props: IconProps) {
	const { className } = props;
	return (
		<svg
			width="16"
			height="16"
			viewBox="0 0 16 16"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
			className={clsx(styles.root, className)}
		>
			<path
				fillRule="evenodd"
				clipRule="evenodd"
				d="M15.1374 0.861296C15.3185 1.04239 15.3799 1.31121 15.2953 1.55293L10.6286 14.8863C10.5383 15.1443 10.2996 15.321 10.0265 15.3321C9.75341 15.3433 9.50116 15.1866 9.39014 14.9368L6.82762 9.1711L1.06193 6.60857C0.81214 6.49756 0.655431 6.24531 0.666573 5.97219C0.677716 5.69907 0.854452 5.46043 1.11245 5.37013L14.4458 0.703462C14.6875 0.618858 14.9563 0.680204 15.1374 0.861296ZM8.12785 8.81368L9.92562 12.8587L13.0717 3.86982L8.12785 8.81368ZM12.1289 2.92701L3.14007 6.0731L7.18504 7.87087L12.1289 2.92701Z"
				className={styles.icon_path}
			/>
		</svg>
	);
}

export default Send;
