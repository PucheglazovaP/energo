import React from 'react';
import { Button } from '@evraz/ui-kit';

import Input from '../../UI/Input';
import Switcher from '../../UI/Switcher';

import { useCreateReportItem } from './useCreateReportItem';

import styles from './CreateReportItem.module.css';

function CreateReportItem() {
	const {
		handleCloseModal,
		handleConfirm,
		handleChangeName,
		positionGroups,
		handlePositionsChange,
		name,
	} = useCreateReportItem();
	return (
		<div>
			<section className={styles.fields}>
				<div className={styles.input_wrapper}>
					<Input
						isRequired
						label="Наименование"
						placeholder="Введите наименование..."
						value={name}
						onChange={handleChangeName}
						className={styles.text}
					/>
				</div>
				<h4>Расположение</h4>
				{positionGroups.map((position) => (
					<Switcher
						key={position.value}
						checked={position.checked}
						type={'radio'}
						value={position.value}
						name={position.name}
						caption={position.name}
						onChange={handlePositionsChange}
					/>
				))}
			</section>
			<div className={styles.controls}>
				<Button onClick={handleCloseModal}>Закрыть</Button>
				<Button disabled={!name} onClick={handleConfirm} primary>
					Применить
				</Button>
			</div>
		</div>
	);
}

export default CreateReportItem;
