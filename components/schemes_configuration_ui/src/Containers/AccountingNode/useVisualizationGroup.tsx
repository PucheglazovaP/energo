import React, { useCallback, useEffect } from 'react';
import { useStore } from 'effector-react';

import { $accountingNode } from '../../Models/AccountingNode';
import { setAccountingNode } from '../../Models/AccountingNode/events';
import { openModal } from '../../Models/Modal/events';
import { $visualizationGroupsTable } from '../../Models/VisualizationGroups';
import { setActiveVisualizationGroupIdEvent } from '../../Models/VisualizationGroups/events';
import { RegisteredModals } from '../../Shared/modalsConfig';
import { ITableBody, ITableColumn } from '../../UI/Table/types';

import styles from '../VisualizationGroupParam/VisualizationGroupParam.module.css';

function useVisualizationGroup() {
	const accountingNode = useStore($accountingNode);
	const { visualizationGroups, activeVisualizationGroupId } = useStore(
		$visualizationGroupsTable,
	);

	// выбранная связанный параметр
	const visualizationGroup = visualizationGroups.filter(
		(visualizationGroups) =>
			visualizationGroups.visualizationGroupId ===
			accountingNode.dailyPointGroupsId,
	);

	// шапка таблицы
	const visualizationGroupHeader: ITableColumn[] = [
		{
			accessor: 'shortName',
			text: 'Наименование в отчете',
			sortOrder: 0,
			width: 250,
		},
		{
			accessor: 'name',
			text: 'Полное наименование',
			sortOrder: 0,
			width: 300,
		},
		{
			accessor: 'comment',
			text: 'Коммент.',
			sortOrder: 0,
			width: 250,
			renderHeaderCell: () => (
				<div className={styles.header_comment}>Комментарий</div>
			),
		},
	];

	// данные таблицы
	const visualizationGroupData: ITableBody[] = visualizationGroup.map(
		(group) => ({
			dataLine: [
				{
					accessor: 'shortName',
					text: group.shortName,
				},
				{
					accessor: 'name',
					text: group.name,
					renderCell: () => (
						<span className={styles.table_text} title={group.name}>
							{group.name}
						</span>
					),
				},
				{
					accessor: 'comment',
					text: group.comment,
					renderCell: () => <span title={group.comment}>{group.comment}</span>,
				},
			],
		}),
	);

	const handleUnbindVisualizationGroup = useCallback(() => {
		setActiveVisualizationGroupIdEvent(null);
		setAccountingNode({
			...accountingNode,
			dailyPointGroupsId: null,
		});
	}, [accountingNode]);

	const handleEditVisualizationGroup = useCallback(() => {
		openModal(RegisteredModals.VisualizationGroups);
	}, []);

	useEffect(() => {
		if (!activeVisualizationGroupId) return;
		setAccountingNode({
			...accountingNode,
			dailyPointGroupsId: activeVisualizationGroupId,
		});
	}, [activeVisualizationGroupId]);

	return {
		visualizationGroupData,
		visualizationGroupHeader,
		handleUnbindVisualizationGroup,
		handleEditVisualizationGroup,
	};
}
export default useVisualizationGroup;
