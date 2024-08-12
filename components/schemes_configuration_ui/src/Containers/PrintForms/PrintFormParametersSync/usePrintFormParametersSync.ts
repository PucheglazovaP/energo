import { useState } from 'react';
import { SelectOption } from '@evraz/ui-kit/dist/src/Shared/Types/SelectCommonProps';
import { useStore } from 'effector-react';

import { $user } from '../../../Models/Auth';
import { closeModal } from '../../../Models/Modal/events';
import {
	$printFormParametersAvailable,
	$selectedPrintFormId,
} from '../../../Models/PrintForms';
import { syncPrintFormParameterFx } from '../../../Models/PrintForms/effects';
import { setSelectedPrintFormParameterName } from '../../../Models/PrintForms/events';
import { RegisteredModals } from '../../../Shared/modalsConfig';
import { User } from '../../../Shared/types';
import { ModuleName } from '../../../Shared/Types/moduleName';

function usePrintFormParametersSync() {
	const [selectedOption, setSelectedOption] = useState<SelectOption>();

	const parametersOptions = useStore($printFormParametersAvailable).map(
		(option) => ({
			...option,
			isSelected: option.id === selectedOption?.id,
		}),
	);
	const selectedPrintFormId: number = useStore($selectedPrintFormId);
	const user: User | null = useStore($user);

	function handleSync(paramId: string | undefined) {
		if (paramId && selectedPrintFormId && user) {
			syncPrintFormParameterFx({
				paramId: Number(paramId),
				printReportId: selectedPrintFormId,
				userId: user.preferredUsername,
				moduleName:
					ModuleName.UsePrintFormParametersSync_syncPrintFormParameterFx,
			});
		}
	}

	function handleClose() {
		closeModal(RegisteredModals.PrintFormParameterSync);
	}
	function handleConfirm() {
		handleSync(selectedOption?.id);
		setSelectedPrintFormParameterName(selectedOption?.name || '');
		handleClose();
	}

	return {
		selectedOption,
		setSelectedOption,
		parametersOptions,
		handleClose,
		handleConfirm,
	};
}

export default usePrintFormParametersSync;
