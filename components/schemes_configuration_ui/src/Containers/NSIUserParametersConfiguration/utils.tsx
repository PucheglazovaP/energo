import { ChangeEvent } from 'react';
import { Button, SymbolDelete, SymbolPlus } from '@evraz/ui-kit';

import {
	DataTableCell,
	TableDataItem,
} from '../../Containers/NSIUserParameters/components/DataTable/types';
import { NSIParameterType } from '../../Containers/NSIUserParameters/types';
import { AngleDown } from '../../Icons';
import { NSISelectedUnit } from '../../Models/NSISelectedUnit/types';
import {
	addUserParameterOption,
	changeUserParameterComment,
	changeUserParameterDataType,
	changeUserParameterName,
	changeUserParameterOption,
	deleteUserParameter,
	deleteUserParameterOption,
	switchAllUserParametersExpandedState,
	switchUserParameterExpandedState,
} from '../../Models/NSIUserParameters/events';
import {
	NSIUserParameter,
	NSIUserParameterDataType,
	NSIUserParameterOption,
	NSIUserParameterOptionsModel,
} from '../../Models/NSIUserParameters/types';
import Divider from '../../UI/Divider';
import Input from '../../UI/Input';
import Select from '../../UI/Select';
import { SelectOption } from '../../UI/Select/types';

import styles from './NSIUserParametersConfiguration.module.css';

function getOptionsList(
	parameterId: number,
	optionsList: NSIUserParameterOption[] | undefined,
) {
	const displayedParameterOptions = optionsList
		? optionsList.filter((option) => {
				return !option.deleted;
		  })
		: [];

	if (displayedParameterOptions.length !== 0) {
		return (
			<ul className={styles.options_list}>
				{displayedParameterOptions.map((displayedOption) => {
					return (
						<li className={styles.option} key={displayedOption.valueId}>
							<div className={styles.option_body}>
								<Input
									className={styles.option_input}
									value={displayedOption.value}
									placeholder="Введите текст"
									onChange={(e: ChangeEvent<HTMLInputElement>) => {
										changeUserParameterOption({
											parameterId,
											value: e.currentTarget.value,
											valueId: displayedOption.valueId,
										});
									}}
								/>
							</div>
							<Button
								className={styles.expand_btn}
								onClick={() => {
									deleteUserParameterOption({
										parameterId,
										valueId: displayedOption.valueId,
									});
								}}
							>
								<SymbolDelete className={styles.icon__compact} />
							</Button>
						</li>
					);
				})}
			</ul>
		);
	}

	return null;
}

export function getTableData(
	unit: NSISelectedUnit,
	userId: string,
	parameters: NSIUserParameter[],
	parameterOptions: NSIUserParameterOptionsModel,
	parameterDataTypes: NSIUserParameterDataType[],
	allParametersExpanded: boolean,
): {
	header: DataTableCell[];
	body: TableDataItem[];
} {
	const displayedParameters = parameters.filter((parameter) => {
		return !parameter.deleted;
	});

	const header: DataTableCell[] = [
		{
			cellId: 'parameters-configuration-control-header-cell',
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
			cellId: 'parameters-configuration-name-header-cell',
			cellClassName: styles.table_cell,
			content: 'Наименование',
		},
		{
			cellId: 'parameters-configuration-type-header-cell',
			cellClassName: styles.table_cell__short,
			content: 'Тип данных',
		},
		{
			cellId: 'parameters-configuration-comment-header-cell',
			cellClassName: styles.table_cell__wide,
			content: 'Комментарий',
		},
	];

	const body: TableDataItem[] = displayedParameters.map((parameter) => {
		const selectOptions: SelectOption[] = parameterDataTypes.map(
			(parameterDataType) => {
				return {
					value: parameterDataType.typeId,
					label: parameterDataType.typeName,
					isSelected: parameterDataType.typeName === parameter.dataType,
				};
			},
		);

		const handleSelectOption = (optionsList: SelectOption[]) => {
			const selectedOption = optionsList.find((option) => {
				return option.isSelected;
			});

			if (selectedOption) {
				changeUserParameterDataType({
					id: parameter.id,
					dataTypeId: Number(selectedOption.value),
					dataType: selectedOption.label,
				});
			}
		};

		return {
			columnId: `${parameter.id}--${parameter.dataTypeId}--${parameter.valueId}--${parameter.lastModified}`,
			cells: [
				{
					cellId: `parameters-configuration-table-row`,
					cellClassName: styles.table_row,
					content: (
						<>
							{parameter.dataType === NSIParameterType.LIST ? (
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
										parameter.dataType === NSIParameterType.LIST &&
										parameter.expanded
											? styles.row_body__active
											: styles.row_body
									}
								>
									<div className={styles.row_item}>
										<Input
											className={styles.input}
											type="text"
											value={parameter.name}
											placeholder="Введите наименование"
											onChange={(e) => {
												changeUserParameterName({
													id: parameter.id,
													name: e.currentTarget.value,
												});
											}}
										/>
									</div>
									<div className={styles.row_item__short}>
										<Select
											className={styles.select}
											options={selectOptions}
											disabled={parameter.id > 0}
											onSelect={handleSelectOption}
										/>
									</div>
									<div className={styles.row_item__wide}>
										<textarea
											className={styles.textarea}
											value={parameter.comment}
											placeholder="Введите комментарий"
											onChange={(e) => {
												changeUserParameterComment({
													id: parameter.id,
													comment: e.currentTarget.value,
												});
											}}
										/>
									</div>
								</div>
								{parameter.dataType === NSIParameterType.LIST &&
								parameter.expanded ? (
									<div className={styles.options_block}>
										<div className={styles.header}>
											<p className={styles.title}>
												Значения списка
												<span className={styles.required_marker}>*</span>
											</p>
											<div className={styles.controls_block}>
												<Divider />
												<Button
													className={styles.control}
													onClick={() => {
														addUserParameterOption(parameter.id);
													}}
												>
													<SymbolPlus className={styles.icon} />
													Добавить значение
												</Button>
											</div>
										</div>
										{getOptionsList(
											parameter.id,
											parameterOptions.get(parameter.id)?.parameterOptions,
										)}
									</div>
								) : null}
							</div>
							<Button
								className={styles.expand_btn}
								onClick={() => {
									deleteUserParameter(parameter.id);
								}}
							>
								<SymbolDelete className={styles.icon__compact} />
							</Button>
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
