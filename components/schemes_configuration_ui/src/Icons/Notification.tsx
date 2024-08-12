import clsx from 'clsx';

import { IconProps } from './types';

import styles from './Icons.module.css';

function Notification(props: IconProps) {
	const { className } = props;
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width="20"
			height="20"
			viewBox="0 0 20 20"
			fill="none"
			className={clsx(styles.root, className)}
		>
			<g clipPath="url(#clip0_6413_7277)">
				<path
					fillRule="evenodd"
					clipRule="evenodd"
					className={styles.icon_path}
					d="M19.1673 9.99943C19.1673 15.062 15.0633 19.1661 10.0007 19.1661C4.93804 19.1661 0.833984 15.062 0.833984 9.99943C0.833984 4.93682 4.93804 0.832764 10.0007 0.832764C15.0633 0.832764 19.1673 4.93682 19.1673 9.99943ZM10.0007 5.83276C9.54041 5.83276 9.16732 6.20586 9.16732 6.6661C9.16732 7.12634 9.54041 7.49943 10.0007 7.49943H10.009C10.4692 7.49943 10.8423 7.12634 10.8423 6.6661C10.8423 6.20586 10.4692 5.83276 10.009 5.83276H10.0007ZM10.834 9.99943C10.834 9.53919 10.4609 9.1661 10.0007 9.1661C9.54041 9.1661 9.16732 9.53919 9.16732 9.99943V13.3328C9.16732 13.793 9.54041 14.1661 10.0007 14.1661C10.4609 14.1661 10.834 13.793 10.834 13.3328V9.99943Z"
				/>
			</g>
			<defs>
				<clipPath id="clip0_6413_7277">
					<rect width="20" height="20" fill="white" />
				</clipPath>
			</defs>
		</svg>
	);
}

export default Notification;
