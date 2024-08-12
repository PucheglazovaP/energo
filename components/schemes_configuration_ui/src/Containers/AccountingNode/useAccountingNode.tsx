import { useCallback, useEffect, useMemo } from 'react';
import { toast } from 'react-toastify';
import { useStore } from 'effector-react';

import {
	$accountingNode,
	$accountingNodeId,
} from '../../Models/AccountingNode';
import { saveAccountingNodeFx } from '../../Models/AccountingNode/effects';
import {
	setAccountingNode,
	setAccountingNodeCalculateMethodActive,
	setAccountingNodeMethodActive,
} from '../../Models/AccountingNode/events';
import { $user } from '../../Models/Auth';
import { $energyResourceId } from '../../Models/EnergyResources';
import { closeModal } from '../../Models/Modal/events';
import { $parameterByValueTable } from '../../Models/ParametersByValueReports';
import { ParametersByValueList } from '../../Models/ParametersByValueReports/types';
import { $editPointData } from '../../Models/Points';
import { fetchPointsListFx } from '../../Models/Points/effects';
import { setEditPointData } from '../../Models/Points/events';
import { fetchVisualizationGroupsListFx } from '../../Models/VisualizationGroups/effects';
import { setActiveVisualizationGroupIdEvent } from '../../Models/VisualizationGroups/events';
import { RegisteredModals } from '../../Shared/modalsConfig';
import { ModuleName } from '../../Shared/Types/moduleName';

import useLinkedParameter from './useLinkedParameter';
import useLinkedPoint from './useLinkedPoint';
import useVisualizationGroup from './useVisualizationGroup';

function useAccountingNode() {
	const { parametersList } = useStore($parameterByValueTable);
	const accountingNode = useStore($accountingNode);
	const accountingNodeId = useStore($accountingNodeId);
	const editPointData = useStore($editPointData);
	const energyResourceId = useStore($energyResourceId);
	const user = useStore($user);
	const { name, shortName, pointId, methodId, calculateMethodId } =
		accountingNode;
	const { linkedPointData, linkedPointHeader, handleEditLinkedPoint } =
		useLinkedPoint();
	const {
		handleEditLinkedParameter,
		handleUnbindLinkedParameter,
		linkedParameterHeader,
		linkedParameterData,
	} = useLinkedParameter();

	const {
		handleUnbindVisualizationGroup,
		handleEditVisualizationGroup,
		visualizationGroupData,
		visualizationGroupHeader,
	} = useVisualizationGroup();

	// Выбранный через контекстное меню параметр
	const selectedParameter = parametersList.find(
		(parameter) => parameter.parameterId === accountingNodeId,
	) as ParametersByValueList;

	// Установка текущих значений узла учета
	useEffect(() => {
		if (!selectedParameter) return;
		setAccountingNode(selectedParameter);
	}, [selectedParameter]);

	// Активация методов при открытии редактирования узла учета
	useEffect(() => {
		if (!selectedParameter) return;
		setAccountingNodeMethodActive(selectedParameter.methodId);
		setAccountingNodeCalculateMethodActive(selectedParameter.calculateMethodId);
	}, [selectedParameter]);

	const handleCloseModal = useCallback(() => {
		closeModal(RegisteredModals.AccountingNodeModal);
	}, []);

	useEffect(() => {
		if (!user) return;
		fetchPointsListFx({
			energyResource: selectedParameter?.energyResourceId || energyResourceId,
			userId: user.preferredUsername,
			moduleName: ModuleName.UseAccountingNode_fetchPointsListFx,
		});
	}, [selectedParameter, user, energyResourceId]);

	// Установка текущей связанной точки учета
	useEffect(() => {
		if (!selectedParameter) return;
		setEditPointData({
			...editPointData,
			linkedPointId: selectedParameter.pointId,
		});
		setActiveVisualizationGroupIdEvent(selectedParameter.dailyPointGroupsId);
	}, [selectedParameter]);

	// Запрос списка групп визуализации
	useEffect(() => {
		if (!user) return;
		fetchVisualizationGroupsListFx({
			energyResourceId,
			userId: user.preferredUsername,
			moduleName: ModuleName.UseAccountingNode_fetchVisualizationGroupsListFx,
		});
	}, [energyResourceId, user]);

	// Сохранение изменений/создание узла учета
	const handleSaveAccountingNode = useCallback(async () => {
		if (!user) return;
		if (!name || !shortName || !pointId || !calculateMethodId || !methodId) {
			toast.error('Заполните обязательные поля!');
			return;
		}
		await saveAccountingNodeFx({
			...accountingNode,
			userId: user.preferredUsername,
			energyResourceId: selectedParameter?.energyResourceId || energyResourceId,
			moduleName: ModuleName.UseAccountingNode_saveAccountingNodeFx,
		});
	}, [accountingNode, user, selectedParameter, energyResourceId]);

	const isUpdateMode = useMemo(
		() => accountingNode.parameterId !== 0,
		[accountingNode],
	);

	return {
		isUpdateMode,
		handleCloseModal,
		linkedPointData,
		linkedPointHeader,
		linkedParameterData,
		linkedParameterHeader,
		visualizationGroupData,
		visualizationGroupHeader,
		handleEditLinkedPoint,
		handleEditLinkedParameter,
		handleUnbindLinkedParameter,
		handleUnbindVisualizationGroup,
		handleEditVisualizationGroup,
		handleSaveAccountingNode,
	};
}

export default useAccountingNode;
