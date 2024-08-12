import { IMessage } from '@stomp/stompjs';
import { createEffect } from 'effector';

import { getGroupsListQuery } from '../../Const/Queries';
import { rxStompRPC } from '../../packages/StompClient';
import { rpcEndPoint } from '../../packages/StompClient/createWSConnection';
import {
	GroupListResponse,
	HardwareGroupListOptions,
	OptimizedPagination,
} from '../../Shared/types';

import { setGroupList, setPaginationInfo } from './event';

export const fetchGroupListFx = createEffect<HardwareGroupListOptions, void>(
	({
		pageNumber,
		pageRowCount,
		filterStr,
		fkChannel,
		serverId,
		filterMode,
		orderMode,
		mode,
		userId,
	}) => {
		rxStompRPC
			.rpc({
				destination: rpcEndPoint,
				body: JSON.stringify(
					getGroupsListQuery(
						pageNumber,
						pageRowCount,
						filterStr,
						fkChannel,
						serverId,
						filterMode,
						orderMode,
						mode,
						userId,
					),
				),
			})
			.subscribe(function (result: IMessage) {
				const response = JSON.parse(result.body).Response;
				const outParams = JSON.parse(result.body).Response.OutParameters[0];
				const data: GroupListResponse[] = response.Tables[0].Rows;
				const preparedData = data.map((item) => ({
					number: item.Number,
					name: item.Name,
					FKDataServers: item.FK_DataServers,
					lastModified: item.LastModified,
					comment: item.LastModified,
					channelsCount: item.ChannelsCount,
					isFavorite: item.IsFavorite,
					rowNumber: item.RowNumber,
					EWorkNumber: item.Number_EWork,
					method: item.Method_Name,
					unitName: item.Unit_Name,
					unitId: item.Unit_ID,
				}));
				const pagination: OptimizedPagination = {
					pageNumber: Number(outParams['@PageNumberOut']),
					pageTotalCount: Number(outParams['@PageTotalCount']),
					rowsPerPage: preparedData.length,
					positionRow: Number(outParams['@SelectRow']),
				};
				setPaginationInfo(pagination);
				setGroupList(preparedData);
			});
	},
);
