import clsx from 'clsx';

import { IconProps } from './types';

import styles from './Icons.module.css';

function Hierarchy(props: IconProps) {
	const { className } = props;
	return (
		<svg
			width="16"
			height="15"
			viewBox="0 0 16 15"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
			className={clsx(styles.root, className)}
		>
			<path
				fillRule="evenodd"
				clipRule="evenodd"
				d="M7.99935 4.29126C8.73573 4.29126 9.33268 3.69431 9.33268 2.95793C9.33268 2.22155 8.73573 1.62459 7.99935 1.62459C7.26297 1.62459 6.66601 2.22155 6.66601 2.95793C6.66601 3.69431 7.26297 4.29126 7.99935 4.29126ZM8.66601 5.54058C9.81617 5.24455 10.666 4.20049 10.666 2.95793C10.666 1.48517 9.47211 0.29126 7.99935 0.29126C6.52659 0.29126 5.33268 1.48517 5.33268 2.95793C5.33268 4.20049 6.18253 5.24455 7.33268 5.54058V6.95793H5.33268C3.85992 6.95793 2.66602 8.15183 2.66602 9.62459V9.7086C1.51586 10.0046 0.666016 11.0487 0.666016 12.2913C0.666016 13.764 1.85992 14.9579 3.33268 14.9579C4.80544 14.9579 5.99935 13.764 5.99935 12.2913C5.99935 11.0487 5.1495 10.0046 3.99935 9.7086V9.62459C3.99935 8.88821 4.5963 8.29126 5.33268 8.29126H7.33268H8.66601H10.666C11.4024 8.29126 11.9993 8.88821 11.9993 9.62459V9.7086C10.8492 10.0046 9.99935 11.0487 9.99935 12.2913C9.99935 13.764 11.1933 14.9579 12.666 14.9579C14.1388 14.9579 15.3327 13.764 15.3327 12.2913C15.3327 11.0487 14.4828 10.0046 13.3327 9.7086V9.62459C13.3327 8.15183 12.1388 6.95793 10.666 6.95793H8.66601V5.54058ZM3.33268 13.6246C4.06906 13.6246 4.66602 13.0276 4.66602 12.2913C4.66602 11.5549 4.06906 10.9579 3.33268 10.9579C2.5963 10.9579 1.99935 11.5549 1.99935 12.2913C1.99935 13.0276 2.5963 13.6246 3.33268 13.6246ZM13.9993 12.2913C13.9993 13.0276 13.4024 13.6246 12.666 13.6246C11.9296 13.6246 11.3327 13.0276 11.3327 12.2913C11.3327 11.5549 11.9296 10.9579 12.666 10.9579C13.4024 10.9579 13.9993 11.5549 13.9993 12.2913Z"
				className={styles.icon_path}
			/>
		</svg>
	);
}

export default Hierarchy;
