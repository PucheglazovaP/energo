import { useCallback, useMemo } from 'react';
import { toast } from 'react-toastify';

import { groupInformationTableAdapter } from '../Adapters/GroupInformation/groupInformationTableAdapter';
import { groupInformationTreeAdapter } from '../Adapters/GroupInformation/groupInformationTreeAdapter';
import { RouteApps } from '../Shared/types';
import { getBaseUrl } from '../Shared/Utils/utils';
import { selectEnergyElement } from '../Store/reducers/ConfiguratorSlice/configuratorSelectors';
import {
	closeGroupInformation,
	expandTreeToItem,
	getFormsRpc,
	getMnemoschemesRpc,
	getSystemsPromise,
	getVersionsPromise,
	openGroupInformation,
	selectFormItem,
	selectTreeItem,
	setFormsIsLoading,
	setSystems,
	setSystemsIsLoading,
	setVersions,
	setVersionsIsLoading,
	toggleCollapseFormItem,
	toggleExpandTree,
	toggleIsTreeOpen,
} from '../Store/reducers/GroupInformationSlice/GroupInformationActions';
import {
	selectForms,
	selectFormsIsLoading,
	selectIsModalOpen,
	selectIsTreeOpen,
	selectMnemoschemes,
	selectSystems,
	selectSystemsIsLoading,
	selectVersions,
	selectVersionsIsLoading,
} from '../Store/reducers/GroupInformationSlice/GroupInformationSelectors';
import { System, Version } from '../Store/reducers/GroupInformationSlice/types';

import useAppDispatch from './Store/useAppDispatch';
import { useAppSelector } from './Store/useAppSelector';
import styles from '../Containers/GroupInformation/GroupInformation.module.scss';

