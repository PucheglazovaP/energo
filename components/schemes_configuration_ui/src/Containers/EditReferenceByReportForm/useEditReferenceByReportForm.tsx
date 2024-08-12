import React, { useCallback } from 'react';
import { useStore } from 'effector-react';

import { closeModal } from '../../Models/Modal/events';
import {
	$editReportData,
	INITIAL_REPORT_DATA,
} from '../../Models/ReferenseByReports';
import { setEditReportData } from '../../Models/ReferenseByReports/events';
import { saveReportFx } from '../../Models/Reports/effects';
import { EditTextName } from '../../Models/Reports/types';
import { RegisteredModals } from '../../Shared/modalsConfig';
import { ModuleName } from '../../Shared/Types/moduleName';

export function useEditReferenceByReportForm() {
	const editReportData = useStore($editReportData);

	const handleChangeTextValue = useCallback(
		(
			e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
			fieldName: EditTextName,
		) => {
			setEditReportData({
				...editReportData,
				[fieldName]: e.target.value,
			});
		},
		[editReportData],
	);

	const onCloseModal = useCallback(() => {
		closeModal(RegisteredModals.EditReport);
		setEditReportData(INITIAL_REPORT_DATA);
	}, []);

	// Callback для редактирования точки
	const onSaveReport = useCallback(() => {
		saveReportFx({
			...editReportData,
			moduleName: ModuleName.UseEditReferenceByReportForm_saveReportFx,
		});
		closeModal(RegisteredModals.EditReport);
	}, [editReportData]);

	return {
		onCloseModal,
		onSaveReport,
		handleChangeTextValue,
		editReportData,
	};
}
