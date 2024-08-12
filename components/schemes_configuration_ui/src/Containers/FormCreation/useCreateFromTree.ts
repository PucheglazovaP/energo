import { useStore } from 'effector-react';

import { parentRadioGroupAdapter } from '../../Adapters/formCreation/parentRadioGroupAdapter';
import { positionRadioGroupAdapter } from '../../Adapters/formCreation/positionRadioGroupAdapter';
import { $user } from '../../Models/Auth';
import { closeModal } from '../../Models/Modal/events';
import { $navigation } from '../../Models/Navigation';
import { $newForm } from '../../Models/NewForm';
import {
	copyFormFx,
	fetchFormTypesFx,
	saveNewFormFx,
} from '../../Models/NewForm/effects';
import {
	changeActiveFormType,
	clearFormTypes,
	onNameChange,
	setParents,
	setPositions,
} from '../../Models/NewForm/events';
import {
	FormActionParams,
	FormOperation,
	FormType,
} from '../../Models/NewForm/types';
import { $sidebar } from '../../Models/Sidebar';
import { $treeForms } from '../../Models/TreeForms';
import { fetchFormTreeDataFx } from '../../Models/TreeForms/effects';
import { getFormInfoById } from '../../Models/TreeForms/events';
import { ModuleName } from '../../Shared/Types/moduleName';
import { RegisteredModals } from '../ChartComparison/types';

function useCreateFromTree() {
	const tree = useStore($treeForms);
	const { versionId = 90 } = useStore($navigation);
	const { contextMenuId } = useStore($sidebar);
	const { copiedId, operation, parents, types, positions, name } =
		useStore($newForm);
	const user = useStore($user);

	const initForm = async () => {
		const formTypes: FormType[] = await fetchFormTypesFx(versionId);
		const form = tree.find((node) => node.id === copiedId);
		// Create radiogroup based on the type of the operation
		// which will proceed modal
		const parentsRadioGroup = parentRadioGroupAdapter(
			tree,
			contextMenuId,
			operation,
		);
		const positionsRadioGroup = positionRadioGroupAdapter();
		setParents(parentsRadioGroup);
		setPositions(positionsRadioGroup);
		// If modal is not for creating new form,
		// set name of the chosen form and active form type
		if (form && operation !== FormOperation.NEW) {
			onNameChange(`${form.name}_копия`);
			const type = formTypes.find((t) => t.name === form.formType);
			if (type) {
				changeActiveFormType(type.value);
			}
		}
	};

	const closeForm = () => {
		closeModal(RegisteredModals.CreateNewForm);
	};

	const acceptForm = async () => {
		if (!user) {
			return;
		}
		// formTypeCode = form type code if new form, original code of form if copy
		const formTypeCode =
			operation === FormOperation.NEW
				? types.find((type) => type.isSelected)?.code || 0
				: copiedId;
		const params: FormActionParams = {
			name: name,
			formTypeCode,
			parentCode:
				Number(parents.find((parent) => parent.checked)?.value) || null,
			position:
				Number(positions.find((position) => position.checked)?.value) || 0,
			versionCode: versionId || null,
			formCode: contextMenuId,
			userId: user.preferredUsername,
			withChildren: false,
			moduleName: ModuleName.UseCreateFromTransparent_saveNewFormFx,
		};
		switch (operation) {
			case FormOperation.NEW: {
				const formId: number = await saveNewFormFx(params);
				closeModal(RegisteredModals.CreateNewForm);
				await fetchFormTreeDataFx({
					versionCode: params.versionCode || 0,
					userId: user.preferredUsername,
					moduleName: ModuleName.UseCreateFromTree_fetchFormTreeDataFx,
				});
				getFormInfoById({
					formId,
					versionCode: params.versionCode || 0,
					userId: user.preferredUsername,
				});
				break;
			}
			case FormOperation.COPY:
				copyFormFx({ ...params });
				break;
			case FormOperation.COPY_WITH_CHILDREN:
				copyFormFx({ ...params, withChildren: true });
				break;
		}
	};

	const resetForm = () => {
		const parentsRadioGroup = parentRadioGroupAdapter(tree, contextMenuId);
		const positionsRadioGroup = positionRadioGroupAdapter();

		setParents(parentsRadioGroup);
		setPositions(positionsRadioGroup);
		onNameChange('');
		clearFormTypes();
	};

	return {
		initForm,
		closeForm,
		acceptForm,
		resetForm,
	};
}

export default useCreateFromTree;
