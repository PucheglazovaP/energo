import { Button } from '@evraz/ui-kit';
import clsx from 'clsx';

import { Plus } from '../../../Icons';
import Divider from '../../../UI/Divider';

import usePrintFormParameterEdit from './usePrintFormParameterEdit';

import styles from './PrintFormParameterEdit.module.css';

function PrintFormParameterEdit() {
	const {
		paramName,
		valuesList,
		isAddValueButtonDisabled,
		handleConfirm,
		handleValueAdd,
	} = usePrintFormParameterEdit();

	return (
		<div className={clsx(styles.root)}>
			<div className={styles.param_name_row}>
				<div className={styles.subtitle}>Параметр</div>
				<div className={styles.param_name}>{paramName}</div>
			</div>
			<div className={styles.param_values_row}>
				<div className={styles.param_values_title_row}>
					<div className={styles.title}>Значения параметра</div>
					<Divider className={styles.divider} />
					<Button
						className={styles.add_value_button}
						onClick={handleValueAdd}
						disabled={isAddValueButtonDisabled}
					>
						<Plus className={styles.icon_plus} /> Добавить
						{isAddValueButtonDisabled}
					</Button>
				</div>
				<div className={styles.values_table}>
					<div className={styles.values_table_header}>
						<div className={styles.values_table_header_cell}>Значение</div>
						<div className={styles.values_table_header_cell}>Статус</div>
						<div className={styles.values_table_header_cell}>Начало</div>
						<div className={styles.values_table_header_cell}>Окончание</div>
						<div
							className={clsx(
								styles.values_table_header_cell__empty,
								styles.values_table_header_cell,
							)}
						></div>
					</div>
					<div className={styles.value_table_body}>{valuesList}</div>
				</div>
			</div>
			<div className={styles.buttons_row}>
				<Button
					primary
					onClick={handleConfirm}
					className={styles.confirm_button}
				>
					Завершить
				</Button>
			</div>
		</div>
	);
}

export default PrintFormParameterEdit;
