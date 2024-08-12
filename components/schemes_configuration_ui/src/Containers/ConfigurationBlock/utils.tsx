import {
	FormObjectParameters,
	FormParameters,
	ObjectConfigTreeOpenState,
} from '../../Models/EditMode/types';
import { RegisteredModals } from '../../Shared/modalsConfig';
import { FormTypes } from '../../Shared/types';
import { ObjectTypes } from '../../Shared/Types/formObject';
import { ParameterType } from '../../UI/Parameter/types';
import { TreeItem } from '../../UI/Tree/types';

import ConfigurationItem from './ConfigurationItem';
import { PARAMETERS_GROUP_TYPE, PARAMETERS_MODAL_TYPE } from './const';

export function getParameterType(
	item: FormObjectParameters | FormParameters,
): ParameterType {
	if (PARAMETERS_MODAL_TYPE.includes(item.parameterName))
		return ParameterType.Modal;
	if (item.parameterName === 'cornerAngle') return ParameterType.Range;
	if (item.parameterName === 'img') return ParameterType.File;
	if (item.dataType === 'bit' || item.dataTypeDelphi === 'Boolean')
		return ParameterType.Toggle;
	if (item.dataTypeDelphi === 'TColor') return ParameterType.Color;
	if (item.parameterName === 'goton' || item.parameterName === 'gotonCode')
		return ParameterType.Modal;
	if (item.possibleValues) return ParameterType.List;
	return ParameterType.Number;
}
export function getModalName(item: FormObjectParameters | FormParameters) {
	if (item.parameterName === 'goton' || item.parameterName === 'gotonCode')
		return RegisteredModals.TransitionTree;
	if (PARAMETERS_GROUP_TYPE.includes(item.parameterName))
		return RegisteredModals.SelectGroup;
	if (item.parameterName === 'csqlChannel')
		return RegisteredModals.ChannelsTreeForEditingFormModal;
	if (item.parameterName === 'csqlChannel')
		return RegisteredModals.ChannelsTreeForEditingFormModal;
	if (item.parameterName === 'metricId' || item.parameterName === 'metricName')
		return RegisteredModals.EmergencyEventsTree;
	return null;
}

export function sortConfigurationItems(
	items: (FormObjectParameters | FormParameters)[],
) {
	return items.sort((a, b) => {
		if (a.groupNumber === null && b.groupNumber === null) {
			return 0;
		} else if (a.groupNumber === null) {
			return 1;
		} else if (b.groupNumber === null) {
			return -1;
		} else if (a.groupNumber === b.groupNumber) {
			if (a.numberInGroup === null && b.numberInGroup === null) {
				return 0;
			} else if (a.numberInGroup === null) {
				return 1;
			} else if (b.numberInGroup === null) {
				return -1;
			} else {
				return a.numberInGroup - b.numberInGroup;
			}
		} else {
			return a.groupNumber - b.groupNumber;
		}
	});
}
export function createConfigurationTree({
	configItems,
	type,
	objectsConfigHistory,
}: {
	configItems: (FormObjectParameters | FormParameters)[];
	type: FormTypes | ObjectTypes;
	objectsConfigHistory: ObjectConfigTreeOpenState[];
}) {
	const groupsNameList: Map<number, string> = new Map();
	for (const configItem of configItems) {
		groupsNameList.set(
			configItem.groupNumber || 0,
			configItem.groupName || 'Общие',
		);
	}
	let mainTreeItems: TreeItem[] = [];
	if (
		!objectsConfigHistory.some((item) => {
			return item.type === type;
		})
	)
		mainTreeItems = Array.from(groupsNameList.entries()).map(([key, name]) => ({
			id: key,
			order: key,
			parentId: undefined,
			displayName: name || '',
			name: name || '',
			isLast: false,
			isOpen: objectsConfigHistory.length > 0 ? false : true,
		}));
	else {
		const objectConfigHistory = objectsConfigHistory.find((item) => {
			return item.type === type;
		});
		if (objectConfigHistory)
			mainTreeItems = Array.from(groupsNameList.entries()).map(
				([key, name]) => {
					const isOpen =
						objectConfigHistory.config.find((item) => item.displayName === name)
							?.isOpen || false;
					return {
						id: key,
						order: key,
						parentId: undefined,
						displayName: name || '',
						name: name || '',
						isLast: false,
						isOpen,
					};
				},
			);
	}
	for (const configItem of configItems) {
		if (configItem.visibilityForUser)
			mainTreeItems.push({
				id: configItem.parameterCode,
				order: configItem.numberInGroup || 0,
				parentId: configItem.groupNumber || 0,
				displayName: configItem.parameterName || '',
				name: configItem.parameterName || '',
				isLast: true,
				isOpen: true,
				renderFn: () => <ConfigurationItem item={configItem} />,
			});
	}
	return mainTreeItems;
}
export function getParameterResetInfo(parameterName: string) {
	const parameterResetInfo =
		PARAMETER_RESET_INFO[parameterName as keyof typeof PARAMETER_RESET_INFO];
	if (parameterResetInfo) return parameterResetInfo;
	return {
		pairedParameterName: undefined,
		pairedParameterValue: undefined,
		value: '',
	};
}
export const PARAMETER_RESET_INFO = {
	goton: {
		pairedParameterName: 'gotonCode',
		pairedParameterValue: -1,
		value: null,
	},
	gotonCode: {
		pairedParameterName: 'goton',
		pairedParameterValue: '',
		value: -1,
	},
	groupId: {
		pairedParameterName: 'groupName',
		pairedParameterValue: '',
		value: -1,
	},
	asqlGroupId: {
		pairedParameterName: 'asqlGroupName',
		pairedParameterValue: '',
		value: -1,
	},
	groupName: {
		pairedParameterName: 'groupId',
		pairedParameterValue: -1,
		value: '',
	},
	metricId: {
		pairedParameterName: 'metricName',
		pairedParameterValue: '',
		value: null,
	},
	metricName: {
		pairedParameterName: 'metricId',
		pairedParameterValue: null,
		value: '',
	},
	asqlGroupName: {
		pairedParameterName: 'asqlGroupId',
		pairedParameterValue: -1,
		value: '',
	},
	img: {
		pairedParameterName: undefined,
		pairedParameterValue: undefined,
		value: '',
	},
};
