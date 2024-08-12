import { Button, Textarea } from '@evraz/ui-kit';
import clsx from 'clsx';

import Input from '../../UI/Input';

import { CreateSystemLayerProps } from './types';
import useCreateSystemLayer from './useCreateSystemLayer';

import styles from './CreateSystemLayer.module.css';

function CreateSystemLayer({ className, style }: CreateSystemLayerProps) {
	const {
		comment,
		name,
		handleCommentChange,
		handleConfirm,
		handleCancel,
		handleNameChange,
	} = useCreateSystemLayer();

	return (
		<div className={clsx(styles.root, className)} style={style}>
			<Input
				isRequired
				label="Наименование"
				placeholder={'Введите текст'}
				value={name}
				onChange={handleNameChange}
				className={clsx(styles.input, styles.accounting_node_parameter)}
			/>
			<div className={styles.field_wrapper}>
				<div className={styles.label}>Комментарий</div>
				<Textarea
					value={comment}
					className={styles.textarea}
					onChange={handleCommentChange}
					placeholder="Введите текст..."
				/>
			</div>
			<div className={styles.buttons_row}>
				<Button className={styles.button} onClick={handleCancel}>
					Отменить
				</Button>
				<Button
					className={styles.button}
					primary
					onClick={handleConfirm}
					disabled={!name}
				>
					Сохранить
				</Button>
			</div>
		</div>
	);
}

export default CreateSystemLayer;
