import { MouseEvent, useEffect } from 'react';
import { Button, SymbolPlus } from '@evraz/ui-kit';
import { useStore } from 'effector-react';

import DataTable from '../../Containers/NSIUserParameters/components/DataTable';
import { NSIParameterType } from '../../Containers/NSIUserParameters/types';
import { closeModal } from '../../Models/Modal/events';
import {
	addUserParameterFx,
	addUserParameterOptionFx,
	deleteUserParameterFx,
	deleteUserParameterOptionFx,
	getUserParameterDataTypesFx,
	getUserParameterOptionsFx,
	getUserParametersListFx,
	updateUserParameterFx,
	updateUserParameterOptionFx,
} from '../../Models/NSIUserParameters/effects';
import {
	addUserParameter,
	changeDefaultParameters,
	resetUserParameterOptionsModel,
	restoreUserParameterOptions,
	restoreUserParametersList,
} from '../../Models/NSIUserParameters/events';
import { RegisteredModals } from '../../Shared/modalsConfig';
import { ModuleName } from '../../Shared/Types/moduleName';
import Divider from '../../UI/Divider';

import { $userParametersConfigurationModel } from './model';
import { ParametersConfigurationControlName } from './types';
import { getTableData } from './utils';

import styles from './NSIUserParametersConfiguration.module.css';

