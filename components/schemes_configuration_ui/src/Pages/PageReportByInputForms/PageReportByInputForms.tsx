import { Panel } from '@evraz/ui-kit';
import clsx from 'clsx';

import EnergyResourceSelectorWithTitle from '../../Containers/EnergyResourceSelectorWithTitle/EnergyResourceSelectorWithTitle';
import InputFormTable from '../../Containers/InputFormTable';
import usePageWithEnergyResources from '../../Facades/EnergyResources/usePageWithEnergyResources';

import styles from './PageReportByInputForms.module.css';

function PageReportByInputForms() {
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
						title: 'Форма ввода',
					})
				}
			>
				<div className={styles.container}>
					<InputFormTable />
				</div>
			</Panel>
		</main>
	);
}

export default PageReportByInputForms;
