import { toast } from 'react-toastify';
import { IMessage } from '@stomp/stompjs';

import { formulaFromDBAdapter } from '../../../Adapters/FormulaEditor/formulaFromDBAdapter';
import { COMMON_PAGE_ROW_COUNT, FORWARD_TREE, GROUP } from '../../../Const';
import {
	checkResponseOutputErrors,
	handleResponseOutputError,
	handleResponseOutputWarning,
} from '../../../Shared/Utils/utils';
import { rpcEndPoint } from '../../../WebSocket';
import { AppDispatch, RootState, rxStompRPC } from '../../store';
import {
	fetchGroupsList,
	updateElementsLists,
	updateGroups,
} from '../ConfiguratorSlice/configuratorActions';
import { removeChannelsFromGroup } from '../ConfiguratorSlice/configuratorSlice';

import { formulaCopyQuery } from './queries/formulaCopyQuery';
import { getFormulaListQuery } from './queries/getFormulaListQuery';
import { updateActiveFormulaQuery } from './queries/updateActiveFormulaQuery';
import { updateFormulaListQuery } from './queries/updateFormulaListQuery';
import { setFormulaText } from './FormulaEditorSlice';
import {
	FormulaCopyQuery,
	GetFormula,
	UpdateActiveFormula,
	UpdateFormula,
} from './types';

export const copyGroupFormula =
	(params: FormulaCopyQuery) =>
	(dispatch: AppDispatch, getState: () => RootState) => {
		const { configuratorReducer, filtersReducer, sortReducer } = getState();
		const serverId = configuratorReducer.currentServer;
		const filterMode = configuratorReducer.groupPagination.filterMode;
		const mode = filtersReducer.groupsActiveFilter;
		const { groupsSortOrder } = sortReducer;
		const { number, numberSource } = params;
		rxStompRPC
			.rpc({
				destination: rpcEndPoint,
				body: JSON.stringify(formulaCopyQuery(params)),
			})
			.subscribe((response: IMessage) => {
				if (checkResponseOutputErrors(response)) {
					handleResponseOutputError(response);
				} else {
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
							params.userId,
						),
					);
					toast.success(
						`Формула группы ${numberSource} успешно назначена для группы ${number}`,
					);
					handleResponseOutputWarning(response);
				}
			});
	};

export const getFormulaText =
	(params: GetFormula) => (dispatch: AppDispatch) => {
		rxStompRPC
			.rpc({
				destination: rpcEndPoint,
				body: JSON.stringify(getFormulaListQuery(params)),
			})
			.subscribe((response: IMessage) => {
				if (checkResponseOutputErrors(response)) {
					handleResponseOutputError(response);
				} else {
					const formulaListFromDB = JSON.parse(response.body).Response.Tables[0]
						.Rows;
					const formulaTextFromDB = formulaFromDBAdapter(formulaListFromDB);
					dispatch(setFormulaText(formulaTextFromDB));
				}
			});
	};

export const updateFormulaList =
	(params: UpdateFormula) =>
	(dispatch: AppDispatch, getState: () => RootState) => {
		const { number, userId } = params;
		const { configuratorReducer } = getState();
		const { currentServer } = configuratorReducer;

		rxStompRPC
			.rpc({
				destination: rpcEndPoint,
				body: JSON.stringify(updateFormulaListQuery(params)),
			})
			.subscribe((response: IMessage) => {
				if (checkResponseOutputErrors(response)) {
					handleResponseOutputError(response);
				} else {
					toast.success(`Назначена формула группы ${params.number}`);
					dispatch(
						updateGroups(number, GROUP, FORWARD_TREE, currentServer, userId),
					);
				}
			});
	};

export const updateActiveFormula =
	(params: UpdateActiveFormula) =>
	(dispatch: AppDispatch, getState: () => RootState) => {
		const { configuratorReducer, authReducer } = getState();
		const { currentServer } = configuratorReducer;
		const { user } = authReducer;
		const { number, activeFormula } = params;

		rxStompRPC
			.rpc({
				destination: rpcEndPoint,
				body: JSON.stringify(updateActiveFormulaQuery(params)),
			})
			.subscribe((response: IMessage) => {
				if (checkResponseOutputErrors(response)) {
					handleResponseOutputError(response);
				} else {
					toast.success(
						`Формула группы ${number} ${
							activeFormula ? 'активирована' : 'деактивирована'
						}`,
					);
					dispatch(
						updateGroups(
							number,
							GROUP,
							FORWARD_TREE,
							currentServer,
							user?.preferredUsername,
						),
					);
					dispatch(removeChannelsFromGroup({ groupNumber: number }));
					dispatch(
						updateElementsLists(number, GROUP, FORWARD_TREE, currentServer),
					);
				}
			});
	};
