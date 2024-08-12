import { Button } from '@evraz/ui-kit';

import Plus from '../../Icons/Plus';

import { AnalyticRangesProps } from './types';
import styles from './AnalyticGroups.module.scss';
export function AnalyticRanges({
	onCreateRange,
	isButtonDisabled,
}: AnalyticRangesProps) {
	return (
		<tr className={styles.analyticRange}>
			<td>
				<h3>Доступные диапазоны</h3>
				<Button
					className={styles.analyticRange__button}
					onClick={onCreateRange}
					disabled={isButtonDisabled}
				>
					<Plus
						className={
							isButtonDisabled ? styles.analyticRange__icon_disabled : ''
						}
					/>
					<span>Добавить</span>
				</Button>
			</td>
		</tr>
	);
}
