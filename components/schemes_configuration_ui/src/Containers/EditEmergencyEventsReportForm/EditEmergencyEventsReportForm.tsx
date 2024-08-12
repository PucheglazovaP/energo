import { Button } from '@evraz/ui-kit';
import clsx from 'clsx';

import { Plus } from '../../Icons';
import CheckMark from '../../Icons/CheckMark';
import { setEditMode } from '../../Models/EmergencyEvents/events';
import Table from '../../UI/Table';

import SupHeader from './SupHeader';
import ReportFormProps from './types';
import useEditEmergencyEventsReportForm from './useEditEmergencyEventsReportForm';

import styles from './EditEmergencyEventsReportForm.module.css';

function EditEmergencyEventsReportForm({ className }: ReportFormProps) {
	const {
		header,
		data,
		activeNodeInfo,
		activeRowIndex,
		handleCreateCriterion,
		isCreateCriterionBtnDisabled,
	} = useEditEmergencyEventsReportForm();

	return (
		<div className={clsx(styles.root, className)}>
			<section className={styles.btns}>
				{activeNodeInfo?.isLast && (
					<Button
						className={styles.button}
						onClick={handleCreateCriterion}
						disabled={isCreateCriterionBtnDisabled}
					>
						<Plus className={styles.icon} /> Новая строка
					</Button>
				)}
				<Button
					className={styles.close}
					onClick={() => {
						setEditMode(false);
					}}
				>
					<CheckMark />
					<p>Завершить</p>
				</Button>
			</section>
			{activeNodeInfo?.isLast && (
				<Table
					className={styles.table}
					headers={header}
					data={data}
					renderSupHeaderFn={() => <SupHeader />}
					activeIndex={activeRowIndex}
				/>
			)}
		</div>
	);
}

export default EditEmergencyEventsReportForm;
