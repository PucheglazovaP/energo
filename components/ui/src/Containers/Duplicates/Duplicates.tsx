import { useSelector } from 'react-redux';
import clsx from 'clsx';

import { useAppSelector } from '../../Hooks/Store/useAppSelector';
import { useFindDuplicates } from '../../Hooks/useFindDuplicates';
import {
	selectContextMenuId,
	selectContextMenuItemTitle,
} from '../../Store/reducers/ContextMenuSlice/contextMenuSelectors';

import DuplicatesRendering from './DuplicatesRendering';
import ModalClose from './ModalClose';
import { DuplicatesProps } from './types';

import styles from './Duplicates.module.css';

function Duplicates({ className, style }: DuplicatesProps): JSX.Element {
	const { closeDuplicatesModal } = useFindDuplicates();
	const id = useAppSelector(selectContextMenuId);
	const itemTitle = useAppSelector(selectContextMenuItemTitle);

	const duplicatesNumber = useSelector(
		(state: any) => state.duplicatesReducer.DuplicatesNumber,
	);

	let data: Array<[]> = [];
	if (Array.isArray(duplicatesNumber)) {
		data = duplicatesNumber;
	} else {
		data;
	}

	return (
		<div className={clsx(styles.root, className)} style={style}>
			<div className={clsx(styles.data_location)}>
				<div>
					<h1 className={clsx(styles.data_location_h1)}>Дубликаты</h1>
					<p className={clsx(styles.data_location_p)}>
						Группа {id} {itemTitle}
					</p>
				</div>
				<ModalClose onClose={closeDuplicatesModal} />
			</div>

			<DuplicatesRendering data={data} />
		</div>
	);
}

export default Duplicates;
