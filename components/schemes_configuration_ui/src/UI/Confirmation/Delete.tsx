import { Button, CircleDelete } from '@evraz/ui-kit';
import clsx from 'clsx';

import styles from './Confirmation.module.css';

function Delete({
	className = '',
	title,
	onClose,
	onDelete,
}: {
	className?: string;
	title: string;
	onClose: () => void;
	onDelete: () => void;
}) {
	return (
		<div className={clsx(styles['root'], className)}>
			<div className={styles.body}>
				<CircleDelete className={styles.icon_delete} />
				<h3 className={styles.title}>Удаление</h3>
				<h5 className={styles.subtitle}>{title}</h5>
			</div>
			<div className={styles.controls}>
				<Button onClick={onClose}>Отмена</Button>
				<Button onClick={onDelete}>Удалить</Button>
			</div>
		</div>
	);
}

export default Delete;
