import clsx from 'clsx';

import { IconProps } from './types';

import styles from './Icon.module.css';

function IconCircleCheck({ className }: IconProps) {
	return (
		<svg
			width="14"
			height="14"
			viewBox="0 0 14 14"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
			className={clsx('icon', styles.root, className)}
		>
			<path
				fillRule="evenodd"
				clipRule="evenodd"
				d="M13.4163 7.00004C13.4163 10.5439 10.5435 13.4167 6.99967 13.4167C3.45585 13.4167 0.583008 10.5439 0.583008 7.00004C0.583008 3.45621 3.45585 0.583374 6.99967 0.583374C10.5435 0.583374 13.4163 3.45621 13.4163 7.00004ZM10.3285 4.83722C10.5565 5.06483 10.5568 5.43418 10.3292 5.66218L6.82917 9.16801C6.71981 9.27756 6.57139 9.33914 6.41659 9.33921C6.2618 9.33927 6.11333 9.27781 6.00387 9.16835L4.25387 7.41835C4.02607 7.19055 4.02607 6.8212 4.25387 6.5934C4.48168 6.36559 4.85102 6.36559 5.07883 6.5934L6.41601 7.93057L9.50353 4.83791C9.73114 4.60991 10.1005 4.6096 10.3285 4.83722Z"
			/>
		</svg>
	);
}

export default IconCircleCheck;
