import { useEffect, useMemo } from 'react';
import { Switcher } from '@evraz/ui-kit';
import clsx from 'clsx';
import { useStore } from 'effector-react';

import { $user } from '../../Models/Auth';
import { $editMode, $selectedObjectsState } from '../../Models/EditMode';
import {
	changeFormName,
	setConfigurationType,
} from '../../Models/EditMode/events';
import { $formLayers } from '../../Models/FormLayers';
import { getCurrentFormLayersFx } from '../../Models/FormLayers/effects';
import { setFormLayers } from '../../Models/FormLayers/events';
import { ConfigurationTypes, FormTypes } from '../../Shared/types';
import {
	DynamicObjectConfiguration,
	TransparentConfiguration,
} from '../../Shared/Types/formObject';
import { ModuleName } from '../../Shared/Types/moduleName';
import SelectedItemInfo from '../../UI/SelectedItemInfo';
import FormLayers from '../FormLayers';

import AlignmentElementsTools from './AlignmentElementsTools';
import ConfigurationList from './ConfigurationList';
import { CONFIGURATION_TYPES_LIST, ConfigurationBlockProps } from './types';

import styles from './ConfigurationBlock.module.css';

function ConfigurationBlock({ className, style }: ConfigurationBlockProps) {
	const editMode = useStore($editMode);
	const { formType, title, selectedConfigurationType, id } = editMode;
	const user = useStore($user);
	const { selectedObjects, isFormSelected } = useStore($selectedObjectsState);
	const { checkedFormLayers } = useStore($formLayers);

	const filteredSelectedObjects = selectedObjects.filter((item) =>
		checkedFormLayers.includes(item.layerId),
	);

	const { selectedObjectName, selectedObjectType } = useMemo(() => {
		if (isFormSelected)
			return { selectedObjectName: title, selectedObjectType: formType };
		if (filteredSelectedObjects.length > 0) {
			return {
				selectedObjectName:
					(filteredSelectedObjects[0] as TransparentConfiguration).text ||
					(filteredSelectedObjects[0] as DynamicObjectConfiguration).nameObject,
				selectedObjectType: filteredSelectedObjects[0].objectType,
			};
		}
		return { selectedObjectName: '', selectedObjectType: '' };
	}, [filteredSelectedObjects, isFormSelected, formType, title]);

	const isMultipleSelection = useMemo(() => {
		if (filteredSelectedObjects.length >= 2) {
			return true;
		} else {
			return false;
		}
	}, [filteredSelectedObjects]);

	const handleFormNameChange = (value: string) => {
		if (!user) {
			return;
		}
		changeFormName({ name: value, userId: user.preferredUsername });
	};
	const hadnleConfigurationTypeSelect = (id: string) => {
		setConfigurationType(id as ConfigurationTypes);
	};

	useEffect(() => {
		if (!user) return;
		setFormLayers([]);
		getCurrentFormLayersFx({
			userId: user.preferredUsername,
			formId: id || 0,
			moduleName: ModuleName.ConfigurationBlock_getCurrentFormLayersFx,
		});
	}, []);

	return (
		<aside className={clsx(styles.root, className)} style={style}>
			{formType === FormTypes.Form && (
				<div className={styles.switcher_wrapper}>
					<Switcher
						items={CONFIGURATION_TYPES_LIST}
						selectedId={selectedConfigurationType}
						onSelect={hadnleConfigurationTypeSelect}
						className={styles.switcher}
					/>
				</div>
			)}
			{selectedConfigurationType === ConfigurationTypes.Inspector ? (
				<>
					{isMultipleSelection ? (
						<p className={styles.group}>Группа</p>
					) : (
						<SelectedItemInfo
							type={selectedObjectType}
							name={selectedObjectName}
							isFormSelected={isFormSelected}
							onChange={handleFormNameChange}
							className={styles.item_info}
						/>
					)}
					<AlignmentElementsTools />
					<ConfigurationList />
				</>
			) : (
				<FormLayers />
			)}
		</aside>
	);
}

export default ConfigurationBlock;
