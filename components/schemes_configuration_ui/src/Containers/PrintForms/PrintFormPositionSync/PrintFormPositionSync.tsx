import { Button } from '@evraz/ui-kit';

import { closeModal } from '../../../Models/Modal/events';
import { RegisteredModals } from '../../../Shared/modalsConfig';
import { IconLink } from '../../../UI/Icon';

import useSelectedPointsSync from './useSelectedPointsSync';

import styles from './PrintFormPositionSync.module.css';

function PrintFormPositionSync() {
	const { positionName, nodeName, handleSync } = useSelectedPointsSync();
	const handleClose = () => {
		closeModal(RegisteredModals.PrintFormPositionSync);
	};

	const handleConfirm = () => {
		handleSync();
		handleClose();
	};
	return (
		<div className={styles.root}>
			<div className={styles.body}>
				<IconLink className={styles.icon_link} />
				<h3 className={styles.title}>Привязать узел дерева</h3>
				<div className={styles.subtitle}>
					Вы действительно хотите привязать узел &quot;
					{nodeName}&quot; к позиции отчета &quot;
					{positionName}&quot;?
				</div>
			</div>
			<div className={styles.controls}>
				<Button onClick={handleClose}>Отмена</Button>
				<Button onClick={handleConfirm}>Привязать</Button>
			</div>
		</div>
	);
}

export default PrintFormPositionSync;
