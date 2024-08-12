import { DeleteItem } from './types';
import styles from './SubmitOperation.module.scss';

export function deleteDeviceBody({ itemNumber, itemName }: DeleteItem) {
	return (
		<div className={styles.text}>
			<span className={styles.text__bold}> Прибор {itemNumber}</span> &quot;
			{itemName}&quot; будет безвозвратно удален
		</div>
	);
}
