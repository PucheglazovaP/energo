import { Button } from '@evraz/ui-kit';
import { useStore } from 'effector-react';

import { Close } from '../../Icons';
import { $groupInformationModal } from '../../Models/GroupInformationModal';
import { setChannelChartModalOpen } from '../../Models/GroupInformationModal/event';

import ChannelChartSection from './ChannelChartSection/ChannelChartSection';

import styles from './GroupInformation.module.css';

function ChannelChartModal() {
	const {
		modalInfo: { groupName },
		isChannelChartModalOpen,
	} = useStore($groupInformationModal);

	return (
		<>
			{isChannelChartModalOpen && (
				<div className={styles.modal}>
					<div className={styles.chart_modal_window}>
						<div className={styles.modal_title_section}>
							{' '}
							<h3 className={styles.modal_title}>
								Информация по каналу / {groupName}
							</h3>
							<Button
								onClick={() => {
									setChannelChartModalOpen(false);
								}}
								className={styles.close_btn}
							>
								<Close className={styles.icon} />
							</Button>
						</div>
						<ChannelChartSection />
					</div>
				</div>
			)}
		</>
	);
}

export default ChannelChartModal;
