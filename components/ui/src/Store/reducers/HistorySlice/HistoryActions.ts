import { toast } from 'react-toastify';
import { IMessage } from '@stomp/stompjs';

import {
	checkResponseOutputErrors,
	handleResponseOutputError,
} from '../../../Shared/Utils/utils';
import { rpcEndPoint } from '../../../WebSocket';
import { AppDispatch, rxStompRPC } from '../../store';

import { convertHistory } from './converters';
import { historySlice } from './HistorySlice';
import { getElementHistoryQuery, getGeneralHistoryQuery } from './queries';
import {
	HistoryElementParams,
	HistoryGeneralParams,
	HistoryResponse,
} from './types';

export const {
	openHistoryModal,
	closeHistoryModal,
	setHistory,
	clearHistory,
	setHistoryIsLoading,
	toggleCollapseHistoryItem,
	setHistoryDates,
	setHistoryTypes,
	setHistoryType,
	setHistoryDefaultFilters,
	setHistoryTotalCount,
} = historySlice.actions;

export const getGeneralHistoryRpc =
	(params: HistoryGeneralParams) => (dispatch: AppDispatch) => {
		dispatch(setHistoryIsLoading(true));
		rxStompRPC
			.rpc({
				destination: rpcEndPoint,
				body: JSON.stringify(getGeneralHistoryQuery(params)),
			})
			.subscribe((response: IMessage) => {
				if (checkResponseOutputErrors(response)) {
					handleResponseOutputError(response);
				} else {
					try {
						const result: HistoryResponse[] = JSON.parse(response.body).Response
							.Tables[0].Rows;
						const convertedResult = convertHistory(result);
						dispatch(setHistory(convertedResult));
						const totalCount: string = JSON.parse(response.body).Response
							.OutParameters[0]['@PageTotalCount'];
						dispatch(setHistoryTotalCount(Number(totalCount)));
					} catch (err) {
						toast.error('Что-то пошло не так');
					}
				}
				dispatch(setHistoryIsLoading(false));
			});
	};

export const getElementHistoryRpc =
	(params: HistoryElementParams) => (dispatch: AppDispatch) => {
		dispatch(setHistoryIsLoading(true));
		rxStompRPC
			.rpc({
				destination: rpcEndPoint,
				body: JSON.stringify(getElementHistoryQuery(params)),
			})
			.subscribe((response: IMessage) => {
				if (checkResponseOutputErrors(response)) {
					handleResponseOutputError(response);
				} else {
					try {
						const parsedResponse = JSON.parse(response.body).Response;
						const result: HistoryResponse[] = parsedResponse.Tables[0].Rows;
						const convertedResult = convertHistory(result);
						dispatch(setHistory(convertedResult));
					} catch (_err) {
						toast.error('Что-то пошло не так');
					} finally {
						dispatch(setHistoryIsLoading(false));
					}
				}
			});
	};
