import clsx from 'clsx';

import { UserPopupProps } from './types';

import styles from './UserPopup.module.css';

function UserPopup({ className, style, children }: UserPopupProps) {
	return (
		<div className={clsx(styles.root, className)} style={style}>
			{children}
		</div>
	);
}

export default UserPopup;
