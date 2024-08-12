import { useCallback, useState } from 'react';
import { useStore } from 'effector-react';

import { $user } from '../../Models/Auth';
import { closeModal } from '../../Models/Modal/events';
import { $contextMenuId } from '../../Models/Points';
import { addPointChannelFx } from '../../Models/Points/effects';
import { $treeModal } from '../../Models/TreeModal';
import { RegisteredModals } from '../../Shared/modalsConfig';
import { TreeTypes } from '../../Shared/types';
import { ModuleName } from '../../Shared/Types/moduleName';

export function usePointChannelsTreeModal() {
	const user = useStore($user);
	const contextMenuId = useStore($contextMenuId);
	const { channelId } = useStore($treeModal);
	const [selectedType, setSelectedType] = useState<TreeTypes>(
		TreeTypes.Devices,
	);
	const handleClose = useCallback(() => {
		closeModal(RegisteredModals.PointChannelsTreeModal);
	}, [RegisteredModals]);

	const handleSubmit = useCallback(() => {
		addPointChannelFx({
			pointId: contextMenuId,
			channelNumber: channelId as number,
			userId: String(user?.preferredUsername),
			moduleName: ModuleName.UsePointChannelsTreeModal_addPointChannelFx,
		});
		closeModal(RegisteredModals.PointChannelsTreeModal);
	}, [contextMenuId, channelId, user]);

	return {
		handleClose,
		handleSubmit,
		selectedType,
		setSelectedType,
		channelId,
	};
}
