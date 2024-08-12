import React from 'react';
import { Button } from '@evraz/ui-kit';
import clsx from 'clsx';

import { EditTextName } from '../../Models/Reports/types';
import Input from '../../UI/Input';

import { useEditReferenceByReportForm } from './useEditReferenceByReportForm';

import styles from './EditReferenceByReportForm.module.css';

function EditReferenceByReportForm() {
	const { onCloseModal, onSaveReport, editReportData, handleChangeTextValue } =
		useEditReferenceByReportForm();
	const { name, comment } = editReportData;
	return (
		<div>
			<section className={styles.fields}>
				<Input
					isRequired
					label="Наименование"
					placeholder="Введите текст..."
					name={EditTextName.Name}
					value={name}
					onChange={(e) => handleChangeTextValue(e, EditTextName.Name)}
					className={styles.text}
				/>
				<aside className={styles.textarea}>
					<label className={clsx(styles.label)} htmlFor="comment">
						<span>Комментарий</span>
					</label>
					<textarea
						className={styles.comment}
						name={EditTextName.Comment}
						value={comment}
						onChange={(e) => handleChangeTextValue(e, EditTextName.Comment)}
					/>
				</aside>
			</section>
			<div className={styles.controls}>
				<Button onClick={onCloseModal}>Закрыть</Button>
				<Button disabled={!editReportData.name} onClick={onSaveReport} primary>
					Сохранить
				</Button>
			</div>
		</div>
	);
}

export default EditReferenceByReportForm;
