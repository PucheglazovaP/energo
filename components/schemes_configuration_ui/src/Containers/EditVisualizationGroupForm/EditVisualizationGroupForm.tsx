import { Button } from '@evraz/ui-kit';

import { EditTextName } from '../../Models/EditVisualizationGroupForm/types';
import Input from '../../UI/Input';

import { useEditGroupForm } from './useEditVisualizationGroupForm';

import styles from './EditVisualizationGroupForm.module.css';

function EditVisualizationGroupForm() {
	const {
		onCloseModal,
		onSaveGroup,
		editVisualizationGroupData: { name, shortName, comment },
		handleChangeTextValue,
		isFormChanged,
	} = useEditGroupForm();

	return (
		<div>
			<section className={styles.fields}>
				<div className={styles.side_left}>
					<Input
						isRequired
						label="Полное наименование"
						placeholder="Введите текст..."
						name={EditTextName.Name}
						value={name}
						onChange={handleChangeTextValue}
						className={styles.text}
					/>
					<Input
						isRequired
						label="Короткое наименование"
						placeholder="Введите текст..."
						name={EditTextName.ShortName}
						value={shortName}
						onChange={handleChangeTextValue}
						className={styles.text}
					/>
					<div>
						<p className={styles.comment_title}>Комментарий</p>
						<textarea
							className={styles.comment}
							placeholder="Введите комментарий..."
							name={EditTextName.Comment}
							value={comment}
							onChange={handleChangeTextValue}
						/>
					</div>
				</div>
			</section>
			<div className={styles.controls}>
				<Button onClick={onCloseModal}>Отменить</Button>
				<Button
					disabled={!name || !shortName || !isFormChanged}
					onClick={onSaveGroup}
					primary
				>
					Сохранить
				</Button>
			</div>
		</div>
	);
}

export default EditVisualizationGroupForm;
