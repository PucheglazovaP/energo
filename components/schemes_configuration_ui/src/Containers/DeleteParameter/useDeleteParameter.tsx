import { useCallback } from 'react';
import { useStore } from 'effector-react';

import { $accountingNodeId } from '../../Models/AccountingNode';
import { $user } from '../../Models/Auth';
import { closeModal } from '../../Models/Modal/events';
import { $parameterByValueTable } from '../../Models/ParametersByValueReports';
import { deleteParameterFx } from '../../Models/ParametersByValueReports/effects';
import { ParametersByValueList } from '../../Models/ParametersByValueReports/types';
import { RegisteredModals } from '../../Shared/modalsConfig';
import { ModuleName } from '../../Shared/Types/moduleName';

export function useDeleteParameter() {
	const user = useStore($user);
	const { parametersList } = useStore($parameterByValueTable);
	const accountingNodeId = useStore($accountingNodeId);

	// Выбранный через контекстное меню параметр
	const currentParameter = parametersList.find(
		(parameter) => parameter.parameterId === accountingNodeId,
	) as ParametersByValueList;

	const handleCloseModal = useCallback(() => {
		closeModal(RegisteredModals.DeleteParameter);
	}, []);

	// Колбек для удаления параметра
	const handleConfirmDelete = useCallback(() => {
		if (!user) return;
		deleteParameterFx({
			id: currentParameter.parameterId,
			lastModified: currentParameter.lastModified,
			userId: user.preferredUsername,
			moduleName: ModuleName.UseDeleteParameter_deleteParameterFx,
		});
		closeModal(RegisteredModals.DeleteParameter);
	}, [currentParameter.lastModified, currentParameter.parameterId, user]);

	return {
		handleCloseModal,
		handleConfirmDelete,
	};
}
