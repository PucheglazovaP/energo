import { Button, CircleDelete } from '@evraz/ui-kit';

import { useHeatingSeasonDelete } from './useHeatingSeasonDelete';

import styles from './HeatingSeasons.module.css';

function HeatingSeasonAddUpdateModalBody() {
	const { onCloseModal, onConfirmDeletion } = useHeatingSeasonDelete();

	return (
		<div className={styles.modal_body}>
			<div className={styles.delete_container}>
				<CircleDelete className={styles.icon_delete} />
				<h5 className={styles.subtitle}>
					Вы действительно хотите удалить период отопительного сезона?
				</h5>
			</div>
			<div className={styles.buttons}>
				<Button onClick={onCloseModal}>Отмена</Button>
				<Button onClick={onConfirmDeletion}>Удалить</Button>
			</div>
		</div>
	);
}

export default HeatingSeasonAddUpdateModalBody;
