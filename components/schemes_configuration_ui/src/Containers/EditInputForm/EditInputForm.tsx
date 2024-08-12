import React from 'react';
import { Button } from '@evraz/ui-kit';

import { InputFormPointOptions } from '../../Models/InputFormPointOptions/types';
import { InputFormPointsDataset } from '../../Models/InputFormPoints/types';
import { InputFormPointsHeader } from '../../Models/InputFormPointsHeader/types';
import Table from '../../UI/Table';
import InputPointParameter from '../InputFormTable/parts/InputPointParameter';

import EditInputPointParameter from './parts/EditInputPointParameter';
import Legend from './parts/Legend';
import useEditInputForm from './useEditInputForm';

import styles from './EditInputForm.module.css';

function renderPointItems({
	headers,
	pointsDataset,
	onEditInputPointParameter,
	handleEditPoints,
	pointOptions,
}: {
	headers: InputFormPointsHeader[];
	pointsDataset: InputFormPointsDataset;
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
	pointOptions: InputFormPointOptions[];
}) {
	return headers.map((header) => {
		const point = pointsDataset[header.name as keyof typeof pointsDataset];
		if (typeof point == 'number') return;
		return (
			<div key={header.name} className={styles.item}>
				<span>{header.title}</span>
				{point?.isEditable ? (
					<EditInputPointParameter
						type={header.type}
						onEditInputPointParameter={onEditInputPointParameter}
						handleEditPoints={handleEditPoints}
						point={point}
						name={header.name}
						options={pointOptions}
					/>
				) : (
					<InputPointParameter
						value={Number(point?.value)}
						type={header.type}
						options={pointOptions}
					/>
				)}
			</div>
		);
	});
}

function EditInputForm() {
	const {
		inputFormHeader,
		renderSupComponent,
		tableData,
		renderColGroupComponent,
		handleCloseModal,
		handleSaveInputForm,
		handleCloseEdit,
		pointsHeader,
		headerGroup,
		pointsDataset,
		onEditInputPointParameter,
		handleEditPoints,
		pointOptions,
		pointsRef,
		pointsHeight,
	} = useEditInputForm();

	return (
		<div className={styles.root}>
			{headerGroup.length > 0 && (
				<div className={styles.points} ref={pointsRef}>
					{headerGroup.map((group) => {
						const currentHeaders = pointsHeader.filter(
							(header) => header.parentTitle === group.title,
						);
						return (
							<div key={group.order} className={styles.point_group}>
								<h4>{group.title}</h4>
								<div className={styles.group_items}>
									{renderPointItems({
										headers: currentHeaders,
										pointsDataset,
										onEditInputPointParameter,
										handleEditPoints,
										pointOptions,
									})}
								</div>
							</div>
						);
					})}
				</div>
			)}
			<Legend />
			<div
				className={styles.edit_input_body}
				style={{ height: 770 - pointsHeight }}
			>
				<Table
					className={styles.edit_input_form}
					headers={inputFormHeader}
					data={tableData}
					renderSupHeaderFn={renderSupComponent}
					renderColGroupComponent={renderColGroupComponent}
				/>
				<div className={styles.controls}>
					<Button onClick={handleCloseEdit}>Отмена</Button>
					<div className={styles.apply}>
						<Button onClick={handleCloseModal}>Сохранить как черновик</Button>
						<Button onClick={handleSaveInputForm}>Сохранить в журнал</Button>
					</div>
				</div>
			</div>
		</div>
	);
}

export default EditInputForm;
