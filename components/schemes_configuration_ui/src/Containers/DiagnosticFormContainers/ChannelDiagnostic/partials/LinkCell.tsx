import { Button } from '@evraz/ui-kit';
import clsx from 'clsx';

import { LinkCellProps } from '../types';

import styles from '../ChannelDiagnostic.module.css';

function LinkCell(props: LinkCellProps) {
	const { text, onClick, className, channelId, deviceId, serverId } = props;

	const handleClick = () => {
		if (onClick) {
			onClick({ channelId, serverId, deviceId });
		}
	};

	return (
		<Button className={clsx(styles.link, className)} onClick={handleClick}>
			{text}
		</Button>
	);
}

export default LinkCell;
