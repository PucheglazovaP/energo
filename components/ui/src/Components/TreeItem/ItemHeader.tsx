import React, { MouseEventHandler, useCallback, useMemo } from 'react';
import { Button } from '@evraz/ui-kit';
import clsx from 'clsx';

import { ReactComponent as ChannelIcon } from '../../Assets/images/ChannelIcon.svg';
import { ReactComponent as DeviceIcon } from '../../Assets/images/DeviceIcon.svg';
import { ReactComponent as GroupIcon } from '../../Assets/images/GroupIcon.svg';
import { ReactComponent as FavouriteIcon } from '../../Assets/images/NotFavoriteLogo.svg';
import {
	CHANNEL,
	DEVICE,
	FORWARD_TREE,
	GROUP,
	REVERSE_TREE,
	SERVER,
	UNUSED_CHANNELS_TREE,
} from '../../Const';
import useAppDispatch from '../../Hooks/Store/useAppDispatch';
import { useAppSelector } from '../../Hooks/Store/useAppSelector';
import { selectSupportTooltipMode } from '../../Store/reducers/AppSlice/appSelectors';
import { positionOnElement } from '../../Store/reducers/ConfiguratorSlice/configuratorActions';
import {
	setDevicesFilterMode,
	setDevicesFilterString,
	setDevicesPaginationAvailable,
	setGroupsFilterMode,
	setGroupsFilterString,
	setGroupsPaginationAvailable,
} from '../../Store/reducers/ConfiguratorSlice/configuratorSlice';
import {
	addDeviceToFavourite,
	removeDeviceFromFavourite,
} from '../../Store/reducers/ContextMenuSlice/Device/deviceContextActions';
import {
	addGroupToFavourite,
	removeGroupFromFavourite,
} from '../../Store/reducers/ContextMenuSlice/Group/groupContextActions';
import {
	setDevicesActiveFilter,
	setGroupsActiveFilter,
} from '../../Store/reducers/FiltersSlice/filtersSlice';
import {
	addParameters,
	setParameters,
} from '../../Store/reducers/ParametersSlice/parametersActions';
import {
	addParameterItems,
	setParameterItems,
} from '../../Store/reducers/ParametersSlice/parametersSlice';
import { TreeHeadersProps } from '../../Types';
import CheckBox from '../../UI/CheckBox/CheckBox';

import styles from './TreeItem.module.scss';

