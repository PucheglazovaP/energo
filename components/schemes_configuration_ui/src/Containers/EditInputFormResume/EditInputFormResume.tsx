import { Button, CircleExclamatory } from '@evraz/ui-kit';

import { useEditInputFormResume } from './useEditInputFormResume';

import styles from './EditInputFormResume.module.css';

function EditInputFormResume() {
	const { handleResume, handleNew, errorMessage } = useEditInputFormResume();

	return (
		<div className={styles.root}>
			<div className={styles.body}>
				<CircleExclamatory className={styles.info} />
				<h3 className={styles.title}>
					Ранее вы уже редактировали данную форму
				</h3>
				<h5 className={styles.subtitle}>{errorMessage}</h5>
			</div>
			<div className={styles.controls}>
				<Button onClick={handleResume}>Открыть сессию</Button>
				<Button onClick={handleNew}>Открыть новую</Button>
			</div>
		</div>
	);
}

export default EditInputFormResume;
