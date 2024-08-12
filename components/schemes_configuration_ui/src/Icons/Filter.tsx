import clsx from 'clsx';

import { IconProps } from './types';

import styles from './Icons.module.css';

function Filter({ className }: IconProps) {
	return (
		<svg
			width="14"
			height="14"
			viewBox="0 0 14 14"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
			className={clsx(styles.root, className)}
		>
			<g id="table-header__filter_Light">
				<path
					id="icon"
					d="M4.62154 11.7807C4.62154 12.0403 4.82863 12.25 5.08531 12.25H8.91212C9.16879 12.25 9.37588 12.0403 9.37588 11.7807V8.90642H4.62154V11.7807ZM12.367 1.75H1.63039C1.27308 1.75 1.04995 2.14155 1.22933 2.45391L4.45674 7.96788H9.5436L12.771 2.45391C12.9475 2.14155 12.7243 1.75 12.367 1.75Z"
					className={styles.icon_path}
				/>
			</g>
		</svg>
	);
}

export default Filter;
