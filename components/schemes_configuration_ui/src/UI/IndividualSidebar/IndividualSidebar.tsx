import clsx from 'clsx';

import { IndividualSidebarProps } from './types';

import styles from './IndividualSidebar.module.css';

function IndividualSidebar({
	isOpen,
	children,
	className,
	style,
}: IndividualSidebarProps) {
	return (
		<aside
			className={clsx(styles.root, className, {
				[styles.sidebar__closed]: !isOpen,
			})}
			style={style}
		>
			{children}
		</aside>
	);
}

export default IndividualSidebar;
