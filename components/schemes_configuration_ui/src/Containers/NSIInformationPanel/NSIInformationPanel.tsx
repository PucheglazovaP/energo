import React, { useEffect, useState } from 'react';
import { Button, Filter } from '@evraz/ui-kit';
import { useStore } from 'effector-react';

import ReportPreview from '../../Containers/ReportPreview';
import CheckMark from '../../Icons/CheckMark';
import Edit from '../../Icons/Edit';
import LinkOn from '../../Icons/LinkOn';
import Refresh from '../../Icons/Refresh';
import Settings from '../../Icons/Settings';
import { openModal } from '../../Models/Modal/events';
import { setNsiSelectedTab } from '../../Models/NSISelectedUnit/events';
import { NSISelectedUnit } from '../../Models/NSISelectedUnit/types';
import {
	getUserParametersListFx,
	saveUserParameterValueFx,
} from '../../Models/NSIUserParameters/effects';
import { changeViewMode } from '../../Models/NSIUserParameters/events';
import { fetchReportLinkListFx } from '../../Models/Report/effects';
import { Permissions } from '../../packages/KeycloakInstance/types';
import usePermissions from '../../packages/KeycloakInstance/usePermissions';
import { checkPermission } from '../../packages/KeycloakInstance/utils';
import { RegisteredModals } from '../../Shared/modalsConfig';
import { ModuleName } from '../../Shared/Types/moduleName';
import { ReportLinkType } from '../../Shared/Types/report';
import Divider from '../../UI/Divider';
import Select from '../../UI/Select';
import { SelectOption } from '../../UI/Select/types';
import Spinner from '../../UI/Spinner';
import WarningMessage from '../../UI/WarningMessage';
import NSIMeasuringInstrumentsExtendedFiltersChips from '../NSIMeasuringInstrumentsExtendedFiltersChips';
import NSIMeasuringInstrumentsJournal from '../NSIMeasuringInstrumentsJournal';
import NSIUserParameters from '../NSIUserParameters';

import { $informationPanelModel } from './model';
import { ControlName, TabName } from './types';
import { nsiTabOptions } from './utils';

import styles from './NSIInformationPanel.module.css';

function getDisplayedTab(
	tabId: string,
	unit: NSISelectedUnit | null,
	reportPath: string,
) {
	if (tabId === TabName.USER_SETTINGS && unit !== null) {
		return <NSIUserParameters unit={unit} />;
	}

	if (tabId === TabName.MEASURING_INSTRUMENTS_JOURNAL) {
		return <NSIMeasuringInstrumentsJournal />;
	}

	if (
		tabId === TabName.DETAILED_INFORMATION &&
		unit !== null &&
		(unit.typeId === 1 || unit.typeId === 2)
	) {
		return (
			<ReportPreview
				className={styles.report_preview}
				url={`${reportPath}&objectType=${unit.typeId}&objectId=${unit.itemNumber}&rs:embed=true`}
			/>
		);
	}

	if (tabId === TabName.CONFIGURATION_HISTORY && unit !== null) {
		return (
			<div>
				Configuration history{' '}
				{`number: ${unit.itemNumber} typeId: ${unit.typeId}`}
			</div>
		);
	}

	return <WarningMessage text="Нет данных для отображения." />;
}

