import React, { useCallback, useEffect, useMemo } from 'react';
import { Button } from '@evraz/ui-kit';
import { useStore } from 'effector-react';

import { $newForm } from '../../Models/NewForm';
import {
	clearFormTypes,
	enablePositions,
	onNameChange,
	onParentChange,
	onPositionChange,
	setFormTypes,
	setParents,
	setPositionEnd,
	setPositions,
} from '../../Models/NewForm/events';
import { FormOperation, FormType } from '../../Models/NewForm/types';
import Input from '../../UI/Input';
import Select from '../../UI/Select';
import { SelectVariant } from '../../UI/Select/types';

import RadioGroupSection from './RadioGroupSection';
import { FormCreationProps } from './types';
import useFormCreation from './useFormCreation';

import styles from './FormCreation.module.css';

function FormCreation(props: FormCreationProps) {
	const { from } = props;
	const { parents, positions, name, types, typesIsLoading, operation } =
		useStore($newForm);

	const { handleInit, handleClose, handleAccept, handleReset } =
		useFormCreation(from);

	const isSelectDisabled = useMemo(() => {
		if (typesIsLoading) {
			return true;
		}
		return operation !== FormOperation.NEW;
	}, []);

	const handleNameChange = useCallback(
		(evt: React.ChangeEvent<HTMLInputElement>) => {
			onNameChange(evt.target.value);
		},
		[],
	);

	const handleParentsChange = useCallback(
		(evt: React.ChangeEvent<HTMLInputElement>) => {
			onParentChange(evt.target.value);
			const newParent = parents.find(
				(parent) => parent.value === evt.target.value,
			);
			if (newParent && newParent.type === 'parent') {
				setPositionEnd();
			} else {
				enablePositions();
			}
		},
		[parents],
	);

	const handlePositionsChange = useCallback(
		(evt: React.ChangeEvent<HTMLInputElement>) => {
			onPositionChange(evt.target.value);
		},
		[],
	);

	const handleFormTypes = useCallback((formTypes: FormType[]) => {
		setFormTypes(formTypes);
	}, []);

	const clearForm = useCallback(() => {
		setParents([]);
		setPositions([]);
		onNameChange('');
		clearFormTypes();
	}, []);

	useEffect(() => {
		handleInit();
		return clearForm;
	}, []);

	return (
		<div className={styles.container}>
			<div className={styles.body}>
				<Select
					options={types}
					onSelect={handleFormTypes}
					placeholder={'please select'}
					legend={'Тип формы'}
					variant={SelectVariant.Secondary}
					disabled={isSelectDisabled}
					isRequired
					className={styles.selector}
				/>
				<Input
					label={'Наименование формы'}
					isRequired
					onChange={handleNameChange}
					value={name}
					error={!name.length ? 'Поле обязательно для заполнения' : undefined}
				/>
				<RadioGroupSection
					title={'Родительская форма'}
					options={parents}
					onChange={handleParentsChange}
				/>
				<RadioGroupSection
					title={'Добавить форму'}
					options={positions}
					onChange={handlePositionsChange}
				/>
			</div>
			<div className={styles.footer}>
				{operation === FormOperation.NEW ? (
					<>
						<Button onClick={handleReset}>Сброс</Button>
						<Button primary onClick={handleAccept}>
							Создать
						</Button>
					</>
				) : (
					<>
						<Button onClick={handleClose}>Отменить</Button>
						<Button onClick={handleAccept}>Вставить</Button>
					</>
				)}
			</div>
		</div>
	);
}

export default FormCreation;
