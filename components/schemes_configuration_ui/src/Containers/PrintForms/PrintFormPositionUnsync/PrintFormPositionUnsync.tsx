import { Button, CircleDelete } from '@evraz/ui-kit';

import { closeModal } from '../../../Models/Modal/events';
import { RegisteredModals } from '../../../Shared/modalsConfig';

import useSelectedPointsUnsync from './useSelectedPointsUnsync';

import styles from './PrintFormPositionUnsync.module.css';

function PrintFormPositionUnsync() {
	const { nodeName, positionName, handleUnsync } = useSelectedPointsUnsync();

	const handleClose = () => {
		closeModal(RegisteredModals.PrintFormPositionUnsync);
	};
	const handleConfirm = () => {
		handleUnsync();
		handleClose();
	};

	return (
		<div className={styles.root}>
			<div className={styles.body}>
				<CircleDelete className={styles.icon_delete} />
				<h3 className={styles.title}>Отвязать узел дерева</h3>
				<div className={styles.subtitle}>
					Вы действительно хотите отвязать узел &quot;
					{nodeName}&quot; от позиции отчета &quot;
					{positionName}&quot;?
				</div>
			</div>
			<div className={styles.controls}>
				<Button onClick={handleClose}>Отмена</Button>
				<Button onClick={handleConfirm}>Отвязать</Button>
			</div>
		</div>
	);
}

export default PrintFormPositionUnsync;
