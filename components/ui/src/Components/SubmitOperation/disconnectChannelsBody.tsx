import { DeleteItem } from './types';
import styles from './SubmitOperation.module.scss';
export function disconnectChannelsBody({
	channelsCount = 1,
	channels = '',
}: DeleteItem) {
	return (
		<div className={styles.text}>
			<span className={styles.text__bold}>
				{channelsCount > 1 ? 'Каналы ' : 'Канал '}
				{channels}
			</span>{' '}
			{channelsCount > 1
				? 'будут отключены от приборов'
				: 'будет отключен от прибора'}
		</div>
	);
}
