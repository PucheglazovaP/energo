import { Button, CircleExclamatory } from '@evraz/ui-kit';

import { useEditInputFormBlocking } from './useEditInputFormBlocking';

import styles from './EditInputFormBlocking.module.css';

function EditInputFormBlocking() {
	const { handleCloseModal, errorMessage } = useEditInputFormBlocking();

	return (
		<div className={styles.root}>
			<div className={styles.body}>
				<CircleExclamatory className={styles.info} />
				<h3 className={styles.title}>Доступен только режим просмотра</h3>
				<h5 className={styles.subtitle}>{errorMessage}</h5>
			</div>
			<div className={styles.controls}>
				<Button onClick={handleCloseModal}>Понятно</Button>
			</div>
		</div>
	);
}

export default EditInputFormBlocking;
