import { ReactNode } from 'react';
import { Button, Calendar, Tooltip } from '@evraz/ui-kit';
import { format } from 'date-fns';

import { AngleDown } from '../../Icons';
import Repeat from '../../Icons/Repeat';
import { openModal } from '../../Models/Modal/events';
import { NSISelectedUnit } from '../../Models/NSISelectedUnit/types';
import {
	changeUserParameterValue,
	setSelectedListId,
	switchAllUserParametersExpandedState,
	switchUserParameterExpandedState,
} from '../../Models/NSIUserParameters/events';
import {
	NSIUserParameter,
	NSIUserParameterOptionsModel,
} from '../../Models/NSIUserParameters/types';
import { RegisteredModals } from '../../Shared/modalsConfig';
import { TooltipDirection } from '../../Shared/types';
import Input from '../../UI/Input';
import RadioButton from '../../UI/RadioButton';
import Select from '../../UI/Select';
import { SelectOption } from '../../UI/Select/types';

import { DataTableCell, TableDataItem } from './components/DataTable/types';
import FilesList from './components/FilesList';
import { NSIParameterType } from './types';

import styles from './NSIUserParameters.module.css';

const booleanCellLabel: Record<string, string> = {
	'0': 'Нет',
	'1': 'Да',
};

export function getTableData(
	unit: NSISelectedUnit,
	userId: string,
	mode: 'read' | 'edit',
	parameters: NSIUserParameter[],
	parameterOptions: NSIUserParameterOptionsModel,
	allParametersExpanded: boolean,
): {
	header: DataTableCell[];
	body: TableDataItem[];
} {
	const header: DataTableCell[] = [
		{
			cellId: 'nsi-control-header-cell',
			cellClassName: styles.table_cell__control,
			content: (
				<Button
					className={styles.expand_btn__compact}
					onClick={() => {
						switchAllUserParametersExpandedState();
					}}
				>
					<AngleDown
						className={
							!allParametersExpanded
								? styles.expand_icon__inactive
								: styles.expand_icon
						}
					/>
				</Button>
			),
		},
		{
			cellId: 'nsi-name-header-cell',
			cellClassName: styles.table_cell,
			content: 'Наименование',
		},
		{
			cellId: 'nsi-value-header-cell',
			cellClassName: styles.table_cell__wide,
			content: 'Значение параметра',
		},
		{
			cellId: 'nsi-type-header-cell',
			cellClassName: styles.table_cell__short,
			content: 'Тип данных',
		},
	];

	function getCellValue(type: string, value: string | null): string {
		if (type === NSIParameterType.FILE) {
			return '';
		}

		if (type === NSIParameterType.BOOLEAN) {
			return value !== null ? booleanCellLabel[value] : '-';
		}

		if (type === NSIParameterType.DATE) {
			return value !== null ? format(new Date(value), 'dd.MM.yyyy') : '-';
		}

		return value ?? '-';
	}

	function getCellComponent(
		id: number,
		type: string,
		value: string | null,
		valueId: number | null,
	): ReactNode {
		if (type === NSIParameterType.TEXT) {
			return (
				<textarea
					className={styles.textarea}
					value={value ?? ''}
					onChange={(e) => {
						changeUserParameterValue({
							id,
							value: e.currentTarget.value,
						});
					}}
				/>
			);
		}

		if (type === NSIParameterType.BOOLEAN) {
			return (
				<div className={styles.radiogroup_field}>
					<div className={styles.radiogroup}>
						<RadioButton
							checked={value === '1'}
							onChange={() => {
								changeUserParameterValue({
									id,
									value: '1',
								});
							}}
						/>
						<span className={styles.radiogroup_title}>Да</span>
					</div>
					<div className={styles.radiogroup}>
						<RadioButton
							checked={value === '0'}
							onChange={() => {
								changeUserParameterValue({
									id,
									value: '0',
								});
							}}
						/>
						<span className={styles.radiogroup_title}>Нет</span>
					</div>
				</div>
			);
		}

		if (type === NSIParameterType.DATE) {
			return (
				<Calendar
					className={styles.calendar}
					dates={[value !== null ? new Date(value) : new Date()]}
					disableTypeSelector
					onSelect={(period) => {
						changeUserParameterValue({
							id,
							value: format(period[0], 'yyyy-MM-dd 00:00:00'),
						});
					}}
				/>
			);
		}

		if (type === NSIParameterType.LIST) {
			const options = parameterOptions.get(id);

			const selectOptions: SelectOption[] = options
				? options.parameterOptions.map((parameterOption) => {
						const stringifiedId = String(parameterOption.valueId);

						return {
							value: stringifiedId,
							label: parameterOption.value,
							isSelected:
								parameterOption.value === value || stringifiedId === value,
						};
				  })
				: [];

			const handleSelectOption = (optionsList: SelectOption[]) => {
				const selectedOption = optionsList.find((option) => {
					return option.isSelected;
				});

				if (selectedOption) {
					changeUserParameterValue({
						id,
						value: String(selectedOption.value),
					});
				}
			};

			const handleGroupChangeClick = () => {
				setSelectedListId(id);

				openModal(RegisteredModals.NSIGroupChangeValues);
			};

			return (
				<div className={styles.select_field}>
					<Select
						className={styles.select}
						options={selectOptions}
						onSelect={handleSelectOption}
					/>
					<Tooltip
						tooltip="Групповая замена значения у совпадающих позиций списка"
						direction={TooltipDirection.Right}
					>
						<Button
							className={styles.group_change_btn}
							disabled={valueId === null}
							key="nsi-group-change-btn"
							onClick={handleGroupChangeClick}
						>
							<Repeat />
						</Button>
					</Tooltip>
				</div>
			);
		}

		return (
			<Input
				className={styles.input}
				type="text"
				value={value ?? ''}
				onChange={(e) => {
					changeUserParameterValue({
						id,
						value: e.currentTarget.value,
					});
				}}
			/>
		);
	}

	const body: TableDataItem[] = parameters.map((parameter) => {
		return {
			columnId: `${parameter.id}--${parameter.dataTypeId}--${parameter.valueId}--${parameter.lastModified}`,
			cells: [
				{
					cellId: `nsi-table-row`,
					cellClassName: styles.table_row,
					content: (
						<>
							{parameter.dataType === NSIParameterType.FILE ? (
								<Button
									className={styles.expand_btn}
									onClick={() => {
										switchUserParameterExpandedState(parameter.id);
									}}
								>
									<AngleDown
										className={
											!parameter.expanded
												? styles.expand_icon__inactive
												: styles.expand_icon
										}
									/>
								</Button>
							) : (
								<span className={styles.row_control}>.</span>
							)}
							<div className={styles.row_content_block}>
								<div
									className={
										parameter.dataType === NSIParameterType.FILE &&
										parameter.expanded
											? styles.row_body__active
											: styles.row_body
									}
								>
									<div className={styles.row_item}>{parameter.name}</div>
									<div className={styles.row_item__wide}>
										{mode === 'read' ||
										parameter.dataType === NSIParameterType.FILE
											? getCellValue(parameter.dataType, parameter.value)
											: getCellComponent(
													parameter.id,
													parameter.dataType,
													parameter.value,
													parameter.valueId,
											  )}
									</div>
									<div className={styles.row_item__short}>
										{parameter.dataType}
									</div>
								</div>
								{parameter.dataType === NSIParameterType.FILE &&
								parameter.expanded ? (
									<FilesList
										unit={unit}
										userId={userId}
										viewMode={mode}
										parameter={parameter}
									/>
								) : null}
							</div>
						</>
					),
				},
			],
		};
	});

	return {
		header,
		body,
	};
}
