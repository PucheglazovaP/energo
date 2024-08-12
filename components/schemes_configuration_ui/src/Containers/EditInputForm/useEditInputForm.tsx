import React, {
	useCallback,
	useEffect,
	useMemo,
	useRef,
	useState,
} from 'react';
import clsx from 'clsx';
import { Property } from 'csstype';
import { format } from 'date-fns';
import { useStore } from 'effector-react';

import inputFormHeaderTableAdapter from '../../Adapters/InputForm/inputFormHeaderTableAdapter';
import { $user } from '../../Models/Auth';
import { $editInputForm } from '../../Models/EditInputForm';
import {
	closeInputFormSessionFx,
	fetchEditInputFormDatasetFx,
	saveInputFormSessionFx,
	updateEditValueFx,
} from '../../Models/EditInputForm/effects';
import { setEditRow } from '../../Models/EditInputForm/events';
import { $editInputFormPoints } from '../../Models/EditInputFormPoints';
import { updateInputFormPointParameterFx } from '../../Models/EditInputFormPoints/effects';
import { setEditParameter } from '../../Models/EditInputFormPoints/events';
import { $energyResourceId } from '../../Models/EnergyResources';
import { fetchInputFormDatasetFx } from '../../Models/InputForm/effects';
import { $inputFormHeader } from '../../Models/InputFormHeader';
import {
	HeaderGroup,
	HeaderParameterType,
} from '../../Models/InputFormHeader/types';
import { $inputFormPointOptions } from '../../Models/InputFormPointOptions';
import { fetchInputFormPointsDatasetFx } from '../../Models/InputFormPoints/effects';
import { $inputFormPointsHeader } from '../../Models/InputFormPointsHeader';
import { $inputFormSelectOptions } from '../../Models/InputFormSelectOptions';
import { fetchInputFormSessionFx } from '../../Models/InputFormSession/effects';
import { closeModal } from '../../Models/Modal/events';
import { $datePeriod } from '../../Models/ReportsTechnical';
import { RegisteredModals } from '../../Shared/modalsConfig';
import { ModuleName } from '../../Shared/Types/moduleName';
import { Cell, ITableBody } from '../../UI/Table/types';

import EditInputCell from './parts/EditInputCell';

import styles from './EditInputForm.module.css';

