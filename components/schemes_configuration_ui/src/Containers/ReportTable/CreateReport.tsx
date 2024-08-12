import { Button, Calendar } from '@evraz/ui-kit';
import clsx from 'clsx';

import Select from '../../UI/Select';

import { usedTypes } from './constants';
import useCreateReport from './useCreateReport';

import styles from './ReportTable.module.css';

function CreateReport() {
	const {
		dates,
		setDates,
		onCancel,
		onConfirm,
		periodType,
		setPeriodTypeChange,
		hasHeatSystems,
		heatSystemOptions,
		setHeatSystemOptions,
	} = useCreateReport();

	return (
		<div className={styles.modal_body}>
			<Calendar
				className={clsx(
					styles.calendar_container,
					hasHeatSystems && styles.calendar_container__flattened,
				)}
				dates={dates}
				onSelect={setDates}
				usedTypes={usedTypes}
				type={periodType}
				onTypeChange={setPeriodTypeChange}
			/>
			{hasHeatSystems && (
				<div className={styles.heat_system}>
					<p className={styles.heat_system_text}>Номер теплосистемы</p>
					<div className={styles.heat_system_divider} />
					<Select
						options={heatSystemOptions}
						onSelect={setHeatSystemOptions}
						className={styles.selector}
					/>
				</div>
			)}
			<div className={styles.buttons}>
				<Button onClick={onCancel}>Отмена</Button>
				<Button onClick={onConfirm}>Подтвердить</Button>
			</div>
		</div>
	);
}

export default CreateReport;
