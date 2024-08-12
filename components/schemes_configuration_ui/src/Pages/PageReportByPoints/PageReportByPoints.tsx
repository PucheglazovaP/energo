import { Panel } from '@evraz/ui-kit';
import clsx from 'clsx';

import EnergyResourceSelectorWithTitle from '../../Containers/EnergyResourceSelectorWithTitle/EnergyResourceSelectorWithTitle';
import PointsReports from '../../Containers/PointsReports/PointsReports';
import usePageWithEnergyResources from '../../Facades/EnergyResources/usePageWithEnergyResources';

import styles from './PageReportByPoints.module.css';

function PageReportByPoints() {
	const { energyResources, onChangeEnergyResource, baseHour } =
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
						baseHour,
						title: 'Базовые точки учета',
					})
				}
			>
				<div className={styles.wrapper}>
					<PointsReports />
				</div>
			</Panel>
		</main>
	);
}

export default PageReportByPoints;
