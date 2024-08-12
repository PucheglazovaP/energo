import { useCallback } from 'react';
import { Button, Tooltip } from '@evraz/ui-kit';
import {
	GridTreeTableBlockShape,
	GridTreeTableCellRenderFnValueProps,
	GridTreeTableDataShape,
} from '@evraz/ui-kit/dist/src/components/GridTreeTable/types';
import clsx from 'clsx';
import { useStore } from 'effector-react';

import ChannelIcon from '../../Icons/Channel';
import WarningIcon from '../../Icons/CircleInfo';
import GroupIcon from '../../Icons/Group';
import { setActiveChannelFormGroupInfo } from '../../Models/ActiveChannelChart/events';
import { $formContextMenu } from '../../Models/FormContextMenu';
import { $groupInformationModal } from '../../Models/GroupInformationModal';
import { getFormulaListFx } from '../../Models/GroupInformationModal/effects';
import {
	setChannelChartModalOpen,
	setGroupFormulaModalOpen,
	setModalInfo,
} from '../../Models/GroupInformationModal/event';
import { TooltipDirection } from '../../Shared/types';

import styles from './GroupInformation.module.css';

function useGroupTable() {
	const { object: contextMenuObject } = useStore($formContextMenu);
	const isLoading = useStore(getFormulaListFx.pending);
	const { groupInformation, groupFormula, isGroupFormulaModalOpen } = useStore(
		$groupInformationModal,
	);

	const handleFomulaModalClick = (
		id: number,
		groupName: string,
		unitName: string,
		unitId: number,
	) => {
		setModalInfo({ groupId: id, groupName, unitName, unitId });
		setGroupFormulaModalOpen(true);
	};

	const handleChannelChartModalClick = (id: number) => {
		const groupItem = groupInformation.find((item) => item.id === id);
		if (groupItem) {
			setModalInfo({
				groupId: groupItem?.idCompanent,
				groupName: groupItem?.name,
				unitName: groupItem?.unitName,
				unitId: groupItem?.unitID,
			});
			setActiveChannelFormGroupInfo({
				id: groupItem?.idCompanent,
				channelName: groupItem?.name,
				unitId: groupItem?.unitID,
				unitName: groupItem?.unitName,
				isConsumption: groupItem?.isConsumption || false,
				methodName: groupItem?.methodName || '',
				typeStorage: groupItem?.typeStorage || '',
			});
			setChannelChartModalOpen(true);
		}
	};

	const renderNameCell = useCallback(
		({ value }: GridTreeTableCellRenderFnValueProps) => {
			const groupItem = groupInformation.find((item) => item.id === value);
			return (
				<>
					{groupItem?.isGroup ? (
						<>
							<Tooltip tooltip={'Группа'} direction={TooltipDirection.Down}>
								<div className={styles.table_cell_name_wrapper} key={'group'}>
									<GroupIcon className={styles.icon} />
								</div>
							</Tooltip>
							{groupItem?.name || ''}
						</>
					) : (
						<>
							<Tooltip tooltip={'Канал'} direction={TooltipDirection.Down}>
								<div className={styles.table_cell_name_wrapper} key={'channel'}>
									<ChannelIcon className={styles.icon} />
								</div>
							</Tooltip>
							<Button
								className={styles.link}
								onClick={() =>
									handleChannelChartModalClick(groupItem?.id as number)
								}
							>
								{groupItem?.name || ''}
							</Button>
						</>
					)}
				</>
			);
		},
		[groupInformation],
	);
	const renderFormulaCell = useCallback(
		({ value }: GridTreeTableCellRenderFnValueProps) => {
			const groupItem = groupInformation.find((item) => item.id === value);
			return (
				groupItem?.activeFormula && (
					<Button
						className={styles.link}
						onClick={() =>
							handleFomulaModalClick(
								value as number,
								groupItem?.name || '',
								groupItem?.unitName || '',
								groupItem?.unitID || 0,
							)
						}
					>
						<WarningIcon className={styles.info_icon} />
					</Button>
				)
			);
		},
		[groupInformation],
	);

	const dataDictionary = groupInformation.reduce(
		(
			acc: {
				[key: string]: {
					data: { dataLine: GridTreeTableDataShape[]; id: string }[];
				};
			},
			groupItem,
		) => {
			const parentId = groupItem.parentId || 'root';
			if (!acc[parentId]) {
				acc[parentId] = { data: [] };
			}
			acc[parentId].data.push({
				dataLine: [
					{
						value: groupItem.id,
						colspan: 1,
						isEnclosure: true,
						cellRenderFn: renderNameCell,
						className: clsx(styles.table_cell, styles.table_cell_name),
					},
					{
						value: groupItem.koef || 'Н/Д',
						colspan: 1,
						isEnclosure: true,
						className: clsx(styles.table_cell),
					},
					{
						value: groupItem.idCompanent,
						colspan: 1,
						isEnclosure: true,
						className: styles.table_cell,
					},
					{
						value: groupItem.value || 'Н/Д',
						colspan: 1,
						isEnclosure: true,
						className: styles.table_cell,
					},
					{
						value: groupItem.id,
						colspan: 1,
						isEnclosure: true,
						className: styles.table_cell,
						cellRenderFn: renderFormulaCell,
					},
					{
						value: groupItem.unitName,
						colspan: 1,
						isEnclosure: true,
						className: styles.table_cell,
					},
					{
						value: groupItem.ki || 'Н/Д',
						colspan: 1,
						isEnclosure: true,
						className: styles.table_cell,
					},
					{
						value: groupItem.ku || 'Н/Д',
						colspan: 1,
						isEnclosure: true,
						className: styles.table_cell,
					},
					{
						value: groupItem.chOb || 'Н/Д',
						colspan: 1,
						isEnclosure: true,
						className: clsx(styles.table_cell, styles.table_cell_coef),
					},
				],
				id: String(groupItem.id),
			});
			return acc;
		},
		{},
	);

	const buildTree = (parentId: string): GridTreeTableBlockShape[] => {
		const children = dataDictionary[parentId];
		if (children) {
			const treeTableData = children.data.reduce(
				(acc: GridTreeTableBlockShape[], child) => {
					if (dataDictionary[child.id]) {
						acc.push({
							data: [...child.dataLine],
							block: buildTree(child.id),
						});
					} else {
						acc.push({
							data: [...child.dataLine],
						});
					}
					return acc;
				},
				[],
			);
			return treeTableData;
		}
		return [{ data: [] }];
	};
	const tableData = buildTree('root');

	const headers = [
		{
			value: 'Наименование',
			colspan: 1,
			isHeader: true,
		},
		{
			value: 'Коэф.',
			colspan: 1,
			isHeader: true,
			className: styles.table_header_cell,
		},
		{
			value: '№',
			colspan: 1,
			isHeader: true,
			className: styles.table_header_cell,
		},
		{
			value: 'Значение',
			colspan: 1,
			isHeader: true,
			className: styles.table_header_cell,
		},
		{
			value: 'f(x)',
			colspan: 1,
			isHeader: true,
			className: styles.table_header_cell,
		},
		{
			value: 'Ед.изм',
			colspan: 1,
			isHeader: true,
			className: styles.table_header_cell,
		},
		{
			value: 'KI',
			colspan: 1,
			isHeader: true,
			className: styles.table_header_cell,
		},
		{
			value: 'KU',
			colspan: 1,
			isHeader: true,
			className: styles.table_header_cell,
		},
		{
			value: 'Коэф. счет.',
			colspan: 1,
			isHeader: true,
			className: styles.table_header_cell,
		},
	];

	return {
		isLoading,
		headers,
		tableData,
		contextMenuObject,
		formula: groupFormula,
		groupId: contextMenuObject?.groupId,
		isGroupFormulaModalOpen,
	};
}

export default useGroupTable;