function ItemHeader({
	title,
	headerType,
	number,
	eWorkNumber,
	count,
	isFavourite,
	activeFormula,
	hasFormula,
	coefficient,
	isDropdownDisabled,
	treeType,
	isIncluded,
	isTreeItemActive,
	setContextMenu,
	contextMenuType,
	currentParent = 0,
}: TreeHeadersProps): JSX.Element {
	const dispatch = useAppDispatch();
	const { parameterItems } = useAppSelector((state) => state.parameterReducer);
	const handleCheckboxClick = useCallback(() => {
		dispatch(addParameters({ parameterType: headerType, parameterId: number }));
	}, []);
	const isSupportTooltipMode = useAppSelector(selectSupportTooltipMode);
	const handleItemClick = useCallback(() => {
		dispatch(setParameters({ parameterType: headerType, parameterId: number }));
	}, []);

	const handleChannelCheckboxClick = useCallback(
		(e: any) => {
			dispatch(
				addParameters({ parameterType: headerType, parameterId: number }),
			);
			const isCurentParentItem = parameterItems.find(
				(item) =>
					item.parameterType === DEVICE && item.parameterId === currentParent,
			);
			if (
				e.target.checked &&
				!isCurentParentItem &&
				treeType !== UNUSED_CHANNELS_TREE
			)
				dispatch(
					addParameters({ parameterType: DEVICE, parameterId: currentParent }),
				);
		},
		[parameterItems, currentParent],
	);

	const handleChannelItemClick = useCallback(() => {
		dispatch(setParameters({ parameterType: headerType, parameterId: number }));
		if (treeType === REVERSE_TREE)
			dispatch(
				addParameters({ parameterType: DEVICE, parameterId: currentParent }),
			);
	}, [headerType, number, currentParent, parameterItems]);

	const handleContextMenu: MouseEventHandler<HTMLDivElement> = useCallback(
		(event) => {
			event.preventDefault();
			if (
				headerType !== SERVER &&
				!parameterItems.some(
					(item) =>
						item.parameterId === number && item.parameterType === headerType,
				)
			) {
				if (
					!(treeType === FORWARD_TREE && headerType === DEVICE) &&
					!(treeType === REVERSE_TREE && headerType === GROUP)
				) {
					dispatch(
						setParameterItems([
							{ parameterType: headerType, parameterId: number },
						]),
					);
				}
				if (headerType === CHANNEL && treeType === REVERSE_TREE) {
					dispatch(
						addParameterItems([
							{ parameterType: DEVICE, parameterId: currentParent },
						]),
					);
				}
				if (headerType === CHANNEL && treeType === FORWARD_TREE) {
					dispatch(
						addParameterItems([
							{ parameterType: GROUP, parameterId: currentParent },
						]),
					);
				}
			}

			const position = [event.clientX, event.clientY];

			setContextMenu &&
				contextMenuType &&
				setContextMenu(
					number,
					currentParent,
					contextMenuType,
					position,
					String(title),
				);
		},
		[
			setContextMenu,
			contextMenuType,
			number,
			parameterItems,
			currentParent,
			headerType,
		],
	);
	const setPagintionAvailable = useMemo(() => {
		return headerType === GROUP
			? setGroupsPaginationAvailable
			: setDevicesPaginationAvailable;
	}, [headerType]);

	const setFilterMode = useMemo(() => {
		return headerType === GROUP ? setGroupsFilterMode : setDevicesFilterMode;
	}, [headerType]);

	const setFilterString = useMemo(() => {
		return headerType === GROUP
			? setGroupsFilterString
			: setDevicesFilterString;
	}, [headerType]);

	const setActiveFilter = useMemo(() => {
		return headerType === GROUP
			? setGroupsActiveFilter
			: setDevicesActiveFilter;
	}, [headerType]);

	const filterReducer = useAppSelector((state) => state.filtersReducer);
	const mode = useMemo(
		() =>
			treeType === FORWARD_TREE
				? filterReducer.groupsActiveFilter
				: filterReducer.devicesActiveFilter,
		[filterReducer.groupsActiveFilter, filterReducer.devicesActiveFilter],
	);

	const handleDoubleClick = useCallback(() => {
		dispatch(setPagintionAvailable(false));
		dispatch(setFilterString(''));
		dispatch(setFilterMode(1));
		dispatch(setActiveFilter(1));
		dispatch(positionOnElement(String(number), 1, headerType, mode));
	}, [number, headerType, mode]);

	const addToFavourite = useMemo((): any => {
		switch (headerType) {
			case GROUP:
				return addGroupToFavourite;
			case DEVICE:
				return addDeviceToFavourite;
			default:
				return () => {};
		}
	}, [headerType]);

	const removeFromFavourite = useMemo((): any => {
		switch (headerType) {
			case GROUP:
				return removeGroupFromFavourite;
			case DEVICE:
				return removeDeviceFromFavourite;
			default:
				return () => {};
		}
	}, [headerType]);

	const handleAddToFavourite = useCallback(
		(e: any) => {
			e.stopPropagation();
			if (!isFavourite) {
				dispatch(addToFavourite(number));
			} else {
				dispatch(removeFromFavourite(number));
			}
		},
		[isFavourite, addToFavourite, removeFromFavourite],
	);

	return (
		<>
			{headerType === SERVER && (
				<div className={styles.header} onContextMenu={handleContextMenu}>
					<div className={styles.header__body}>
						<div className={styles.header__item}>Сервер</div>
						<div className={styles.header__item} title={String(number)}>
							{number}
						</div>
					</div>
				</div>
			)}

			{headerType === GROUP && (
				// eslint-disable-next-line jsx-a11y/click-events-have-key-events,jsx-a11y/no-static-element-interactions
				<div
					onClick={treeType === FORWARD_TREE ? handleItemClick : undefined}
					onContextMenu={handleContextMenu}
					onDoubleClick={
						treeType === REVERSE_TREE || treeType === UNUSED_CHANNELS_TREE
							? handleDoubleClick
							: undefined
					}
					className={clsx(
						styles.header,
						isTreeItemActive &&
							treeType === FORWARD_TREE &&
							styles.header__active,
						isDropdownDisabled && styles.header__last,
					)}
				>
					<div className={styles.header__body}>
						{treeType === FORWARD_TREE && (
							<CheckBox
								id={`${GROUP}_${number}`}
								isChecked={isTreeItemActive}
								setChecked={handleCheckboxClick}
							/>
						)}
						<div title={isSupportTooltipMode ? 'Группа' : ''}>
							<GroupIcon className={clsx(styles.header__item, styles.icon)} />
						</div>

						<div
							className={clsx(
								styles.header__item,
								treeType === FORWARD_TREE
									? styles.groupItem__number
									: styles.groupItem__number_reverse,
							)}
						>
							<span>{number}</span>
							{eWorkNumber && (
								<>
									<span>/</span>
									<span
										title={isSupportTooltipMode ? 'Номер группы по eWork' : ''}
										className={styles.groupItem__number_ework}
									>
										{eWorkNumber}
									</span>
								</>
							)}
						</div>

						<div
							className={clsx(
								styles.header__item,
								styles.header__title,
								treeType === FORWARD_TREE
									? styles.groupItem__title
									: styles.groupItem__title_reverse,
							)}
						>
							<span className={clsx(styles.overflowItem)} title={title}>
								{title}
							</span>
						</div>

						{treeType === FORWARD_TREE && (
							<span
								className={clsx(styles.header__item, styles.groupItem__count)}
								title={
									isSupportTooltipMode ? 'Количество каналов в группе' : ''
								}
							>
								{count}
							</span>
						)}

						{treeType === FORWARD_TREE && (
							<div className={styles.groupItem__rightItems}>
								{hasFormula && (
									<div
										className={
											activeFormula
												? clsx(
														styles.formula,
														styles.formula__active,
														styles.header__item,
												  )
												: clsx(styles.formula, styles.header__item)
										}
										title={
											isSupportTooltipMode
												? activeFormula
													? 'Формула группы активна'
													: 'В группе есть формула'
												: ''
										}
									>
										<span className={clsx(styles.header__item)}>f(x)</span>
									</div>
								)}

								<Button
									className={clsx(
										styles.header__item,
										styles.favouriteBtn,
										isFavourite && styles.favouriteBtn__active,
									)}
									onClick={handleAddToFavourite}
									title={
										isSupportTooltipMode
											? isFavourite
												? 'Исключить группу из избранных'
												: 'Добавить группу в избранные'
											: ''
									}
								>
									<FavouriteIcon />
								</Button>
							</div>
						)}
					</div>
				</div>
			)}

			{headerType === CHANNEL && (
				// eslint-disable-next-line jsx-a11y/click-events-have-key-events,jsx-a11y/no-static-element-interactions
				<div
					className={clsx(
						styles.header,
						treeType === REVERSE_TREE &&
							isTreeItemActive &&
							styles.header__active,
					)}
					onClick={
						treeType === REVERSE_TREE || treeType === UNUSED_CHANNELS_TREE
							? handleChannelItemClick
							: undefined
					}
					onContextMenu={handleContextMenu}
				>
					<div className={styles.header__body}>
						{(treeType === REVERSE_TREE ||
							treeType === UNUSED_CHANNELS_TREE) && (
							<CheckBox
								id={`${CHANNEL}_${number}`}
								isChecked={isTreeItemActive}
								setChecked={handleChannelCheckboxClick}
							/>
						)}
						<div title={isSupportTooltipMode ? 'Канал' : ''}>
							<ChannelIcon className={clsx(styles.header__item, styles.icon)} />
						</div>

						<div
							className={clsx(styles.header__item, styles.channelItem__number)}
						>
							<span className={styles.channelItem__number}>{number}</span>
						</div>
						<div
							className={clsx(
								styles.header__item,
								styles.header__title,
								treeType === FORWARD_TREE
									? styles.channelItem__title
									: styles.channelItem__title_reverse,
							)}
						>
							<span className={clsx(styles.overflowItem)} title={title}>
								{title}
							</span>
						</div>
						{treeType === FORWARD_TREE && (
							<div className={styles.channelItem__coefficient}>
								<span>k = </span>
								{coefficient ? <div>{coefficient}</div> : <span>f(x)</span>}
							</div>
						)}
						{(treeType === REVERSE_TREE ||
							treeType === UNUSED_CHANNELS_TREE) && (
							<span
								className={clsx(
									styles.channelItem__includeFlag,
									isIncluded && styles.channelItem__includeFlag_active,
								)}
								title={
									isSupportTooltipMode
										? isIncluded
											? 'Канал включен в группу'
											: 'Канал не включен в группу'
										: ''
								}
							/>
						)}
					</div>
				</div>
			)}

			{headerType === DEVICE && (
				// eslint-disable-next-line jsx-a11y/click-events-have-key-events,jsx-a11y/no-static-element-interactions
				<div
					className={clsx(
						styles.header,
						treeType === REVERSE_TREE &&
							isTreeItemActive &&
							styles.header__active,
						isDropdownDisabled && styles.header__last,
					)}
					onClick={treeType === REVERSE_TREE ? handleItemClick : undefined}
					onContextMenu={handleContextMenu}
					onDoubleClick={
						treeType === FORWARD_TREE ? handleDoubleClick : undefined
					}
				>
					<div className={styles.header__body}>
						{treeType === REVERSE_TREE && (
							<CheckBox
								id={`${DEVICE}_${number}`}
								isChecked={isTreeItemActive}
								setChecked={handleCheckboxClick}
							/>
						)}
						<div title={isSupportTooltipMode ? 'Прибор' : ''}>
							<DeviceIcon className={clsx(styles.header__item, styles.icon)} />
						</div>
						<div
							className={clsx(styles.header__item, styles.deviceItem__number)}
						>
							<span className={styles.deviceItem__number}>{number}</span>
						</div>
						<div
							className={clsx(
								styles.header__item,
								styles.header__title,
								treeType === FORWARD_TREE
									? styles.deviceItem__title
									: styles.deviceItem__title_reverse,
							)}
						>
							<span className={clsx(styles.overflowItem)} title={title}>
								{title}
							</span>
						</div>
						{treeType === REVERSE_TREE && (
							<>
								<span
									className={clsx(
										styles.header__item,
										styles.deviceItem__count,
									)}
									title={
										isSupportTooltipMode
											? 'Количество каналов подключенных к прибору'
											: ''
									}
								>
									{count}
								</span>
								<div className={styles.deviceItem__rightItems}>
									<Button
										className={clsx(
											styles.header__item,
											styles.favouriteBtn,
											isFavourite && styles.favouriteBtn__active,
										)}
										title={
											isSupportTooltipMode
												? isFavourite
													? 'Исключить прибор из избранных'
													: 'Добавить прибор в избранные'
												: ''
										}
										onClick={handleAddToFavourite}
									>
										<FavouriteIcon />
									</Button>
								</div>
							</>
						)}
					</div>
				</div>
			)}
		</>
	);
}

export default ItemHeader;
