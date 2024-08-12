import React from 'react';
import { Button } from '@evraz/ui-kit';

import { EditTextName } from '../../Models/ReportItems/types';
import Input from '../../UI/Input';
import Select from '../../UI/Select';
import LinkedPointTableParam from '../LinkedPointTableParam/LinkedPointTableParam';

import { useEditReportItem } from './useEditReportItem';

import styles from './EditReportItem.module.css';

function EditReportItem() {
	const {
		onCloseModal,
		onSaveReportItem,
		editReportItemData,
		handleChangeTextValue,
		handleEditLinkedPoint,
		linkedPointHeader,
		linkedPointData,
		calculatedOptions,
		handleCalculationChange,
	} = useEditReportItem();
	const { positionName, coefficient } = editReportItemData;
	return (
		<div>
			<section className={styles.fields}>
				<div className={styles.side_left}>
					<Input
						isRequired
						label="Наименование"
						placeholder="Введите текст..."
						name={EditTextName.PositionName}
						value={positionName}
						onChange={(e) =>
							handleChangeTextValue(e, EditTextName.PositionName)
						}
						className={styles.text}
					/>
				</div>
				<div className={styles.side_right}>
					<Select
						options={calculatedOptions}
						onSelect={handleCalculationChange}
						className={styles.selector}
						label={'Вычисляемое'}
					/>
					<Input
						type="number"
						label="Коэфф."
						placeholder="0,00"
						name={EditTextName.Coefficient}
						value={coefficient}
						onChange={(e) => handleChangeTextValue(e, EditTextName.Coefficient)}
						className={styles.text}
					/>
				</div>
			</section>
			<LinkedPointTableParam
				data={linkedPointData}
				header={linkedPointHeader}
				handleEditLinkedPoint={handleEditLinkedPoint}
			/>
			<div className={styles.controls}>
				<Button onClick={onCloseModal}>Отменить</Button>
				<Button
					disabled={!editReportItemData.positionName}
					onClick={onSaveReportItem}
					primary
				>
					Сохранить
				</Button>
			</div>
		</div>
	);
}

export default EditReportItem;
