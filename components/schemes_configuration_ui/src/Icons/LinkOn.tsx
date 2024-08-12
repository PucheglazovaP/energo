import { IconProps } from './types';

import styles from './Icons.module.css';

function LinkOn({ className }: IconProps) {
	return (
		<svg
			className={`${styles.root} ${className || ''}`}
			width={14}
			height={14}
			viewBox="0 0 14 14"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
		>
			<path
				className={styles.icon_path}
				fillRule="evenodd"
				clipRule="evenodd"
				d="M3.5 4.667a2.333 2.333 0 000 4.666h1.75a.583.583 0 010 1.167H3.5a3.5 3.5 0 110-7h1.75a.583.583 0 110 1.167H3.5zm4.667-.584c0-.322.26-.583.583-.583h1.75a3.5 3.5 0 110 7H8.75a.583.583 0 010-1.167h1.75a2.333 2.333 0 000-4.666H8.75a.583.583 0 01-.583-.584zM4.083 7c0-.322.261-.583.584-.583h4.666a.583.583 0 110 1.166H4.667A.583.583 0 014.083 7z"
			/>
		</svg>
	);
}

export default LinkOn;
