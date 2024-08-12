import { useCallback, useEffect } from 'react';
import { useStore } from 'effector-react';

import { pointChannelsAdapter } from '../../Adapters/Points/pointChannelsAdapter';
import { $user } from '../../Models/Auth';
import { $energyResourceId } from '../../Models/EnergyResources';
import { closeModal, openModal } from '../../Models/Modal/events';
import { $contextMenuId, $points } from '../../Models/Points';
import {
	deletePointChannelFx,
	editPointChannelFx,
	fetchPointChannelsListFx,
	fetchPointsListFx,
} from '../../Models/Points/effects';
import {
	DeleteParams,
	EditPointChannelParams,
} from '../../Models/Points/types';
import { RegisteredModals } from '../../Shared/modalsConfig';
import { ModuleName } from '../../Shared/Types/moduleName';

export function useEditPointLinkedChannels() {
	const user = useStore($user);
	const points = useStore($points);
	const contextMenuId = useStore($contextMenuId);
	const selectedPoint = points.find((point) => point.id === contextMenuId);
	const energyResourceId = useStore($energyResourceId);

	const handleEditChannel = useCallback(
		(data: EditPointChannelParams) => {
			if (!user) return;

			editPointChannelFx({
				...data,
				userId: user.preferredUsername,
				moduleName: ModuleName.UseEditPointLinkedChannels_editPointChannelFx,
			});
		},
		[editPointChannelFx, user],
	);

	const handleDeleteChannel = useCallback(
		(data: DeleteParams) => {
			deletePointChannelFx({
				...data,
				moduleName: ModuleName.UseEditPointLinkedChannels_deletePointChannelFx,
			});
		},
		[deletePointChannelFx],
	);

	const { header, data } = pointChannelsAdapter({
		point: selectedPoint,
		handleEditChannel,
		handleDeleteChannel,
		userId: String(user?.preferredUsername),
		moduleName: ModuleName.UseEditPointLinkedChannels_pointChannelsAdapter,
	});

	const handleClose = useCallback(() => {
		if (!user) return;
		fetchPointsListFx({
			energyResource: energyResourceId,
			userId: user.preferredUsername,
			moduleName: ModuleName.UsePointsReports_fetchPointsListFx,
		});
		closeModal(RegisteredModals.EditPointLinkedChannels);
	}, [RegisteredModals, user, energyResourceId]);

	const handleOpenTree = useCallback(() => {
		openModal(RegisteredModals.PointChannelsTreeModal);
	}, [RegisteredModals]);

	useEffect(() => {
		if (!user) return;

		fetchPointChannelsListFx({
			point: contextMenuId,
			userId: user.preferredUsername,
			moduleName:
				ModuleName.UseEditPointLinkedChannels_fetchPointChannelsListFx,
		});
	}, [user, contextMenuId]);

	return {
		handleClose,
		handleOpenTree,
		header,
		data,
	};
}
