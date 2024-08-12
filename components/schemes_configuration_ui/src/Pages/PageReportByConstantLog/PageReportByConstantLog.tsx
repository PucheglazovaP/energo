import { Panel } from '@evraz/ui-kit';
import clsx from 'clsx';

import EnergyResourceSelectorWithTitle from '../../Containers/EnergyResourceSelectorWithTitle/EnergyResourceSelectorWithTitle';
import ReportPreview from '../../Containers/ReportPreview/ReportPreview';
import usePageWithEnergyResources from '../../Facades/EnergyResources/usePageWithEnergyResources';

import usePageReportByConstantLog from './usePageReportByConstantLog';

import styles from './PageReportByConstantLog.module.css';

function PageReportByConstantLog() {
	const { energyResources, onChangeEnergyResource, energyResourceId } =
		usePageWithEnergyResources();

	const { url } = usePageReportByConstantLog(energyResourceId);

	return (
		<main className={clsx('page', styles.root)}>
			<Panel
				className={styles.common}
				title={' '}
				renderTitleLeft={() =>
					EnergyResourceSelectorWithTitle({
						energyResources,
						onChangeEnergyResource,
						title: 'Журнал констант',
					})
				}
			>
				<ReportPreview url={url} />
			</Panel>
		</main>
	);
}

export default PageReportByConstantLog;
