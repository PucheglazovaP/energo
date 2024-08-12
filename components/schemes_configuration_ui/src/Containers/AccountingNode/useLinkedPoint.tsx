import React, { useCallback } from 'react';
import clsx from 'clsx';
import { useStore } from 'effector-react';

import { Comment, Info } from '../../Icons';
import { $accountingNode } from '../../Models/AccountingNode';
import { openModal } from '../../Models/Modal/events';
import { $points } from '../../Models/Points';
import { RegisteredModals } from '../../Shared/modalsConfig';
import { ITableBody, ITableColumn } from '../../UI/Table/types';

import styles from '../LinkedPointTableParam/LinkedPointTableParam.module.css';

function useLinkedPoint() {
	const accountingNode = useStore($accountingNode);
	const points = useStore($points);

	// Выбранная связанная точка учета
	const linkedPoint = points.filter(
		(linkedPoint) => linkedPoint.id === accountingNode.pointId,
	);

	const linkedPointHeader: ITableColumn[] = [
		{
			accessor: 'captionName',
			text: 'Наименование в отчете',
			isResizable: true,
			isSortable: false,
			sortOrder: 0,
			width: 250,
		},
		{
			accessor: 'name',
			text: 'Полное наименование',
			isResizable: true,
			isSortable: false,
			sortOrder: 0,
			minWidth: 200,
		},
		{
			accessor: 'comment',
			text: 'Коммент.',
			isResizable: true,
			isSortable: false,
			sortOrder: 0,
			minWidth: 30,
			width: 50,
			renderHeaderCell: () => (
				<div className={styles.header_comment}>
					<Comment className={styles.comment_icon} />
				</div>
			),
		},
		{
			accessor: 'isLinked',
			text: 'Связ. канал',
			isResizable: true,
			isSortable: false,
			sortOrder: 0,
			width: 120,
		},
		{
			accessor: 'channelNumber',
			text: '№ канала',
			isResizable: true,
			isSortable: false,
			sortOrder: 0,
			minWidth: 100,
			width: 160,
		},
		{
			accessor: 'channelName',
			text: 'Наименование канала',
			isResizable: true,
			isSortable: false,
			sortOrder: 0,
			minWidth: 480,
		},
		{
			accessor: 'deviceNumber',
			text: '№ прибора',
			isResizable: true,
			isSortable: false,
			sortOrder: 0,
			width: 140,
		},
		{
			accessor: 'coefficient',
			text: 'Коэфф.',
			isResizable: true,
			isSortable: false,
			sortOrder: 0,
			width: 90,
		},
	];

	const linkedPointData: ITableBody[] = linkedPoint.map((linkedPoint) => ({
		dataLine: [
			{
				accessor: 'captionName',
				text: linkedPoint.captionName,
				renderCell: () => (
					<span className={styles.table_text} title={linkedPoint.captionName}>
						{linkedPoint.captionName}
					</span>
				),
			},
			{
				accessor: 'name',
				text: linkedPoint.name,
				renderCell: () => (
					<span className={styles.table_text} title={linkedPoint.name}>
						{linkedPoint.name}
					</span>
				),
			},
			{
				accessor: 'comment',
				text: linkedPoint.comment,
				renderCell: () => (
					<span title={linkedPoint.comment} className={styles.comment_cell}>
						<Comment
							className={clsx(
								styles.comment_icon,
								linkedPoint.comment && styles.comment_icon__active,
							)}
						/>
					</span>
				),
			},
			{
				accessor: 'isLinked',
				text: linkedPoint.channelState,
				className: clsx(
					styles.linked_cell,
					linkedPoint.channelNumber && styles.linked_cell__active,
				),
			},
			{
				accessor: 'channelNumber',
				text: linkedPoint.channelNumber,
			},
			{
				accessor: 'channelName',
				text: linkedPoint.channelName,
				renderCell: () => (
					<span className={styles.table_text} title={linkedPoint.channelName}>
						{linkedPoint.channelName}
					</span>
				),
			},
			{
				accessor: 'deviceNumber',
				text: linkedPoint.deviceNumber,
				renderCell: () => (
					<div className={styles.device_info}>
						<span className={styles.table_text} title={linkedPoint.deviceName}>
							<Info className={styles.info_icon} />
						</span>
						<span>{linkedPoint.deviceNumber}</span>
					</div>
				),
			},
			{
				accessor: 'coefficient',
				text: linkedPoint.coefficient,
			},
		],
	}));

	const handleEditLinkedPoint = useCallback(() => {
		openModal(RegisteredModals.EditLinkedPointFromAccountingNode);
	}, []);

	return {
		linkedPointData,
		linkedPointHeader,
		handleEditLinkedPoint,
	};
}
export default useLinkedPoint;
