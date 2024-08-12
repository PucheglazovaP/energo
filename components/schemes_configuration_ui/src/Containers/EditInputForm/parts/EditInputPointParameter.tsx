import React from 'react';
import clsx from 'clsx';

import { InputFormPointOptions } from '../../../Models/InputFormPointOptions/types';
import { InputFormPointCell } from '../../../Models/InputFormPoints/types';
import Input from '../../../UI/Input';
import Select from '../../../UI/Select';
import { InputPointType } from '../types';

import styles from '../EditInputForm.module.css';

function EditInputPointParameter({
	point,
	name,
	onEditInputPointParameter,
	handleEditPoints,
	type,
	options,
}: {
	point: InputFormPointCell;
	name: string;
	type: string;
	onEditInputPointParameter: (
		fieldValue: string | number,
		fieldName: string,
		pointId: number,
	) => void;
	handleEditPoints: (
		fieldValue: string | number,
		fieldName: string,
		pointId: number,
		needRefreshAll: number | null,
	) => void;
	options?: InputFormPointOptions[];
}): JSX.Element {
	if (type === InputPointType.Lookup && options && options?.length > 0) {
		const methodOptions = options.map((option) => ({
			label: option.name,
			value: option.id,
			isSelected: option.id === point.value,
		}));
		return (
			<Select
				className={clsx(styles.select_point)}
				options={methodOptions}
				onSelect={(options) => {
					const selectedOption = options.find((selectOption) => {
						return selectOption.isSelected;
					});
					onEditInputPointParameter(
						selectedOption?.value || 1,
						name,
						Number(point.pointId),
					);
					handleEditPoints(
						selectedOption?.value || 1,
						name,
						Number(point.pointId),
						point.needRefreshAll,
					);
				}}
			/>
		);
	}

	return (
		<Input
			name={name}
			className={styles.point_input}
			type="number"
			value={Number(point?.value)}
			onBlur={(e) =>
				handleEditPoints(
					e.target.value,
					name,
					Number(point.pointId),
					point.needRefreshAll,
				)
			}
			onChange={(e) => {
				onEditInputPointParameter(e.target.value, name, Number(point.pointId));
			}}
		/>
	);
}

export default EditInputPointParameter;
