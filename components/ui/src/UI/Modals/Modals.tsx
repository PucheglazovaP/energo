import clix from 'clsx';

import ModalWindow from './ModalsWindow';
import { ModalInfo, ModalProps } from './types';

import styles from './Modals.module.css';

function Modals({ className, style, openedModalList, modalsList }: ModalProps) {
	if (openedModalList.length === 0) return null;

	return (
		<div className={clix(styles.root, className)} style={style}>
			{openedModalList.map((modalName) => {
				const modalWindow: ModalInfo = modalsList[modalName];

				return (
					<ModalWindow
						key={modalName}
						title={modalWindow.title}
						hasCloseButton={modalWindow.hasCloseButton}
						width={modalWindow.width ? modalWindow.width : 460}
						height={modalWindow.height ? modalWindow.height : 670}
					>
						{modalWindow.body}
					</ModalWindow>
				);
			})}
		</div>
	);
}

export default Modals;
