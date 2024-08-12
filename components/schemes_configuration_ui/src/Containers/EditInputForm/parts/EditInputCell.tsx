import React, { useCallback } from 'react';
import clsx from 'clsx';

import Input from '../../../UI/Input';
import Select from '../../../UI/Select';
import { EditInputCellProps, InputType } from '../types';

import styles from '../EditInputForm.module.css';

function EditInputCell({
	id,
	type,
	name,
	value,
	options,
	handleEditValue = () => {},
	onChange,
	additionalCellStyles,
	additionalCellText,
	withoutOnBlur = false,
}: EditInputCellProps): JSX.Element {
	const onEdit = useCallback(
		(e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
			handleEditValue(e.target.value, name, id);
		},
		[handleEditValue, id, name],
	);
	if (type === InputType.Text) {
		return (
			<textarea
				className={styles.comment}
				name={name}
				onBlur={withoutOnBlur ? () => {} : onEdit}
				value={String(value)}
				onChange={(e) => {
					onChange(e.target.value, name, id);
				}}
				placeholder="Введите комментарий..."
			/>
		);
	}

	if (type === InputType.Lookup && options && options?.length > 0) {
		const methodOptions = options.map((option) => ({
			label: option.name,
			value: option.id,
			isSelected: option.id === value,
		}));
		return (
			<Select
				className={clsx(styles.select)}
				options={methodOptions}
				onSelect={(options) => {
					const selectedOption = options.find((selectOption) => {
						return selectOption.isSelected;
					});
					onChange(selectedOption?.value || 1, name, id);
					handleEditValue(selectedOption?.value || 1, name, id);
				}}
			/>
		);
	}

	if (additionalCellText) {
		return (
			<div className={clsx(styles.table_text)}>
				<Input
					name={name}
					value={String(value)}
					type={'number'}
					onBlur={withoutOnBlur ? () => {} : onEdit}
					onChange={(e) => {
						onChange(e.target.value, name, id);
					}}
					className={styles.input}
				/>
				<span
					className={clsx(styles.table_text)}
					style={additionalCellStyles}
					title={String(additionalCellText)}
				>
					{typeof value === 'number'
						? additionalCellText.toLocaleString()
						: additionalCellText}
				</span>
			</div>
		);
	}

	return (
		<Input
			name={name}
			value={String(value)}
			type={'number'}
			onBlur={withoutOnBlur ? () => {} : onEdit}
			onChange={(e) => {
				onChange(e.target.value, name, id);
			}}
			className={styles.input}
		/>
	);
}

export default EditInputCell;
