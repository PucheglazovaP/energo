import { Button } from '@evraz/ui-kit';

import Edit from '../../Icons/Edit';
import Spinner from '../../UI/Spinner';
import Table from '../../UI/Table';

import { ReportTableProps } from './types';
import useReportTable from './useReportTable';

import styles from './ReportTable.module.css';

function ReportTable({ onCloseParameters, isEditMode }: ReportTableProps) {
	const { reportData, header, isLoading, activeRow } = useReportTable();

	return (
		<div className={styles.container}>
			{isEditMode && (
				<div className={styles.report_table__header}>
					<Button onClick={onCloseParameters} className={styles.header_button}>
						<Edit className={styles.icon_edit} />
						<span>Завершить</span>
					</Button>
				</div>
			)}
			{!isLoading ? (
				<div className={styles.table}>
					<Table
						headers={header}
						data={reportData}
						className={styles.report_table}
						activeIndex={activeRow}
					/>
				</div>
			) : (
				<Spinner className={styles.spinner} />
			)}
		</div>
	);
}

export default ReportTable;
