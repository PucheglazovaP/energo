import { Button, Input } from '@evraz/ui-kit';
import clsx from 'clsx';

import { ModalCreateEditNodeNSIProps } from './types';
import useCreateEditNodeNSI from './useCreateEditNodeNSI';

import styles from './ModalCreateEditNodeNSI.module.css';

function ModalCreateEditNodeNSI({
	isEditMode = false,
	className,
	style,
}: ModalCreateEditNodeNSIProps) {
	const {
		nodeName,
		isConfirmButtonDisabled,
		handleNodeNameChange,
		handleConfirm,
		handleClose,
	} = useCreateEditNodeNSI(isEditMode);

	return (
		<div className={clsx(styles.root, className)} style={style}>
			<Input
				required
				placeholder="Введите наименование..."
				className={styles.input}
				caption="Наименование узла"
				value={nodeName}
				onChange={handleNodeNameChange}
			/>
			<div className={styles.buttons_row}>
				<Button className={styles.button} onClick={handleClose}>
					Отменить
				</Button>
				<Button
					className={styles.button}
					primary
					disabled={isConfirmButtonDisabled}
					onClick={handleConfirm}
				>
					Сохранить
				</Button>
			</div>
		</div>
	);
}

export default ModalCreateEditNodeNSI;
