import { useStore } from 'effector-react';

import parentRadioGroupForTransparentAdapter from '../../Adapters/formCreation/parentRadioGroupForTransparentAdapter';
import { positionRadioGroupAdapter } from '../../Adapters/formCreation/positionRadioGroupAdapter';
import { $user } from '../../Models/Auth';
import { $editMode, $selectedObjectsState } from '../../Models/EditMode';
import { fetchFormTreeDataFx } from '../../Models/EditMode/effects';
import { updateObjectParameter } from '../../Models/EditMode/events';
import { $formContextMenu } from '../../Models/FormContextMenu';
import { closeModal } from '../../Models/Modal/events';
import { $navigation } from '../../Models/Navigation';
import { $newForm } from '../../Models/NewForm';
import { fetchFormTypesFx, saveNewFormFx } from '../../Models/NewForm/effects';
import {
	changeActiveFormType,
	onNameChange,
	setParents,
	setPositions,
} from '../../Models/NewForm/events';
import { FormActionParams, FormType } from '../../Models/NewForm/types';
import { $treeForms } from '../../Models/TreeForms';
import { FormTreeItem } from '../../Models/TreeForms/types';
import { RegisteredModals } from '../../Shared/modalsConfig';
import { DynamicObjectConfiguration } from '../../Shared/Types/formObject';
import { ModuleName } from '../../Shared/Types/moduleName';
import { TreeItem } from '../../UI/Tree/types';

import { ParentRadioGroup, RadioGroup } from './types';

const getFormById = (tree: TreeItem[], id: number): TreeItem | undefined => {
	const form: TreeItem | undefined = tree.find((node) => node.id === id);
	return form;
};

function useCreateFromDynamicObject() {
	const tree = useStore($treeForms);
	const { versionId = 90, formId = 0 } = useStore($navigation);
	const { object } = useStore($formContextMenu);
	const dynamicObject = object as DynamicObjectConfiguration;
	const { parents, types, positions, name } = useStore($newForm);
	const { objectParameters } = useStore($editMode);
	const { selectedObjects } = useStore($selectedObjectsState);
	const user = useStore($user);

	const initForm = async () => {
		const formTypes: FormType[] = await fetchFormTypesFx(versionId);
		const parents: ParentRadioGroup[] = parentRadioGroupForTransparentAdapter(
			tree,
			formId,
		);
		const positions: RadioGroup[] = positionRadioGroupAdapter();
		// Get first form type as chosen one
		const formType: FormType | undefined = formTypes[0];
		if (!formType) {
			return;
		}
		setParents(parents);
		setPositions(positions);
		onNameChange(dynamicObject.groupName || '');
		changeActiveFormType(formType.value);
	};

	const closeForm = () => {
		closeModal(RegisteredModals.CreateNewFormFromDynamicObject);
	};

	const acceptForm = async () => {
		if (!user) {
			return;
		}
		const formTypeCode = types.find((type) => type.isSelected)?.code || 0;
		const parentCode =
			Number(parents.find((parent) => parent.checked)?.value) || null;
		const position = Number(positions.find((pos) => pos.checked)?.value) || 0;
		const params: FormActionParams = {
			name,
			formTypeCode,
			parentCode,
			position,
			versionCode: versionId,
			formCode: formId,
			objectId: dynamicObject.id,
			userId: user.preferredUsername,
			moduleName: ModuleName.UseCreateFromDynamicObject_saveNewFormFx,
		};

		const form: TreeItem | undefined = getFormById(tree, formId);
		if (!form) {
			return;
		}
		// Save new form and remember it's 'id'
		const newFormId: number = await saveNewFormFx(params);
		// Fetch updated forms tree
		const { tree: updatedTree } = await fetchFormTreeDataFx({
			versionCode: params.versionCode || 0,
			userId: user.preferredUsername,
			moduleName: ModuleName.UseCreateFromDynamicObject_fetchFormTreeDataFx,
		});
		// Find newly created form in the list
		const newForm: FormTreeItem | undefined = updatedTree.find(
			(node) => node.id === newFormId,
		);
		if (!newForm) {
			return;
		}
		// Update dynamic object parameter with newly created form information
		updateObjectParameter({
			objectId: selectedObjects[0].id,
			value: newForm.displayName,
			parameterCode: getParameterCode(),
			parameterName: 'goton',
			versionCode: versionId,
			pairedParameterName: 'gotonCode',
			pairedParameterValue: newForm.id,
		});
		closeModal(RegisteredModals.CreateNewFormFromDynamicObject);
	};

	const resetForm = () => {
		initForm();
	};

	function getParameterCode() {
		if (!selectedObjects.length) {
			return undefined;
		}
		const parameters = objectParameters.get(selectedObjects[0].id);
		if (!parameters) {
			return undefined;
		}
		return parameters.find((parameter) => parameter.parameterName === 'goton')
			?.parameterCode;
	}

	return {
		initForm,
		closeForm,
		acceptForm,
		resetForm,
	};
}

export default useCreateFromDynamicObject;
