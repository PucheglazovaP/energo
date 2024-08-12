import { useStore } from 'effector-react';

import { $devicesURSV510 } from '../../../Models/Devices';
import { Device } from '../../../Models/Devices/types';
import { closeModal } from '../../../Models/Modal/events';
import { setPrintFormPriorityInfo } from '../../../Models/PrintForms/events';
import { $treeModal } from '../../../Models/TreeModal';
import { RegisteredModals } from '../../../Shared/modalsConfig';

function usePriorityMethodByArchive() {
	const { deviceId } = useStore($treeModal);
	const { list: USRVDevicesList } = useStore($devicesURSV510);

	const onClose = () => {
		closeModal(RegisteredModals.PickPriorityMethodByArchive);
	};

	const onApply = () => {
		const device: Device | undefined = USRVDevicesList.find(
			(d) => d.id === deviceId,
		);

		if (!device) {
			return;
		}
		setPrintFormPriorityInfo({
			deviceId: device.id,
			deviceName: device.name,
		});
		closeModal(RegisteredModals.PickPriorityMethodByArchive);
	};

	return {
		onClose,
		onApply,
	};
}

export default usePriorityMethodByArchive;
