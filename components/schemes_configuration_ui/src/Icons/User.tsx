import clsx from 'clsx';

import { IconProps } from './types';

import styles from './Icons.module.css';

function User(props: IconProps) {
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
				d="M5 1C4.17157 1 3.5 1.67157 3.5 2.5C3.5 3.32843 4.17157 4 5 4C5.82843 4 6.5 3.32843 6.5 2.5C6.5 1.67157 5.82843 1 5 1ZM2.5 2.5C2.5 1.11929 3.61929 0 5 0C6.38071 0 7.5 1.11929 7.5 2.5C7.5 3.88071 6.38071 5 5 5C3.61929 5 2.5 3.88071 2.5 2.5ZM1.23223 6.73223C1.70107 6.26339 2.33696 6 3 6H7C7.66304 6 8.29892 6.26339 8.76777 6.73223C9.23661 7.20107 9.5 7.83696 9.5 8.5V9.5C9.5 9.77614 9.27614 10 9 10C8.72386 10 8.5 9.77614 8.5 9.5V8.5C8.5 8.10217 8.34196 7.72064 8.06066 7.43934C7.77935 7.15803 7.39782 7 7 7H3C2.60217 7 2.22064 7.15803 1.93934 7.43934C1.65803 7.72064 1.5 8.10217 1.5 8.5V9.5C1.5 9.77614 1.27614 10 1 10C0.723858 10 0.5 9.77614 0.5 9.5V8.5C0.5 7.83696 0.763392 7.20107 1.23223 6.73223Z"
				className={styles.icon_path}
			/>
		</svg>
	);
}

export default User;
