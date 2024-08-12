import { useCallback, useEffect, useState } from 'react';
import { useStore } from 'effector-react';

import { devicesAdapter } from '../../Adapters/devicesAdapter';
import { getDevicesListQuery } from '../../Const/Queries/devices';
import { $user } from '../../Models/Auth';
import { Device } from '../../Models/Devices/types';
import { $editMode } from '../../Models/EditMode';
import { updateFormParameter } from '../../Models/EditMode/events';
import { closeModal } from '../../Models/Modal/events';
import { $navigation } from '../../Models/Navigation';
import { $treeModal } from '../../Models/TreeModal';
import { setTreeModal } from '../../Models/TreeModal/events';
import { TreeModal } from '../../Models/TreeModal/types';
import { RegisteredModals } from '../../Shared/modalsConfig';
import { OptimizedPagination, TreeTypes } from '../../Shared/types';
import { rpcQuery } from '../../Utils/requests';

export function useChannelsTreeForEditingFormModal() {
	const { id, formParameters } = useStore($editMode);
	const { channelId } = useStore($treeModal);
	const user = useStore($user);

	const [selectedType, setSelectedType] = useState<TreeTypes>(
		TreeTypes.Devices,
	);
	const handleClose = useCallback(() => {
		closeModal(RegisteredModals.ChannelsTreeForEditingFormModal);
	}, [RegisteredModals]);
	const { versionId } = useStore($navigation);

	const handleSubmit = useCallback(() => {
		const parameterCode =
			formParameters.find((item) => item.parameterName === 'csqlChannel')
				?.parameterCode || 0;

		updateFormParameter({
			formId: id || 0,
			value: String(channelId),
			parameterCode,
			parameterName: 'csqlChannel',
			versionCode: versionId || 90,
		});
		closeModal(RegisteredModals.ChannelsTreeForEditingFormModal);
	}, [channelId]);

	useEffect(() => {
		if (!user) return;
		const channelValue = formParameters.find(
			(item) => item.parameterName === 'csqlChannel',
		)?.value;
		rpcQuery<{
			devices: Device[];
			pagination: OptimizedPagination;
		}>(
			getDevicesListQuery({
				filterStr: String(channelValue),
				filterMode: 3,
				userId: user.preferredUsername,
			}),
			devicesAdapter,
		).then(({ devices, pagination: devicesPagination }) => {
			const foundNode = devices.find(
				(n) => n.order === devicesPagination.positionRow,
			);
			if (foundNode) {
				let treeParams: TreeModal = {
					serverId: foundNode.serverId,
					deviceId: foundNode.id,
					channelId: Number(channelValue),
				};
				setTreeModal(treeParams);
			}
		});
	}, []);

	return {
		handleClose,
		handleSubmit,
		selectedType,
		setSelectedType,
		channelId,
	};
}
