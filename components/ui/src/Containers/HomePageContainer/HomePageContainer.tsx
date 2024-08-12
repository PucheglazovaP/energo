import { useCallback } from 'react';

import HomePageHeader from '../../Components/HomePage/HomePageHeader';
import SubmitOperation from '../../Components/SubmitOperation/SubmitOperation';
import { useFormulaEditorContainer } from '../../Hooks/FormulaEditor/useFormulaEditorContainer';
import { useAppSelector } from '../../Hooks/Store/useAppSelector';
import { useAnalyticGroups } from '../../Hooks/useAnalyticGroups';
import { useDataLocation } from '../../Hooks/useDataLocation';
import { useFindDuplicates } from '../../Hooks/useFindDuplicates';
import { useGroupInformation } from '../../Hooks/useGroupInformation';
import { useHistory } from '../../Hooks/useHistory';
import { useSubmitOperation } from '../../Hooks/useSubmitOperation';
import { useVacantEntities } from '../../Hooks/useVacantEntities';
import { HistoryType } from '../../Store/reducers/HistorySlice/types';
import AnalyticGroups from '../AnalyticGroups';
import DataLocation from '../DataLocation';
import Duplicates from '../Duplicates/Duplicates';
import FormulaEditorContainer from '../FormulaEditorContainer';
import GroupInformation from '../GroupInformation';
import History from '../History';
import TreeBlockContainer from '../TreeBlockContainer/TreeBlockContainer';
import VacantEntities from '../VacantEntities';

import styles from './HomePageContainer.module.scss';

const HomePageContainer = () => {
	const { isParametersActive } = useAppSelector(
		(state) => state.parameterReducer,
	);
	const { isCreating } = useAppSelector((state) => state.parameterReducer);
	const { openHistoryModal, getGeneralHistory, setHistoryType, isHistoryOpen } =
		useHistory();
	const { isDataLocationOpen } = useDataLocation();
	const { isFindDuplicatesOpen } = useFindDuplicates();
	const { isModalOpen: isGroupInformationOpen } = useGroupInformation();
	const { openVacantEntities, getVacantEntities, isVacantEntitiesOpen } =
		useVacantEntities();
	const { isFormulaEditorOpen } = useFormulaEditorContainer();
	const { isSubmitOperationOpen } = useSubmitOperation();
	const handleOpenGeneralHistory = useCallback(() => {
		setHistoryType(HistoryType.GENERAL);
		openHistoryModal();
		getGeneralHistory();
	}, [openHistoryModal, getGeneralHistory]);

	const { isAnalyticGroupsOpen } = useAnalyticGroups();

	const handleOpenVacantEntities = useCallback(() => {
		openVacantEntities();
		getVacantEntities();
	}, [openVacantEntities, getVacantEntities]);

	return (
		<div className={styles.container}>
			<HomePageHeader
				isParametersActive={isParametersActive}
				openHistory={handleOpenGeneralHistory}
			/>
			<TreeBlockContainer
				isParametersActive={isParametersActive || isCreating}
				onAction={handleOpenVacantEntities}
			/>
			{isHistoryOpen && <History />}
			{isDataLocationOpen && <DataLocation />}
			{isFindDuplicatesOpen && <Duplicates />}
			{isVacantEntitiesOpen && <VacantEntities />}
			{isGroupInformationOpen && <GroupInformation />}
			{isFormulaEditorOpen && <FormulaEditorContainer />}
			{isSubmitOperationOpen && <SubmitOperation />}
			{isAnalyticGroupsOpen && <AnalyticGroups />}
		</div>
	);
};

export default HomePageContainer;
