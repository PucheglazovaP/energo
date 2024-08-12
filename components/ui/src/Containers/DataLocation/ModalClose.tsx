import clsx from 'clsx';

import { ModalCloseProps } from './types';

import styles from './DataLocation.module.css';

function ModalClose({ className, style, onClose }: ModalCloseProps) {
	return (
		<button
			className={clsx(styles.icon_button_close, className)}
			style={style}
			onClick={onClose}
		>
			<div>
				<svg
					width="15"
					height="15"
					viewBox="0 0 15 15"
					fill="none"
					xmlns="http://www.w3.org/2000/svg"
					className={clsx(styles.icon_button_svg)}
				>
					<path
						fillRule="evenodd"
						clipRule="evenodd"
						d="M14.4872 1.98649C14.894 1.57969 14.894 0.920145 14.4872 0.513349C14.0804 0.106553 13.4209 0.106553 13.0141 0.513349L7.50065 6.02678L1.98722 0.513349C1.58042 0.106553 0.920878 0.106553 0.514081 0.513349C0.107285 0.920145 0.107285 1.57969 0.514081 1.98649L6.02751 7.49992L0.514081 13.0133C0.107285 13.4201 0.107285 14.0797 0.514081 14.4865C0.920878 14.8933 1.58042 14.8933 1.98722 14.4865L7.50065 8.97306L13.0141 14.4865C13.4209 14.8933 14.0804 14.8933 14.4872 14.4865C14.894 14.0797 14.894 13.4201 14.4872 13.0133L8.97379 7.49992L14.4872 1.98649Z"
						fill="#7D7D7D"
					/>
				</svg>
			</div>
		</button>
	);
}

export default ModalClose;
