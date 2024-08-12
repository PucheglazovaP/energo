import { Tooltip } from '@evraz/ui-kit';
import clsx from 'clsx';

import { Comment } from '../../../../Icons';
import { TooltipDirection } from '../../../../Shared/types';

import styles from '../PrintFormsList.module.css';

type PrintFormsListItemProps = {
	title: string;
	comment: string;
};

function PrintFormsListItem(props: PrintFormsListItemProps) {
	const { title, comment } = props;
	return (
		<span className={styles.list__item}>
			<span className={styles.list__item__title}>{title}</span>
			<Tooltip
				tooltip={comment}
				direction={TooltipDirection.Left}
				disabled={!comment}
			>
				<span>
					<Comment
						className={clsx(
							styles.list__icon,
							comment && styles.list__icon__active,
						)}
					/>
				</span>
			</Tooltip>
		</span>
	);
}

export default PrintFormsListItem;
