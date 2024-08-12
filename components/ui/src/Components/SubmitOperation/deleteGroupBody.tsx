import { DeleteItem } from './types';
import styles from './SubmitOperation.module.scss';
export function deleteGroupBody({
	itemNumber,
	itemName,
	channelsCount,
}: DeleteItem) {
	return (
		<div className={styles.text}>
			<span className={styles.text__bold}>Группа {itemNumber}</span> &quot;
			{itemName}&quot; будет безвозвратно удалена. Количество каналов,
			включенных в группу: {channelsCount}
		</div>
	);
}
