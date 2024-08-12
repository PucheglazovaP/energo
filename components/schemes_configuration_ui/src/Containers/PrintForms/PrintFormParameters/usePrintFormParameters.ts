import { useEffect } from 'react';
import { useStore } from 'effector-react';

import { $user } from '../../../Models/Auth';
import { openModal } from '../../../Models/Modal/events';
import {
	$printFormParametersAvailable,
	$selectedPrintFormId,
} from '../../../Models/PrintForms';
import { fetchPrintFormParametersFx } from '../../../Models/PrintForms/effects';
import { RegisteredModals } from '../../../Shared/modalsConfig';
import { ModuleName } from '../../../Shared/Types/moduleName';

function usePrintFormParameters() {
	const selectedPrintFormId: number = useStore($selectedPrintFormId);
	const availablePrintFormParameters = useStore($printFormParametersAvailable);
	const user = useStore($user);
	const isPrintFormSelected: boolean = !!selectedPrintFormId;
	const isAvailablePrintFormParametersListEmpty: boolean =
		availablePrintFormParameters.length === 0;

	function getPrintFormParameters() {
		if (selectedPrintFormId && user) {
			fetchPrintFormParametersFx({
				printReportId: selectedPrintFormId,
				userId: user.preferredUsername,
				moduleName:
					ModuleName.UsePrintFormParameters_fetchPrintFormParametersFx,
			});
		}
	}

	function handleSyncButtonClick() {
		openModal(RegisteredModals.PrintFormParameterSync);
	}

	useEffect(() => {
		getPrintFormParameters();
	}, []);

	return {
		isPrintFormSelected,
		isAvailablePrintFormParametersListEmpty,
		handleSyncButtonClick,
	};
}

export default usePrintFormParameters;
