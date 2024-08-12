import clix from 'clsx';

import ModalClose from './ModalClose';
import { ModalWindowProps } from './types';

import styles from './Modals.module.css';

function ModalWindow({
	title,
	hasCloseButton,
	children,
	width,
	height,
}: ModalWindowProps) {
	return (
		<div
			className={clix(styles.modal_window)}
			style={{ width: `${width}px`, height: `${height}px` }}
		>
			<div className={clix(styles.title)}>
				<p>{title}</p>
				{hasCloseButton && <ModalClose />}
			</div>

			<div className={clix(styles.modal_body)}>{children}</div>
		</div>
	);
}

export default ModalWindow;
