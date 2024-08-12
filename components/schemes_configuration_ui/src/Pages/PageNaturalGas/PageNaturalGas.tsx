import { Panel } from '@evraz/ui-kit';
import clsx from 'clsx';

import ReportPreview from '../../Containers/ReportPreview/ReportPreview';
import usePageWithEnergyResources from '../../Facades/EnergyResources/usePageWithEnergyResources';

import usePageNaturalGas from './usePageNaturalGas';

import styles from './PageNaturalGas.module.css';

function PageNaturalGas() {
	const { energyResourceId } = usePageWithEnergyResources();

	const { url } = usePageNaturalGas(energyResourceId);

	return (
		<main className={clsx('page', styles.root)}>
			<Panel className={styles.common} title={'Природный газ'}>
				<ReportPreview url={url} />
			</Panel>
		</main>
	);
}

export default PageNaturalGas;