function NSIUserParametersConfiguration() {
	const {
		user,
		selectedUnit,
		userParameterDataTypes,
		userParameters,
		userParameterOptions,
	} = useStore($userParametersConfigurationModel);
	const { parametersList, allParametersExpanded } = userParameters;

	useEffect(() => {
		if (user !== null) {
			getUserParameterDataTypesFx({
				userId: user.preferredUsername,
				moduleName:
					ModuleName.NSIUserParametersConfiguration_getUserParameterDataTypesFx,
			});
		}
	}, [user]);

	useEffect(() => {
		changeDefaultParameters('static');
	}, []);

	const submitDisabled =
		parametersList.length === 0 ||
		!parametersList.some((parameter) => {
			return parameter.touched;
		});

	const tableData =
		parametersList.length !== 0 && user !== null && selectedUnit !== null
			? getTableData(
					selectedUnit,
					user.preferredUsername,
					parametersList,
					userParameterOptions,
					userParameterDataTypes,
					allParametersExpanded,
			  )
			: null;

	const handleControlClick = (e: MouseEvent<HTMLButtonElement>) => {
		const { id } = e.currentTarget;

		if (
			id === ParametersConfigurationControlName.ADD &&
			userParameterDataTypes.length !== 0
		) {
			addUserParameter({
				id: -(parametersList.length + 1),
				name: '',
				dataTypeId: userParameterDataTypes[0].typeId,
				dataType: userParameterDataTypes[0].typeName,
				comment: '',
				lastModified: '',
				valueId: null,
				value: null,
				valueLastModified: null,
				touched: true,
				expanded: true,
				deleted: false,
			});
		}

		if (id === ParametersConfigurationControlName.CANCEL) {
			restoreUserParametersList();

			parametersList
				.filter((parameter) => {
					return parameter.dataType === NSIParameterType.LIST;
				})
				.forEach((listTypeParameter) => {
					restoreUserParameterOptions(listTypeParameter.id);
				});

			closeModal(RegisteredModals.NSIUserParametersConfiguration);
		}

		if (
			id === ParametersConfigurationControlName.SUBMIT &&
			user !== null &&
			selectedUnit !== null
		) {
			const requestsQueue = parametersList
				.filter((parameter) => {
					return parameter.touched;
				})
				.map((touchedParameter) => {
					if (
						touchedParameter.id > 0 &&
						!touchedParameter.deleted &&
						touchedParameter.dataType === NSIParameterType.LIST
					) {
						const listOptions = userParameterOptions.get(touchedParameter.id);

						if (listOptions) {
							return listOptions.parameterOptions
								.filter((option) => {
									return option.touched;
								})
								.map((touchedOption) => {
									if (touchedOption.valueId < 0) {
										return addUserParameterOptionFx({
											userId: user.preferredUsername,
											parameterId: touchedParameter.id,
											value: touchedOption.value,
											moduleName:
												ModuleName.NSIUserParametersConfiguration_addUserParameterOptionFx,
										});
									}

									if (touchedOption.deleted) {
										return deleteUserParameterOptionFx({
											userId: user.preferredUsername,
											valueId: touchedOption.valueId,
											lastModified: touchedOption.lastModified,
											moduleName:
												ModuleName.NSIUserParametersConfiguration_deleteUserParameterOptionFx,
										});
									}

									return updateUserParameterOptionFx({
										userId: user.preferredUsername,
										valueId: touchedOption.valueId,
										value: touchedOption.value,
										lastModified: touchedOption.lastModified,
										moduleName:
											ModuleName.NSIUserParametersConfiguration_updateUserParameterOptionFx,
									});
								});
						}
					}

					if (
						touchedParameter.id < 0 &&
						touchedParameter.dataType === NSIParameterType.LIST
					) {
						const listOptions = userParameterOptions.get(touchedParameter.id);

						addUserParameterFx({
							userId: user.preferredUsername,
							unitTypeId: selectedUnit.typeId,
							name: touchedParameter.name,
							dataTypeId: touchedParameter.dataTypeId,
							comment: touchedParameter.comment,
							moduleName:
								ModuleName.NSIUserParametersConfiguration_addUserParameterFx,
						}).then((addedParameterData) => {
							if (listOptions) {
								return listOptions.parameterOptions
									.filter((option) => {
										return option.touched;
									})
									.map((touchedOption) => {
										return addUserParameterOptionFx({
											userId: user.preferredUsername,
											parameterId: addedParameterData.parameterId,
											value: touchedOption.value,
											moduleName:
												ModuleName.NSIUserParametersConfiguration_addUserParameterOptionFx,
										});
									});
							}
						});
					}

					if (touchedParameter.id < 0) {
						return addUserParameterFx({
							userId: user.preferredUsername,
							unitTypeId: selectedUnit.typeId,
							name: touchedParameter.name,
							dataTypeId: touchedParameter.dataTypeId,
							comment: touchedParameter.comment,
							moduleName:
								ModuleName.NSIUserParametersConfiguration_addUserParameterFx,
						});
					}

					if (touchedParameter.deleted) {
						deleteUserParameterFx({
							userId: user.preferredUsername,
							parameterId: touchedParameter.id,
							lastModified: touchedParameter.lastModified,
							moduleName:
								ModuleName.NSIUserParametersConfiguration_deleteUserParameterFx,
						});
					}

					return updateUserParameterFx({
						userId: user.preferredUsername,
						parameterId: touchedParameter.id,
						name: touchedParameter.name,
						comment: touchedParameter.comment,
						lastModified: touchedParameter.lastModified,
						moduleName:
							ModuleName.NSIUserParametersConfiguration_updateUserParameterFx,
					});
				});

			Promise.allSettled(requestsQueue).then(() => {
				getUserParametersListFx({
					userId: user.preferredUsername,
					unitId: selectedUnit.itemNumber,
					unitTypeId: selectedUnit.typeId,
					moduleName:
						ModuleName.NSIUserParametersConfiguration_getUserParametersListFx,
				}).then((requestedParametersList) => {
					resetUserParameterOptionsModel();

					const listTypeParameters = requestedParametersList.filter(
						(requestedParameter) => {
							return requestedParameter.dataType === NSIParameterType.LIST;
						},
					);

					listTypeParameters.forEach((listTypeParameter) => {
						getUserParameterOptionsFx({
							userId: user.preferredUsername,
							parameterId: listTypeParameter.id,
							moduleName:
								ModuleName.NSIUserParametersConfiguration_getUserParameterOptionsFx,
						});
					});
				});

				changeDefaultParameters('actual');

				closeModal(RegisteredModals.NSIUserParametersConfiguration);
			});
		}
	};

	return (
		<div className={styles.container}>
			<div className={styles.header}>
				<p className={styles.title}>Список доступных</p>
				<div className={styles.controls_block}>
					<Divider />
					<Button
						id={ParametersConfigurationControlName.ADD}
						className={styles.control}
						onClick={handleControlClick}
					>
						<SymbolPlus className={styles.icon} />
						Добавить параметр
					</Button>
				</div>
			</div>
			<div className={styles.body}>
				{tableData !== null ? (
					<DataTable
						headerData={tableData.header}
						bodyData={tableData.body}
						bodyClassName={styles.table_body}
						orientation="row"
					/>
				) : null}
			</div>
			<div className={styles.footer}>
				<Button
					id={ParametersConfigurationControlName.CANCEL}
					onClick={handleControlClick}
				>
					Отменить
				</Button>
				<Button
					id={ParametersConfigurationControlName.SUBMIT}
					primary
					disabled={submitDisabled}
					onClick={handleControlClick}
				>
					Сохранить
				</Button>
			</div>
		</div>
	);
}

export default NSIUserParametersConfiguration;
