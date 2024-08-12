import { toast } from 'react-toastify';
import { IMessage } from '@stomp/stompjs';

import {
	checkResponseOutputErrors,
	handleResponseOutputError,
} from '../../../Shared/Utils/utils';
import { rpcEndPoint } from '../../../WebSocket';
import { AppDispatch, rxStompRPC } from '../../store';

import { analyticGroupsSlice } from './AnalyticGroupsSlice';
import { convertAnalyticGroups } from './converters';
import {
	createNewAnalyticGroupQuery,
	deleteAnalyticGroupQuery,
	getAnalyticGroupsQuery,
	updateAnalyticGroupQuery,
} from './queries';
import {
	AnalyticGroups,
	AnalyticGroupsProps,
	AnalyticGroupsResponse,
	AnalyticRangeLogOperation,
	CreateAnalyticGroupsProps,
	DeleteAnalyticGroupRange,
	UpdateAnalyticGroupRange,
} from './types';

export const {
	setAnalyticGroupsIsLoading,
	openAnalyticGroupsModal,
	closeAnalyticGroupsModal,
	setAnalyticGroups,
	createAnalyticGroupsRange,
	deleteAnalyticGroupsRange,
	updateAnalyticGroupsRange,
	toggleCollapseAnalyticGroup,
} = analyticGroupsSlice.actions;

export const getAnalyticGroupsRpc =
	(props: AnalyticGroupsProps) => (dispatch: AppDispatch) => {
		dispatch(setAnalyticGroupsIsLoading(true));
		rxStompRPC
			.rpc({
				destination: rpcEndPoint,
				body: JSON.stringify(getAnalyticGroupsQuery(props)),
			})
			.subscribe((response: IMessage) => {
				if (checkResponseOutputErrors(response)) {
					handleResponseOutputError(response);
				} else {
					try {
						const result: AnalyticGroupsResponse[] = JSON.parse(response.body)
							.Response.Tables[0].Rows;
						const convertedResult: AnalyticGroups[] =
							convertAnalyticGroups(result);
						dispatch(setAnalyticGroups(convertedResult));
					} catch (err) {
						toast.error('Что-то пошло не так');
					}
				}

				dispatch(setAnalyticGroupsIsLoading(false));
			});
	};
export const createNewAnalyticGroupRpc =
	(props: CreateAnalyticGroupsProps) => (dispatch: AppDispatch) => {
		const { analyticId, rangeStart, rangeEnd } = props;
		dispatch(setAnalyticGroupsIsLoading(true));
		rxStompRPC
			.rpc({
				destination: rpcEndPoint,
				body: JSON.stringify(createNewAnalyticGroupQuery(props)),
			})
			.subscribe((response: IMessage) => {
				if (checkResponseOutputErrors(response)) {
					handleResponseOutputError(response);
				} else {
					try {
						const result: string = JSON.parse(response.body).Response
							.OutParameters[0]['@LogOperation'];

						const parsedResult: AnalyticRangeLogOperation[] =
							JSON.parse(result);
						const { ID = 0, LastModified } = parsedResult[0];
						dispatch(
							createAnalyticGroupsRange({
								analyticId,
								rangeStart,
								rangeEnd,
								rangeId: ID,
								lastModified: LastModified,
							}),
						);
						toast.success('Диапазон успешно создан!');
					} catch (err) {
						toast.error('Что-то пошло не так');
					}
				}
				dispatch(setAnalyticGroupsIsLoading(false));
			});
	};

export const updateAnalyticGroupRangeRpc =
	(props: UpdateAnalyticGroupRange) => (dispatch: AppDispatch) => {
		dispatch(setAnalyticGroupsIsLoading(true));
		rxStompRPC
			.rpc({
				destination: rpcEndPoint,
				body: JSON.stringify(updateAnalyticGroupQuery(props)),
			})
			.subscribe((response: IMessage) => {
				if (checkResponseOutputErrors(response)) {
					handleResponseOutputError(response);
				} else {
					try {
						const result: string = JSON.parse(response.body).Response[
							'OutParameters'
						][0]['@LogOperation'];
						const parsedResult: AnalyticRangeLogOperation[] =
							JSON.parse(result);
						const { LastModified } = parsedResult[0];

						dispatch(
							updateAnalyticGroupsRange({
								...props,
								lastModified: LastModified,
							}),
						);
						toast.success('Диапазон успешно обновлен!');
					} catch (err) {
						toast.error('Что-то пошло не так');
					}
				}
				dispatch(setAnalyticGroupsIsLoading(false));
			});
	};
export const deleteAnalyticGroupRangeRpc =
	(props: DeleteAnalyticGroupRange) => (dispatch: AppDispatch) => {
		dispatch(setAnalyticGroupsIsLoading(true));
		rxStompRPC
			.rpc({
				destination: rpcEndPoint,
				body: JSON.stringify(deleteAnalyticGroupQuery(props)),
			})
			.subscribe((response: IMessage) => {
				if (checkResponseOutputErrors(response)) {
					handleResponseOutputError(response);
				} else {
					try {
						dispatch(deleteAnalyticGroupsRange(props));
						toast.success('Диапазон успешно удален!');
					} catch (err) {
						toast.error('Что-то пошло не так');
					}
				}
				dispatch(setAnalyticGroupsIsLoading(false));
			});
	};
