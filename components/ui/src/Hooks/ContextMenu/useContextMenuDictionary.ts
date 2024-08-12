import { useCallback, useMemo } from 'react';

import Basket from '../../Assets/ContextMenu/Basket.svg';
import Calculator from '../../Assets/ContextMenu/Calculator.svg';
import CircleCheck from '../../Assets/ContextMenu/CircleCheck.svg';
import CircleMinus from '../../Assets/ContextMenu/CircleMinus.svg';
import CirclePlus from '../../Assets/ContextMenu/CirclePlus.svg';
import Copy from '../../Assets/ContextMenu/Copy.svg';
import Edit from '../../Assets/ContextMenu/Edit.svg';
import List from '../../Assets/ContextMenu/List.svg';
import Paste from '../../Assets/ContextMenu/Paste.svg';
import Plus from '../../Assets/ContextMenu/Plus.svg';
import Search from '../../Assets/ContextMenu/Search.svg';
import Users from '../../Assets/ContextMenu/Users.svg';
import {
	CHANNEL,
	CREATE_GROUP_FROM_CHANNEL_PARAMETERS,
	CREATE_GROUPS_FROM_CHANNELS_PARAMETERS,
	DEVICE,
	GROUP,
} from '../../Const';
import {
	CREATE_DEVICE,
	CREATE_DEVICES,
	CREATE_GROUP_COPY,
	CREATE_GROUP_FROM_CHANNELS,
	CREATE_GROUPS,
	CREATE_GROUPS_FROM_CHANNELS,
	CREATE_NEW_CHANNELS,
	INCLUDE_CHANNELS_TO_GROUP,
	INCLUDE_UNUSED_CHANNELS_TO_GROUP,
	UPDATE_CHANNEL,
	UPDATE_CHANNEL_COEFFICIENT,
	UPDATE_DEVICE,
	UPDATE_GROUP,
	UPDATE_UNUSED_CHANNEL,
} from '../../Const/parametersBlock';
import { copyToBuffer } from '../../Const/utils';
import usePermissions from '../../Packages/KeycloakInstance/usePermissions';
import { selectUser } from '../../Store/reducers/AuthSlice/authSelectors';
import {
	setDevicesFilterMode,
	setDevicesFilterString,
	setDevicesPaginationAvailable,
	setGroupsFilterMode,
	setGroupsFilterString,
	setGroupsPaginationAvailable,
} from '../../Store/reducers/ConfiguratorSlice/configuratorSlice';
import { getGroupItemEditingAvailable } from '../../Store/reducers/ConfiguratorSlice/utils';
import {
	deleteChannelSubmitting,
	disconnectChannelsSubmitting,
	removeChannelFromGroupSubmitting,
} from '../../Store/reducers/ContextMenuSlice/Channel/channelContextActions';
import { connectChannelsToDevice } from '../../Store/reducers/ContextMenuSlice/Channel/unusedChannelContextActions';
import {
	selectContextMenuId,
	selectContextMenuItemTitle,
	selectContextMenuType,
} from '../../Store/reducers/ContextMenuSlice/contextMenuSelectors';
import { deleteDeviceSubmitting } from '../../Store/reducers/ContextMenuSlice/Device/deviceContextActions';
import { deleteGroupSubmitting } from '../../Store/reducers/ContextMenuSlice/Group/groupContextActions';
import { getDataLocationRpc } from '../../Store/reducers/DataLocationSlice/DataLocationActions';
import {
	setDevicesActiveFilter,
	setGroupsActiveFilter,
} from '../../Store/reducers/FiltersSlice/filtersSlice';
import { selectGroupNumberForFormulaCopy } from '../../Store/reducers/FormulaEditorSlice/FormulaEditorSelectors';
import {
	HistoryElementType,
	HistoryType,
} from '../../Store/reducers/HistorySlice/types';
import {
	clearForCreating,
	filterParameterItems,
	removeParameterItems,
	setIsCreating,
	setOperationType,
	setParameterItems,
	setParametersActive,
} from '../../Store/reducers/ParametersSlice/parametersSlice';
import { TreeItemType } from '../../Types';
import {
	CHANNEL_IN_DEVICE_CONTEXT_MENU,
	CHANNEL_IN_GROUP_CONTEXT_MENU,
	ContextMenuItemClickType,
	ContextMenuType,
	DEVICE_DEFAULT_CONTEXT_MENU,
	DEVICE_IN_CHANNEL_CONTEXT_MENU,
	DEVICES_SERVER_CONTEXT_MENU,
	DictionaryType,
	GROUP_DEFAULT_CONTEXT_MENU,
	GROUP_IN_CHANNEL_CONTEXT_MENU,
	GROUPS_SERVER_CONTEXT_MENU,
	UNUSED_CHANNEL_CONTEXT_MENU,
	UNUSED_CHANNELS_SERVER_CONTEXT_MENU,
} from '../../Types/ContextMenuTypes';
import { useFormulaEditorContainer } from '../FormulaEditor/useFormulaEditorContainer';
import useAppDispatch from '../Store/useAppDispatch';
import { useAppSelector } from '../Store/useAppSelector';
import { useAnalyticGroups } from '../useAnalyticGroups';
import { useDataLocation } from '../useDataLocation';
import { useFindDuplicates } from '../useFindDuplicates';
import { useGroupInformation } from '../useGroupInformation';
import { useHistory } from '../useHistory';

