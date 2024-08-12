import { toast } from 'react-toastify';
import { IMessage } from '@stomp/stompjs';

import { deleteGroupBody } from '../../../../Components/SubmitOperation/deleteGroupBody';
import {
	SubmitButtonText,
	SubmitOperation,
	SubmitOperationTitle,
} from '../../../../Components/SubmitOperation/types';
import {
	COMMON_PAGE_ROW_COUNT,
	FORWARD_TREE,
	GROUP,
	NAME_PARAM,
	NUMBER_PARAM,
} from '../../../../Const';
import {
	getParameterValue,
	getQueryOutputParameters,
} from '../../../../Const/utils';
import { ModuleName } from '../../../../Shared/types';
import {
	checkResponseOutputErrors,
	handleResponseOutputError,
	handleResponseOutputWarning,
} from '../../../../Shared/Utils/utils';
import { ParamsBlock } from '../../../../Types/ParametersBlockTypes';
import { FavouriteLogOperationType } from '../../../../Types/RpcResponseTypes';
import { rpcEndPoint } from '../../../../WebSocket';
import { AppDispatch, RootState, rxStompRPC } from '../../../store';
import {
	fetchGroupsList,
	updateGroups,
} from '../../ConfiguratorSlice/configuratorActions';
import {
	filterGroupsList,
	updateGroupFavourite,
} from '../../ConfiguratorSlice/configuratorSlice';
import {
	setIsCreating,
	setParameterItems,
} from '../../ParametersSlice/parametersSlice';
import {
	openSubmitOperationModal,
	setSubmitButtonText,
	setSubmitOperationBody,
	setSubmitOperationFunction,
	setSubmitOperationTitle,
} from '../../SubmitOperationSlice/SubmitOperationSlice';

import { addGroupToFavouriteQuery } from './queries/addGroupToFavouriteQuery';
import { createGroupCopyQuery } from './queries/createGroupCopyQuery';
import { createGroupsQuery } from './queries/createGroupsQuery';
import { deleteGroupQuery } from './queries/deleteGroupQuery';
import { removeGroupFromFavouriteQuery } from './queries/removeGroupFromFavouriteQuery';
import { updateGroupQuery } from './queries/updateGroupQuery';

export const addGroupToFavourite =
	(groupNumber: number) =>
	(dispatch: AppDispatch, getState: () => RootState) => {
		const userId = getState().authReducer.user?.preferredUsername;
		try {
			rxStompRPC
				.rpc({
					destination: rpcEndPoint,
					body: JSON.stringify(
						addGroupToFavouriteQuery({
							numbers: String(groupNumber),
							userId,
							moduleName: ModuleName.GroupContextActions_addGroupToFavourite,
						}),
					),
				})
				.subscribe(function (response: IMessage) {
					const outParameters = getQueryOutputParameters(response);
					if (checkResponseOutputErrors(response)) {
						handleResponseOutputError(response);
					} else {
						const logOperation: FavouriteLogOperationType = JSON.parse(
							outParameters['@LogOperation'],
						);
						dispatch(
							updateGroupFavourite({
								logOperation: logOperation,
								isFavourite: true,
							}),
						);
						toast.success(`Группа ${groupNumber} добавлена в избранное`);
					}
				});
		} catch (e) {
			console.log(e);
		}
	};
export const removeGroupFromFavourite =
	(groupNumber: number) =>
	(dispatch: AppDispatch, getState: () => RootState) => {
		const userId = getState().authReducer.user?.preferredUsername;
		try {
			rxStompRPC
				.rpc({
					destination: rpcEndPoint,
					body: JSON.stringify(
						removeGroupFromFavouriteQuery({
							numbers: String(groupNumber),
							userId,
							moduleName:
								ModuleName.GroupContextActions_removeGroupFromFavourite,
						}),
					),
				})
				.subscribe(function (response: IMessage) {
					const outParameters = getQueryOutputParameters(response);
					if (checkResponseOutputErrors(response)) {
						handleResponseOutputError(response);
					} else {
						const logOperation: FavouriteLogOperationType = JSON.parse(
							outParameters['@LogOperation'],
						);
						dispatch(
							updateGroupFavourite({
								logOperation: logOperation,
								isFavourite: false,
							}),
						);
						toast.success(`Группа ${groupNumber} удалена из избранных`);
					}
				});
		} catch (e) {
			console.log(e);
		}
	};
