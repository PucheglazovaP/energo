import { ChangeEvent, useCallback } from 'react';

import { formulaToDBAdapter } from '../../Adapters/FormulaEditor/formulaToDBAdapter';
import { ModuleName } from '../../Shared/types';
import { selectUser } from '../../Store/reducers/AuthSlice/authSelectors';
import { selectTreeItemFromContextMenu } from '../../Store/reducers/ConfiguratorSlice/configuratorSelectors';
import {
	copyGroupFormula,
	getFormulaText,
	updateActiveFormula,
	updateFormulaList,
} from '../../Store/reducers/FormulaEditorSlice/FormulaEditorActions';
import {
	selectFormulaText,
	selectGroupNumberForFormulaCopy,
	selectIsFormulaEditorOpen,
} from '../../Store/reducers/FormulaEditorSlice/FormulaEditorSelectors';
import {
	closeFormulaEditorModal,
	openFormulaEditorModal,
	setFormulaText,
	setGroupNumberForFormulaCopy,
} from '../../Store/reducers/FormulaEditorSlice/FormulaEditorSlice';
import { GroupsListItemType } from '../../Types';
import useAppDispatch from '../Store/useAppDispatch';
import { useAppSelector } from '../Store/useAppSelector';

export const useFormulaEditorContainer = () => {
	const dispatch = useAppDispatch();
	const isFormulaEditorOpen = useAppSelector(selectIsFormulaEditorOpen);
	const groupNumberSource = useAppSelector(selectGroupNumberForFormulaCopy);
	const group = useAppSelector(
		selectTreeItemFromContextMenu,
	) as GroupsListItemType;
	const user = useAppSelector(selectUser);
	const formulaText = useAppSelector(selectFormulaText);

	// Запись номера группы в store для копирования
	const handleCopyFormula = useCallback(
		(id: number) => () => {
			dispatch(setGroupNumberForFormulaCopy(id));
		},
		[dispatch],
	);

	// Открытие модального окна редактора формул
	const openFormulaEditor = useCallback(() => {
		dispatch(openFormulaEditorModal());
		dispatch(getFormulaText({ number: Number(group.Number) }));
	}, [dispatch]);

	//Закрытие модального окна редактора формул
	const closeFormulaEditor = useCallback(() => {
		dispatch(closeFormulaEditorModal());
	}, [dispatch]);

	// Применение копирования формулы к группе
	const handleSetGroupFormula = useCallback(() => {
		if (group) {
			dispatch(
				copyGroupFormula({
					number: group.Number,
					numberSource: groupNumberSource,
					lastModified: group.LastModified,
					userId: user?.preferredUsername,
				}),
			);
			dispatch(setGroupNumberForFormulaCopy(null));
		}
	}, [dispatch, group, user, groupNumberSource]);

	//Активация/деактивация формулы
	const onFormulaActiveToggle = useCallback(() => {
		dispatch(
			updateActiveFormula({
				number: group.Number,
				userId: user?.preferredUsername,
				activeFormula: !group.ActiveFormula,
				lastModified: group.LastModified,
				moduleName: ModuleName.UseFormulaEditorContainer_onFormulaActiveToggle,
			}),
		);
	}, [dispatch, user, group]);

	// Сохранение формулы
	const handleSubmitFormula = useCallback(() => {
		dispatch(
			updateFormulaList({
				number: group.Number,
				userId: user?.preferredUsername,
				formulaList: formulaToDBAdapter(formulaText),
				lastModified: group.LastModified,
			}),
		);
	}, [dispatch, group, formulaText, user]);

	//Дополнительный инпут
	const setFormulaInputHandler = useCallback(
		(e: ChangeEvent<HTMLInputElement>) => {
			dispatch(setFormulaText(e.target.value));
		},
		[],
	);
	const setFormulaTextHandler = useCallback((formulaText: string) => {
		dispatch(setFormulaText(formulaText));
	}, []);

	return {
		isFormulaEditorOpen,
		handleCopyFormula,
		handleSetGroupFormula,
		handleSubmitFormula,
		openFormulaEditor,
		closeFormulaEditor,
		groupNumber: Number(group?.Number),
		groupName: String(group?.Name),
		isFormulaActive: group?.ActiveFormula,
		onFormulaActiveToggle,
		formulaText,
		setFormulaInputHandler,
		setFormulaTextHandler,
	};
};
