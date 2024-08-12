import { Panel } from '@evraz/ui-kit';
import clsx from 'clsx';

import EnergyResourceSelectorWithTitle from '../../Containers/EnergyResourceSelectorWithTitle/EnergyResourceSelectorWithTitle';
import ReportPreview from '../../Containers/ReportPreview/ReportPreview';
import usePageWithEnergyResources from '../../Facades/EnergyResources/usePageWithEnergyResources';

import usePageReportByInstrumentation from './usePageReportByInstrumentation';

import styles from './PageReportByInstrumentation.module.css';

function PageReportByInstrumentation() {
	const { energyResources, onChangeEnergyResource, energyResourceId } =
		usePageWithEnergyResources();

	const { url } = usePageReportByInstrumentation(energyResourceId);

	return (
		<main className={clsx('page', styles.root)}>
			<Panel
				className={styles.common}
				title={' '}
				renderTitleLeft={() =>
					EnergyResourceSelectorWithTitle({
						energyResources,
						onChangeEnergyResource,
						title: 'Показания приборов',
					})
				}
			>
				<ReportPreview url={url} />
			</Panel>
		</main>
	);
}

export default PageReportByInstrumentation;
