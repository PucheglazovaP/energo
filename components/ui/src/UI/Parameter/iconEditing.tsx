import clsx from 'clsx';

import { IconProps } from './types';

import styles from './Parameter.module.css';

function IconApprove({ className, style }: IconProps) {
	return (
		<svg
			width="12"
			height="9"
			viewBox="0 0 12 9"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
			className={clsx('icon', styles.icon_approve, className)}
			style={style}
		>
			<path
				fillRule="evenodd"
				clipRule="evenodd"
				d="M11.8047 0.528514C12.0651 0.788863 12.0651 1.21097 11.8047 1.47132L4.4714 8.80465C4.21105 9.065 3.78894 9.065 3.52859 8.80465L0.195262 5.47132C-0.0650873 5.21097 -0.0650873 4.78886 0.195262 4.52851C0.455611 4.26816 0.877721 4.26816 1.13807 4.52851L4 7.39044L10.8619 0.528514C11.1223 0.268165 11.5444 0.268165 11.8047 0.528514Z"
				fill="#595959"
			/>
		</svg>
	);
}

function IconReject({ className, style }: IconProps) {
	return (
		<svg
			width="10"
			height="10"
			viewBox="0 0 10 10"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
			className={clsx('icon', styles.icon_approve, className)}
			style={style}
		>
			<path
				fillRule="evenodd"
				clipRule="evenodd"
				d="M0.529246 0.528514C0.789596 0.268165 1.21171 0.268165 1.47205 0.528514L5.00065 4.05711L8.52924 0.528514C8.78959 0.268165 9.2117 0.268165 9.47205 0.528514C9.7324 0.788863 9.7324 1.21097 9.47205 1.47132L5.94345 4.99991L9.47205 8.52851C9.7324 8.78886 9.7324 9.21097 9.47205 9.47131C9.2117 9.73166 8.78959 9.73166 8.52924 9.47131L5.00065 5.94272L1.47205 9.47131C1.21171 9.73166 0.789596 9.73166 0.529246 9.47131C0.268897 9.21097 0.268897 8.78886 0.529246 8.52851L4.05784 4.99991L0.529246 1.47132C0.268897 1.21097 0.268897 0.788863 0.529246 0.528514Z"
				fill="#595959"
			/>
		</svg>
	);
}

export { IconApprove, IconReject };
