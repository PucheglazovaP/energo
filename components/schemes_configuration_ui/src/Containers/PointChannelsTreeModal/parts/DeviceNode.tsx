import { Device } from '../../../Models/Devices/types';
import RadioButton from '../../../UI/RadioButton';

import styles from '../PointChannelsTreeModal.module.css';

type DeviceNodeProps = {
	device: Device;
	selectedId?: number;
};

function DeviceNode(props: DeviceNodeProps) {
	const { device, selectedId } = props;
	return (
		<p className={styles.node}>
			<RadioButton
				readOnly
				checked={String(device.id) === String(selectedId)}
			/>
			<span className={styles.name}>{device.name}</span>
		</p>
	);
}

export default DeviceNode;
