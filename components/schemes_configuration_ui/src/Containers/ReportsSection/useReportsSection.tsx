import React, { ChangeEvent, useCallback, useMemo, useState } from 'react';
import { useStore } from 'effector-react';

import { Edit } from '../../Icons';
import { $user } from '../../Models/Auth';
import { openModal } from '../../Models/Modal/events';
import {
	$reportContextMenuId,
	$selectedReportId,
	INITIAL_REPORT_DATA,
} from '../../Models/ReferenseByReports';
import {
	setEditReportData,
	setReportContextMenuId,
	setSelectedReportId,
} from '../../Models/ReferenseByReports/events';
import { $reports } from '../../Models/Reports';
import { Report } from '../../Models/Reports/types';
import { RegisteredModals } from '../../Shared/modalsConfig';
import { ModuleName } from '../../Shared/Types/moduleName';
import {
	ContextMenuItem,
	ContextMenuPosition,
} from '../../UI/ContextMenu/types';
import { IconDelete } from '../../UI/Parameter/iconEditing';

import styles from './ReportsSection.module.css';

export function useReportsSection() {
	const user = useStore($user);
	const reports = useStore($reports);

	const selectedReportId = useStore($selectedReportId);
	const contextMenuId = useStore($reportContextMenuId);

	const selectedReport = reports.find((report) => report.id === contextMenuId);

	// Стор положения контекстного меню
	const [position, setPosition] = useState<ContextMenuPosition | null>(null);

	const [searchFilter, setSearchFilter] = useState<string>('');

	const filteredReports = reports.filter((report) =>
		report.name.includes(searchFilter),
	);

	const handleActiveReportId = useCallback(
		(id: number) => {
			setSelectedReportId(id);
		},
		[setSelectedReportId],
	);

	const handleSearch = useCallback(
		(event: ChangeEvent<HTMLInputElement>) =>
			setSearchFilter(event.target.value),
		[setSearchFilter],
	);

	const onOpen = useCallback((evt: React.MouseEvent, id: number) => {
		evt.preventDefault();
		setPosition({ x: evt.pageX, y: evt.pageY });
		setReportContextMenuId(id);
	}, []);

	const handleCreateReport = useCallback(() => {
		openModal(RegisteredModals.EditReport);
		setEditReportData({
			...INITIAL_REPORT_DATA,
			userId: user?.preferredUsername ?? '',
		});
	}, [user]);

	const items: ContextMenuItem[] = useMemo(
		() => [
			{
				name: 'Редактировать',
				onClick: () => {
					const { id, name, comment } = selectedReport as Report;
					openModal(RegisteredModals.EditReport);
					setEditReportData({
						id,
						name,
						comment,
						userId: user?.preferredUsername ?? '',
						moduleName: ModuleName.UseReportsSection_setEditReportData,
					});
				},
				renderFn: () => (
					<span className={styles.context_menu_item}>
						<Edit className={styles.icon} />
						<span>Редактировать</span>
					</span>
				),
			},
			{
				name: 'Удалить',
				onClick: () => {
					openModal(RegisteredModals.DeleteReport);
				},
				renderFn: () => (
					<span className={styles.context_menu_item}>
						<IconDelete className={styles.icon} />
						<span>Удалить</span>
					</span>
				),
			},
		],
		[selectedReport, user],
	);

	return {
		searchFilter,
		handleSearch,
		filteredReports,
		selectedReportId,
		handleActiveReportId,
		onOpen,
		position,
		setPosition,
		items,
		handleCreateReport,
	};
}
