import Modal from '../../Components/Modal';
import Table from '../../Components/Table';
import { useAnalyticGroups } from '../../Hooks/useAnalyticGroups';

import styles from './AnalyticGroups.module.scss';

export function AnalyticGroups() {
	const { handleCloseAnalyticGroupsModal, analyticGroups, isLoading } =
		useAnalyticGroups(styles);

	return (
		<Modal
			title={'Список аналитиков'}
			onClose={handleCloseAnalyticGroupsModal}
			className={styles.modal}
		>
			<Table
				header={analyticGroups.header}
				rows={analyticGroups.rows}
				isLoading={isLoading}
				className={styles.table}
			/>
		</Modal>
	);
}
