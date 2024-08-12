import React, { useCallback, useEffect, useMemo } from 'react';
import clsx from 'clsx';
import { format, startOfMonth } from 'date-fns';
import { useStore } from 'effector-react';

import inputFormHeaderTableAdapter from '../../Adapters/InputForm/inputFormHeaderTableAdapter';
import { $user } from '../../Models/Auth';
import { createInputFormSessionFx } from '../../Models/EditInputForm/effects';
import { setEditDataset } from '../../Models/EditInputForm/events';
import { setEditPoints } from '../../Models/EditInputFormPoints/events';
import {
	$energyResourceId,
	$energyResources,
} from '../../Models/EnergyResources';
import { $inputFormDataset, $refresh } from '../../Models/InputForm';
import { fetchInputFormDatasetFx } from '../../Models/InputForm/effects';
import { $inputFormHeader } from '../../Models/InputFormHeader';
import { fetchInputFormHeaderFx } from '../../Models/InputFormHeader/effects';
import {
	HeaderGroup,
	HeaderParameterType,
} from '../../Models/InputFormHeader/types';
import { $inputFormPointOptions } from '../../Models/InputFormPointOptions';
import { fetchInputFormPointOptionsFx } from '../../Models/InputFormPointOptions/effects';
import { $inputFormPointsDataset } from '../../Models/InputFormPoints';
import { fetchInputFormPointsDatasetFx } from '../../Models/InputFormPoints/effects';
import { $inputFormPointsHeader } from '../../Models/InputFormPointsHeader';
import { fetchInputFormPointsHeaderFx } from '../../Models/InputFormPointsHeader/effects';
import { $inputFormSelectOptions } from '../../Models/InputFormSelectOptions';
import { fetchInputFormSelectOptionsFx } from '../../Models/InputFormSelectOptions/effects';
import { $inputFormSession } from '../../Models/InputFormSession';
import { fetchInputFormSessionFx } from '../../Models/InputFormSession/effects';
import { openModal } from '../../Models/Modal/events';
import { $datePeriod } from '../../Models/ReportsTechnical';
import { setDatePeriod } from '../../Models/ReportsTechnical/events';
import { RegisteredModals } from '../../Shared/modalsConfig';
import { TreeTypes } from '../../Shared/types';
import { ModuleName } from '../../Shared/Types/moduleName';
import { Cell, ITableBody } from '../../UI/Table/types';

import InputCell from './parts/InputCell';

import styles from './InputFormTable.module.css';

