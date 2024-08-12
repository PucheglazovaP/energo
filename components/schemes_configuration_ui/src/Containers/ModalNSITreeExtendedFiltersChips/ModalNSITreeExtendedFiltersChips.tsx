import { Button } from '@evraz/ui-kit';
import clsx from 'clsx';

import { Close } from '../../Icons';

import useExtendedFiltersChips from './useExtendedFiltersChips';

import styles from './ModalNSITreeExtendedFiltersChips.module.css';

function ModalNSITreeExtendedFiltersChips() {
	const { chips, isCommonChipShown, handleAllFiltersClear } =
		useExtendedFiltersChips();

	return (
		<div className={clsx(styles.root)}>
			{chips}
			{isCommonChipShown && (
				<Button
					className={styles.clear_all_filters_button}
					onClick={handleAllFiltersClear}
				>
					Сбросить фильтры
					<Close className={styles.close_icon} />
				</Button>
			)}
		</div>
	);
}

export default ModalNSITreeExtendedFiltersChips;
