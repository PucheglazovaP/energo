import React, { useCallback, useEffect, useState } from 'react';
import clsx from 'clsx';
import { useStore } from 'effector-react';

import { Comment, Info } from '../../Icons';
import { $user } from '../../Models/Auth';
import { closeModal, openModal } from '../../Models/Modal/events';
import { $points } from '../../Models/Points';
import { fetchPointsListFx } from '../../Models/Points/effects';
import {
	$editReportItemData,
	INITIAL_REPORT_ITEM_DATA,
} from '../../Models/ReferenseByReports';
import { setEditReportItemData } from '../../Models/ReferenseByReports/events';
import { editReportItemFx } from '../../Models/ReportItems/effects';
import { EditTextName } from '../../Models/ReportItems/types';
import { RegisteredModals } from '../../Shared/modalsConfig';
import { ModuleName } from '../../Shared/Types/moduleName';
import { SelectOption } from '../../UI/Select/types';
import { ITableBody, ITableColumn } from '../../UI/Table/types';

import styles from '../LinkedPointTableParam/LinkedPointTableParam.module.css';

const INITIAL_SELECT_VALUES: SelectOption[] = [
	{
		label: 'Нет',
		value: 0,
		isSelected: false,
	},
	{
		label: 'Да',
		value: 1,
		isSelected: false,
	},
];

export function useEditReportItem() {
	const editReportItemData = useStore($editReportItemData);
	const { isCalculated } = editReportItemData;
	const user = useStore($user);

	const points = useStore($points);

	// Выбранная связанная точка учета
	const linkedPoint = points.filter(
		(linkedPoint) => linkedPoint.id === editReportItemData.pointId,
	);

	const [calculatedOptions, setCalculatedOptions] = useState<SelectOption[]>(
		INITIAL_SELECT_VALUES,
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

	const handleCalculationChange = useCallback(
		(options: SelectOption[]) => {
			setCalculatedOptions([...options]);
		},
		[calculatedOptions, setCalculatedOptions],
	);

	const handleChangeTextValue = useCallback(
		(
			e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
			fieldName: EditTextName,
		) => {
			setEditReportItemData({
				...editReportItemData,
				[fieldName]: e.target.value,
			});
		},
		[editReportItemData],
	);

	const onCloseModal = useCallback(() => {
		closeModal(RegisteredModals.EditReportItem);
		setEditReportItemData(INITIAL_REPORT_ITEM_DATA);
	}, []);

	// Открытие модалки со списком точек

	const handleEditLinkedPoint = useCallback(() => {
		openModal(RegisteredModals.EditLinkedPointFromReportItem);
	}, []);

	// Callback для редактирования узла отчета
	const onSaveReportItem = useCallback(() => {
		const calculated = calculatedOptions.find((option) => option.isSelected);
		editReportItemFx({
			...editReportItemData,
			isCalculated: calculated ? Number(calculated.value) : null,
			moduleName: ModuleName.UseEditReportItem_editReportItemFx,
		});
		closeModal(RegisteredModals.EditReportItem);
	}, [editReportItemData, calculatedOptions]);

	useEffect(() => {
		const changedOptions = calculatedOptions.map((option) =>
			option.value === isCalculated ? { ...option, isSelected: true } : option,
		);
		setCalculatedOptions(changedOptions);
	}, [isCalculated]);

	useEffect(() => {
		if (!user) return;
		fetchPointsListFx({
			energyResource: null,
			userId: user.preferredUsername,
			moduleName: ModuleName.UseEditReportItem_fetchPointsListFx,
		});
	}, [user]);

	return {
		onCloseModal,
		onSaveReportItem,
		handleChangeTextValue,
		editReportItemData,
		linkedPointHeader,
		linkedPointData,
		handleEditLinkedPoint,
		calculatedOptions,
		handleCalculationChange,
	};
}
