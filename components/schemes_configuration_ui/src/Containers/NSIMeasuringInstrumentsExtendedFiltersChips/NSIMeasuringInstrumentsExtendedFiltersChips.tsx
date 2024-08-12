import { Button } from '@evraz/ui-kit';
import clsx from 'clsx';

import { Close } from '../../Icons';

import useExtendedFiltersChips from './useExtendedFiltersChips';

import styles from './NSIMeasuringInstrumentsExtendedFiltersChips.module.css';

function NSIMeasuringInstrumentsExtendedFiltersChips() {
	const {
		isUserStatusesChipShown,
		isInstrumentTypesChipShown,
		instrumentTypeChipLabel,
		userStatusChipLabel,
		isCommonChipShown,
		handleInstrumentTypesFilterClear,
		handleUserStatusesFilterClear,
		handleExtendedFilterClear,
	} = useExtendedFiltersChips();

	return (
		<div className={clsx(styles.root)}>
			{isUserStatusesChipShown && (
				<div className={styles.chip}>
					<div
						className={styles.chip_label}
					>{`Статус: ${userStatusChipLabel}`}</div>
					<Button
						className={styles.delete_button}
						onClick={handleUserStatusesFilterClear}
					>
						<Close className={styles.close_icon} />
					</Button>
				</div>
			)}
			{isInstrumentTypesChipShown && (
				<div className={styles.chip}>
					<div
						className={styles.chip_label}
					>{`Вид измерения: ${instrumentTypeChipLabel}`}</div>
					<Button
						className={styles.delete_button}
						onClick={handleInstrumentTypesFilterClear}
					>
						<Close className={styles.close_icon} />
					</Button>
				</div>
			)}
			{isCommonChipShown && (
				<Button
					className={styles.clear_all_filters_button}
					onClick={handleExtendedFilterClear}
				>
					Сбросить фильтры
					<Close className={styles.close_icon} />
				</Button>
			)}
		</div>
	);
}

export default NSIMeasuringInstrumentsExtendedFiltersChips;
