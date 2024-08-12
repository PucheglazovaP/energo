import { Button } from '@evraz/ui-kit';

import {
	PositionAxis,
	PriorityMethodSource,
	TreeTypes,
} from '../../../Shared/types';
import Divider from '../../../UI/Divider';
import PointDevicesTree from '../../PointChannelsTreeModal/PointDevicesTree';
import PrintFormsURSVDevicesList from '../../PrintFormsURSVDevicesList';

import usePriorityMethod from './usePriorityMethod';

import styles from './PrintFormsPriorityMethodSource.module.css';

type PrintFormsPriorityMethodSourceProps = {
	from: PriorityMethodSource;
};

function PrintFormsPriorityMethodSource(
	props: PrintFormsPriorityMethodSourceProps,
) {
	const { from } = props;

	const { onClose, onApply } = usePriorityMethod(from);

	const mappedBy: TreeTypes =
		from === 'archive' ? TreeTypes.Devices : TreeTypes.Channels;

	return (
		<div className={styles.container}>
			{mappedBy === TreeTypes.Devices ? (
				<PrintFormsURSVDevicesList />
			) : (
				<PointDevicesTree mappedBy={mappedBy} />
			)}
			<Divider position={PositionAxis.Horizontal} className={styles.divider} />
			<div className={styles.controllers}>
				<Button onClick={onClose}>Отменить</Button>
				<Button onClick={onApply} primary>
					Применить
				</Button>
			</div>
		</div>
	);
}

export default PrintFormsPriorityMethodSource;
