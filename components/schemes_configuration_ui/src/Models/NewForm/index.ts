import { createStore } from 'effector';

import {
	ParentRadioGroup,
	RadioGroup,
} from '../../Containers/FormCreation/types';

import {
	changeActiveFormType,
	clearFormTypes,
	enablePositions,
	onNameChange,
	onParentChange,
	onPositionChange,
	setCopiedId,
	setCopiedIdChildrenFlag,
	setFormOperation,
	setFormTypes,
	setParents,
	setPositionEnd,
	setPositions,
	setTypesIsLoading,
} from './events';
import { FormOperation, FormPosition, NewForm } from './types';

export const $newForm = createStore<NewForm>({
	types: [],
	name: '',
	parents: [],
	positions: [],
	typesIsLoading: false,
	operation: FormOperation.NEW,
	copiedId: 0,
	withChildren: false,
});

$newForm.on(setTypesIsLoading, (state, indicator) => ({
	...state,
	typesIsLoading: indicator,
}));

$newForm.on(setParents, (state, parents) => ({ ...state, parents }));

$newForm.on(setPositions, (state, positions) => ({ ...state, positions }));

$newForm.on(onParentChange, (state, value) => {
	const parents: ParentRadioGroup[] = [...state.parents];
	const oldParentIdx = parents.findIndex((parent) => parent.checked === true);
	if (oldParentIdx !== -1) {
		parents[oldParentIdx] = { ...parents[oldParentIdx], checked: false };
	}
	const newParentIdx = parents.findIndex((parent) => parent.value === value);
	if (newParentIdx !== -1) {
		parents[newParentIdx] = { ...parents[newParentIdx], checked: true };
	}
	return {
		...state,
		parents,
	};
});

$newForm.on(onPositionChange, (state, value) => {
	const positions: RadioGroup[] = [...state.positions];
	const oldPositionIdx = positions.findIndex(
		(position) => position.checked === true,
	);
	if (oldPositionIdx !== -1) {
		positions[oldPositionIdx] = {
			...positions[oldPositionIdx],
			checked: false,
		};
	}
	const newPositionIdx = positions.findIndex(
		(position) => position.value === value,
	);
	if (newPositionIdx !== -1) {
		positions[newPositionIdx] = { ...positions[newPositionIdx], checked: true };
	}
	return {
		...state,
		positions,
	};
});

$newForm.on(setPositionEnd, (state) => {
	const positions = state.positions.map((position) => {
		return {
			...position,
			disabled: true,
			checked: position.value === FormPosition.END.toString() ? true : false,
		};
	});
	return {
		...state,
		positions,
	};
});

$newForm.on(enablePositions, (state) => {
	const positions = state.positions.map((position) => ({
		...position,
		disabled: false,
	}));
	return {
		...state,
		positions,
	};
});

$newForm.on(onNameChange, (state, value) => ({ ...state, name: value }));

$newForm.on(setFormTypes, (state, types) => ({ ...state, types }));
$newForm.on(clearFormTypes, (state) => {
	const types = state.types.map((type) => ({ ...type, isSelected: false }));
	return {
		...state,
		types,
	};
});

$newForm.on(setFormOperation, (state, operation) => ({
	...state,
	operation,
}));

$newForm.on(setCopiedId, (state, copiedId) => ({
	...state,
	copiedId,
}));
$newForm.on(setCopiedIdChildrenFlag, (state, withChildren) => ({
	...state,
	withChildren,
}));

$newForm.on(changeActiveFormType, (state, id) => {
	const types = state.types.map((type) => ({
		...type,
		isSelected: type.value === id,
	}));
	return {
		...state,
		types,
	};
});
