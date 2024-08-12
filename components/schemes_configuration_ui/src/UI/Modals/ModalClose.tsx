import { SymbolDelete } from '@evraz/ui-kit';
import clsx from 'clsx';

import { ModalCloseProps } from './types';

import styles from './Modals.module.css';

function ModalClose({ className, style, onClose }: ModalCloseProps) {
	return (
		<button
			className={clsx(styles.icon_button_close, className)}
			style={style}
			onClick={onClose}
		>
			<SymbolDelete />
		</button>
	);
}

export default ModalClose;