export function useContextMenuDictionary() {
	const dispatch = useAppDispatch();
	const id = useAppSelector(selectContextMenuId);
	const type = useAppSelector(selectContextMenuType);
	const itemTitle = useAppSelector(selectContextMenuItemTitle);
	const userId = useAppSelector(selectUser)?.preferredUsername;
	const groupNumberForFormulaCopy = useAppSelector(
		selectGroupNumberForFormulaCopy,
	);
	const { parameterItems } = useAppSelector((state) => state.parameterReducer);
	const { groupsList } = useAppSelector((state) => state.configuratorReducer);
	const { openHistoryModal, getElementHistory, setHistoryType } = useHistory();
	const { handleOpenAnalyticGroupsModal } = useAnalyticGroups();
	const { openParametersModal, getDataLocation } = useDataLocation();
	const { openDuplicatesModal, getFindDuplicates } = useFindDuplicates();
	const { handleSetGroupFormula, handleCopyFormula, openFormulaEditor } =
		useFormulaEditorContainer();
	const { initializeGroupInformation } = useGroupInformation();
	const permissions = usePermissions();

	const createChannelHelpFunction = useCallback(() => {
		dispatch(filterParameterItems(DEVICE));
	}, [dispatch]);

	const updateChannelHelpFunction = useCallback(() => {
		dispatch(removeParameterItems(GROUP));
	}, [dispatch]);

	const updateParametersItemsFunction = useCallback(
		(parameterType: TreeItemType) => () => {
			dispatch(
				setParameterItems([{ parameterId: id, parameterType: parameterType }]),
			);
		},
		[id, dispatch],
	);
	const connectUnusedChannelsToDevice = useCallback(() => {
		dispatch(connectChannelsToDevice());
		updateChannelHelpFunction();
	}, []);

	const deleteItem = useCallback(
		(itemType: TreeItemType) => () => {
			if (itemType === GROUP) {
				dispatch(
					setParameterItems([{ parameterType: GROUP, parameterId: id }]),
				);
				dispatch(deleteGroupSubmitting);
				return;
			}
			if (itemType === DEVICE) {
				dispatch(
					setParameterItems([{ parameterType: DEVICE, parameterId: id }]),
				);
				dispatch(deleteDeviceSubmitting);
				return;
			}
			dispatch(
				setParameterItems([{ parameterType: CHANNEL, parameterId: id }]),
			);
			dispatch(deleteChannelSubmitting);
		},
		[id],
	);

	const removeItem = useCallback(() => {
		if (type === CHANNEL_IN_GROUP_CONTEXT_MENU) {
			dispatch(removeChannelFromGroupSubmitting);
		}
		if (type === CHANNEL_IN_DEVICE_CONTEXT_MENU) {
			dispatch(disconnectChannelsSubmitting);
		}
	}, [id, type]);

	const setChanelLocation = useCallback(() => {
		openParametersModal();
		getDataLocation(id, userId);
	}, [id, userId, openParametersModal, getDataLocationRpc]);

	const setFindDuplicates = useCallback(() => {
		openDuplicatesModal();
		getFindDuplicates(id);
	}, [id, openDuplicatesModal, getFindDuplicates]);

	const contextMenuItemClickHandler = useCallback(
		({
				operationType,
				needToClear = false,
				updateConfiguratorFunction,
			}: ContextMenuItemClickType) =>
			() => {
				dispatch(setOperationType(operationType));
				dispatch(setParametersActive(true));
				dispatch(setIsCreating(true));
				needToClear && dispatch(clearForCreating());
				updateConfiguratorFunction && updateConfiguratorFunction();
			},
		[dispatch],
	);

	const getElementTypeByMenuType = useCallback((menuType: ContextMenuType) => {
		if (
			menuType === GROUP_DEFAULT_CONTEXT_MENU ||
			menuType === GROUP_IN_CHANNEL_CONTEXT_MENU
		) {
			return HistoryElementType.GROUP;
		}
		if (
			menuType === DEVICE_DEFAULT_CONTEXT_MENU ||
			menuType === DEVICE_IN_CHANNEL_CONTEXT_MENU
		) {
			return HistoryElementType.DEVICE;
		}
		return HistoryElementType.CHANNEL;
	}, []);

	const handlePositionOnTheEntity = useCallback(
		(itemType: TreeItemType) => () => {
			if (itemType === GROUP) {
				dispatch(setGroupsPaginationAvailable(false));
				dispatch(setGroupsFilterMode(1));
				dispatch(setGroupsActiveFilter(1));
				dispatch(setGroupsFilterString(String(id)));
			} else {
				dispatch(setDevicesPaginationAvailable(false));
				dispatch(setDevicesFilterMode(1));
				dispatch(setDevicesActiveFilter(1));
				dispatch(setDevicesFilterString(String(id)));
			}
		},
		[id],
	);

	const handleOpenHistoryModal = useCallback(() => {
		const elementType = getElementTypeByMenuType(type);
		setHistoryType(HistoryType.ELEMENT);
		openHistoryModal();
		getElementHistory(elementType, id);
	}, [id, type, openHistoryModal, getElementHistory, setHistoryType]);

	const handleOpenGroupInformationModal = useCallback(() => {
		initializeGroupInformation();
	}, [initializeGroupInformation]);

	const isChannelIncludingDisabled: boolean = useMemo(
		() =>
			parameterItems.filter((item) => item.parameterType === GROUP).length !==
			1,
		[parameterItems],
	);
	const channelConnectingDisabled: boolean = useMemo(() => {
		const deviceList = parameterItems.filter(
			(item) => item.parameterType === DEVICE,
		);
		return deviceList.length !== 1;
	}, [parameterItems]);

	const isGroupOwner: boolean | undefined = useMemo(() => {
		if (
			type === CHANNEL_IN_GROUP_CONTEXT_MENU ||
			type === CHANNEL_IN_DEVICE_CONTEXT_MENU ||
			type === UNUSED_CHANNEL_CONTEXT_MENU
		) {
			const groupId = parameterItems.find(
				(item) => item.parameterType === GROUP,
			)?.parameterId;
			if (groupId) {
				return getGroupItemEditingAvailable(groupsList, groupId);
			} else return;
		}
		return getGroupItemEditingAvailable(groupsList, id);
	}, [id, type, parameterItems]);

	const isPasteFormulaDisabled = useMemo(() => {
		return (
			!groupNumberForFormulaCopy ||
			!getGroupItemEditingAvailable(groupsList, id)
		);
	}, [groupNumberForFormulaCopy, id]);

	const isSetFormulaDisabled = useMemo(
		() => !getGroupItemEditingAvailable(groupsList, id),
		[id],
	);

	const contextMenuDictionary = useMemo(() => {
		const contextMenu: DictionaryType = {
			/**************
			 * Group Tree *
			 **************/

			[GROUPS_SERVER_CONTEXT_MENU]: [
				{
					name: 'Создать группу',
					onClick: contextMenuItemClickHandler({
						operationType: CREATE_GROUPS,
						needToClear: true,
					}),
					icon: Plus,
					isVisible: permissions.canCreateEditDeleteGroups,
				},
			],

			[GROUP_DEFAULT_CONTEXT_MENU]: [
				{
					name: 'Создать группу',
					onClick: contextMenuItemClickHandler({
						operationType: CREATE_GROUPS,
						needToClear: true,
					}),
					icon: Plus,
					isVisible: permissions.canCreateEditDeleteGroups,
				},
				{
					name: 'Создать копию группы',
					onClick: contextMenuItemClickHandler({
						operationType: CREATE_GROUP_COPY,
					}),
					icon: Plus,
					isVisible: permissions.canCreateEditDeleteGroups,
				},

				{
					name: 'Редактировать',
					onClick: contextMenuItemClickHandler({
						operationType: UPDATE_GROUP,
						updateConfiguratorFunction: updateParametersItemsFunction(GROUP),
					}),
					icon: Edit,
					isVisible: permissions.canCreateEditDeleteGroups,
					disabled: !isGroupOwner,
				},
				{
					name: 'Найти дубли',
					onClick: setFindDuplicates,
					icon: Search,
					isVisible: permissions.canFindGroupDoubles,
				},
				{
					name: 'Найти группу на мнемосхеме',
					onClick: handleOpenGroupInformationModal,
					icon: Search,
					isVisible: permissions.canFindGroupOnScheme,
				},
				{
					name: 'Список аналитиков',
					onClick: handleOpenAnalyticGroupsModal,
					icon: Users,
					isVisible: permissions.canSeeAnalyticGroups,
				},

				{
					name: 'Просмотреть историю',
					onClick: handleOpenHistoryModal,
					icon: List,
					needRenderSeparator: permissions.canCopyPasteGroupFormula, // check next item is visible for render separator
					isVisible: permissions.canSeeHistory,
				},
				{
					name: 'Копировать формулу',
					onClick: handleCopyFormula(id),
					icon: Copy,
					isVisible: permissions.canCopyPasteGroupFormula,
				},
				{
					name: 'Вставить формулу',
					onClick: handleSetGroupFormula,
					icon: Paste,
					isVisible: permissions.canCopyPasteGroupFormula,
					disabled: isPasteFormulaDisabled,
				},
				{
					name: 'Назначить формулу',
					onClick: openFormulaEditor,
					icon: Calculator,
					needRenderSeparator: permissions.canCreateEditDeleteGroups, //check next item is visible for render separator
					isVisible: permissions.canSetGroupFormula,
					disabled: isSetFormulaDisabled,
				},
				{
					name: 'Удалить',
					onClick: deleteItem(GROUP),
					icon: Basket,
					isVisible: permissions.canCreateEditDeleteGroups,
					disabled: !isGroupOwner,
				},
			],

			[CHANNEL_IN_GROUP_CONTEXT_MENU]: [
				{
					name: 'Редактировать коэффициент',
					onClick: contextMenuItemClickHandler({
						operationType: UPDATE_CHANNEL_COEFFICIENT,
					}),
					icon: Edit,
					isVisible: permissions.canEditChannelCoefficient,
					disabled: !isGroupOwner,
				},
				{
					name: 'Просмотреть историю',
					onClick: handleOpenHistoryModal,
					icon: List,
					needRenderSeparator: permissions.canRemoveChannelFromGroup, //check if item last
					isVisible: permissions.canSeeHistory,
				},
				{
					name: 'Удалить из группы',
					onClick: removeItem,
					icon: Basket,
					isVisible: permissions.canRemoveChannelFromGroup,
					disabled: !isGroupOwner,
				},
			],

			[DEVICE_IN_CHANNEL_CONTEXT_MENU]: [
				{
					name: 'Скопировать номер',
					onClick: () => {
						copyToBuffer(String(id));
					},
					icon: Copy,
					isVisible: permissions.canCopyDataToBuffer,
				},
				{
					name: 'Найти в дереве приборов',
					onClick: handlePositionOnTheEntity(DEVICE),
					icon: Search,
					isVisible: permissions.canFindItemInAnotherTree,
				},
			],

			/***************
			 * Device Tree *
			 ***************/

			[DEVICES_SERVER_CONTEXT_MENU]: [
				{
					name: 'Создать прибор',
					onClick: contextMenuItemClickHandler({
						operationType: CREATE_DEVICE,
						needToClear: true,
					}),
					icon: Plus,
					isVisible: permissions.canCreateEditDeleteDevices,
				},
			],

			[DEVICE_DEFAULT_CONTEXT_MENU]: [
				{
					name: 'Создать прибор',
					onClick: contextMenuItemClickHandler({
						operationType: CREATE_DEVICE,
						needToClear: true,
					}),
					icon: Plus,
					isVisible: permissions.canCreateEditDeleteDevices,
				},
				{
					name: 'Создать серию приборов',
					onClick: contextMenuItemClickHandler({
						operationType: CREATE_DEVICES,
						needToClear: true,
					}),
					icon: Plus,
					isVisible: permissions.canCreateEditDeleteDevices,
				},
				{
					name: 'Создать канал',
					onClick: contextMenuItemClickHandler({
						operationType: CREATE_NEW_CHANNELS,
					}),
					icon: Plus,
					isVisible: permissions.canCreateEditConnectDisconnectDeleteChannel,
				},
				{
					name: 'Редактировать',
					onClick: contextMenuItemClickHandler({
						operationType: UPDATE_DEVICE,
						updateConfiguratorFunction: updateParametersItemsFunction(DEVICE),
					}),
					icon: Edit,
					isVisible: permissions.canCreateEditDeleteDevices,
				},
				{
					name: 'Просмотреть историю',
					onClick: handleOpenHistoryModal,
					icon: List,
					needRenderSeparator: permissions.canCreateEditDeleteDevices, //check next item is visible for render separator
					isVisible: permissions.canSeeHistory,
				},
				{
					name: 'Удалить',
					onClick: deleteItem(DEVICE),
					icon: Basket,
					isVisible: permissions.canCreateEditDeleteDevices,
				},
			],

			[CHANNEL_IN_DEVICE_CONTEXT_MENU]: [
				{
					name: 'Создать канал',
					onClick: contextMenuItemClickHandler({
						operationType: CREATE_NEW_CHANNELS,
						updateConfiguratorFunction: createChannelHelpFunction,
					}),
					icon: Plus,
					isVisible: permissions.canCreateEditConnectDisconnectDeleteChannel,
				},
				{
					name:
						parameterItems.filter((el) => el.parameterType === CHANNEL)
							.length === 1
							? CREATE_GROUP_FROM_CHANNEL_PARAMETERS
							: CREATE_GROUPS_FROM_CHANNELS_PARAMETERS,
					onClick: contextMenuItemClickHandler({
						operationType: CREATE_GROUPS_FROM_CHANNELS,
						updateConfiguratorFunction: updateChannelHelpFunction,
					}),
					icon: Plus,
					isVisible: permissions.canCreateGroupsFromChannels,
				},
				{
					name: 'Создать группу из каналов',
					onClick: contextMenuItemClickHandler({
						operationType: CREATE_GROUP_FROM_CHANNELS,
						updateConfiguratorFunction: updateChannelHelpFunction,
					}),
					icon: Plus,
					isVisible: permissions.canCreateGroupsFromChannels,
				},
				{
					name: 'Редактировать',
					onClick: contextMenuItemClickHandler({
						operationType: UPDATE_CHANNEL,
						updateConfiguratorFunction: updateChannelHelpFunction,
					}),
					icon: Edit,
					isVisible: permissions.canCreateEditConnectDisconnectDeleteChannel,
				},
				{
					name: 'Включить каналы в группу',
					onClick: contextMenuItemClickHandler({
						operationType: INCLUDE_CHANNELS_TO_GROUP,
					}),
					disabled: isChannelIncludingDisabled || !isGroupOwner,
					icon: CircleCheck,
					isVisible: permissions.canIncludeChannelsToGroup,
				},
				{
					name: 'Показать расположение данных',
					onClick: setChanelLocation,
					icon: Search,
					isVisible: permissions.canSeeChannelDataPlacement,
				},
				{
					name: 'Просмотреть историю',
					onClick: handleOpenHistoryModal,
					icon: List,
					needRenderSeparator:
						permissions.canCreateEditConnectDisconnectDeleteChannel, // check next item is visible for render separator
					isVisible: permissions.canSeeHistory,
				},
				{
					name: 'Отключить от прибора',
					onClick: removeItem,
					icon: CircleMinus,
					isVisible: permissions.canCreateEditConnectDisconnectDeleteChannel,
				},
			],

			[GROUP_IN_CHANNEL_CONTEXT_MENU]: [
				{
					name: 'Скопировать название',
					onClick: () => {
						copyToBuffer(itemTitle);
					},
					icon: Copy,
					isVisible: permissions.canCopyDataToBuffer,
				},
				{
					name: 'Скопировать номер',
					onClick: () => {
						copyToBuffer(String(id));
					},
					icon: Copy,
					isVisible: permissions.canCopyDataToBuffer,
				},
				{
					name: 'Найти в дереве групп',
					onClick: handlePositionOnTheEntity(GROUP),
					icon: Search,
					isVisible: permissions.canFindItemInAnotherTree,
				},
			],

			/***********************
			 * Unused Channel Tree *
			 ***********************/

			[UNUSED_CHANNELS_SERVER_CONTEXT_MENU]: [
				{
					name: 'Создать канал',
					onClick: contextMenuItemClickHandler({
						operationType: CREATE_NEW_CHANNELS,
						updateConfiguratorFunction: createChannelHelpFunction,
					}),
					icon: Plus,
					isVisible: permissions.canCreateEditConnectDisconnectDeleteChannel,
				},
			],

			[UNUSED_CHANNEL_CONTEXT_MENU]: [
				{
					name: 'Создать канал',
					onClick: contextMenuItemClickHandler({
						operationType: CREATE_NEW_CHANNELS,
						updateConfiguratorFunction: createChannelHelpFunction,
					}),
					icon: Plus,
					isVisible: permissions.canCreateEditConnectDisconnectDeleteChannel,
				},
				{
					name: 'Редактировать',
					onClick: contextMenuItemClickHandler({
						operationType: UPDATE_UNUSED_CHANNEL,
						updateConfiguratorFunction: updateChannelHelpFunction,
					}),
					icon: Edit,
					isVisible: permissions.canCreateEditConnectDisconnectDeleteChannel,
				},
				{
					name:
						parameterItems
							.filter((el) => el.parameterType === CHANNEL)
							.map((item) => item.parameterId).length === 1
							? CREATE_GROUP_FROM_CHANNEL_PARAMETERS
							: CREATE_GROUPS_FROM_CHANNELS_PARAMETERS,
					onClick: contextMenuItemClickHandler({
						operationType: CREATE_GROUPS_FROM_CHANNELS,
						updateConfiguratorFunction: updateChannelHelpFunction,
					}),
					icon: Plus,
					isVisible: permissions.canCreateGroupsFromChannels,
				},
				{
					name: 'Создать группу из каналов',
					onClick: contextMenuItemClickHandler({
						operationType: CREATE_GROUP_FROM_CHANNELS,
						updateConfiguratorFunction: updateChannelHelpFunction,
					}),
					icon: Plus,
					isVisible: permissions.canCreateGroupsFromChannels,
				},
				{
					name: 'Подключить к прибору',
					onClick: connectUnusedChannelsToDevice,
					icon: CirclePlus,
					isVisible: permissions.canCreateEditConnectDisconnectDeleteChannel,
					disabled: channelConnectingDisabled,
				},

				{
					name: 'Включить каналы в группу',
					onClick: contextMenuItemClickHandler({
						operationType: INCLUDE_UNUSED_CHANNELS_TO_GROUP,
					}),
					icon: CircleCheck,
					disabled: isChannelIncludingDisabled || !isGroupOwner,
					isVisible: permissions.canIncludeChannelsToGroup,
				},
				{
					name: 'Показать расположение данных',
					onClick: setChanelLocation,
					icon: Search,
					isVisible: permissions.canSeeChannelDataPlacement,
				},
				{
					name: 'Просмотреть историю',
					onClick: handleOpenHistoryModal,
					icon: List,
					needRenderSeparator:
						permissions.canCreateEditConnectDisconnectDeleteChannel, // check next item is visible for render separator
					isVisible: permissions.canSeeHistory,
				},
				{
					name: 'Удалить',
					onClick: deleteItem(CHANNEL),
					icon: Basket,
					isVisible: permissions.canCreateEditConnectDisconnectDeleteChannel,
				},
			],
		};
		return contextMenu;
	}, [
		contextMenuItemClickHandler,
		handleOpenHistoryModal,
		createChannelHelpFunction,
		updateChannelHelpFunction,
		updateParametersItemsFunction,
		deleteItem,
		removeItem,
		connectUnusedChannelsToDevice,
		setChanelLocation,
		parameterItems,
	]);

	// TODO: Remove useEffect from useContextMenu and move 'id' and 'type' there
	return { contextMenuDictionary, id, type };
}
