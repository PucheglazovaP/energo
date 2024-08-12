/* global CSSModuleClasses */
import { ChangeEvent, useCallback, useEffect, useMemo, useState } from 'react';

import { analyticGroupsAdapter } from '../Adapters/AnalyticGroups/analyticGroupsAdapter';
import { ModuleName } from '../Shared/types';
import {
	closeAnalyticGroupsModal,
	createNewAnalyticGroupRpc,
	deleteAnalyticGroupRangeRpc,
	getAnalyticGroupsRpc,
	openAnalyticGroupsModal,
	toggleCollapseAnalyticGroup,
	updateAnalyticGroupRangeRpc,
} from '../Store/reducers/AnalyticGroupsSlice/AnalyticGroupsActions';
import {
	selectAnalyticGroups,
	selectAnalyticGroupsIsLoading,
	selectIsAnalyticGroupsModalOpen,
} from '../Store/reducers/AnalyticGroupsSlice/AnalyticGroupsSelectors';
import {
	AnalyticGroups,
	AnalyticRangeType,
	DeleteAnalyticGroupRange,
	UpdateAnalyticRange,
} from '../Store/reducers/AnalyticGroupsSlice/types';
import { selectUser } from '../Store/reducers/AuthSlice/authSelectors';

import useAppDispatch from './Store/useAppDispatch';
import { useAppSelector } from './Store/useAppSelector';

