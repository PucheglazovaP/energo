import { useStore } from 'effector-react';

import { $user } from '../../../Models/Auth';
import { closeModal } from '../../../Models/Modal/events';
import { $selectedPrintFormParameter } from '../../../Models/PrintForms';
import { unsyncPrintFormParameterFx } from '../../../Models/PrintForms/effects';
import { RegisteredModals } from '../../../Shared/modalsConfig';
import { User } from '../../../Shared/types';
import { ModuleName } from '../../../Shared/Types/moduleName';

function usePrintFormParametersUnsync() {
	const selectedPrintFormParameter = useStore($selectedPrintFormParameter);

	const user: User | null = useStore($user);

	function handleUnsync() {
		if (selectedPrintFormParameter && user) {
			unsyncPrintFormParameterFx({
				linkId: selectedPrintFormParameter.linkId,
				userId: user.preferredUsername,
				moduleName:
					ModuleName.UsePrintFormParametersUnsync_unsyncPrintFormParameterFx,
			});
		}
	}

	function handleClose() {
		closeModal(RegisteredModals.PrintFormParameterUnsync);
	}
	function handleConfirm() {
		handleUnsync();
		handleClose();
	}

	return {
		handleClose,
		handleConfirm,
	};
}

export default usePrintFormParametersUnsync;
