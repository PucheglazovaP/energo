import { combine } from 'effector';

import { $activeForm } from '../ActiveForm';
import { $editMode } from '../EditMode';

export const $formWithEditInfo = combine(
	$editMode,
	$activeForm,
	(editMode, activeForm) => ({
		isEdititng: editMode.isEditing,
		title: activeForm.title,
		isTitleVisible: activeForm.isTitleVisible,
		id: activeForm.id,
		isLoading: activeForm.isLoading,
	}),
);
