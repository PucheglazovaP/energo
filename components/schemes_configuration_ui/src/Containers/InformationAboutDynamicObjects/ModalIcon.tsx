import clsx from 'clsx';

import { ModalIconProps } from './types';

import styles from './InformationAboutBanners.module.css';

function ModalIcon({ className, style }: ModalIconProps) {
	return (
		<div className={clsx(styles.icon_button_search, className)} style={style}>
			<div>
				<svg
					width="12"
					height="13"
					viewBox="0 0 12 13"
					fill="none"
					xmlns="http://www.w3.org/2000/svg"
				>
					<path
						fillRule="evenodd"
						clipRule="evenodd"
						d="M5.41602 1.83341C3.16085 1.83341 1.33268 3.66159 1.33268 5.91675C1.33268 8.17191 3.16085 10.0001 5.41602 10.0001C6.51615 10.0001 7.51467 9.56502 8.24891 8.85756C8.26426 8.83759 8.28108 8.81839 8.29937 8.8001C8.31766 8.78181 8.33686 8.765 8.35682 8.74964C9.06429 8.0154 9.49935 7.01688 9.49935 5.91675C9.49935 3.66159 7.67118 1.83341 5.41602 1.83341ZM9.51796 9.19373C10.2364 8.29559 10.666 7.15634 10.666 5.91675C10.666 3.01725 8.31551 0.666748 5.41602 0.666748C2.51652 0.666748 0.166016 3.01725 0.166016 5.91675C0.166016 8.81624 2.51652 11.1667 5.41602 11.1667C6.65561 11.1667 7.79486 10.7371 8.693 10.0187L10.8369 12.1626C11.0647 12.3904 11.434 12.3904 11.6618 12.1626C11.8896 11.9348 11.8896 11.5654 11.6618 11.3376L9.51796 9.19373Z"
						fill="#BEBEBF"
					/>
				</svg>
			</div>
		</div>
	);
}

export default ModalIcon;
