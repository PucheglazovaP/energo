import { ChangeEvent, useEffect, useState } from 'react';
import { useStore } from 'effector-react';

import { $activeIds } from '../../Models/ActiveIds';
import { $user } from '../../Models/Auth';
import { $formLayers } from '../../Models/FormLayers';
import {
	createSystemLayerFx,
	getSystemLayersFx,
} from '../../Models/FormLayers/effects';
import { setSystemLayerEditData } from '../../Models/FormLayers/events';
import { closeModal, openModal } from '../../Models/Modal/events';
import { RegisteredModals } from '../../Shared/modalsConfig';
import { Action, User } from '../../Shared/types';
import { ModuleName } from '../../Shared/Types/moduleName';

function useCreateSystemLayer() {
	const user: User | null = useStore($user);
	const activeIds = useStore($activeIds);
	const { editData, systemLayerActionType } = useStore($formLayers);

	const [name, setName] = useState<string>('');
	const [comment, setComment] = useState<string>('');

	function handleCommentChange(evt: ChangeEvent<HTMLTextAreaElement>) {
		const { value } = evt.target;
		setComment(value);
	}

	function handleNameChange(evt: ChangeEvent<HTMLInputElement>) {
		const { value } = evt.target;
		setName(value);
	}

	async function handleConfirm() {
		if (user) {
			if (systemLayerActionType === Action.Create) {
				await createSystemLayerFx({
					layerName: name,
					comment,
					systemCode: activeIds.activeVersion?.systemCode || 0,
					userId: user.preferredUsername,
					moduleName: ModuleName.UseCreateSystemLayer_createSystemLayerFx,
				});
				await getSystemLayersFx({
					userId: user.preferredUsername,
					systemCode: activeIds.activeVersion?.systemCode || 0,
					moduleName: ModuleName.UseCreateSystemLayer_getSystemLayersFx,
				});
			} else {
				setSystemLayerEditData({
					id: editData?.id || 0,
					systemCode: editData?.systemCode || 0,
					lastModified: editData?.lastModified || '',
					comment,
					name,
				});
				openModal(RegisteredModals.ConfirmSystemLayerEdit);
			}

			closeModal(RegisteredModals.CreateSystemLayer);
		}
	}
	function handleCancel() {
		setSystemLayerEditData(null);
		closeModal(RegisteredModals.CreateSystemLayer);
	}
	useEffect(() => {
		setName(editData?.name || '');
		setComment(editData?.comment || '');
	}, [editData]);

	return {
		comment,
		handleCommentChange,
		handleConfirm,
		handleCancel,
		handleNameChange,
		name,
	};
}

export default useCreateSystemLayer;