export const deleteGroupSubmitting = (
	dispatch: AppDispatch,
	getState: () => RootState,
) => {
	const group = getState()
		.parameterReducer.parameterItems.filter(
			(item) => item.parameterType === GROUP,
		)
		.map((item) => {
			return getState().configuratorReducer.groupsList.find(
				(groupsListItem) => groupsListItem.Number === item.parameterId,
			);
		})[0];
	const groupNumber = Number(group?.Number);
	dispatch(setSubmitOperationTitle(SubmitOperationTitle.DeletePosition));
	dispatch(
		setSubmitOperationBody(
			deleteGroupBody({
				itemNumber: groupNumber,
				itemName: String(group?.Name),
				channelsCount: Number(group?.ChannelsCount),
			}),
		),
	);
	dispatch(setSubmitButtonText(SubmitButtonText.Delete));
	dispatch(setSubmitOperationFunction(SubmitOperation.DeleteGroup));
	dispatch(openSubmitOperationModal());
};
export const deleteGroup = (
	dispatch: AppDispatch,
	getState: () => RootState,
) => {
	const { authReducer, configuratorReducer, parameterReducer } = getState();
	const userId = authReducer.user?.preferredUsername;
	const group = parameterReducer.parameterItems
		.filter((item) => item.parameterType === GROUP)
		.map((item) => {
			return configuratorReducer.groupsList.find(
				(groupsListItem) => groupsListItem.Number === item.parameterId,
			);
		})[0];
	const groupNumber = Number(group?.Number);

	try {
		rxStompRPC
			.rpc({
				destination: rpcEndPoint,
				body: JSON.stringify(
					deleteGroupQuery({
						number: groupNumber,
						lastModified: String(group?.LastModified),
						userId,
						moduleName: ModuleName.GroupContextActions_deleteGroup,
					}),
				),
			})
			.subscribe(function (response: IMessage) {
				if (checkResponseOutputErrors(response)) {
					handleResponseOutputError(response);
				} else {
					dispatch(filterGroupsList(groupNumber));
					dispatch(setParameterItems([]));
					toast.success(`Группа ${groupNumber} успешно удалена`);
				}
			});
	} catch (e) {
		console.log(e);
	}
};

export const createGroups =
	(parametersData: ParamsBlock[]) =>
	(dispatch: AppDispatch, getState: () => RootState) => {
		const { configuratorReducer, authReducer, sortReducer, filtersReducer } =
			getState();
		const serverId = Number(configuratorReducer.currentServer);
		const userId = authReducer.user?.preferredUsername;
		const { groupsSortOrder } = sortReducer;
		const parameterItems = parametersData[0].sortParams;
		const name = parameterItems[0].value;
		const number = parameterItems[1].value;
		const unit = parameterItems[2].value;
		const method = parameterItems[3].value;
		const typeStorage = parameterItems[4].value;
		const filterMode = configuratorReducer.groupPagination.filterMode;
		const mode = filtersReducer.groupsActiveFilter;

		try {
			rxStompRPC
				.rpc({
					destination: rpcEndPoint,
					body: JSON.stringify(
						createGroupsQuery({
							name: String(name),
							number: Number(number),
							unit: Number(unit),
							method: Number(method),
							typeStorage: Number(typeStorage),
							server: serverId,
							userId: userId,
							moduleName: ModuleName.GroupContextActions_createGroups,
						}),
					),
				})
				.subscribe(function (response: IMessage) {
					if (checkResponseOutputErrors(response)) {
						handleResponseOutputError(response);
					} else {
						toast.success('Группа успешно создана');
						dispatch(
							fetchGroupsList(
								1,
								COMMON_PAGE_ROW_COUNT,
								String(number),
								null,
								serverId,
								false,
								filterMode,
								mode,
								groupsSortOrder,
								userId,
							),
						);
						dispatch(
							setParameterItems([
								{ parameterType: GROUP, parameterId: Number(number) },
							]),
						);
					}
				});
		} catch (e) {
			console.log(e);
		} finally {
			dispatch(setIsCreating(false));
		}
	};

