import { Channel } from '../../../Models/Channels/types';
import RadioButton from '../../../UI/RadioButton';
import { getMethodColor } from '../../EditReportForm/utils';

import styles from '../PointChannelsTreeModal.module.css';

function ChannelNode({
	channel,
	selectedChannelId,
}: {
	channel: Channel;
	selectedChannelId: number | undefined;
}) {
	return (
		<p className={styles.node}>
			<RadioButton readOnly checked={selectedChannelId === channel.id} />
			<span className={styles.name}>{channel.name}</span>
			<span
				className={styles.method}
				style={{ backgroundColor: getMethodColor(channel.method) }}
			>
				{channel.method}
			</span>
		</p>
	);
}

export default ChannelNode;
