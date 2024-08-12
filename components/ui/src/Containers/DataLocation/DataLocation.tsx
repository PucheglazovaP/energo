import { useSelector } from 'react-redux';
import clsx from 'clsx';

import { useDataLocation } from '../../Hooks/useDataLocation';

import DataLocationRendering from './DataLocationRendering';
import ModalClose from './ModalClose';
import { DataLocationProps } from './types';

import styles from './DataLocation.module.css';

function DataLocation({ className, style }: DataLocationProps): JSX.Element {
	const { closeParametersModal } = useDataLocation();
	const dataLocation = useSelector(
		(state: any) => state.dataLocation.channelNumber,
	);
	const idItemTitle = useSelector((state: any) => state.contextMenuReducer);

	let data: Array<[]> = [];
	if (Array.isArray(dataLocation)) {
		data = dataLocation;
	} else {
		data;
	}

	return (
		<div className={clsx(styles.root, className)} style={style}>
			<div className={clsx(styles.data_location)}>
				<div>
					<h1 className={clsx(styles.data_location_h1)}>Расположение данных</h1>
					<p className={clsx(styles.data_location_p)}>
						Канал {idItemTitle.id} {idItemTitle.itemTitle}
					</p>
				</div>
				<ModalClose onClose={closeParametersModal} />
			</div>

			<DataLocationRendering data={data} />
		</div>
	);
}

export default DataLocation;
