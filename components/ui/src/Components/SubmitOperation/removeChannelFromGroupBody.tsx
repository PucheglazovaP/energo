import { DeleteItem } from './types';
import styles from './SubmitOperation.module.scss';
export function removeChannelFromGroupBody({
	itemNumber,
	itemName,
	subItemNumber,
	subItemName,
}: DeleteItem) {
	return (
		<div className={styles.text}>
			<span className={styles.text__bold}>Канал {itemNumber}</span> &quot;
			{itemName}&quot; будет безвозвратно удален из{' '}
			<span className={styles.text__bold}>Группы {subItemNumber}</span> &quot;
			{subItemName}&quot;
		</div>
	);
}
