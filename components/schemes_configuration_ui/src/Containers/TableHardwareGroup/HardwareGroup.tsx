import { useCallback, useEffect, useState } from 'react';
import { useStore } from 'effector-react';

import devicesHardwareGroup from '../../Adapters/DevicesHardwareGroup';
import { $user } from '../../Models/Auth';
import {
	$groups,
	$hardwareGroupScrollPosition,
	$pagination,
	$searchInfo,
	$sorting,
} from '../../Models/HardwareGroup';
import {
	fetchGroupList,
	setScrollPosition,
} from '../../Models/HardwareGroup/event';
import TableInfinity from '../../UI/TableInfinity';
import { TableCell } from '../../UI/TablePair/types';

import { HardwareGroupProps } from './type';
import { useMount } from './utils';

function HardwareGroup(props: HardwareGroupProps) {
	const { mode } = props;
	const user = useStore($user);
	const groups = useStore($groups);
	const sorting = useStore($sorting);
	const pagination = useStore($pagination);

	const [currentPage, setCurrentPage] = useState(0);
	const [scrollDownOffset, setScrollDownOffset] = useState<number | null>(0);
	const scrollPosition = useStore($hardwareGroupScrollPosition);

	const tableData = devicesHardwareGroup(groups, mode);
	const { value, filterMode } = useStore($searchInfo);

	const areRowSelected = useCallback(
		(rowData: TableCell[]) => {
			const groupNumber = rowData.find((item) => item.name === 'number')?.value;
			return Number(value) === groupNumber;
		},
		[value],
	);

	const loadNext = () => {
		if (scrollPosition == null) setScrollPosition(0);
		setCurrentPage(pagination.pageNumber + 1);
		if (scrollDownOffset == null && scrollPosition != null) {
			setScrollDownOffset(scrollPosition + 30);
		}
		if (
			scrollDownOffset != null &&
			pagination.pageNumber > 1 &&
			scrollPosition != null
		) {
			setScrollPosition(scrollPosition - (scrollDownOffset + 500));
		}
	};
	const loadPrev = () => {
		if (scrollPosition == null) setScrollPosition(0);
		if (pagination.pageNumber > 0) setCurrentPage(pagination.pageNumber - 1);
		if (scrollDownOffset == null && scrollPosition != null) {
			setScrollDownOffset(scrollPosition + 30);
		}
		if (
			pagination.pageNumber > 1 &&
			scrollPosition != null &&
			scrollDownOffset != null
		) {
			setScrollPosition(scrollPosition + scrollDownOffset + 500);
		}
	};
	const changeScrollPosition = (newScrollPosition: number) => {
		setScrollPosition(newScrollPosition);
	};

	useEffect(() => {
		if (!user) return;
		const searchName = `%${sorting.searchName}`;

		if (
			sorting.searchValue === '' &&
			sorting.searchName === '' &&
			currentPage !== 0
		) {
			fetchGroupList({
				pageNumber: currentPage,
				pageRowCount: 30,
				filterStr: null,
				fkChannel: null,
				serverId: 2,
				filterMode: filterMode,
				orderMode: 1,
				mode: 1,
				userId: user.preferredUsername,
			});
		} else if (sorting.searchName !== '') {
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
		} else if (sorting.searchValue !== '') {
			fetchGroupList({
				pageNumber: currentPage,
				pageRowCount: 30,
				filterStr: `${sorting.searchValue},0`,
				fkChannel: null,
				serverId: 2,
				filterMode: 1,
				orderMode: 1,
				mode: 1,
				userId: user.preferredUsername,
			});
		} else if (currentPage === 0) {
			fetchGroupList({
				pageNumber: currentPage,
				pageRowCount: 30,
				fkChannel: null,
				filterStr: null,
				serverId: 2,
				filterMode: 1,
				orderMode: 1,
				mode: 1,
				userId: user.preferredUsername,
			});
		}
	}, [currentPage, sorting.searchName, sorting.searchValue]);

	useMount();
	return (
		<TableInfinity
			loadNext={loadNext}
			loadPrev={loadPrev}
			scrollPosition={scrollPosition}
			onChangeScrollPosition={changeScrollPosition}
			data={tableData}
			areRowSelected={areRowSelected}
		/>
	);
}
export default HardwareGroup;
