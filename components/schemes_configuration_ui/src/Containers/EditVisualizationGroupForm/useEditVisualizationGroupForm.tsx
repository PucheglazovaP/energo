import React, { useCallback, useEffect, useState } from 'react';
import { useStore } from 'effector-react';

import { $user } from '../../Models/Auth';
import {
	$editVisualizationGroupData,
	INITIAL_EDIT_VISUALIZATION_GROUP,
} from '../../Models/EditVisualizationGroupForm';
import { saveVisualizationGroupFx } from '../../Models/EditVisualizationGroupForm/effects';
import { setEditVisualizationGroupData } from '../../Models/EditVisualizationGroupForm/events';
import { EditVisualizationGroup } from '../../Models/EditVisualizationGroupForm/types';
import { $energyResourceId } from '../../Models/EnergyResources';
import { closeModal, openModal } from '../../Models/Modal/events';
import { RegisteredModals } from '../../Shared/modalsConfig';
import { ModuleName } from '../../Shared/Types/moduleName';

export function useEditGroupForm() {
	const user = useStore($user);
	const editVisualizationGroupData = useStore($editVisualizationGroupData);
	const energyResourceId = useStore($energyResourceId);
	// начальное состояние полей для сравнения с измененными
	const [initialFields, setInitialFields] = useState<EditVisualizationGroup>(
		editVisualizationGroupData,
	);
	const [isFormChanged, setFormChanged] = useState<boolean>(false);

	const handleChangeTextValue = useCallback(
		(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
			setEditVisualizationGroupData({
				...editVisualizationGroupData,
				[e.target.name]: e.target.value,
			});
		},
		[editVisualizationGroupData],
	);

	const onCloseModal = useCallback(() => {
		closeModal(RegisteredModals.EditVisualizationGroupForm);
		openModal(RegisteredModals.VisualizationGroups);
		setEditVisualizationGroupData(INITIAL_EDIT_VISUALIZATION_GROUP);
		setInitialFields(INITIAL_EDIT_VISUALIZATION_GROUP);
	}, []);

	const onSaveGroup = useCallback(() => {
		if (!user) return;

		saveVisualizationGroupFx({
			...editVisualizationGroupData,
			energyResourceId,
			userId: user.preferredUsername,
			moduleName: ModuleName.UseEditGroupForm_saveVisualizationGroupFx,
		});
		closeModal(RegisteredModals.EditVisualizationGroupForm);
		setEditVisualizationGroupData(INITIAL_EDIT_VISUALIZATION_GROUP);
	}, [editVisualizationGroupData, energyResourceId, user]);

	useEffect(() => {
		const isCurrentFormChanged: boolean =
			JSON.stringify(initialFields) !==
			JSON.stringify(editVisualizationGroupData);

		setFormChanged(isCurrentFormChanged);
	}, [editVisualizationGroupData, initialFields]);

	return {
		onCloseModal,
		onSaveGroup,
		handleChangeTextValue,
		editVisualizationGroupData,
		isFormChanged,
	};
}
