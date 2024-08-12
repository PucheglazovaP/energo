import { toast } from 'react-toastify';
import { createStore, sample } from 'effector';

import { RadioGroup } from '../../Containers/FormCreation/types';
import { ModuleName } from '../../Shared/Types/moduleName';
import { handleError } from '../../Utils/handleToast';

import {
	assignResponsiblePersonsFx,
	changeAssignedResponsiblePersonFx,
	fetchAssignedResponsiblePersonsListFx,
	fetchResponsiblePersonsListFx,
	getEnumValuesFx,
	handleQueryFails,
	saveNewParameterFx,
	saveParameterFx,
	unassginResponsiblePersonFx,
} from './effects';
import {
	addResponsiblePerson,
	changeResponsiblePerson,
	deleteResponsiblePerson,
	resetParameterCreationData,
	saveNewParameter,
	saveParameter,
	setAssignedResponsiblePersonsList,
	setControlGroupNumber,
	setControlParameterFlag,
	setDataTypeList,
	setDynamicObjectGroupNumber,
	setGroupNumberInfo,
	setInfoForEditing,
	setName,
	setNewPosition,
	setOperation,
	setResponsiblePersonsList,
	setResponsiblePersonsListIsLoading,
	setSelectedParameterId,
	setSelectedParameterParentId,
	setSelectGroupType,
} from './events';
import {
	NewParameter,
	ParameterOperation,
	ParameterPosition,
	ResponsiblePersonOperationStatus,
	SelectGroupType,
} from './types';

export const $newEmergencyEventParameter = createStore<NewParameter>({
	id: null,
	parentId: null,
	responsiblePersons: [],
	name: '',
	selectedParameterId: null,
	listIsLoading: false,
	controlGroupNumber: null,
	controlGroupNumberDataTypeCode: null,
	dynamicObjectGroupNumber: null,
	itHasControlParameter: false,
	selectedPersonsList: [],
	operation: ParameterOperation.New,
	positions: [
		{
			name: 'Выше текущего узла',
			value: String(ParameterPosition.ABOVE),
			checked: false,
			disabled: false,
		},
		{
			name: 'Ниже текущего узла',
			value: String(ParameterPosition.UNDER),
			checked: true,
			disabled: false,
		},
		{
			name: 'Потомком текущего узла',
			value: String(ParameterPosition.CHILD),
			checked: false,
			disabled: false,
		},
	],
	unitId: null,
	selectGroupType: SelectGroupType.ControlGroupNumber,
	lastModified: '',
	dataTypeList: [],
});

$newEmergencyEventParameter.on(
	setResponsiblePersonsListIsLoading,
	(state, indicator) => ({
		...state,
		listIsLoading: indicator,
	}),
);
$newEmergencyEventParameter.on(setName, (state, value) => ({
	...state,
	name: value,
}));

$newEmergencyEventParameter.on(
	setResponsiblePersonsList,
	(state, responsiblePersons) => ({
		...state,
		responsiblePersons,
	}),
);
$newEmergencyEventParameter.on(
	setAssignedResponsiblePersonsList,
	(state, assignedResponsiblePersonsList) => {
		const { responsiblePersons } = state;
		if (assignedResponsiblePersonsList.length > 0)
			return {
				...state,
				selectedPersonsList: assignedResponsiblePersonsList.map((item) => ({
					items: [...responsiblePersons].map((person) => ({
						...person,
						isSelected: item.skey === person.skey,
					})),
					skey: item.skey,
					recordCode: item.recordCode,
					lastModified: item.lastModified,
					operationStatus: ResponsiblePersonOperationStatus.NoChange,
				})),
			};
		else
			return {
				...state,
				selectedPersonsList: [
					{
						items: [...responsiblePersons],
						operationStatus: ResponsiblePersonOperationStatus.Add,
					},
				],
			};
	},
);