export const createGroupCopy =
	(parametersData: ParamsBlock[]) =>
	(dispatch: AppDispatch, getState: () => RootState) => {
		const { sortReducer, authReducer, configuratorReducer } = getState();
		const serverId = Number(configuratorReducer.currentServer);
		const userId = authReducer.user?.preferredUsername;
		const { groupsSortOrder } = sortReducer;
		const parameterItems = parametersData[0].sortParams;
		const name = getParameterValue(parameterItems, NAME_PARAM);
		const number = getParameterValue(parameterItems, NUMBER_PARAM);
		const numberSource = parametersData[0].header.split('№')[1];

		try {
			rxStompRPC
				.rpc({
					destination: rpcEndPoint,
					body: JSON.stringify(
						createGroupCopyQuery({
							name: String(name),
							numberSource: Number(numberSource),
							numberNew: Number(number),
							userId: userId,
							moduleName: ModuleName.GroupContextActions_createGroupCopy,
						}),
					),
				})
				.subscribe(function (response: IMessage) {
					if (checkResponseOutputErrors(response)) {
						handleResponseOutputError(response);
					} else {
						toast.success('Копия группы успешно создана');
						dispatch(
							fetchGroupsList(
								1,
								COMMON_PAGE_ROW_COUNT,
								String(number),
								null,
								serverId,
								false,
								1,
								1,
								groupsSortOrder,
								userId,
							),
						);
						dispatch(
							setParameterItems([
								{ parameterType: GROUP, parameterId: Number(number) },
							]),
						);
					}
				});
		} catch (e) {
			console.log(e);
		} finally {
			dispatch(setIsCreating(false));
		}
	};

export const updateGroup =
	(parametersData: ParamsBlock[]) =>
	(dispatch: AppDispatch, getState: () => RootState) => {
		const currentState = getState();
		const server = currentState.configuratorReducer.currentServer;
		const newGroupData = parametersData[0];
		const userId = getState().authReducer.user?.preferredUsername;
		const groupToUpdate = currentState.parameterReducer.parameterItems
			.filter((item) => item.parameterType === GROUP)
			.map((item) => {
				const groupItem = currentState.configuratorReducer.groupsList.find(
					(groupsListItem) => groupsListItem.Number === item.parameterId,
				);
				return {
					Number: item.parameterId,
					LastModified: groupItem?.LastModified,
					isFormula: groupItem?.Formula,
					isFormulaActive: groupItem?.ActiveFormula,
				};
			})[0];

		const groupName = String(newGroupData.sortParams[0].value);
		const groupNumber = Number(newGroupData.sortParams[1].value);
		const fkUnits = Number(newGroupData.sortParams[2].value);
		const fkMethods = Number(newGroupData.sortParams[3].value);
		const eworkNumber = Number(newGroupData.sortParams[4].value);
		const fkTypeStorage = Number(newGroupData.sortParams[5].value);

		try {
			rxStompRPC
				.rpc({
					destination: rpcEndPoint,
					body: JSON.stringify(
						updateGroupQuery({
							groupNumber,
							groupName,
							fkUnits,
							fkTypeStorage,
							fkMethods,
							lastModified: String(groupToUpdate.LastModified),
							eWork: eworkNumber === 0 ? null : eworkNumber,
							userId,
							isFormula: !!groupToUpdate.isFormula,
							isFormulaActive: !!groupToUpdate.isFormulaActive,
							moduleName: ModuleName.GroupContextActions_updateGroup,
						}),
					),
				})
				.subscribe(function (response: IMessage) {
					if (checkResponseOutputErrors(response)) {
						handleResponseOutputError(response);
					} else {
						dispatch(
							updateGroups(groupNumber, GROUP, FORWARD_TREE, server, userId),
						);
						toast.success(`Группа ${groupNumber} успешно отредактирована`);
						handleResponseOutputWarning(response);
					}
				});
		} catch (e) {
			console.log(e);
		} finally {
			dispatch(setIsCreating(false));
		}
	};
