import clsx from 'clsx';

import { IconProps } from './types';

import styles from './Icons.module.css';

function AngleArrowDoubleRight(props: IconProps) {
	const { className } = props;
	return (
		<svg
			width="15"
			height="14"
			viewBox="0 0 15 14"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
			className={clsx(styles.root, className)}
		>
			<path
				fillRule="evenodd"
				clipRule="evenodd"
				d="M3.58882 3.67085C3.81663 3.44305 4.18598 3.44305 4.41378 3.67085L7.33045 6.58752C7.55825 6.81533 7.55825 7.18467 7.33045 7.41248L4.41378 10.3291C4.18598 10.557 3.81663 10.557 3.58882 10.3291C3.36102 10.1013 3.36102 9.73199 3.58882 9.50419L6.09301 7L3.58882 4.49581C3.36102 4.26801 3.36102 3.89866 3.58882 3.67085ZM7.67216 3.67085C7.89996 3.44305 8.26931 3.44305 8.49711 3.67085L11.4138 6.58752C11.6416 6.81533 11.6416 7.18467 11.4138 7.41248L8.49711 10.3291C8.26931 10.557 7.89996 10.557 7.67216 10.3291C7.44435 10.1013 7.44435 9.73199 7.67216 9.50419L10.1763 7L7.67216 4.49581C7.44435 4.26801 7.44435 3.89866 7.67216 3.67085Z"
				fill="none"
				className={styles.icon_path}
			/>
		</svg>
	);
}

export default AngleArrowDoubleRight;
