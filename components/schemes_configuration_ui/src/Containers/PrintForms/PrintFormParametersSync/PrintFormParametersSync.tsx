import { Button, Select } from '@evraz/ui-kit';
import clsx from 'clsx';

import usePrintFormParametersSync from './usePrintFormParametersSync';

import styles from './PrintFormParametersSync.module.css';

function PrintFormParametersSync() {
	const {
		selectedOption,
		setSelectedOption,
		parametersOptions,
		handleConfirm,
		handleClose,
	} = usePrintFormParametersSync();

	return (
		<div className={clsx(styles.root)}>
			<Select
				options={parametersOptions}
				value={selectedOption?.id}
				onChange={setSelectedOption}
				className={styles.dropdown}
				placeholder="Выберите параметр..."
				label="Параметр"
				required
			/>
			<div className={styles.buttons_row}>
				<Button className={styles.button} onClick={handleClose}>
					Отменить
				</Button>
				<Button
					className={styles.button}
					disabled={!selectedOption}
					onClick={handleConfirm}
					primary
				>
					Продолжить
				</Button>
			</div>
		</div>
	);
}

export default PrintFormParametersSync;
