import React, { ChangeEvent, useCallback, useEffect } from 'react';
import clsx from 'clsx';
import { useStore } from 'effector-react';

import { Comment, Info } from '../../Icons';
import { $user } from '../../Models/Auth';
import { closeModal, openModal } from '../../Models/Modal/events';
import {
	$editPointData,
	$points,
	INITIAL_EDIT_POINT,
} from '../../Models/Points';
import { savePointFx } from '../../Models/Points/effects';
import { setEditPointData } from '../../Models/Points/events';
import { EditTextName } from '../../Models/Points/types';
import { RegisteredModals } from '../../Shared/modalsConfig';
import { ModuleName } from '../../Shared/Types/moduleName';
import Input from '../../UI/Input';
import { ITableBody, ITableColumn } from '../../UI/Table/types';

import styles from '../LinkedPointTableParam/LinkedPointTableParam.module.css';

export function useEditPointForm() {
	const points = useStore($points);
	const editPointData = useStore($editPointData);
	const user = useStore($user);

	const linkedPoints = points.filter(
		(linkedPoint) => linkedPoint.id === editPointData?.linkedPointId,
	);

	const header: ITableColumn[] = [
		{
			accessor: 'linkedPointRatio',
			text: 'Коэфф. связи',
			isResizable: false,
			isSortable: false,
			sortOrder: 0,
			minWidth: 150,
			width: 250,
		},
		{
			accessor: 'captionName',
			text: 'Наименование в отчете',
			isResizable: false,
			isSortable: false,
			sortOrder: 0,
			minWidth: 150,
			width: 250,
		},
		{
			accessor: 'name',
			text: 'Полное наименование',
			isResizable: false,
			isSortable: false,
			sortOrder: 0,
			minWidth: 200,
		},
		{
			accessor: 'comment',
			text: 'Коммент.',
			isResizable: false,
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
			isResizable: false,
			isSortable: false,
			sortOrder: 0,
			width: 120,
		},
		{
			accessor: 'channelNumber',
			text: '№ канала',
			isResizable: false,
			isSortable: false,
			sortOrder: 0,
			minWidth: 100,
			width: 160,
		},
		{
			accessor: 'channelName',
			text: 'Наименование канала',
			isResizable: false,
			isSortable: false,
			sortOrder: 0,
			minWidth: 480,
		},
		{
			accessor: 'deviceNumber',
			text: '№ прибора',
			isResizable: false,
			isSortable: false,
			sortOrder: 0,
			width: 100,
		},
		{
			accessor: 'coefficient',
			text: 'Коэфф.',
			isResizable: false,
			isSortable: false,
			sortOrder: 0,
			width: 90,
		},
	];
	const data: ITableBody[] = linkedPoints.map((linkedPoint) => ({
		dataLine: [
			{
				accessor: 'linkedPointRatio',
				text: linkedPoint.captionName,
				renderCell: () => (
					<Input
						type="number"
						value={Number(editPointData.linkedPointRatio)}
						onChange={(e: ChangeEvent<HTMLInputElement>) => {
							setEditPointData({
								...editPointData,
								linkedPointRatio: Number(e.target.value),
							});
						}}
					/>
				),
			},
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

	const handleChangeTextValue = useCallback(
		(
			e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
			fieldName: EditTextName,
		) => {
			setEditPointData({
				...editPointData,
				[fieldName]: e.target.value,
			});
		},
		[editPointData],
	);

	const onCloseModal = useCallback(() => {
		closeModal(RegisteredModals.EditPoint);
		setEditPointData(INITIAL_EDIT_POINT);
	}, []);

	// Callback для редактирования точки
	const onSavePoint = useCallback(() => {
		savePointFx({
			...editPointData,
			moduleName: ModuleName.UseEditPointForm_savePointFx,
		});
		closeModal(RegisteredModals.EditPoint);
	}, [editPointData]);

	const handleUnbindPoint = useCallback(() => {
		setEditPointData({
			...editPointData,
			linkedPointId: null,
		});
	}, [editPointData]);

	const handleEditLinkedPoint = useCallback(() => {
		closeModal(RegisteredModals.EditPoint);
		openModal(RegisteredModals.EditLinkedPoint);
	}, []);

	useEffect(() => {
		if (!user) return;
		setEditPointData({ ...editPointData, userId: user.preferredUsername });
	}, [user]);

	return {
		onCloseModal,
		onSavePoint,
		handleChangeTextValue,
		handleUnbindPoint,
		handleEditLinkedPoint,
		editPointData,
		header,
		data,
	};
}
