import React from 'react';
import clsx from 'clsx';

import { Comment, Info } from '../../Icons';
import { ActivePoint, Point } from '../../Models/Points/types';
import RadioButton from '../../UI/RadioButton';
import { ITableBody } from '../../UI/Table/types';

import styles from '../../Containers/EditLinkedPointForm/EditLinkedPointForm.module.css';

export default function linkedPointsTableAdapter(
	points: Point[],
	changeIsActivePointEvent: ({ id, isActive }: ActivePoint) => void,
	handleSelectPoint: (id: number) => void,
	selectedPoint: number | null,
): ITableBody[] {
	return points.map((point) => ({
		dataLine: [
			{
				accessor: 'captionName',
				text: point.captionName,
				renderCell: () => (
					<div className={styles.radiogroup}>
						<RadioButton checked={selectedPoint === point.id} readOnly />
						<span className={styles.table_text} title={point.captionName}>
							{point.captionName}
						</span>
					</div>
				),
			},
			{
				accessor: 'name',
				text: point.name,
				renderCell: () => (
					<span className={styles.table_text} title={point.name}>
						{point.name}
					</span>
				),
			},
			{
				accessor: 'comment',
				text: point.comment,
				renderCell: () => (
					<span title={point.comment} className={styles.comment_cell}>
						<Comment
							className={clsx(
								styles.comment_icon,
								point.comment && styles.comment_icon__active,
							)}
						/>
					</span>
				),
			},
			{
				accessor: 'isLinked',
				text: point.channelNumber ? 'Да' : 'Нет',
				className: clsx(
					styles.linked_cell,
					point.channelNumber && styles.linked_cell__active,
				),
			},
			{
				accessor: 'channelNumber',
				text: point.channelNumber,
			},
			{
				accessor: 'channelName',
				text: point.channelName,
				renderCell: () => (
					<span className={styles.table_text} title={point.channelName}>
						{point.channelName}
					</span>
				),
			},
			{
				accessor: 'deviceNumber',
				text: point.deviceNumber,
				renderCell: () =>
					point.deviceNumber ? (
						<div className={styles.device_info}>
							<span title={point.deviceName}>
								<Info className={styles.info_icon} />
							</span>
							<span>{point.deviceNumber}</span>
						</div>
					) : (
						<></>
					),
			},
			{
				accessor: 'coefficient',
				text: point.coefficient,
			},
			{
				accessor: 'linkedPoint',
				text: point.linkedPointName || '',
				renderCell: () =>
					point.linkedPointName ? (
						<div
							id={`linked-table-button-${point.id}`}
							className={styles.link_wrapper}
						>
							<button
								className={styles.link_button}
								onClick={() => {
									const linkedPoint = document.getElementById(
										`linked-table-button-${point.linkedPointId}`,
									);
									changeIsActivePointEvent({
										id: point.linkedPointId,
										isActive: true,
									} as ActivePoint);
									linkedPoint?.scrollIntoView({
										block: 'center',
										behavior: 'smooth',
									});
								}}
							>
								<span
									className={styles.link_button_text}
									title={point.linkedPointName}
								>
									{point.linkedPointName}
								</span>
							</button>
						</div>
					) : (
						<span className={styles.linked_cell}>Нет</span>
					),
			},
		],
		rowClassName: point.isActive ? styles.row__active : undefined,
		onRowClick: () => handleSelectPoint(point.id),
		onMouseEnter: () => {
			point.isActive
				? changeIsActivePointEvent({
						id: point.id,
						isActive: false,
				  } as ActivePoint)
				: undefined;
		},
	}));
}
