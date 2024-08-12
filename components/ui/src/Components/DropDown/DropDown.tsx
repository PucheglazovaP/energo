import { useState } from 'react';
import { Button } from '@evraz/ui-kit';
import clsx from 'clsx';

import useOutsideClick from '../../Hooks/useOutsideClick';

import { DropDownProps } from './types';

import styles from './DropDown.module.css';

function DropDown({ className, style, title, children }: DropDownProps) {
	const [isPaneOpen, setIsPaneOpen] = useState<boolean>(false);
	const rootRef = useOutsideClick(isPaneOpen, () => setIsPaneOpen(false));
	const togglePaneOpen = () => setIsPaneOpen(!isPaneOpen);
	return (
		<div ref={rootRef} className={clsx(styles.root, className)} style={style}>
			<Button className={styles.drop_button} onClick={togglePaneOpen}>
				{title}
			</Button>
			{isPaneOpen && <div className={styles.pane}>{children}</div>}
		</div>
	);
}

export default DropDown;
