import { GridTreeTable } from '@evraz/ui-kit';

import NotificationIcon from '../../Icons/Notification';
import FormulaViewer from '../../UI/FormulaEditor';
import Spinner from '../../UI/Spinner';

import ChannelChartModal from './ChannelChartModal';
import GroupFormulaModal from './GroupFormulaModal';
import useGroupTable from './useGroupTable';

import styles from './GroupInformation.module.css';

function GroupInformation() {
	const {
		isLoading,
		headers,
		tableData,
		contextMenuObject,
		formula,
		groupId,
		isGroupFormulaModalOpen,
	} = useGroupTable();

	return (
		<>
			<div className={styles.root}>
				<div className={styles.title}>
					{groupId} {contextMenuObject?.groupName}
				</div>
				{isLoading ? (
					<div className={styles.spinner}>
						<Spinner className={styles.loading} />
					</div>
				) : (
					<>
						{formula ? (
							<FormulaViewer formula={formula} className={styles.formula} />
						) : (
							<div className={styles.no_info}>
								<NotificationIcon className={styles.notification_icon} />
								<p>Для этой группы не назначена формула</p>
							</div>
						)}
						<div className={styles.table_wrapper}>
							<GridTreeTable
								columnsCount={9}
								header={headers}
								data={tableData}
								className={styles.table}
								style={{
									gridTemplateColumns: '350px repeat(8, 1fr)',
									borderRadius: '3px',
									marginBottom: '.5em',
								}}
							/>
						</div>
					</>
				)}
			</div>
			{isGroupFormulaModalOpen && <GroupFormulaModal />}
			<ChannelChartModal />
		</>
	);
}

export default GroupInformation;
