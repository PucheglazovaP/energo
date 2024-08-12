import React from 'react';

import FormulaEditor from '../../Components/FormulaEditor';
import Modal from '../../Components/Modal';
import { useFormulaEditorContainer } from '../../Hooks/FormulaEditor/useFormulaEditorContainer';
import Parameter from '../../UI/Parameter';
import { ParameterType } from '../../UI/Parameter/types';

import { FormulaEditorHeader } from './types';
import styles from './FormulaEditorContainer.module.scss';

function renderHeader({
	groupNumber,
	groupName,
	isFormulaActive,
	onFormulaActiveToggle,
}: FormulaEditorHeader): JSX.Element {
	return (
		<div className={styles.header}>
			<div className={styles.header__text}>
				<div className={styles.header__title}>Назначенная формула</div>
				<div className={styles.header__subtitle}>
					Группа {groupNumber} &quot;{groupName}&quot;
				</div>
			</div>
			<div className={styles.header__switcher}>
				<Parameter
					type={ParameterType.Toggle}
					caption={`Формула ${isFormulaActive ? 'активна' : 'не активна'}`}
					className={styles.switcher}
					value={String(isFormulaActive)}
					onClick={onFormulaActiveToggle}
				/>
			</div>
		</div>
	);
}

function FormulaEditorContainer() {
	const {
		closeFormulaEditor,
		groupName,
		groupNumber,
		isFormulaActive,
		onFormulaActiveToggle,
		handleSubmitFormula,
		formulaText,
		setFormulaInputHandler,
		setFormulaTextHandler,
	} = useFormulaEditorContainer();

	const handleSelectFormulaElement = (element: string) => {
		console.log(element);
	};

	return (
		<Modal
			title={renderHeader({
				groupNumber,
				groupName,
				isFormulaActive,
				onFormulaActiveToggle,
			})}
			onClose={closeFormulaEditor}
			className={styles.modal}
		>
			<FormulaEditor
				onSubmit={handleSubmitFormula}
				formula={formulaText}
				onCancel={closeFormulaEditor}
				onSelectFormulaElement={handleSelectFormulaElement}
				setFormulaInputHandler={setFormulaInputHandler}
				/* 				isViewModeEnabled={true} */
				setFormulaText={setFormulaTextHandler}
			/>
		</Modal>
	);
}

export default FormulaEditorContainer;
