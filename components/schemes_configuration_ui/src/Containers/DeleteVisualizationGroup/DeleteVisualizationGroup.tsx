import { Button, CircleDelete } from '@evraz/ui-kit';

import { useDeleteVisualizationGroup } from './useDeleteVisualizationGroup';

import styles from './DeleteVisualizationGroup.module.css';

function DeleteVisualizationGroup() {
	const { handleCloseModal, handleConfirmDelete } =
		useDeleteVisualizationGroup();

	return (
		<div className={styles.root}>
			<div className={styles.body}>
				<CircleDelete className={styles.icon_delete} />
				<h3 className={styles.title}>Удаление</h3>
				<h5 className={styles.subtitle}>
					Вы действительно хотите удалить группу?
				</h5>
			</div>
			<div className={styles.controls}>
				<Button onClick={handleCloseModal}>Отмена</Button>
				<Button onClick={handleConfirmDelete}>Удалить</Button>
			</div>
		</div>
	);
}

export default DeleteVisualizationGroup;