function NSIInformationPanel() {
	const {
		user,
		selectedUnit,
		selectedTab,
		userParameters,
		measuringInstruments,
		isInstrumentsJournalPending,
	} = useStore($informationPanelModel);
	const { viewMode, parametersList } = userParameters;
	const { instrumentsList } = measuringInstruments;
	const permissions = usePermissions();
	const hasNSIEditingPermission: boolean = checkPermission(
		permissions,
		Permissions.CanEditNSIPage,
	);
	const parametersListLoading = useStore(getUserParametersListFx.pending);

	const isLinkButtonDisabled: boolean = !instrumentsList.some(
		({ checked }) => checked,
	);

	const [reportPath, setReportPath] = useState('');
	useEffect(() => {
		changeViewMode('read');
	}, [selectedUnit]);

	useEffect(() => {
		fetchReportLinkListFx(ReportLinkType.InfoAboutNSI).then((url) => {
			const result = decodeURI(url).split('&')[0];
			setReportPath(result);
		});
	}, []);

	const selectOptions: SelectOption[] = nsiTabOptions.map(
		(tabOption): SelectOption => {
			return {
				value: tabOption.value,
				label: tabOption.label,
				isSelected: tabOption.value === selectedTab,
			};
		},
	);
	const handleSelectTab = (options: SelectOption[]) => {
		const selectedOption = options.find((selectOption) => {
			return selectOption.isSelected;
		});
		if (selectedOption) {
			setNsiSelectedTab(selectedOption.value as TabName);
		}
	};

	const handleActionControlClick = (e: React.MouseEvent<HTMLButtonElement>) => {
		const { id } = e.currentTarget;

		if (id === ControlName.EDIT_VALUES) {
			changeViewMode('edit');
		}

		if (id === ControlName.SAVE_VALUES) {
			if (
				user !== null &&
				selectedUnit !== null &&
				parametersList.some((parameterData) => {
					return parameterData.touched;
				})
			) {
				const requestsQueue = parametersList
					.filter((parameterData) => {
						return parameterData.touched;
					})
					.map((touchedParameter) => {
						return saveUserParameterValueFx({
							userId: user.preferredUsername,
							unitId: selectedUnit.itemNumber,
							parameterId: touchedParameter.id,
							valueId: touchedParameter.valueId,
							value: touchedParameter.value as string,
							fileId: null,
							fileBinaryData: null,
							fileName: null,
							valueLastModified: touchedParameter.valueLastModified,
							moduleName:
								ModuleName.NSIInformationPanel_saveUserParameterValueFx,
						});
					});

				Promise.allSettled(requestsQueue).then(() => {
					getUserParametersListFx({
						userId: user.preferredUsername,
						unitId: selectedUnit.itemNumber,
						unitTypeId: selectedUnit.typeId,
						moduleName: ModuleName.NSIInformationPanel_getUserParametersListFx,
					}).then(() => {
						changeViewMode('read');
					});
				});
			} else {
				changeViewMode('read');
			}
		}

		if (id === ControlName.LINK) {
			openModal(RegisteredModals.LinkMeasuringInstrumentsNSI);
		}
		if (id === ControlName.ADVANCED_FILTER) {
			openModal(RegisteredModals.MeasuringInstrumentsExtendedFilters);
		}
	};

	const handleSettingsControlClick = () => {
		if (selectedTab === TabName.USER_SETTINGS) {
			openModal(RegisteredModals.NSIUserParametersConfiguration);
		}
	};

	return (
		<div className={styles.container}>
			<div className={styles.header}>
				<div className={styles.controls_block}>
					<Select
						className={styles.select}
						options={selectOptions}
						disabled={viewMode === 'edit'}
						onSelect={handleSelectTab}
					/>
					<Divider />
					{selectedTab === TabName.MEASURING_INSTRUMENTS_JOURNAL &&
						isInstrumentsJournalPending && <Spinner />}
				</div>
				<div className={styles.controls_block}>
					{selectedTab === TabName.USER_SETTINGS &&
					viewMode === 'read' &&
					hasNSIEditingPermission ? (
						<Button
							id={ControlName.EDIT_VALUES}
							className={styles.control}
							disabled={selectedUnit === null || parametersList.length === 0}
							onClick={handleActionControlClick}
						>
							<Edit className={styles.control_icon} />
							Редактировать значения
						</Button>
					) : null}
					{selectedTab === TabName.MEASURING_INSTRUMENTS_JOURNAL ? (
						<>
							{hasNSIEditingPermission && (
								<>
									<Button
										id={ControlName.LINK}
										className={styles.control__primary}
										primary
										disabled={selectedUnit === null || isLinkButtonDisabled}
										onClick={handleActionControlClick}
									>
										<LinkOn
											className={
												selectedUnit === null
													? styles.control_icon
													: styles.control_icon__primary
											}
										/>
										Привязать
									</Button>
									<Divider />
								</>
							)}

							<Button
								id={ControlName.ADVANCED_FILTER}
								className={styles.control}
								disabled={selectedUnit === null}
								onClick={handleActionControlClick}
							>
								<Filter className={styles.control_icon} />
								Расширенный фильтр
							</Button>
							<Button
								id={ControlName.REFRESH}
								className={styles.control}
								disabled={selectedUnit === null}
								onClick={handleActionControlClick}
							>
								<Refresh className={styles.control_icon} />
								Обновить
							</Button>
						</>
					) : null}
					{((selectedTab === TabName.USER_SETTINGS && viewMode === 'read') ||
						selectedTab === TabName.MEASURING_INSTRUMENTS_JOURNAL) &&
					hasNSIEditingPermission ? (
						<>
							<Divider />
							<Button
								id={ControlName.SETTINGS}
								className={styles.control}
								disabled={
									selectedUnit === null ||
									(selectedTab === TabName.USER_SETTINGS &&
										parametersListLoading)
								}
								onClick={handleSettingsControlClick}
							>
								<Settings className={styles.control_icon} />
							</Button>
						</>
					) : null}
					{selectedTab === TabName.USER_SETTINGS && viewMode === 'edit' ? (
						<>
							<Divider />
							<Button
								id={ControlName.SAVE_VALUES}
								className={styles.control__confirm}
								onClick={handleActionControlClick}
							>
								<CheckMark className={styles.control_icon__primary} />
								Завершить
							</Button>
						</>
					) : null}
				</div>
			</div>
			{selectedTab === TabName.MEASURING_INSTRUMENTS_JOURNAL && (
				<NSIMeasuringInstrumentsExtendedFiltersChips />
			)}
			{getDisplayedTab(selectedTab, selectedUnit, reportPath)}
		</div>
	);
}

export default NSIInformationPanel;
