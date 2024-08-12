import { Panel } from '@evraz/ui-kit';
import clsx from 'clsx';

import EnergyResourceSelectorWithTitle from '../../Containers/EnergyResourceSelectorWithTitle/EnergyResourceSelectorWithTitle';
import ReportPreview from '../../Containers/ReportPreview/ReportPreview';
import usePageWithEnergyResources from '../../Facades/EnergyResources/usePageWithEnergyResources';

import usePageReportByCorrectionLog from './usePageReportByCorrectionLog';

import styles from './PageReportByCorrectionLog.module.css';

function PageReportByCorrectionLog() {
	const { energyResources, onChangeEnergyResource } =
		usePageWithEnergyResources();

	const { url } = usePageReportByCorrectionLog(energyResources);

	return (
		<main className={clsx('page', styles.root)}>
			<Panel
				className={styles.common}
				title={' '}
				renderTitleLeft={() =>
					EnergyResourceSelectorWithTitle({
						energyResources,
						onChangeEnergyResource,
						title: 'Журнал коррекций',
					})
				}
			>
				<ReportPreview url={url} />
			</Panel>
		</main>
	);
}

export default PageReportByCorrectionLog;
