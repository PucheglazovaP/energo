import { useEffect } from 'react';
import { useStore } from 'effector-react';

import { $printFormSidebarsState } from '../../Models/PrintForms';
import { toggleLeftSidebarState } from '../../Models/PrintForms/events';
import { $selectedReportId } from '../../Models/ReferenseByReports';
import { setSelectedReportId } from '../../Models/ReferenseByReports/events';
import { $reports } from '../../Models/Reports';
import { fetchReportsListFx } from '../../Models/Reports/effects';
import Divider from '../../UI/Divider';
import Dropdown from '../../UI/Dropdown';
import { TOption } from '../../UI/Dropdown/types';
import ButtonToggleSidebarIndividual from '../ButtonToggleSidebarIndividual';

import { ReferenceByFormsHeaderProps } from './types';

import styles from './ReferenceByFormsHeader.module.css';

function ReferenceByFormsHeader({
	title,
	onSelectDropdown = () => {},
	needRenderSidebarToggle = true,
}: ReferenceByFormsHeaderProps) {
	const reports = useStore($reports);
	const selectedReportId = useStore($selectedReportId);
	const { isLeftSidebarOpen } = useStore($printFormSidebarsState);

	const adaptedReports: TOption[] = reports.map((report) => ({
		label: report.name,
		value: String(report.id),
	}));

	const selectedOption: TOption | undefined = adaptedReports.find(
		(report) => report.value === String(selectedReportId),
	);

	const handleSelectDropdown = (option: TOption) => {
		setSelectedReportId(Number(option.value));
		onSelectDropdown();
	};

	useEffect(() => {
		if (!reports.length) {
			fetchReportsListFx();
		}
	}, [reports.length]);

	const renderDropdown = () => {
		return (
			<Dropdown
				options={adaptedReports}
				selectedOption={selectedOption}
				setSelectedOption={handleSelectDropdown}
				className={styles.dropdown}
				isActive={!!selectedOption}
			/>
		);
	};

	return (
		<div className={styles.header}>
			{needRenderSidebarToggle && (
				<>
					<ButtonToggleSidebarIndividual
						isSidebarOpen={isLeftSidebarOpen}
						onClick={toggleLeftSidebarState}
						className={styles.left_sidebar_toggle_button}
					/>
					<Divider className={styles.divider} />
				</>
			)}
			<h3>
				<span>{title}</span>
				<span className={styles.slash}>/</span>&nbsp;
			</h3>
			{renderDropdown()}
		</div>
	);
}

export default ReferenceByFormsHeader;