export const useAnalyticGroups = (styles?: CSSModuleClasses) => {
	const dispatch = useAppDispatch();
	const isAnalyticGroupsOpen = useAppSelector(selectIsAnalyticGroupsModalOpen);
	const analyticGroups = useAppSelector(selectAnalyticGroups);
	const isLoading = useAppSelector(selectAnalyticGroupsIsLoading);
	const userId = useAppSelector(selectUser)?.preferredUsername;
	const [groups, setGroups] = useState<AnalyticGroups[]>([]);
	const [searchValue, setSearchValue] = useState<string>('');
	const [filteredGroups, setFilteredGroups] =
		useState<AnalyticGroups[]>(groups);

	// Сворачивание/разворачивание диапазонов аналитиков
	const onAnalyticGroupCollapse = useCallback(
		(id: string) => {
			dispatch(toggleCollapseAnalyticGroup(id));
		},
		[dispatch],
	);

	// Изменение локального диапазона перед отправкой
	const handleUpdateLocalAnalyticRange = useCallback(
		(props: UpdateAnalyticRange) => (e: ChangeEvent<HTMLInputElement>) => {
			const {
				rangeId,
				analyticId,
				lastModified,
				rangeStart,
				rangeEnd,
				rangeType,
			} = props;

			const analyticGroups = groups.map((group) => {
				if (group.analyticId === analyticId) {
					return {
						...group,
						ranges: group.ranges.map((groupRange) => {
							if (groupRange.rangeId === rangeId) {
								return {
									...groupRange,
									lastModified,
									rangeStart:
										rangeType === AnalyticRangeType.Start
											? Number(e.target.value)
											: rangeStart,
									rangeEnd:
										rangeType === AnalyticRangeType.End
											? Number(e.target.value)
											: rangeEnd,
								};
							}
							return groupRange;
						}),
					};
				}
				return group;
			});
			setGroups(analyticGroups);
		},
		[groups],
	);

	const handleUpdateAnalyticRange = useCallback(
		(props: UpdateAnalyticRange) => (e: ChangeEvent<HTMLInputElement>) => {
			const { rangeType, rangeStart, rangeEnd, analyticId, rangeId } = props;
			const needToCreateRange = rangeId === -1;

			// Изменение нового диапазона для его создания
			if (needToCreateRange && rangeStart && rangeEnd) {
				dispatch(
					createNewAnalyticGroupRpc({
						analyticId: analyticId,
						rangeStart: rangeStart,
						rangeEnd: rangeEnd,
						userId: userId,
						moduleName: ModuleName.UseAnalyticGroups_createNewAnalyticGroupRpc,
					}),
				);
				return;
			}

			// Изменение существующего диапазона
			const oldRangeValue = analyticGroups
				.find((group) => group.analyticId === analyticId)!
				.ranges.find((groupRange) => groupRange.rangeId === rangeId)!;

			if (!needToCreateRange) {
				if (rangeType === AnalyticRangeType.Start) {
					if (rangeStart === oldRangeValue.rangeStart || rangeStart === 0)
						return;
				}

				if (rangeType === AnalyticRangeType.End) {
					if (rangeEnd === oldRangeValue.rangeEnd || rangeEnd === 0) return;
				}

				dispatch(
					updateAnalyticGroupRangeRpc({
						...props,
						userId: userId,
						rangeStart:
							rangeType === AnalyticRangeType.Start
								? Number(e.target.value)
								: rangeStart,
						rangeEnd:
							rangeType === AnalyticRangeType.End
								? Number(e.target.value)
								: rangeEnd,
						moduleName:
							ModuleName.UseAnalyticGroups_updateAnalyticGroupRangeRpc,
					}),
				);
			}
		},
		[dispatch, userId, analyticGroups],
	);

	// Создание пустого нового диапазона
	const handleCreateLocalRange = useCallback(
		(analyticId: string) => () => {
			const localGroups = groups.map((group) => {
				if (group.analyticId === analyticId) {
					return {
						...group,
						ranges: [
							...group.ranges,
							{
								rangeId: -1,
								rangeStart: 0,
								rangeEnd: 0,
								lastModified: '',
							},
						],
					};
				}
				return group;
			});

			setGroups(localGroups);
		},

		[groups],
	);

	// Удаление диапазона
	const handleDeleteRange = useCallback(
		({ rangeId, analyticId, lastModified }: DeleteAnalyticGroupRange) =>
			() => {
				// Удаление нового несозданного диапазона
				if (rangeId === -1) {
					setGroups(analyticGroups);
					return;
				}

				dispatch(
					deleteAnalyticGroupRangeRpc({
						analyticId,
						userId,
						rangeId,
						lastModified,
						moduleName:
							ModuleName.UseAnalyticGroups_deleteAnalyticGroupRangeRpc,
					}),
				);
			},
		[userId, analyticGroups, dispatch],
	);

	const handleOpenAnalyticGroupsModal = useCallback(() => {
		dispatch(
			getAnalyticGroupsRpc({
				userId,
				moduleName: ModuleName.UseAnalyticGroups_getAnalyticGroupsRpc,
			}),
		);
		dispatch(openAnalyticGroupsModal());
	}, [dispatch, userId]);

	const handleCloseAnalyticGroupsModal = useCallback(() => {
		dispatch(closeAnalyticGroupsModal());
	}, [dispatch]);

	const handleSetSearchValue = useCallback(
		(e: ChangeEvent<HTMLInputElement>) => {
			setSearchValue(e.target.value);
		},
		[],
	);

	// Режим создания нового диапазона
	const isRangeCreationMode = useMemo(() => {
		let result = false;
		groups.forEach((group) => {
			group.ranges.forEach((range) => {
				if (range.rangeId === -1) result = true;
				return;
			});
		});

		return result;
	}, [groups]);

	// Шапка и тело таблицы с диапазонами аналитиков
	const analyticGroupsData = useMemo(() => {
		return analyticGroupsAdapter(
			isRangeCreationMode,
			filteredGroups,
			searchValue,
			onAnalyticGroupCollapse,
			styles ?? {},
			handleUpdateLocalAnalyticRange,
			handleUpdateAnalyticRange,
			handleCreateLocalRange,
			handleDeleteRange,
			handleSetSearchValue,
		);
	}, [filteredGroups, isRangeCreationMode, searchValue]);

	useEffect(() => {
		setGroups(analyticGroups);
	}, [analyticGroups]);

	useEffect(() => {
		if (searchValue === '') {
			setFilteredGroups(groups);
		}
		setFilteredGroups(
			groups.filter((group) =>
				group.name.toLowerCase().includes(searchValue.toLowerCase()),
			),
		);
	}, [searchValue, groups]);

	return {
		isLoading,
		isAnalyticGroupsOpen,
		handleCloseAnalyticGroupsModal,
		handleOpenAnalyticGroupsModal,
		analyticGroups: analyticGroupsData,
	};
};
