import { useStore } from 'effector-react';

import $diagnosticCurrentModel from '../../../Models/DiagnosticCurrent';
import { setSelectedDeviceIdEvent } from '../../../Models/DiagnosticCurrent/events';
import RadioButton from '../../../UI/RadioButton/RadioButton';

import { DevicesStateTableRadioButtonCellProps } from './types';

import styles from './DevicesStateTable.module.css';

function DevicesStateTableRadioButtonCell({
	data,
}: DevicesStateTableRadioButtonCellProps) {
	const { deviceId = '' } = data;
	const { selectedDeviceId } = useStore($diagnosticCurrentModel);

	const handleButtonChange = () => {
		setSelectedDeviceIdEvent(deviceId);
	};

	return (
		<div className={styles.devices_radio_button_cell}>
			<RadioButton
				checked={deviceId === selectedDeviceId}
				onChange={handleButtonChange}
			/>
		</div>
	);
}

export default DevicesStateTableRadioButtonCell;
