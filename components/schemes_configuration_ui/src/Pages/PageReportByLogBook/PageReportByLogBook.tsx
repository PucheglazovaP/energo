import { Panel } from '@evraz/ui-kit';
import clsx from 'clsx';

import EnergyResourceSelectorWithTitle from '../../Containers/EnergyResourceSelectorWithTitle/EnergyResourceSelectorWithTitle';
import ReportPreview from '../../Containers/ReportPreview/ReportPreview';
import usePageWithEnergyResources from '../../Facades/EnergyResources/usePageWithEnergyResources';
import { Edit } from '../../Icons';

import usePageReportByLogBook from './usePageReportByLogBook';

import styles from './PageReportByLogBook.module.css';

function PageReportByLogBook() {
	const { energyResources, energyResourceId, onChangeEnergyResource } =
		usePageWithEnergyResources();

	const { url, handleOpenModal } = usePageReportByLogBook(energyResourceId);

	return (
		<main className={clsx('page', styles.root)}>
			<Panel
				className={styles.common}
				title={' '}
				renderTitleLeft={() =>
					EnergyResourceSelectorWithTitle({
						energyResources,
						onChangeEnergyResource,
						title: 'Журнал учета',
					})
				}
			>
				<ReportPreview url={url} />
				<button
					onClick={handleOpenModal}
					title={'Редактировать форму'}
					className={styles.edit}
				>
					<Edit />
				</button>
			</Panel>
		</main>
	);
}

export default PageReportByLogBook;
