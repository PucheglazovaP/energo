import React from 'react';
import { AngleDown } from '@evraz/ui-kit';
import clsx from 'clsx';

import LinkedDevicesAndChannelsTable from '../../Containers/PointsReports/LinkedDevicesAndChannelsTable';
import { Comment, Info } from '../../Icons';
import { ActivePoint, Point } from '../../Models/Points/types';
import { ITableBody } from '../../UI/Table/types';

import { linkedTableAdapter } from './linkedTableAdapter';

import styles from '../../Containers/PointsReports/PointsReports.module.css';

export default function pointsTableBodyAdapter(
	points: Point[],
	onCollapse: ({ id, userId }: { id: number; userId: string }) => void,
	changeIsActivePointEvent: ({ id, isActive }: ActivePoint) => void,
	onOpen: (evt: React.MouseEvent, id: number) => void,
	userId: string,
): ITableBody[] {
	return points.map((point) => ({
		dataLine: [
			{
				accessor: 'collapse',
				text: 'collapse',
				renderCell: () => (
					<button
						type="button"
						className={
							point.isCollapsed
								? styles.btn
								: clsx(styles.btn, styles['btn--hide'])
						}
						onClick={() => onCollapse({ id: point.id, userId })}
					>
						<AngleDown
							className={clsx(
								styles.arrow,
								point.isCollapsed ? styles['arrow--down'] : '',
							)}
						/>
					</button>
				),
			},
			{
				accessor: 'captionName',
				text: point.captionName,
				renderCell: () => (
					<span className={styles.table_text} title={point.captionName}>
						{point.captionName}
					</span>
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
				text: point.channelState,
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
					<span
						className={clsx(styles.table_text, styles.table_text__left)}
						title={point.channelName}
					>
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
							<span className={styles.info_title} title={point.deviceName}>
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
							id={`linked-button-${point.id}`}
							className={styles.link_wrapper}
						>
							<button
								className={styles.link_button}
								onClick={() => {
									const linkedPoint = document.getElementById(
										`linked-button-${point.linkedPointId}`,
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
		child: () => {
			const { data: linkedData, header: linkedHeader } =
				linkedTableAdapter(point);
			return (
				<LinkedDevicesAndChannelsTable
					headers={linkedHeader}
					data={linkedData}
				/>
			);
		},
		rowClassName:
			point.isCollapsed || point.isActive ? styles.collapsed : undefined,
		isCollapsed: point.isCollapsed,
		onMouseEnter: () => {
			point.isActive
				? changeIsActivePointEvent({
						id: point.id,
						isActive: false,
				  } as ActivePoint)
				: undefined;
		},
		onContextMenu: (evt: React.MouseEvent) => onOpen(evt, point.id),
	}));
}
