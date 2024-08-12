import React from 'react';

import { Edit } from '../../Icons';
import { InputFormPointOptions } from '../../Models/InputFormPointOptions/types';
import { InputFormPointsDataset } from '../../Models/InputFormPoints/types';
import { InputFormPointsHeader } from '../../Models/InputFormPointsHeader/types';
import Spinner from '../../UI/Spinner';
import Table from '../../UI/Table';

import InputPointParameter from './parts/InputPointParameter';
import Legend from './parts/Legend';
import useInputFormTable from './useInputFormTable';

import styles from './InputFormTable.module.css';

function renderPointItems(
	headers: InputFormPointsHeader[],
	pointsDataset: InputFormPointsDataset,
	pointOptions: InputFormPointOptions[],
) {
	return headers.map((header) => {
		const point = pointsDataset[header.name as keyof typeof pointsDataset];
		if (typeof point == 'number') return;
		return (
			<div key={header.name} className={styles.item}>
				<span>{header.title}</span>
				<InputPointParameter
					value={Number(point?.value)}
					type={header.type}
					options={pointOptions}
				/>
			</div>
		);
	});
}

function InputFormTable() {
	const {
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
	} = useInputFormTable();
	return (
		<div className={styles.body}>
			{headerGroup.length > 0 && (
				<div className={styles.points}>
					{headerGroup.map((group) => {
						const currentHeaders = pointsHeader.filter(
							(header) => header.parentTitle === group.title,
						);
						return (
							<div key={group.order} className={styles.point_group}>
								<h4>{group.title}</h4>
								<div className={styles.group_items}>
									{renderPointItems(
										currentHeaders,
										pointsDataset,
										pointOptions,
									)}
								</div>
							</div>
						);
					})}
				</div>
			)}
			<Legend />
			{isTableLoading ? (
				<div className={styles.spinner}>
					<Spinner className={styles.loading} />
				</div>
			) : (
				<>
					<Table
						className={styles.input_form}
						headers={inputFormHeader}
						data={tableData}
						renderSupHeaderFn={renderSupComponent}
						renderColGroupComponent={renderColGroupComponent}
					/>
					<button
						onClick={handleOpenModal}
						title={'Редактировать форму'}
						className={styles.edit}
					>
						<Edit />
					</button>
				</>
			)}
		</div>
	);
}

export default InputFormTable;
