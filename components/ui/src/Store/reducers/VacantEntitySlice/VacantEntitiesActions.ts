import { toast } from 'react-toastify';
import { IMessage } from '@stomp/stompjs';

import {
	checkResponseOutputErrors,
	handleResponseOutputError,
} from '../../../Shared/Utils/utils';
import { rpcEndPoint } from '../../../WebSocket';
import { AppDispatch, rxStompRPC } from '../../store';

import { convertVacantEntities } from './converters';
import { getVacantEntitiesQuery } from './queries';
import { VacantEntityParams, VacantEntityResponse } from './types';
import { vacantEntitiesSlice } from './VacantEntitiesSlice';

export const {
	setVacantEntities,
	clearVacantEntities,
	openVacantEntitiesModal,
	closeVacantEntitiesModal,
	setIsVacantEntitiesLoading,
	setVacantEntitiesTotalCount,
	setVacantEntitiesSelectorData,
	setVacantEntityTypeActive,
} = vacantEntitiesSlice.actions;

export const getVacantEntitiesRpc =
	(params: VacantEntityParams) => (dispatch: AppDispatch) => {
		dispatch(setIsVacantEntitiesLoading(true));
		rxStompRPC
			.rpc({
				destination: rpcEndPoint,
				body: JSON.stringify(getVacantEntitiesQuery(params)),
			})
			.subscribe((response: IMessage) => {
				if (checkResponseOutputErrors(response)) {
					handleResponseOutputError(response);
				} else {
					try {
						const vacantEntities: VacantEntityResponse[] = JSON.parse(
							response.body,
						).Response.Tables[0].Rows;
						const convertedVacantEntities =
							convertVacantEntities(vacantEntities);
						const totalCount: string = JSON.parse(response.body).Response
							.OutParameters[0]['@PageTotalCount'];
						if (!convertedVacantEntities.length) {
							toast.warn('Нет данных по свободным номерам');
						}
						dispatch(setVacantEntities(convertedVacantEntities));
						dispatch(setVacantEntitiesTotalCount(Number(totalCount)));
					} catch (_err) {
						toast.error('Что-то пошло не так');
					} finally {
						dispatch(setIsVacantEntitiesLoading(false));
					}
				}
			});
	};
