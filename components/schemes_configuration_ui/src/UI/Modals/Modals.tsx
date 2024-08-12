import clsx from 'clsx';

import ModalWindow from './ModalsWindow';
import { ModalInfo, ModalProps } from './types';

import styles from './Modals.module.css';

function Modals({ className, style, openedModalList, modalsList }: ModalProps) {
	if (openedModalList.length === 0) return null;

	return (
		<div className={clsx(styles.root, className)} style={style}>
			{openedModalList.map((modalName, idx) => {
				const modalWindow: ModalInfo = modalsList[modalName];
				return (
					<ModalWindow
						key={modalName}
						title={modalWindow.title}
						hasCloseButton={modalWindow.hasCloseButton}
						width={modalWindow.width}
						height={modalWindow.height}
						onClose={modalWindow.onCloseFn}
						isVisible={!openedModalList[idx + 1]}
						isOverflowVisible={modalWindow.isOverflowVisible}
						hasTitle={modalWindow.hasTitle}
					>
						{modalWindow.body}
					</ModalWindow>
				);
			})}
		</div>
	);
}

export default Modals;
