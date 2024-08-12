import { useCallback, useEffect, useMemo, useState } from 'react';
import { toast } from 'react-toastify';
import clsx from 'clsx';
import { Property } from 'csstype';
import { format } from 'date-fns';
import { useStore } from 'effector-react';

import inputFormHeaderTableAdapter from '../../Adapters/InputForm/inputFormHeaderTableAdapter';
import usePageWithEnergyResources from '../../Facades/EnergyResources/usePageWithEnergyResources';
import { $user } from '../../Models/Auth';
import { $energyResources } from '../../Models/EnergyResources';
import { closeModal } from '../../Models/Modal/events';
import { $points } from '../../Models/Points';
import { fetchPointsListFx } from '../../Models/Points/effects';
import { $pointLogBook } from '../../Models/PointsLogBook';
import {
	fetchPointLogBookBodyListFx,
	fetchPointLogBookHeaderListFx,
	savePointLogBookValueFx,
} from '../../Models/PointsLogBook/effects';
import { savePointLogBookValueEvent } from '../../Models/PointsLogBook/events';
import { PointLogBookBodyList } from '../../Models/PointsLogBook/types';
import { $datePeriod } from '../../Models/ReportsTechnical';
import { RegisteredModals } from '../../Shared/modalsConfig';
import { ModuleName } from '../../Shared/Types/moduleName';
import { SelectOption } from '../../UI/Select/types';
import { Cell, ITableBody } from '../../UI/Table/types';
import { RpcError } from '../../Utils/requests';
import EditInputCell from '../EditInputForm/parts/EditInputCell';

import styles from './EditLogBook.module.css';

function useEditLogBook() {
	const user = useStore($user);
	const { energyResourceName, energyResourceId } = usePageWithEnergyResources();
	const points = useStore($points);
	const { pointLogBookHeader, pointLogBookBody, isLoading } =
		useStore($pointLogBook);
	const date = useStore($datePeriod);
	const energyResources = useStore($energyResources);

	const [selectedPointId, setSelectedPointId] = useState<number>();

	// Колбэк для кнопки редактирования формы
	const handleCloseModal = useCallback(() => {
		closeModal(RegisteredModals.EditLogBook);
	}, []);

	// Колбэк для ивента, меняющего значения в таблице
	const onEditInputCell = useCallback(
		(value: string | number, name: string, rowId: string | number) => {
			if (!user) return;

			/* изначальное value из модели */
			const prevValue =
				pointLogBookBody.find((item) => item.date === rowId)?.[
					name as keyof PointLogBookBodyList
				] || null;

			savePointLogBookValueEvent({ id: rowId, columnName: name, value });
			savePointLogBookValueFx({
				sessionId: null,
				pointId: selectedPointId || 1,
				date: format(new Date(rowId), 'yyyy-MM-dd 00:00:00'),
				fieldDatasetName: name,
				fieldValue: value ? String(value) : null,
				userId: user.preferredUsername,
				moduleName: ModuleName.UseEditLogBook_savePointLogBookValueFx,
			}).catch((err) => {
				/* сбрасываем значение инпута до value из модели */
				savePointLogBookValueEvent({
					id: rowId,
					columnName: name,
					value: prevValue,
				});

				if (err instanceof RpcError) {
					err.toastMessage();
				} else {
					toast.error(
						'Что-то пошло не так при сохранении значения в журнале учёта для базовой точки',
					);
				}
			});
		},
		[pointLogBookBody, selectedPointId, user],
	);

	const { renderSupComponent, renderColGroupComponent, inputFormHeader } =
		useMemo(
			() => inputFormHeaderTableAdapter({ header: pointLogBookHeader }),
			[pointLogBookHeader],
		);

	const tableData: ITableBody[] = pointLogBookBody.map((item) => {
		const dataLine: Cell[] = pointLogBookHeader.map((headerItem) => {
			const cellData = item[headerItem.name as keyof typeof item];
			const cellProps =
				typeof cellData === 'object'
					? {
							color: String(cellData?.fontColor) || 'inherit',
							backgroundColor: String(cellData?.backgroundColor) || 'inherit',
							textAlign: headerItem.type === 'Number' ? 'right' : 'left',
							value: cellData?.val ?? '',
							isEditable: cellData?.editable,
					  }
					: {
							textAlign: 'left',
							value: cellData ?? '',
					  };
			return {
				accessor: headerItem.name,
				text: cellProps.value,
				renderCell: () =>
					headerItem.type === 'Date' ? (
						<span
							className={clsx(styles.table_text)}
							style={{
								color: cellProps.color,
								backgroundColor: cellProps.backgroundColor,
								textAlign: cellProps.textAlign as Property.TextAlign,
							}}
							title={format(new Date(cellProps.value), 'yyyy-MM-dd')}
						>
							{format(new Date(cellProps.value), 'yyyy-MM-dd')}
						</span>
					) : (
						<EditInputCell
							name={headerItem.name}
							type={headerItem.type}
							value={cellProps.value}
							/* в качестве id используется дата */
							id={item.date}
							onChange={onEditInputCell}
							withoutOnBlur
						/>
					),
			};
		});

		return {
			dataLine,
		};
	});

	const selectOptions: SelectOption[] = points.map((point): SelectOption => {
		return {
			value: point.id,
			label: point.shortName,
			isSelected: point.id === selectedPointId,
		};
	});

	// колбек выбора точки учета в селекторе
	const handleSelectPoint = (options: SelectOption[]) => {
		const selectedOption: SelectOption | undefined = options.find(
			(selectOption) => {
				return selectOption.isSelected;
			},
		);

		if (selectedOption) {
			setSelectedPointId(selectedOption.value as number);
		}
	};

	const isSelectorDisabled: boolean = points.length === 0;

	// начальный запрос точек учета
	useEffect(() => {
		if (!user) return;
		fetchPointsListFx({
			energyResource: energyResourceId,
			userId: user.preferredUsername,
			moduleName: ModuleName.UseEditLogBook_fetchPointsListFx,
		});
	}, [user, energyResources, energyResourceId]);

	// если точки есть, то обновляем значение в селекторе
	useEffect(() => {
		if (points.length > 0) {
			setSelectedPointId(points[0].id);
		}
	}, [points]);

	// получение журнала учёта для базовой точки
	useEffect(() => {
		if (!user || !selectedPointId) return;
		fetchPointLogBookHeaderListFx({
			pointId: selectedPointId || 1,
			userId: user.preferredUsername,
			moduleName: ModuleName.UseEditLogBook_fetchPointLogBookHeaderListFx,
		});
		fetchPointLogBookBodyListFx({
			fromd: format(date.startDate, 'yyyy-MM-dd 00:00:00'),
			tod: format(date.endDate, 'yyyy-MM-dd 00:00:00'),
			pointId: selectedPointId || 1,
			userId: user.preferredUsername,
			moduleName: ModuleName.UseEditLogBook_fetchPointLogBookBodyListFx,
		});
	}, [date, energyResourceId, points, selectedPointId, user]);

	return {
		inputFormHeader,
		renderSupComponent,
		tableData,
		renderColGroupComponent,
		handleCloseModal,
		energyResourceName,
		isSelectorDisabled,
		selectOptions,
		handleSelectPoint,
		isLoading,
	};
}

export default useEditLogBook;