export const useGroupInformation = () => {
	const dispatch = useAppDispatch();

	const isModalOpen = useAppSelector(selectIsModalOpen);
	const systems = useAppSelector(selectSystems);
	const systemsIsLoading = useAppSelector(selectSystemsIsLoading);
	const versions = useAppSelector(selectVersions);
	const versionsIsLoading = useAppSelector(selectVersionsIsLoading);
	const energyElement = useAppSelector(selectEnergyElement);
	const forms = useAppSelector(selectForms);
	const formsIsLoading = useAppSelector(selectFormsIsLoading);
	const mnemoschemes = useAppSelector(selectMnemoschemes);
	const isTreeOpen = useAppSelector(selectIsTreeOpen);

	const selectedVersion = useMemo(() => {
		return versions.find((version) => version.isSelected);
	}, [versions]);

	const handleError = useCallback(() => {
		toast.error('Что-то пошло не так');
	}, []);

	const handleCloseGroupInformation = useCallback(() => {
		dispatch(closeGroupInformation());
	}, [dispatch]);

	const handleOpenGroupInformation = useCallback(() => {
		dispatch(openGroupInformation());
	}, [dispatch]);

	const handleSetVersions = useCallback(
		(versions: Version[]) => {
			dispatch(setVersions(versions));
		},
		[dispatch],
	);

	const handleSetSystems = useCallback(
		(systems: System[]) => {
			dispatch(setSystems(systems));
		},
		[dispatch],
	);

	const getSystems = useCallback(async () => {
		try {
			if (energyElement) {
				dispatch(setSystemsIsLoading(true));
				const systems = await getSystemsPromise(energyElement.Number);
				dispatch(setSystemsIsLoading(false));
				dispatch(setSystems(systems));
				return systems;
			}
		} catch (_err) {
			handleError();
		}
	}, [energyElement, dispatch]);

	const getVersions = useCallback(
		async (systemId: number) => {
			try {
				if (energyElement) {
					dispatch(setVersionsIsLoading(true));
					const versions = await getVersionsPromise(
						energyElement.Number,
						systemId,
					);
					dispatch(setVersionsIsLoading(false));
					dispatch(setVersions(versions));
					return versions;
				}
			} catch (_err) {
				handleError();
			}
		},
		[energyElement, dispatch],
	);

	const getForms = useCallback(
		(versionId: number) => {
			if (energyElement) {
				dispatch(
					getFormsRpc({
						groupId: energyElement.Number,
						versionId: versionId,
					}),
				);
			}
		},
		[dispatch, energyElement],
	);

	const getMnemoschemes = useCallback(
		(versionId: number) => {
			if (energyElement) {
				dispatch(
					getMnemoschemesRpc({
						groupId: energyElement.Number,
						versionId: versionId,
					}),
				);
			}
		},
		[dispatch, energyElement],
	);

	const getSelectedSystem = useCallback((systems: System[]) => {
		return systems.find((system) => system.isSelected);
	}, []);

	// find the most recent and actual version, set it  and return it's id
	const handleDefaultVersion = useCallback(
		(versions: Version[]) => {
			let recentVersionId: number = 0;
			const newVersions = versions.map((version) => ({ ...version }));
			newVersions.forEach((version) => {
				if (version.isActualVersion && version.value > recentVersionId) {
					recentVersionId = version.value;
				}
			});
			const recentVersion = newVersions.find(
				(version) => version.value === recentVersionId,
			);
			if (recentVersion) {
				recentVersion.isSelected = true;
			} else {
				toast.warn('Нет актуальной версии данной системы');
			}
			handleSetVersions(newVersions);
			return recentVersionId;
		},
		[dispatch, handleSetVersions],
	);

	const changeSystem = useCallback(
		async (systems: System[]) => {
			dispatch(setSystems(systems));
			const selectedSystem = getSelectedSystem(systems);
			if (selectedSystem) {
				const versions = await getVersions(selectedSystem.value);
				if (versions) {
					const selectedVersionId = handleDefaultVersion(versions);
					getForms(selectedVersionId);
					getMnemoschemes(selectedVersionId);
				}
			}
		},
		[
			getSelectedSystem,
			handleSetVersions,
			handleDefaultVersion,
			getForms,
			getMnemoschemes,
		],
	);

	const onFormCollapse = useCallback(
		(id: string) => {
			dispatch(toggleCollapseFormItem(id));
		},
		[dispatch],
	);

	// When user select form in the table, mnemoscheme in the tree
	// Should also be selected
	const onFormSelect = useCallback(
		(id: string) => {
			dispatch(selectFormItem(id));
			dispatch(selectTreeItem(id));
			dispatch(expandTreeToItem(id));
		},
		[dispatch],
	);

	const adaptedForms = useMemo(() => {
		const result = groupInformationTableAdapter(
			forms,
			onFormCollapse,
			onFormSelect,
			styles,
		);
		return result;
	}, [forms, onFormCollapse]);

	// init modal group information
	const initializeGroupInformation = useCallback(async () => {
		try {
			handleOpenGroupInformation();
			const systems = await getSystems();
			if (systems) {
				const selectedSystem = systems.find((system) => system.isSelected);
				if (selectedSystem) {
					dispatch(setVersionsIsLoading(true));
					const versions = await getVersions(selectedSystem.value);
					if (versions) {
						const selectedVersionId = handleDefaultVersion(versions);
						getForms(selectedVersionId);
						getMnemoschemes(selectedVersionId);
					}
				}
			}
		} catch (_err) {
			toast.error('Что-то пошло не так');
		} finally {
			dispatch(setSystemsIsLoading(false));
			dispatch(setVersionsIsLoading(false));
			dispatch(setFormsIsLoading(false));
		}
	}, [
		dispatch,
		handleOpenGroupInformation,
		handleSetSystems,
		handleSetVersions,
		handleDefaultVersion,
		getForms,
		getMnemoschemes,
	]);

	const redirectToMonitoring = useCallback(
		(id: string) => {
			const baseUrl = getBaseUrl(RouteApps.MONITORING);
			const searchParams: URLSearchParams = new URLSearchParams([
				['versionId', String(selectedVersion?.value)],
				['treeType', 'mnemoschemes'],
				['formId', id],
			]);
			const finalUrl: URL = new URL(
				`${baseUrl}/schemes/#/monitoring/?${searchParams}`,
			);
			window.open(finalUrl);
		},
		[selectedVersion],
	);

	const adaptedMnemoschemes = useMemo(() => {
		return groupInformationTreeAdapter(
			mnemoschemes,
			redirectToMonitoring,
			styles,
		);
	}, [mnemoschemes]);

	const selectedMnemoscheme = useMemo(() => {
		return mnemoschemes.find((mnemoscheme) => mnemoscheme.isSelected);
	}, [mnemoschemes]);

	const onTreeExpand = useCallback(
		(id?: string) => {
			dispatch(toggleExpandTree(id));
		},
		[dispatch],
	);

	const handleIsTreeOpen = useCallback(() => {
		dispatch(toggleIsTreeOpen());
	}, [dispatch]);

	return {
		closeGroupInformation: handleCloseGroupInformation,
		openGroupInformation: handleOpenGroupInformation,
		isModalOpen,
		systems,
		systemsIsLoading,
		versions,
		versionsIsLoading,
		setVersions: handleSetVersions,
		setSystems: handleSetSystems,
		handleDefaultVersion,
		initializeGroupInformation,
		forms: adaptedForms,
		formsIsLoading,
		onFormCollapse,
		onFormSelect,
		changeSystem,
		getForms,
		getMnemoschemes,
		mnemoschemes: adaptedMnemoschemes,
		selectedMnemoscheme,
		onTreeExpand,
		toggleIsTreeOpen: handleIsTreeOpen,
		isTreeOpen,
		redirectToMonitoring,
	};
};
