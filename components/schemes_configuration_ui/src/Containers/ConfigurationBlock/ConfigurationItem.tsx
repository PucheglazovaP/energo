import { useCallback } from 'react';
import React from 'react';
import { useStore } from 'effector-react';

import { $activeIds } from '../../Models/ActiveIds';
import { $editMode, $selectedObjectsState } from '../../Models/EditMode';
import {
	setEditableParameterName,
	updateFormParameter,
	updateObjectParameter,
} from '../../Models/EditMode/events';
import { FormObjectParameters } from '../../Models/EditMode/types';
import { $formSettings } from '../../Models/FormSettings';
import { setSearchInfo } from '../../Models/HardwareGroup/event';
import {
	setFormParameters,
	setType,
} from '../../Models/ImagesCollectionParameters/events';
import { CollectionType } from '../../Models/ImagesCollectionParameters/types';
import { openModal } from '../../Models/Modal/events';
import { $multichartSettings } from '../../Models/MultichartSettings';
import { RegisteredModals } from '../../Shared/modalsConfig';
import { FormTypes } from '../../Shared/types';
import Parameter from '../../UI/Parameter';
import { ParameterType } from '../../UI/Parameter/types';
import convertValue from '../../Utils/convertValue';

import {
	STATUS_INDICATOR_COLOR_PARAMETERS,
	STATUS_INDICATOR_DEFAULT_COLORS,
} from './const';
import { ConfigurationItemProps } from './types';
import { getModalName, getParameterResetInfo, getParameterType } from './utils';

import styles from './ConfigurationBlock.module.css';