function useEditInputForm() {
	const user = useStore($user);
	const header = useStore($inputFormHeader);
	const { data, sessionId } = useStore($editInputForm);
	const pointsHeader = useStore($inputFormPointsHeader);
	const editPoints = useStore($editInputFormPoints);
	const date = useStore($datePeriod);
	const options = useStore($inputFormSelectOptions);
	const pointOptions = useStore($inputFormPointOptions);
	const energyResourceId = useStore($energyResourceId);

	const [pointsHeight, setPointsHeight] = useState<number>(0);
	const pointsRef = useRef<HTMLDivElement>(null);
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

	const getSession = useCallback(() => {
		if (!user) return;
		fetchInputFormSessionFx({
			energyResourceId,
			userId: user.preferredUsername,
			date: format(date.endDate, 'yyyyMMdd'),
			moduleName: ModuleName.UseEditInputForm_fetchInputFormSessionFx,
		});
	}, [user, date, energyResourceId, sessionId]);

	// Сохранить значения шапки
	const handleEditPoints = useCallback(
		(
			fieldValue: string | number | null,
			fieldName: string,
			pointId: number,
			needRefreshAll: number | null,
		) => {
			if (!user) return;
			updateInputFormPointParameterFx({
				sessionId,
				energyResourceId,
				userId: user.preferredUsername,
				date: format(date.endDate, 'yyyyMMdd'),
				moduleName: ModuleName.UseEditInputForm_updateInputFormPointParameterFx,
				fieldValue,
				fieldName,
				pointId,
			}).then(() => {
				if (needRefreshAll)
					fetchEditInputFormDatasetFx({
						sessionId,
						userId: user.preferredUsername,
						moduleName: ModuleName.UseEditInputForm_fetchEditInputFormDatasetFx,
					});
			});
		},
		[sessionId, energyResourceId, user, date],
	);

	// Закрыть модалку
	const handleCloseModal = useCallback(() => {
		getSession();
		closeModal(RegisteredModals.EditInputForm);
	}, []);

	// Закрыть сессию
	const handleCloseEdit = useCallback(() => {
		if (!user) return;
		closeInputFormSessionFx({
			sessionId,
			userId: user.preferredUsername,
			moduleName: ModuleName.UseEditInputForm_closeInputFormSessionFx,
		}).then(() => {
			getSession();
		});
		closeModal(RegisteredModals.EditInputForm);
	}, [user, sessionId, energyResourceId]);

	// Колбэк для ивента, меняющего значения в таблице
	const onEditInputCell = useCallback(
		(value: string | number, name: string, rowId: string | number) => {
			setEditRow({ id: rowId, columnName: name, value });
		},
		[],
	);

	// Колбэк для ивента, меняющего значения шапки
	const onEditInputPointParameter = useCallback(
		(fieldValue: string | number, fieldName: string, pointId: number) => {
			setEditParameter({ pointId, fieldName, fieldValue });
		},
		[],
	);

	const handleSaveInputForm = useCallback(() => {
		if (!user) return;
		saveInputFormSessionFx({
			userId: user.preferredUsername,
			sessionId,
			moduleName: ModuleName.UseEditInputForm_saveInputFormSessionFx,
		}).then(() => {
			fetchInputFormPointsDatasetFx({
				energyResourceId,
				sessionId: null,
				userId: user.preferredUsername,
				date: format(date.endDate, 'yyyyMMdd'),
				moduleName: ModuleName.UseEditInputForm_fetchInputFormPointsDatasetFx,
			});
			fetchInputFormDatasetFx({
				energyResourceId,
				userId: user.preferredUsername,
				date: format(date.endDate, 'yyyyMMdd'),
				moduleName: ModuleName.UseEditInputForm_fetchInputFormDatasetFx,
			}).then(() => {
				getSession();
			});
			closeModal(RegisteredModals.EditInputForm);
		});
	}, [user, sessionId, energyResourceId]);

	const handleEditValue = useCallback(
		(value: string | number, name: string, rowId: string | number) => {
			if (!user) return;
			updateEditValueFx({
				value: String(value) || null,
				date: format(date.endDate, 'yyyyMMdd'),
				userId: user.preferredUsername,
				energyResourceId,
				fieldName: name,
				rowId: Number(rowId),
				sessionId,
				moduleName: ModuleName.UseEditInputForm_updateEditValueFx,
			});
		},
		[energyResourceId, sessionId, user, date],
	);

	const { renderSupComponent, renderColGroupComponent, inputFormHeader } =
		useMemo(() => inputFormHeaderTableAdapter({ header }), [header]);

	const tableData: ITableBody[] = data.map((item) => {
		const dataLine: Cell[] = header.map((headerItem) => {
			const cellData = item[headerItem.name as keyof typeof item];
			const cellProps =
				typeof cellData !== 'number'
					? {
							color: String(cellData?.fontColor) || 'inherit',
							backgroundColor: String(cellData?.backgroundColor) || 'inherit',
							textAlign:
								headerItem.type === HeaderParameterType.Number
									? 'right'
									: 'left',
							value: cellData?.val ?? '',
							isEditable: cellData?.editable,
					  }
					: {
							textAlign: 'left',
							value: '',
					  };
			const className = clsx(
				item.level === 1 && styles.row_header,
				headerItem.fixed && 'fixed',
			);

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
				text: cellProps.value,
				renderCell: () =>
					cellProps.isEditable ? (
						<EditInputCell
							name={headerItem.name}
							type={headerItem.type}
							value={cellProps.value}
							options={options}
							id={item.id}
							handleEditValue={handleEditValue}
							onChange={onEditInputCell}
							additionalCellText={additionalCellText}
							additionalCellStyles={additionalCellStyles}
						/>
					) : (
						<span
							className={clsx(styles.table_text)}
							style={{
								color: cellProps.color,
								backgroundColor: cellProps.backgroundColor,
								textAlign: cellProps.textAlign as Property.TextAlign,
							}}
							title={String(cellProps.value)}
						>
							{typeof cellProps.value === 'number'
								? cellProps.value.toLocaleString()
								: cellProps.value}
						</span>
					),
				className: className,
			};
		});
		return {
			dataLine,
		};
	});

	useEffect(() => {
		if (pointsRef && pointsRef.current && pointsRef.current.clientHeight)
			setPointsHeight(pointsRef.current.clientHeight ?? 0);
	}, [pointsRef]);

	return {
		inputFormHeader,
		renderSupComponent,
		tableData,
		renderColGroupComponent,
		handleCloseModal,
		handleSaveInputForm,
		handleCloseEdit,
		pointsHeader,
		headerGroup,
		pointsDataset: editPoints.data,
		onEditInputPointParameter,
		handleEditPoints,
		pointOptions,
		pointsRef,
		pointsHeight,
	};
}

export default useEditInputForm;
