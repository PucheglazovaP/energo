import { Panel } from '@evraz/ui-kit';
import clsx from 'clsx';

import EnergyResourceSelectorWithTitle from '../../Containers/EnergyResourceSelectorWithTitle/EnergyResourceSelectorWithTitle';
import ReportPreview from '../../Containers/ReportPreview/ReportPreview';

import useChannelsList from './useChannelsList';
import usePageStatisticalProcessing from './usePageStatisticalProcessing';

import styles from './PageStatisticalProcessing.module.css';

function PageStatisticalProcessing() {
	const { channelOptions, onChangeChannelOptions, selectedChannel } =
		useChannelsList();

	const url: string = usePageStatisticalProcessing(selectedChannel.value);

	return (
		<main className={clsx('page', styles.root)}>
			<Panel
				className={styles.common}
				title={' '}
				renderTitleLeft={() =>
					EnergyResourceSelectorWithTitle({
						energyResources: channelOptions,
						onChangeEnergyResource: onChangeChannelOptions,
						title: 'Узел учета',
						className: styles.channel_select,
					})
				}
			>
				<ReportPreview url={url} />
			</Panel>
		</main>
	);
}

export default PageStatisticalProcessing;