function useInputFormTable() {
	const user = useStore($user);
	const header = useStore($inputFormHeader);
	const dataset = useStore($inputFormDataset);
	const pointsHeader = useStore($inputFormPointsHeader);
	const pointsDataset = useStore($inputFormPointsDataset);
	const pointOptions = useStore($inputFormPointOptions);
	const date = useStore($datePeriod);
	const { sessionId, errorMessage } = useStore($inputFormSession);
	const options = useStore($inputFormSelectOptions);
	const refresh = useStore($refresh);
	const isTableLoading = useStore(fetchInputFormDatasetFx.pending);

	// номер выбранного энергоресурса (или дефолтный, если не выбрано)
	const energyResources = useStore($energyResources);

	// номер выбранного энергоресурса (или дефолтный, если не выбрано)
	const energyResourceId = useStore($energyResourceId);

	const baseHour = energyResources.find((item) => item.isSelected)?.baseHour;

	const headerGroup: HeaderGroup[] = [];
	pointsHeader.forEach((item) => {
		const currentGroupIndex = headerGroup.findIndex(
			(group) => group.order === item.parentOrder,
		);
		if (headerGroup[currentGroupIndex]) {
			headerGroup[currentGroupIndex].colSpan += 1;
		} else
			headerGroup.push({
				order: item.parentOrder,
				title: item.parentTitle,
				colSpan: 1,
				isVisible: item.isParentVisible,
				width: item.parentMaxWidth,
			});
	});

	// Колбэк для кнопки редактирования формы
	const handleOpenModal = useCallback(() => {
		if (errorMessage && sessionId) {
			openModal(RegisteredModals.EditInputFormResume);
		} else if (errorMessage) {
			openModal(RegisteredModals.EditInputFormBlocking);
		} else {
			if (!user) return;

			createInputFormSessionFx({
				energyResourceId,
				date: format(date.endDate, 'yyyyMMdd'),
				userId: user.preferredUsername,
				moduleName: ModuleName.UseInputFormTable_createInputFormSessionFx,
			});
			setEditPoints(pointsDataset);
			setEditDataset(dataset);
			openModal(RegisteredModals.EditInputForm);
		}
	}, [sessionId, errorMessage, dataset, user, pointsDataset]);

	const { renderSupComponent, renderColGroupComponent, inputFormHeader } =
		useMemo(() => inputFormHeaderTableAdapter({ header }), [header]);

	const tableData: ITableBody[] = dataset.map((item) => {
		const dataLine: Cell[] = header.map((headerItem) => {
			const cellData = item[headerItem.name as keyof typeof item];
			const cellStyles: React.CSSProperties =
				typeof cellData !== 'number'
					? {
							fontWeight: headerItem.additionalFieldName ? '700' : '400',
							color: String(cellData?.fontColor) || 'inherit',
							backgroundColor: String(cellData?.backgroundColor) || 'inherit',
							border: `1px solid ${cellData?.borderColor}`,
							textAlign:
								headerItem.type === HeaderParameterType.Number
									? 'right'
									: 'left',
					  }
					: {};
			const cellText =
				(typeof cellData !== 'number' ? cellData?.val : '') ?? '';

			const channelLink =
				(typeof cellData !== 'number'
					? `#/monitoring/?versionId=90&treeType=${
							cellData?.iD_Device ? TreeTypes.Devices : TreeTypes.Channels
					  }&serverId=${cellData?.iD_Server}&channelId=${cellData?.val}${
							cellData?.iD_Device
								? '&deviceId='.concat(String(cellData?.iD_Device))
								: ''
					  }&baseHour=${baseHour || 0}`
					: '') ?? '';

			const className = clsx(
				item.level === 1 && styles.row_header,
				headerItem.fixed && 'fixed',
			);

			const methodName =
				options.find((option) => option.id === Number(cellText))?.name || '';

			const additionalCellData = headerItem.additionalFieldName
				? item[headerItem.additionalFieldName as keyof typeof item]
				: undefined;
			const additionalCellStyles: React.CSSProperties =
				additionalCellData && typeof additionalCellData !== 'number'
					? {
							color: String(additionalCellData?.fontColor) || 'inherit',
							backgroundColor:
								String(additionalCellData?.backgroundColor) || 'inherit',
							border: `1px solid ${additionalCellData?.borderColor}`,
							textAlign:
								headerItem.type === HeaderParameterType.Number
									? 'right'
									: 'left',
					  }
					: {};
			const additionalCellText =
				(typeof additionalCellData !== 'number' &&
				additionalCellData !== undefined
					? String(additionalCellData?.val ?? '')
					: '') ?? '';
			return {
				accessor: headerItem.name,
				text: cellText,
				renderCell: () => (
					<InputCell
						cellText={cellText}
						cellStyles={cellStyles}
						methodName={methodName}
						headerItem={headerItem}
						additionalCellStyles={additionalCellStyles}
						additionalCellText={additionalCellText}
						onClick={() => navigateToChannel(channelLink)}
					/>
				),
				className: className,
			};
		});
		return {
			dataLine,
		};
	});

	const navigateToChannel = useCallback((val: string) => {
		window.open(val);
	}, []);

	// Запрос хедера и опций для селекта

	useEffect(() => {
		if (!user) return;
		fetchInputFormSelectOptionsFx({
			userId: user.preferredUsername,
			moduleName: ModuleName.UseInputFormTable_fetchInputFormSelectOptionsFx,
		});
		fetchInputFormPointOptionsFx({
			userId: user.preferredUsername,
			moduleName: ModuleName.UseInputFormTable_fetchInputFormPointOptionsFx,
		});
	}, [user]);

	useEffect(() => {
		if (!user) return;
		fetchInputFormHeaderFx({
			energyResource: energyResourceId,
			userId: user.preferredUsername,
			moduleName: ModuleName.UseInputFormTable_fetchInputFormHeaderFx,
		});
		fetchInputFormPointsHeaderFx({
			energyResource: energyResourceId,
			userId: user.preferredUsername,
			moduleName: ModuleName.UseInputFormTable_fetchInputFormPointsHeaderFx,
		});
	}, [user, energyResourceId]);

	// Запрос данных для таблицы и наличия сессии для редактирвоания
	useEffect(() => {
		if (!user) return;
		fetchInputFormDatasetFx({
			energyResourceId,
			userId: user.preferredUsername,
			date: format(date.endDate, 'yyyyMMdd'),
			moduleName: ModuleName.UseInputFormTable_fetchInputFormDatasetFx,
		});
		fetchInputFormSessionFx({
			energyResourceId,
			userId: user.preferredUsername,
			date: format(date.endDate, 'yyyyMMdd'),
			moduleName: ModuleName.UseInputFormTable_fetchInputFormSessionFx,
		});
		fetchInputFormPointsDatasetFx({
			energyResourceId,
			sessionId: null,
			userId: user.preferredUsername,
			date: format(date.endDate, 'yyyyMMdd'),
			moduleName: ModuleName.UseInputFormTable_fetchInputFormPointsDatasetFx,
		});
	}, [energyResourceId, user, date, refresh]);

	useEffect(() => {
		const currentResourceChangeDate = energyResources.find(
			(item) => item.isSelected,
		)?.changeDateTime;
		if (currentResourceChangeDate) {
			const endDate = new Date(
				format(new Date(currentResourceChangeDate), 'yyyy.MM.dd'),
			);
			const startDate = startOfMonth(new Date(currentResourceChangeDate));

			setDatePeriod({ startDate, endDate });
		}
	}, [energyResources, energyResourceId]);

	return {
		inputFormHeader,
		renderSupComponent,
		tableData,
		renderColGroupComponent,
		handleOpenModal,
		pointsHeader,
		headerGroup,
		pointsDataset,
		pointOptions,
		isTableLoading,
	};
}

export default useInputFormTable;
