import React, { useCallback, useEffect } from 'react';
import clsx from 'clsx';
import { useStore } from 'effector-react';

import { $accountingNode } from '../../Models/AccountingNode';
import { setAccountingNode } from '../../Models/AccountingNode/events';
import { setActiveLinkedParameterIdEvent } from '../../Models/EditLinkedParameter/events';
import { openModal } from '../../Models/Modal/events';
import { $parameterByValueTable } from '../../Models/ParametersByValueReports';
import { RegisteredModals } from '../../Shared/modalsConfig';
import { ITableBody, ITableColumn } from '../../UI/Table/types';

import styles from '../LinkedParameterTableParam/LinkedParameterTableParam.module.css';

function useLinkedParameter() {
	const accountingNode = useStore($accountingNode);
	const { parametersList } = useStore($parameterByValueTable);

	// Выбранная связанный параметер
	const linkedParameter = parametersList.filter(
		(parameter) => parameter.parameterId === accountingNode.linkedDailyPointsId,
	);

	// Шапка таблицы
	const linkedParameterHeader: ITableColumn[] = [
		{
			accessor: 'shortName',
			text: 'Короткое наименование',
			isResizable: true,
			sortOrder: 0,
			width: 250,
		},
		{
			accessor: 'name',
			text: 'Полное наименование',
			isResizable: true,
			sortOrder: 0,
			width: 400,
		},
		{
			accessor: 'pointName',
			text: 'Базовая ТУ',
			isResizable: true,
			sortOrder: 0,
			width: 160,
		},
		{
			accessor: 'methodName',
			text: 'Метод обработки',
			isResizable: true,
			sortOrder: 0,
		},
		{
			accessor: 'calcName',
			text: 'Способ вычисления',
			isResizable: true,
			sortOrder: 0,
		},
		{
			accessor: 'precision',
			text: 'Округление',
			isResizable: true,
			width: 100,
			sortOrder: 0,
		},
		{
			accessor: 'hourShift',
			text: 'Сдвиг в часах',
			isResizable: true,
			width: 120,
			sortOrder: 0,
		},
		{
			accessor: 'linkedColumns',
			text: 'Связ. параметр',
			isResizable: true,
			sortOrder: 0,
			minWidth: 140,
			width: 140,
		},
	];

	// Данные таблицы
	const linkedParameterData: ITableBody[] = linkedParameter.map(
		(parameter) => ({
			dataLine: [
				{
					accessor: 'shortName',
					text: parameter.shortName,
					renderCell: () => (
						<span title={parameter.shortName}>{parameter.shortName}</span>
					),
				},
				{
					accessor: 'name',
					text: parameter.name,
					renderCell: () => (
						<span title={parameter.name}>{parameter.name}</span>
					),
				},
				{
					accessor: 'pointName',
					text: parameter.pointName,
					renderCell: () => (
						<span title={parameter.pointName}>{parameter.pointName}</span>
					),
				},
				{
					accessor: 'methodName',
					text: parameter.methodName,
					renderCell: () => (
						<span title={parameter.methodName}>{parameter.methodName}</span>
					),
				},
				{
					accessor: 'calcName',
					text: parameter.calcName,
					renderCell: () => (
						<span title={parameter.calcName}>{parameter.calcName}</span>
					),
				},
				{
					accessor: 'precision',
					text: parameter.precision,
					renderCell: () => (
						<span title={String(parameter.precision)}>
							{parameter.precision}
						</span>
					),
				},
				{
					accessor: 'hourShift',
					text: parameter.hourShift,
					renderCell: () => (
						<span title={String(parameter.hourShift)}>
							{parameter.hourShift}
						</span>
					),
				},
				{
					accessor: 'linkedColumns',
					text: parameter.linkedColumns ? 'Да' : 'Нет',
					className: clsx(
						styles.linked_cell,
						parameter.linkedColumns && styles.linked_cell__active,
					),
				},
			],
		}),
	);

	const handleUnbindLinkedParameter = useCallback(() => {
		setAccountingNode({
			...accountingNode,
			linkedDailyPointsId: null,
		});
		setActiveLinkedParameterIdEvent(null);
	}, [accountingNode]);

	const handleEditLinkedParameter = useCallback(() => {
		openModal(RegisteredModals.LinkedParameter);
	}, []);

	useEffect(() => {
		setActiveLinkedParameterIdEvent(accountingNode.linkedDailyPointsId);
	}, [accountingNode.linkedDailyPointsId]);

	return {
		linkedParameterHeader,
		linkedParameterData,
		handleEditLinkedParameter,
		handleUnbindLinkedParameter,
	};
}
export default useLinkedParameter;