$newEmergencyEventParameter.on(addResponsiblePerson, (state) => {
	const { responsiblePersons } = state;
	return {
		...state,
		selectedPersonsList: [
			...state.selectedPersonsList,
			{
				items: [...responsiblePersons],
				operationStatus: ResponsiblePersonOperationStatus.Add,
			},
		],
	};
});
$newEmergencyEventParameter.on(deleteResponsiblePerson, (state, payload) => {
	const { selectedPersonsList } = state;
	return {
		...state,
		selectedPersonsList: selectedPersonsList.map((item, index) => {
			if (index === payload)
				return {
					...item,
					operationStatus: ResponsiblePersonOperationStatus.Delete,
				};
			return item;
		}),
	};
});
$newEmergencyEventParameter.on(
	changeResponsiblePerson,
	(state, { options, personNumber }) => {
		const { selectedPersonsList } = state;
		return {
			...state,
			selectedPersonsList: selectedPersonsList.map((item, index) => {
				if (index === personNumber)
					return {
						...item,
						items: [...options],
						operationStatus: item.recordCode
							? ResponsiblePersonOperationStatus.Change
							: ResponsiblePersonOperationStatus.Add,
					};
				return item;
			}),
		};
	},
);
$newEmergencyEventParameter.on(setControlParameterFlag, (state, value) => ({
	...state,
	itHasControlParameter: value,
}));
$newEmergencyEventParameter.on(setOperation, (state, value) => ({
	...state,
	operation: value,
}));
$newEmergencyEventParameter.on(setSelectedParameterId, (state, value) => ({
	...state,
	id: value,
}));
$newEmergencyEventParameter.on(
	setSelectedParameterParentId,
	(state, value) => ({
		...state,
		parentId: value,
	}),
);
$newEmergencyEventParameter.on(setNewPosition, (state, value) => {
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
$newEmergencyEventParameter.on(
	setInfoForEditing,
	(
		state,
		{
			name,
			controlGroupNumber,
			dynamicObjectGroupNumber,
			lastModified,
			unitId,
			dataTypeCode,
		},
	) => ({
		...state,
		name,
		controlGroupNumber,
		dynamicObjectGroupNumber,
		itHasControlParameter:
			controlGroupNumber != null || dynamicObjectGroupNumber != null,
		lastModified,
		unitId,
		controlGroupNumberDataTypeCode: dataTypeCode,
	}),
);
$newEmergencyEventParameter.on(
	setGroupNumberInfo,
	(state, { number, unitId }) => {
		const { selectGroupType } = state;
		if (selectGroupType === SelectGroupType.ControlGroupNumber)
			return {
				...state,
				controlGroupNumber: number,
				unitId,
			};
		else
			return {
				...state,
				dynamicObjectGroupNumber: number,
			};
	},
);
$newEmergencyEventParameter.on(setSelectGroupType, (state, value) => {
	return {
		...state,
		selectGroupType: value,
	};
});
$newEmergencyEventParameter.on(setControlGroupNumber, (state, value) => {
	return {
		...state,
		controlGroupNumber: value,
	};
});
$newEmergencyEventParameter.on(setDynamicObjectGroupNumber, (state, value) => {
	return {
		...state,
		dynamicObjectGroupNumber: value,
	};
});
$newEmergencyEventParameter.on(setDataTypeList, (state, dataTypeList) => {
	return {
		...state,
		dataTypeList,
	};
});

sample({
	clock: [saveNewParameter],
	source: $newEmergencyEventParameter,
	fn: (sourceData, clockData) => {
		const userId = clockData;
		const {
			id,
			parentId,
			positions,
			controlGroupNumber,
			dynamicObjectGroupNumber,
			unitId,
			itHasControlParameter,
			name,
			dataTypeList,
		} = sourceData;
		const position = positions.find((item) => item.checked)?.value;
		const dataTypeCode = dataTypeList.find((item) => item.isSelected)?.value;
		if (position === '3')
			return {
				id: id || 0,
				userId,
				parentId: id,
				order: 0,
				controlGroupNumber,
				dynamicObjectGroupNumber,
				unitId,
				itHasControlParameter,
				name,
				dataTypeCode: dataTypeCode ? Number(dataTypeCode) : 0,
				moduleName: ModuleName.SaveNewParameter_sample_saveNewParameterFx,
			};
		return {
			id: id || 0,
			userId,
			parentId,
			order: Number(position),
			controlGroupNumber,
			dynamicObjectGroupNumber,
			unitId,
			itHasControlParameter,
			name,
			dataTypeCode: dataTypeCode ? Number(dataTypeCode) : 0,
			moduleName: ModuleName.SaveNewParameter_sample_saveNewParameterFx,
		};
	},
	target: saveNewParameterFx,
});

$newEmergencyEventParameter.watch(
	saveNewParameterFx.done,
	(state, { params: { userId }, result: { id } }) => {
		toast.success('Новый параметр добавлен');
		const { selectedPersonsList } = state;
		const assignedPersons = selectedPersonsList.map(({ items }) =>
			items.find((item) => item.isSelected),
		);
		const requests = assignedPersons.filter((item) => {
			if (item)
				return assignResponsiblePersonsFx({
					skey: item.skey,
					userId,
					id: id || 0,
					moduleName:
						ModuleName.SaveNewParameterFx_watch_assignResponsiblePersonsFx,
				});
		});
		Promise.allSettled([...requests]);
	},
);
$newEmergencyEventParameter.watch(
	saveParameterFx.done,
	(state, { params: { userId } }) => {
		toast.success('Параметр отредактирован');
		const { selectedPersonsList, id } = state;
		const assignedPersons = selectedPersonsList.filter(({ items }) =>
			items.find((item) => item.isSelected),
		);
		const requests = assignedPersons.filter(
			({ items, recordCode, operationStatus, lastModified }) => {
				const selectedPerson = items.find((item) => item.isSelected);
				if (selectedPerson) {
					switch (operationStatus) {
						case ResponsiblePersonOperationStatus.Add:
							return assignResponsiblePersonsFx({
								skey: selectedPerson.skey || 0,
								userId,
								id: id || 0,
								moduleName:
									ModuleName.SaveParameterFx_watch_assignResponsiblePersonsFx,
							});
						case ResponsiblePersonOperationStatus.Delete: {
							if (recordCode)
								return unassginResponsiblePersonFx({
									recordCode,
									userId,
									lastModified: lastModified || '',
									moduleName:
										ModuleName.SaveParameterFx_watch_unassginResponsiblePersonFx,
								});
							break;
						}
						case ResponsiblePersonOperationStatus.Change: {
							if (recordCode)
								return changeAssignedResponsiblePersonFx({
									recordCode,
									userId,
									skey: selectedPerson.skey || 0,
									lastModified: lastModified || '',
									moduleName:
										ModuleName.SaveParameterFx_watch_changeAssignedResponsiblePersonFx,
								});
							break;
						}
						case ResponsiblePersonOperationStatus.NoChange: {
							return false;
						}
						default:
							return assignResponsiblePersonsFx({
								skey: selectedPerson.skey || 0,
								userId,
								id: id || 0,
								moduleName:
									ModuleName.SaveParameterFx_watch_assignResponsiblePersonsFx,
							});
					}
				}
			},
		);
		Promise.allSettled([...requests]);
	},
);
sample({
	clock: [saveParameter],
	source: $newEmergencyEventParameter,
	fn: (sourceData, clockData) => {
		const userId = clockData;
		const {
			id,
			controlGroupNumber,
			dynamicObjectGroupNumber,
			unitId,
			name,
			lastModified,
			dataTypeList,
		} = sourceData;
		const dataTypeCode = dataTypeList.find((item) => item.isSelected)?.value;
		return {
			id: id || 0,
			userId,
			lastModified,
			controlGroupNumber,
			dynamicObjectGroupNumber,
			unitId,
			name,
			dataTypeCode: dataTypeCode ? Number(dataTypeCode) : 0,
			moduleName: ModuleName.SaveParameter_sample_saveParameterFx,
		};
	},
	target: saveParameterFx,
});
$newEmergencyEventParameter.reset(resetParameterCreationData);
$newEmergencyEventParameter.watch(handleQueryFails, (_state, { error }) => {
	handleError(error);
});

sample({
	clock: [fetchResponsiblePersonsListFx.done],
	source: $newEmergencyEventParameter,
	fn: (sourceData, clockData) => {
		return clockData.result;
	},
	target: setResponsiblePersonsList,
});
sample({
	clock: [fetchResponsiblePersonsListFx.done],
	source: $newEmergencyEventParameter,
	filter: (sourceData) => {
		const { operation } = sourceData;
		return operation === ParameterOperation.Edit;
	},
	fn: (sourceData) => {
		const { id } = sourceData;
		return id || 0;
	},
	target: fetchAssignedResponsiblePersonsListFx,
});

sample({
	clock: [fetchAssignedResponsiblePersonsListFx.done],
	fn: (clockData) => {
		return clockData.result;
	},
	target: setAssignedResponsiblePersonsList,
});
sample({
	clock: [getEnumValuesFx.done],
	source: $newEmergencyEventParameter,
	fn: (sourceData, clockData) => {
		const { controlGroupNumberDataTypeCode } = sourceData;
		if (controlGroupNumberDataTypeCode == null) return clockData.result;
		return clockData.result.map((item) => ({
			...item,
			isSelected: Number(item.value) === controlGroupNumberDataTypeCode,
		}));
	},
	target: setDataTypeList,
});