function ConfigurationItem({ item }: ConfigurationItemProps) {
	const editMode = useStore($editMode);

	const { id, formType, isHintModeEnabled, formParameters, objectParameters } =
		editMode;
	const { selectedObjects, isFormSelected } = useStore($selectedObjectsState);
	const { activeVersion } = useStore($activeIds);
	const { activeId } = useStore($formSettings);
	const { activeId: multichartActiveId } = useStore($multichartSettings);

	const updateParameter = useCallback(
		(
			value: string,
			parameterCode: number,
			dataTypeDelphi: string,
			parameterName: string,
		) => {
			const convertedValue = convertValue(value, dataTypeDelphi);

			if (isFormSelected)
				updateFormParameter({
					value: convertedValue,
					parameterCode,
					formId: id as number,
					parameterName,
					versionCode: activeVersion?.code as number,
				});
			else if (formType === FormTypes.MultiChart) {
				updateObjectParameter({
					objectId: multichartActiveId,
					value: convertedValue,
					parameterCode,
					parameterName,
					versionCode: activeVersion?.code as number,
				});
			} else {
				let value = convertedValue;
				if (parameterName === 'x') {
					value =
						Number(convertedValue) >= 791 || Number(convertedValue) < 0
							? 0
							: convertedValue;
				}
				if (parameterName === 'y') {
					value =
						Number(convertedValue) >= 528 || Number(convertedValue) < 0
							? 0
							: convertedValue;
				}
				selectedObjects.forEach((item) =>
					updateObjectParameter({
						objectId: item.id,
						value,
						parameterCode,
						parameterName,
						versionCode: activeVersion?.code as number,
					}),
				);
			}
		},
		[
			isFormSelected,
			id,
			activeVersion,
			selectedObjects,
			formType,
			multichartActiveId,
		],
	);
	const handleModalOpen = (parameterName: string) => {
		if (modalName === RegisteredModals.SelectGroup) {
			if (formType === FormTypes.Chart) {
				const groupIdInfo = formParameters.find(
					(parameter) => parameter.parameterName === 'asqlGroupId',
				);
				setSearchInfo({
					value: groupIdInfo?.value ? String(groupIdInfo?.value) : '',
					filterMode: 1,
				});
			} else if (formType === FormTypes.MultiChart) {
				const selectedSeriesParameters: FormObjectParameters[] | undefined =
					objectParameters.get(multichartActiveId);
				if (selectedSeriesParameters) {
					const groupIdInfo = selectedSeriesParameters.find(
						(parameter) => parameter.parameterName === 'asqlGroupId',
					);
					setSearchInfo({
						value: groupIdInfo?.value ? String(groupIdInfo?.value) : '',
						filterMode: 1,
					});
				}
			} else {
				const formObject = selectedObjects.find(
					(object) => object.id === (item as FormObjectParameters).objectId,
				);
				setSearchInfo({
					value: formObject?.groupId ? String(formObject?.groupId) : '',
					filterMode: 1,
				});
				setEditableParameterName(parameterName);
			}
		}
		modalName && openModal(modalName);
	};

	const handleResetClick = (
		parameterCode: number,
		parameterName: string,
		defaultValue: string | number,
	) => {
		if (STATUS_INDICATOR_COLOR_PARAMETERS.includes(parameterName)) {
			updateObjectParameter({
				objectId: selectedObjects[0]?.id || multichartActiveId,
				value:
					STATUS_INDICATOR_DEFAULT_COLORS[
						parameterName as keyof typeof STATUS_INDICATOR_DEFAULT_COLORS
					],
				parameterCode: parameterCode,
				parameterName,
				versionCode: activeVersion?.code as number,
			});
		} else {
			const parameterResetInfo = getParameterResetInfo(parameterName);
			if (formType === FormTypes.MultiChart)
				updateObjectParameter({
					objectId: multichartActiveId,
					value: defaultValue,
					parameterCode,
					parameterName,
					versionCode: activeVersion?.code as number,
					pairedParameterName: parameterResetInfo.pairedParameterName,
					pairedParameterValue: parameterResetInfo.pairedParameterValue,
				});
			else {
				if (isFormSelected)
					updateFormParameter({
						formId: activeId || 0,
						value: defaultValue,
						parameterCode: parameterCode,
						parameterName,
						versionCode: activeVersion?.code as number,
						pairedParameterName: parameterResetInfo.pairedParameterName,
						pairedParameterValue: parameterResetInfo.pairedParameterValue,
					});
				else {
					selectedObjects.forEach((item) => {
						updateObjectParameter({
							objectId: item.id,
							value: defaultValue,
							parameterCode,
							parameterName,
							versionCode: activeVersion?.code as number,
							pairedParameterName: parameterResetInfo.pairedParameterName,
							pairedParameterValue: parameterResetInfo.pairedParameterValue,
						});
					});
				}
			}
		}
	};
	const handleRangeChange = (
		e: React.ChangeEvent<HTMLInputElement>,
		parameterCode: number,
		parameterName: string,
	): void => {
		selectedObjects.forEach((item) =>
			updateObjectParameter({
				objectId: item.id,
				value: e.target.value,
				parameterCode: parameterCode,
				parameterName,
				versionCode: activeVersion?.code as number,
			}),
		);
	};
	const handleFileChange = (
		parameterCode: number,
		parameterName: string,
	): void => {
		setType(CollectionType.single);
		setFormParameters({ code: parameterCode, name: parameterName });
		openModal(RegisteredModals.ImagesCollection);
	};

	const configType = getParameterType(item);
	const modalName = getModalName(item);

	const inputValue = item.value != null ? String(item.value) : item.value;

	switch (configType) {
		case ParameterType.File:
			return item.visibilityForUser ? (
				<Parameter
					value={inputValue}
					caption={item.parameterForDisplay}
					type={configType}
					className={styles['list-item']}
					isHintEnabled={isHintModeEnabled}
					onResetClick={() => {
						handleResetClick(
							item.parameterCode,
							item.parameterName,
							item.defaultValue,
						);
					}}
					onClick={() => {
						handleFileChange(item.parameterCode, item.parameterName);
					}}
					parameterComment={item.comment}
				/>
			) : null;
		case ParameterType.Range:
			return item.visibilityForUser ? (
				<Parameter
					value={inputValue}
					caption={item.parameterForDisplay}
					type={configType}
					isHintEnabled={isHintModeEnabled}
					className={styles['list-item']}
					onChange={(e) => {
						handleRangeChange(e, item.parameterCode, item.parameterName);
					}}
					parameterComment={item.comment}
				/>
			) : null;
		case ParameterType.Modal:
			return item.visibilityForUser ? (
				<Parameter
					value={inputValue}
					caption={item.parameterForDisplay}
					type={configType}
					className={styles['list-item']}
					isHintEnabled={isHintModeEnabled}
					onResetClick={() => {
						handleResetClick(
							item.parameterCode,
							item.parameterName,
							item.defaultValue,
						);
					}}
					onModalOpen={() => {
						handleModalOpen(item.parameterName);
					}}
					parameterComment={item.comment}
					disabled={item.parameterCode < 0}
				/>
			) : null;
		case ParameterType.List:
			return item.visibilityForUser && item.possibleValues ? (
				<Parameter
					value={inputValue}
					valuesList={item.possibleValues}
					caption={item.parameterForDisplay}
					isHintEnabled={isHintModeEnabled}
					type={configType}
					className={styles['list-item']}
					onClick={(value) => {
						updateParameter(
							value,
							item.parameterCode,
							item.dataTypeDelphi,
							item.parameterName,
						);
					}}
					parameterComment={item.comment}
				/>
			) : null;
		default: {
			return item.visibilityForUser ? (
				<Parameter
					value={inputValue}
					caption={item.parameterForDisplay}
					type={configType}
					isHintEnabled={isHintModeEnabled}
					className={styles['list-item']}
					onClick={(value) => {
						updateParameter(
							value,
							item.parameterCode,
							item.dataTypeDelphi,
							item.parameterName,
						);
					}}
					onResetClick={() =>
						handleResetClick(
							item.parameterCode,
							item.parameterName,
							item.defaultValue,
						)
					}
					parameterComment={item.comment}
					disabled={item.parameterCode < 0}
				/>
			) : null;
		}
	}
}

export default ConfigurationItem;
