import clsx from 'clsx';

import { IconProps } from './types';

import styles from './Icons.module.css';

function Chart(props: IconProps) {
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
				d="M15.3386 9.66535C15.3386 9.29716 15.0401 8.99868 14.6719 8.99868H11.6719C11.396 8.99868 11.1487 9.16857 11.0497 9.42603L10.0501 12.025L6.63766 1.78788C6.54692 1.51565 6.29216 1.33203 6.00521 1.33203C5.71825 1.33203 5.46349 1.51565 5.37275 1.78788L3.52472 7.33205L1.33855 7.33203C0.970356 7.33203 0.671878 7.63051 0.671875 7.99869C0.671873 8.36688 0.970347 8.66536 1.33854 8.66537L4.00522 8.66538C4.29217 8.66538 4.54694 8.48176 4.63768 8.20953L6.00521 4.10689L9.37277 14.2095C9.46175 14.4765 9.70876 14.6588 9.99008 14.6652C10.2714 14.6716 10.5264 14.5007 10.6275 14.238L12.1298 10.332H14.6719C15.0401 10.332 15.3386 10.0335 15.3386 9.66535Z"
				fill="none"
				className={styles.icon_path}
			/>
		</svg>
	);
}

export default Chart;
