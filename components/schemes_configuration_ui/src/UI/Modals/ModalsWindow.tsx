import clsx from 'clsx';

import ModalClose from './ModalClose';
import { ModalWindowProps } from './types';

import styles from './Modals.module.css';

function ModalWindow({
	title,
	hasCloseButton,
	children,
	width,
	height,
	onClose = () => {},
	isVisible,
	isOverflowVisible = false,
	hasTitle = true,
}: ModalWindowProps) {
	return (
		<div
			className={clsx(
				styles.modal_window,
				!isVisible && styles.modal_window_hidden,
			)}
			style={{
				width,
				height,
			}}
		>
			{hasTitle && (
				<div className={styles.title}>
					<p>{title}</p>
					{hasCloseButton && (
						<ModalClose className={styles.icon_close} onClose={onClose} />
					)}
				</div>
			)}

			<div
				className={clsx(
					styles.modal_body,
					isOverflowVisible && styles.body_with__overflow,
				)}
			>
				{children}
			</div>
		</div>
	);
}

export default ModalWindow;
