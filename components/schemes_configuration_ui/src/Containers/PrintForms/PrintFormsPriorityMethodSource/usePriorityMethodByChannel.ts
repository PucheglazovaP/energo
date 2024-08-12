import { useStore } from 'effector-react';

import { $channels } from '../../../Models/Channels';
import { Channel } from '../../../Models/Channels/types';
import { $devices } from '../../../Models/Devices';
import { Device } from '../../../Models/Devices/types';
import { closeModal } from '../../../Models/Modal/events';
import { setPrintFormPriorityInfo } from '../../../Models/PrintForms/events';
import { $treeModal } from '../../../Models/TreeModal';
import { RegisteredModals } from '../../../Shared/modalsConfig';

function usePriorityMethodByChannel() {
	const { channelId } = useStore($treeModal);
	const { list: channelsList } = useStore($channels);
	const { list: devicesList } = useStore($devices);
	const onClose = () => {
		closeModal(RegisteredModals.PickPriorityMethodByChannel);
	};

	const onApply = () => {
		const channel: Channel | undefined = channelsList.find(
			(ch) => ch.id === channelId,
		);
		if (!channel) {
			return;
		}
		const device: Device | undefined = devicesList.find(
			(d) => d.id === channel.deviceId,
		);
		if (!device) {
			return;
		}
		setPrintFormPriorityInfo({
			channelId: channel.id,
			channelName: channel.name,
			deviceId: device.id,
			deviceName: device.name,
			methodName: channel.method,
		});
		closeModal(RegisteredModals.PickPriorityMethodByChannel);
	};

	return {
		onClose,
		onApply,
	};
}

export default usePriorityMethodByChannel;
