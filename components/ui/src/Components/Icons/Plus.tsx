import clsx from 'clsx';

import { IconButtonProps } from './types';

import styles from './Icons.module.css';
function Plus({ className, onClick }: IconButtonProps) {
	return (
		<svg
			width="26"
			height="26"
			viewBox="0 0 26 26"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
			className={clsx(styles.root, className)}
			onClick={onClick}
		>
			<path
				fillRule="evenodd"
				clipRule="evenodd"
				d="M12.9998 7.66663C13.368 7.66663 13.6665 7.9651 13.6665 8.33329V12.3333H17.6665C18.0347 12.3333 18.3332 12.6318 18.3332 13C18.3332 13.3681 18.0347 13.6666 17.6665 13.6666H13.6665V17.6666C13.6665 18.0348 13.368 18.3333 12.9998 18.3333C12.6316 18.3333 12.3332 18.0348 12.3332 17.6666V13.6666H8.33317C7.96498 13.6666 7.6665 13.3681 7.6665 13C7.6665 12.6318 7.96498 12.3333 8.33317 12.3333H12.3332V8.33329C12.3332 7.9651 12.6316 7.66663 12.9998 7.66663Z"
				fill="black"
			/>
			<rect x="1" y="1" width="24" height="24" rx="4" stroke="#FAB82E" />
		</svg>
	);
}

export default Plus;
