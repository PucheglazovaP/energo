import { Panel } from '@evraz/ui-kit';
import clsx from 'clsx';

import EnergyResourceSelectorWithTitle from '../../Containers/EnergyResourceSelectorWithTitle/EnergyResourceSelectorWithTitle';
import ParameterByValueTable from '../../Containers/ParameterByValueTable';
import usePageWithEnergyResources from '../../Facades/EnergyResources/usePageWithEnergyResources';

import styles from './PageReportByParameters.module.css';

function PageReportByParameters() {
	const { energyResources, onChangeEnergyResource } =
		usePageWithEnergyResources();

	return (
		<main className={clsx('page', styles.root)}>
			<Panel
				className={styles.common}
				title={' '}
				renderTitleLeft={() =>
					EnergyResourceSelectorWithTitle({
						energyResources,
						onChangeEnergyResource,
						title: 'Параметры приборных и вычисляемых величин',
					})
				}
			>
				<div className={styles.container}>
					<ParameterByValueTable />
				</div>
			</Panel>
		</main>
	);
}

export default PageReportByParameters;
