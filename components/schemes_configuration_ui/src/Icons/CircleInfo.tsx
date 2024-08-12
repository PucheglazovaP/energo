import clsx from 'clsx';

import { IconProps } from './types';

import styles from './Icons.module.css';

function CircleInfo({ className, width, height }: IconProps) {
	return (
		<svg
			width={width || 16}
			height={height || 16}
			viewBox="0 0 16 16"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
			className={clsx('icon', styles.root, className)}
		>
			<g id="icons / solid / circle-i">
				<path
					id="icon"
					fillRule="evenodd"
					clipRule="evenodd"
					d="M14.6663 7.99967C14.6663 11.6816 11.6816 14.6663 7.99967 14.6663C4.31778 14.6663 1.33301 11.6816 1.33301 7.99967C1.33301 4.31778 4.31778 1.33301 7.99967 1.33301C11.6816 1.33301 14.6663 4.31778 14.6663 7.99967ZM7.33301 5.33301C7.33301 4.96482 7.63148 4.66634 7.99967 4.66634H8.00634C8.37453 4.66634 8.67301 4.96482 8.67301 5.33301C8.67301 5.7012 8.37453 5.99967 8.00634 5.99967H7.99967C7.63148 5.99967 7.33301 5.7012 7.33301 5.33301ZM7.99967 7.33301C8.36786 7.33301 8.66634 7.63148 8.66634 7.99967V10.6663C8.66634 11.0345 8.36786 11.333 7.99967 11.333C7.63148 11.333 7.33301 11.0345 7.33301 10.6663V7.99967C7.33301 7.63148 7.63148 7.33301 7.99967 7.33301Z"
					className={styles.icon_path}
				/>
			</g>
		</svg>
	);
}

export default CircleInfo;
