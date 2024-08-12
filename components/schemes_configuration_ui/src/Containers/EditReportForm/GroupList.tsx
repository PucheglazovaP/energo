import { useCallback, useEffect, useState } from 'react';
import { Button } from '@evraz/ui-kit';
import { useStore } from 'effector-react';

import AngleArrowDoubleLeftIcon from '../../Icons/AngleArrowDoubleLeft';
import RefreshIcon from '../../Icons/Refresh';
import { $user } from '../../Models/Auth';
import {
	$hardwareGroupScrollPosition,
	$requestData,
	$sorting,
} from '../../Models/HardwareGroup';
import {
	fetchGroupList,
	setScrollPosition,
} from '../../Models/HardwareGroup/event';
import { addGroupsFx } from '../../Models/ReportFormProperties/effects';
import { ModuleName } from '../../Shared/Types/moduleName';
import TableInfinity from '../../UI/TableInfinity';

import { useEditForm } from './useEditForm';

import styles from './EditReportForm.module.css';

function GroupList() {
	const user = useStore($user);
	const sorting = useStore($sorting);
	const requestData = useStore($requestData);

	const [currentPage, setCurrentPage] = useState(0);
	const [scrollDownOffset, setScrollDownOffset] = useState<number | null>(null);
	const scrollPosition = useStore($hardwareGroupScrollPosition);

	const areRowSelected = useCallback(() => false, []);

	const onLoadNext = useCallback(() => {
		setCurrentPage((prev) => (prev += 1));
		if (scrollDownOffset == null && scrollPosition != null) {
			setScrollDownOffset(scrollPosition + 30);
		}
		if (scrollDownOffset != null && currentPage > 1 && scrollPosition != null) {
			setScrollPosition(scrollPosition - scrollDownOffset);
		}
	}, [currentPage, scrollDownOffset, scrollPosition]);

	const onLoadPrev = useCallback(() => {
		if (currentPage > 0) setCurrentPage((prev) => (prev -= 1));
		if (scrollDownOffset != null && currentPage > 1 && scrollPosition != null) {
			setScrollPosition(scrollPosition + scrollDownOffset);
		}
	}, [currentPage, scrollDownOffset, scrollPosition]);

	const onChangeScrollPosition = useCallback(
		(newScrollPosition: number) => setScrollPosition(newScrollPosition),
		[],
	);

	useEffect(() => {
		refreshDeviceList();
	}, [currentPage, sorting, requestData, sorting.searchValue]);

	const refreshDeviceList = useCallback(() => {
		if (!user) return;
		requestData.pageNumber = currentPage;
		const searchValue = `${sorting.searchValue}` + ',0';

		const searchName = `%${sorting.searchName}`;
		if (searchValue === ',0' && searchName === '%') {
			fetchGroupList({ ...requestData, userId: user.preferredUsername });
		} else {
			if (searchName !== '%') {
				fetchGroupList({
					pageNumber: currentPage,
					pageRowCount: 30,
					filterStr: `${searchName}%`,
					fkChannel: null,
					serverId: 2,
					filterMode: 2,
					orderMode: 1,
					mode: 0,
					userId: user.preferredUsername,
				});
			} else {
				fetchGroupList({
					pageNumber: currentPage,
					pageRowCount: 30,
					filterStr: searchValue,
					fkChannel: null,
					serverId: 2,
					filterMode: 1,
					orderMode: 1,
					mode: 1,
					userId: user.preferredUsername,
				});
			}
		}
	}, [currentPage, sorting, requestData, user]);

	useEffect(() => {
		if (!user) return;
		fetchGroupList({
			pageNumber: 0,
			pageRowCount: 30,
			filterStr: null,
			fkChannel: null,
			serverId: 2,
			filterMode: 1,
			orderMode: 1,
			mode: 1,
			userId: user.preferredUsername,
		});
	}, [user]);

	const { devicesTableRows, formId, versionId, selectedGroups } = useEditForm();

	const onAddToReportFormBtnClick = useCallback(() => {
		if (formId && versionId && user)
			addGroupsFx({
				formId,
				versionId,
				groups: selectedGroups,
				userId: user.preferredUsername,
				moduleName: ModuleName.GroupList_addGroupsFx,
			});
	}, [formId, versionId, selectedGroups, user]);

	const onRefreshBtnClick = () => {
		refreshDeviceList();
	};

	return (
		<div className={styles.group_list}>
			<div className={styles.panel}>
				<h3 className={styles.title}>Список доступных групп</h3>
				<div className={styles.btns}>
					{' '}
					<Button
						className={styles.btn}
						disabled={selectedGroups.length === 0}
						onClick={onAddToReportFormBtnClick}
					>
						{' '}
						<AngleArrowDoubleLeftIcon className={styles.icon} />
						Добавить к отчету
					</Button>
					<Button className={styles.btn} onClick={onRefreshBtnClick}>
						{' '}
						<RefreshIcon className={styles.icon} />
						Обновить
					</Button>
				</div>
			</div>
			<TableInfinity
				loadNext={onLoadNext}
				loadPrev={onLoadPrev}
				scrollPosition={scrollPosition}
				onChangeScrollPosition={onChangeScrollPosition}
				data={[devicesTableRows]}
				areRowSelected={areRowSelected}
				className={styles.table_devices}
			/>
		</div>
	);
}
export default GroupList;
