import { useCallback, useEffect } from 'react';
import { useStore } from 'effector-react';

import { tableAdapter } from '../../Adapters/emergencyEvents/criterionTableAdapter';
import { $user } from '../../Models/Auth';
import { $emergencyEventsInfo } from '../../Models/EmergencyEvents';
import {
	createParameterCriterionFx,
	deleteParameterCriterionFx,
	editParameterCriterionFx,
	getParameterCriterionsFx,
} from '../../Models/EmergencyEvents/effects';
import { setActiveRowIndex } from '../../Models/EmergencyEvents/events';
import {
	DeleteParameterCriterionsParams,
	EditParameterCriterionsParams,
} from '../../Shared/types';
import { ModuleName } from '../../Shared/Types/moduleName';

export default function useEditEmergencyEventsReportForm() {
	const user = useStore($user);
	const { activeNode, activeNodeInfo, parameterCriterions, activeRowIndex } =
		useStore($emergencyEventsInfo);
	const isCreateCriterionBtnDisabled = !activeNodeInfo?.parameterCode;
	const handleRowClick = (rowIndex: number) => {
		setActiveRowIndex(rowIndex);
	};

	const handleCreateCriterion = () => {
		if (activeNode)
			createParameterCriterionFx({
				parameterId: activeNode,
				userId: String(user?.preferredUsername),
				moduleName:
					ModuleName.UseEditEmergencyEventsReportForm_createParameterCriterionFx,
			});
	};

	const handleEditCriterion = useCallback(
		(data: EditParameterCriterionsParams) => {
			editParameterCriterionFx(data);
		},
		[],
	);

	const handleDeleteCriterion = useCallback(
		(data: DeleteParameterCriterionsParams) => {
			deleteParameterCriterionFx(data);
		},
		[],
	);
	const { header, data } = tableAdapter({
		parameterId: activeNodeInfo?.id || 0,
		criterions: parameterCriterions,
		dataType: activeNodeInfo?.dataType || 'по умолчанию',
		handleEditCriterion,
		handleDeleteCriterion,
		handleRowClick,
		userId: String(user?.preferredUsername),
		moduleName: ModuleName.UseEditEmergencyEventsReportForm_tableAdapter,
	});

	useEffect(() => {
		if (activeNode) getParameterCriterionsFx(activeNode);
	}, [activeNode]);

	return {
		header,
		data,
		handleCreateCriterion,
		activeNodeInfo,
		activeRowIndex,
		isCreateCriterionBtnDisabled,
	};
}
