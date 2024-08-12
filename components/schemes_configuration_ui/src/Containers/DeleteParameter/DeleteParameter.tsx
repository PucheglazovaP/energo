import { Button, CircleDelete } from '@evraz/ui-kit';

import { useDeleteParameter } from './useDeleteParameter';

import styles from './DeleteParameter.module.css';

function DeleteParameter() {
	const { handleCloseModal, handleConfirmDelete } = useDeleteParameter();

	return (
		<div className={styles.root}>
			<div className={styles.body}>
				<CircleDelete className={styles.icon_delete} />
				<h3 className={styles.title}>Удаление</h3>
				<h5 className={styles.subtitle}>
					Вы действительно хотите удалить параметр?
				</h5>
			</div>
			<div className={styles.controls}>
				<Button onClick={handleCloseModal}>Отмена</Button>
				<Button onClick={handleConfirmDelete}>Удалить</Button>
			</div>
		</div>
	);
}

export default DeleteParameter;
