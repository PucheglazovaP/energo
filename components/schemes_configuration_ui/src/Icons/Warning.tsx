import clsx from 'clsx';

import { IconProps } from './types';

import styles from './Icons.module.css';

function Warning(props: IconProps) {
	const { className } = props;
	return (
		<svg
			width="30"
			height="30"
			viewBox="0 0 30 30"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
			className={clsx(styles.root, className)}
		>
			<path
				fillRule="evenodd"
				clipRule="evenodd"
				d="M15 3.75C8.7868 3.75 3.75 8.7868 3.75 15C3.75 21.2132 8.7868 26.25 15 26.25C21.2132 26.25 26.25 21.2132 26.25 15C26.25 8.7868 21.2132 3.75 15 3.75ZM1.25 15C1.25 7.40608 7.40608 1.25 15 1.25C22.5939 1.25 28.75 7.40608 28.75 15C28.75 22.5939 22.5939 28.75 15 28.75C7.40608 28.75 1.25 22.5939 1.25 15ZM15 8.75C15.6904 8.75 16.25 9.30964 16.25 10V15C16.25 15.6904 15.6904 16.25 15 16.25C14.3096 16.25 13.75 15.6904 13.75 15V10C13.75 9.30964 14.3096 8.75 15 8.75ZM13.75 20C13.75 19.3096 14.3096 18.75 15 18.75H15.0125C15.7029 18.75 16.2625 19.3096 16.2625 20C16.2625 20.6904 15.7029 21.25 15.0125 21.25H15C14.3096 21.25 13.75 20.6904 13.75 20Z"
				fill="none"
				className={styles.icon_path}
			/>
		</svg>
	);
}

export default Warning;
