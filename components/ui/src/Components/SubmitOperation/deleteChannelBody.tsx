import { DeleteItem } from './types';
import styles from './SubmitOperation.module.scss';

export function deleteChannelBody({ itemNumber, itemName }: DeleteItem) {
	return (
		<div className={styles.text}>
			<span className={styles.text__bold}> Канал {itemNumber}</span> &quot;
			{itemName}&quot; будет безвозвратно удален
		</div>
	);
}
