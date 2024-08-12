import { Button } from '@evraz/ui-kit';

import Input from '../../UI/Input';

import PrintFormEditorField from './Partials/PrintFormEditorField';
import { PrintFormEditorProps } from './types';
import usePrintFormEditor from './usePrintFormEditor';

import styles from './PrintFormEditor.module.css';

function PrintFormEditor(props: PrintFormEditorProps) {
	const { action } = props;

	const {
		formByPeriodName,
		comment,
		name,
		onCancel,
		onSave,
		onChangeComment,
		onChangeName,
	} = usePrintFormEditor(action);

	return (
		<div className={styles.editor}>
			<PrintFormEditorField
				heading="Форма отчета за период"
				title={formByPeriodName}
			/>
			<Input
				isRequired
				placeholder="Введите текст..."
				label={'Наименование'}
				value={name}
				onChange={onChangeName}
			/>
			<Input
				placeholder={'Введите комментарий...'}
				label={'Комментарий'}
				value={comment}
				onChange={onChangeComment}
			/>
			<div className={styles.editor__controllers}>
				<Button onClick={onCancel}>Отменить</Button>
				<Button onClick={onSave} primary>
					Сохранить
				</Button>
			</div>
		</div>
	);
}

export default PrintFormEditor;
