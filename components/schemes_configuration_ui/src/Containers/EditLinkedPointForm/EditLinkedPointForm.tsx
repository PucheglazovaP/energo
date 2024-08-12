import React from 'react';
import { Button } from '@evraz/ui-kit';

import Table from '../../UI/Table';

import { EditLinkedPointFormProps } from './types';
import { useEditLinkedPointForm } from './useEditLinkedPointForm';

import styles from './EditLinkedPointForm.module.css';

function EditLinkedPointForm({ from }: EditLinkedPointFormProps) {
	const { handleCloseModal, handleSubmit, pointsData, header } =
		useEditLinkedPointForm(from);

	return (
		<div>
			<section className={styles.linked_points}>
				<Table
					className={styles.linked_points_table}
					headers={header}
					data={pointsData}
				/>
			</section>
			<div className={styles.controls}>
				<Button onClick={handleCloseModal}>Отменить</Button>
				<Button onClick={handleSubmit} primary>
					Применить
				</Button>
			</div>
		</div>
	);
}

export default EditLinkedPointForm;
