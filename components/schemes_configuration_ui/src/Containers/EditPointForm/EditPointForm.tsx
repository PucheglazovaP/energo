import React from 'react';
import { Button } from '@evraz/ui-kit';

import { EditTextName } from '../../Models/Points/types';
import Input from '../../UI/Input';
import LinkedPointTableParam from '../LinkedPointTableParam/LinkedPointTableParam';

import { useEditPointForm } from './useEditPointForm';

import styles from './EditPointForm.module.css';

function EditPointForm() {
	const {
		onCloseModal,
		onSavePoint,
		editPointData,
		handleChangeTextValue,
		header,
		data,
		handleUnbindPoint,
		handleEditLinkedPoint,
	} = useEditPointForm();
	const { name, shortName, comment, captionName } = editPointData;

	return (
		<div>
			<section className={styles.fields}>
				<div className={styles.side_left}>
					<Input
						isRequired
						label="Полное наименование ТУ"
						name={EditTextName.Name}
						value={name}
						onChange={(e) => handleChangeTextValue(e, EditTextName.Name)}
						className={styles.text}
					/>
					<Input
						isRequired
						label="Короткое наименование ТУ"
						name={EditTextName.ShortName}
						value={shortName}
						onChange={(e) => handleChangeTextValue(e, EditTextName.ShortName)}
						className={styles.text}
					/>
					<Input
						label="Наименование в отчете"
						name={EditTextName.CaptionName}
						value={captionName}
						onChange={(e) => handleChangeTextValue(e, EditTextName.CaptionName)}
						className={styles.text}
					/>
				</div>
				<aside>
					<textarea
						className={styles.comment}
						name={EditTextName.Comment}
						value={comment}
						onChange={(e) => handleChangeTextValue(e, EditTextName.Comment)}
					/>
				</aside>
			</section>
			<LinkedPointTableParam
				data={data}
				header={header}
				handleEditLinkedPoint={handleEditLinkedPoint}
				handleUnbindPoint={handleUnbindPoint}
				isUnbindMode
			/>
			<div className={styles.controls}>
				<Button onClick={onCloseModal}>Закрыть</Button>
				<Button disabled={!name || !shortName} onClick={onSavePoint} primary>
					Сохранить
				</Button>
			</div>
		</div>
	);
}

export default EditPointForm;
