import React, { useCallback, useState } from 'react';
import { useStore } from 'effector-react';

import { $user } from '../../Models/Auth';
import { closeModal } from '../../Models/Modal/events';
import {
	$reportItemContextMenuId,
	$selectedReportId,
} from '../../Models/ReferenseByReports';
import { createReportItemFx } from '../../Models/ReportItems/effects';
import { RegisteredModals } from '../../Shared/modalsConfig';
import { ModuleName } from '../../Shared/Types/moduleName';

const INITIAL_RADIO_VALUES = [
	{
		name: 'В начало текущего уровня',
		value: 'startLevel',
		checked: true,
	},
	{
		name: 'Выше текущего узла',
		value: 'upNode',
		checked: false,
	},
	{
		name: 'Ниже текущего узла',
		value: 'underNode',
		checked: false,
	},
	{
		name: 'В конец текущего уровня',
		value: 'endLevel',
		checked: false,
	},
	{
		name: 'Потомком в начало',
		value: 'startChild',
		checked: false,
	},
	{
		name: 'Потомком в конец',
		value: 'endChild',
		checked: false,
	},
];
export function useCreateReportItem() {
	const user = useStore($user);
	const currentReportId = useStore($reportItemContextMenuId);
	const reportId = useStore($selectedReportId);

	const [name, setName] = useState<string>('');
	const [positionGroups, setPositionGroups] = useState(INITIAL_RADIO_VALUES);

	const handleChangeName = useCallback(
		(evt: React.ChangeEvent<HTMLInputElement>) => setName(evt.target.value),
		[setName],
	);

	const handlePositionsChange = useCallback(
		(evt: React.ChangeEvent<HTMLInputElement>) => {
			const positions = positionGroups.map((position) => {
				return position.value === evt.target.value
					? { ...position, checked: true }
					: { ...position, checked: false };
			});
			setPositionGroups(positions);
		},
		[positionGroups, setPositionGroups],
	);

	const handleCloseModal = useCallback(() => {
		closeModal(RegisteredModals.CreateReportItem);
	}, []);

	// Callback для создания элемента узла
	const handleConfirm = useCallback(() => {
		if (!user || !reportId) return;
		const insertPosition = positionGroups.findIndex(
			(position) => position.checked,
		);
		createReportItemFx({
			targetId: currentReportId,
			reportId,
			insertPosition,
			positionName: name,
			userId: user.preferredUsername,
			moduleName: ModuleName.UseCreateReportItem_createReportItemFx,
		});
		closeModal(RegisteredModals.CreateReportItem);
	}, [currentReportId, user, name, positionGroups]);

	return {
		handleCloseModal,
		handleConfirm,
		handleChangeName,
		handlePositionsChange,
		positionGroups,
		name,
	};
}
