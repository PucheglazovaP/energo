import clsx from 'clsx';

import { TreeHeaderProps } from './types';

import styles from './TreeHeader.module.css';

function TreeHeader({ className, style, children, Icon }: TreeHeaderProps) {
	return (
		<div className={clsx(styles.root, className)} style={style}>
			{Icon && <Icon />}
			{children}
		</div>
	);
}

export default TreeHeader;
