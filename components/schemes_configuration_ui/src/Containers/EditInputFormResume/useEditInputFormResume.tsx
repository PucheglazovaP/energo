import { useCallback } from 'react';
import { format } from 'date-fns';
import { useStore } from 'effector-react';

import { $user } from '../../Models/Auth';
import {
	closeInputFormSessionFx,
	createInputFormSessionFx,
	fetchEditInputFormDatasetFx,
} from '../../Models/EditInputForm/effects';
import {
	setActiveSessionId,
	setEditDataset,
} from '../../Models/EditInputForm/events';
import { fetchEditInputFormPointsFx } from '../../Models/EditInputFormPoints/effects';
import { setEditPoints } from '../../Models/EditInputFormPoints/events';
import { $energyResourceId } from '../../Models/EnergyResources';
import { $inputFormDataset } from '../../Models/InputForm';
import { $inputFormPointsDataset } from '../../Models/InputFormPoints';
import { $inputFormSession } from '../../Models/InputFormSession';
import { closeModal, openModal } from '../../Models/Modal/events';
import { $datePeriod } from '../../Models/ReportsTechnical';
import { RegisteredModals } from '../../Shared/modalsConfig';
import { ModuleName } from '../../Shared/Types/moduleName';

export function useEditInputFormResume() {
	const user = useStore($user);
	const { sessionId, errorMessage } = useStore($inputFormSession);
	const dataset = useStore($inputFormDataset);
	const pointsDataset = useStore($inputFormPointsDataset);
	const energyResourceId = useStore($energyResourceId);
	const date = useStore($datePeriod);

	const handleResume = useCallback(() => {
		if (!user) return;

		closeModal(RegisteredModals.EditInputFormResume);
		setActiveSessionId(sessionId);
		fetchEditInputFormDatasetFx({
			sessionId,
			userId: user.preferredUsername,
			moduleName: ModuleName.UseEditInputFormResume_fetchEditInputFormDatasetFx,
		});
		fetchEditInputFormPointsFx({
			sessionId,
			energyResourceId,
			date: format(date.endDate, 'yyyyMMdd'),
			userId: user.preferredUsername,
			moduleName: ModuleName.UseEditInputFormResume_fetchEditInputFormDatasetFx,
		});
		openModal(RegisteredModals.EditInputForm);
	}, [sessionId, user]);

	const handleNew = useCallback(() => {
		if (!user) return;
		closeModal(RegisteredModals.EditInputFormResume);
		closeInputFormSessionFx({
			sessionId,
			userId: user.preferredUsername,
			moduleName: ModuleName.UseEditInputFormResume_closeInputFormSessionFx,
		}).then(() => {
			createInputFormSessionFx({
				energyResourceId,
				date: format(date.endDate, 'yyyyMMdd'),
				userId: user.preferredUsername,
				moduleName: ModuleName.UseEditInputFormResume_createInputFormSessionFx,
			});
			setEditPoints(pointsDataset);
			setEditDataset(dataset);
			openModal(RegisteredModals.EditInputForm);
		});
	}, [date, energyResourceId, user, dataset, sessionId]);

	return {
		errorMessage,
		handleResume,
		handleNew,
	};
}
