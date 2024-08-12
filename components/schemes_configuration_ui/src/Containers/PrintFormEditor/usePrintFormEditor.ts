import React, { useEffect, useState } from 'react';
import { useStore } from 'effector-react';

import { $user } from '../../Models/Auth';
import { closeModal } from '../../Models/Modal/events';
import { $contextMenuPrintFormId, $printForms } from '../../Models/PrintForms';
import {
	createPrintFormFx,
	fetchPrintFormsFx,
	updatePrintFormFx,
} from '../../Models/PrintForms/effects';
import { PrintForm } from '../../Models/PrintForms/types';
import { $selectedReportId } from '../../Models/ReferenseByReports';
import { $reports } from '../../Models/Reports';
import { Report } from '../../Models/Reports/types';
import { RegisteredModals } from '../../Shared/modalsConfig';
import {
	Action,
	CreatePrintFormParams,
	UpdatePrintFormParams,
} from '../../Shared/types';
import { ModuleName } from '../../Shared/Types/moduleName';

import { PrintFormEditorAction, PrintFormEditorController } from './types';

function usePrintFormEditor(
	type: PrintFormEditorAction,
): PrintFormEditorController {
	const [name, setName] = useState<string>('');
	const [comment, setComment] = useState<string>('');
	const printForms = useStore($printForms);
	const reportForms = useStore($reports);
	const selectedReportFormId = useStore($selectedReportId);
	const contextMenuPrintFormId = useStore($contextMenuPrintFormId);
	const user = useStore($user);

	const selectedReportForm: Report | undefined = reportForms.find(
		(form) => form.id === selectedReportFormId,
	);

	const onSave = () => {
		if (type === Action.Create) {
			const params: CreatePrintFormParams = {
				reportId: selectedReportFormId || 0,
				userId: user?.preferredUsername || '',
				name,
				comment,
				moduleName: ModuleName.UsePrintFormEditor_createPrintFormFx,
			};
			createPrintFormFx(params).then(() => {
				fetchPrintFormsFx(selectedReportFormId);
				closeModal(RegisteredModals.CreateReportForm);
			});
		}
		if (type === Action.Update) {
			const params: UpdatePrintFormParams = {
				reportId: contextMenuPrintFormId,
				userId: user?.preferredUsername || '',
				name,
				comment,
				moduleName: ModuleName.UsePrintFormEditor_updatePrintFormFx,
			};
			updatePrintFormFx(params).then(() => {
				fetchPrintFormsFx(selectedReportFormId);
				closeModal(RegisteredModals.UpdateReportForm);
			});
		}
	};

	const onCancel = () => {
		if (type === Action.Create) {
			closeModal(RegisteredModals.CreateReportForm);
		}
		if (type === Action.Update) {
			closeModal(RegisteredModals.UpdateReportForm);
		}
	};

	const onChangeName = (evt: React.ChangeEvent<HTMLInputElement>) => {
		setName(evt.target.value);
	};

	const onChangeComment = (evt: React.ChangeEvent<HTMLInputElement>) => {
		setComment(evt.target.value);
	};

	useEffect(() => {
		if (type === Action.Update) {
			const printForm: PrintForm | undefined = printForms.find(
				(form) => form.id === contextMenuPrintFormId,
			);
			if (!printForm) {
				return;
			}
			setName(printForm.name);
			setComment(printForm.comment);
		}
	}, [type, printForms, contextMenuPrintFormId]);

	return {
		formByPeriodName: selectedReportForm?.name || '',
		name,
		comment,
		onChangeComment,
		onChangeName,
		onSave,
		onCancel,
	};
}

export default usePrintFormEditor;
