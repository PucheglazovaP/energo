import { Calendar, Checkbox, Textarea } from '@evraz/ui-kit';
import clsx from 'clsx';

import { Close } from '../../../Icons';
import { IconCircleCheck, IconCircleCross } from '../../../UI/Icon';

import { PrintFormParameterValueFormProps } from './types';
import usePrintFormParameterValueForm from './usePrintFormParameterValueForm';

import styles from './PrintFormParameterValueForm.module.css';

function PrintFormParameterValueForm({
	className,
	style,
	isActive,
	valueId,
	valueName: name,
	dateFrom,
	dateTo,
}: PrintFormParameterValueFormProps) {
	const {
		dateFrom: valueDateFrom,
		dateTo: valueDateTo,
		isEndDateExists,
		valueName,
		handleIsEndDateExistsChange,
		handleValueNameChange,
		handleDateFromChange,
		handleDateToChange,
		handleFieldBlur,
		handleDelete,
	} = usePrintFormParameterValueForm(valueId, name, isActive, dateFrom, dateTo);

	return (
		<div className={clsx(styles.root, className)} style={style}>
			<div className={styles.fields_wrapper}>
				<div className={styles.field_wrapper}>
					<Textarea
						className={styles.textarea}
						value={valueName}
						onChange={handleValueNameChange}
						onBlur={handleFieldBlur}
						placeholder="Введите значение параметра"
					/>
				</div>
				<div className={styles.field_wrapper}>
					{isActive ? (
						<IconCircleCheck className={clsx(styles.icon, styles.icon_check)} />
					) : (
						<IconCircleCross className={clsx(styles.icon, styles.icon_cross)} />
					)}
				</div>
				<div className={styles.field_wrapper}>
					<Calendar
						dates={[valueDateFrom]}
						onSelect={handleDateFromChange}
						disableTypeSelector
						className={styles.calendar}
						disableManualInput={false}
						isCloseOnSelect={false}
						onClose={handleFieldBlur}
					/>
				</div>
				<div className={styles.field_wrapper}>
					<Checkbox
						isChecked={isEndDateExists}
						onChange={handleIsEndDateExistsChange}
						className={styles.checkbox}
					/>
					{isEndDateExists ? (
						<Calendar
							dates={[valueDateTo]}
							onSelect={handleDateToChange}
							disableTypeSelector
							disabled={!isEndDateExists}
							className={styles.calendar}
							disableManualInput={false}
							isCloseOnSelect={false}
							onClose={handleFieldBlur}
						/>
					) : (
						<div className={styles.no_end_date_message}>Дата не выбрана</div>
					)}
				</div>
			</div>
			<button
				type="button"
				onClick={handleDelete}
				className={styles.delete_button}
			>
				<Close className={styles.icon_close} />
			</button>
		</div>
	);
}

export default PrintFormParameterValueForm;
