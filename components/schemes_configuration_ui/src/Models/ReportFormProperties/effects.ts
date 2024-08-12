import { toast } from 'react-toastify';
import { createEffect } from 'effector';

import { moveObjectAdapter } from '../../Adapters/moveObjectAdapter';
import { reportFormGroupListAdapter } from '../../Adapters/reportFormGroupListAdapter';
import { createObjectParameterQuery } from '../../Const/Queries/createObjectParameterQuery';
import { deleteObjectQuery } from '../../Const/Queries/deleteObjectImage';
import getReportFormGroupListQuery from '../../Const/Queries/getReportFormGroupList';
import { moveObjectQuery } from '../../Const/Queries/moveObject';
import {
	AddGroupsParams,
	DeleteGroupsParams,
	FetchReportGroupListParams,
	MoveObjectParams,
} from '../../Shared/types';
import { handleError } from '../../Utils/handleToast';
import { rpcQuery } from '../../Utils/requests';

import { removeSelectedGroupList } from './events';
import { GroupsInReportForm } from './types';

export const getReportFormGroupListFx = createEffect(
	async (params: FetchReportGroupListParams) => {
		const reportFormGroupList = await rpcQuery<GroupsInReportForm[]>(
			getReportFormGroupListQuery(params),
			reportFormGroupListAdapter,
		);
		return reportFormGroupList;
	},
);

export const moveGroupFx = createEffect(async (params: MoveObjectParams) => {
	const rowsMoved = await rpcQuery<string>(
		moveObjectQuery(params),
		moveObjectAdapter,
	);
	return rowsMoved;
});

export const addGroupsFx = createEffect(async (params: AddGroupsParams) => {
	const { groups, formId, versionId, userId, moduleName } = params;
	Promise.allSettled(
		groups.map((group, index) => {
			rpcQuery(
				createObjectParameterQuery({
					value: group.number,
					formId,
					versionId,
					parameterName: 'ReportGroups',
					order: index + 1,
					userId,
					moduleName,
				}),
			).catch((err) => {
				handleError(err);
			});
		}),
	).then(() => {
		if (formId)
			getReportFormGroupListFx({
				formId,
				userId,
				moduleName,
			});
		toast.success('Группы успешно добавлены');
		removeSelectedGroupList();
	});
});

export const deleteGroupFx = createEffect(
	async (params: DeleteGroupsParams) => {
		const { groups, formId, deleteAllFlag, userId, moduleName } = params;
		if (deleteAllFlag === 0)
			Promise.allSettled(
				groups.map((group) => {
					rpcQuery(
						deleteObjectQuery({
							objectIdx: group.order,
							formId,
							parameterName: 'ReportGroups',
							deleteAllFlag,
							userId,
							moduleName,
						}),
					).catch((err) => {
						handleError(err);
					});
				}),
			).then(() => {
				getReportFormGroupListFx({ formId, userId, moduleName });
				toast.success('Группы успешно удалены');
			});
		else
			rpcQuery(
				deleteObjectQuery({
					formId,
					parameterName: 'ReportGroups',
					deleteAllFlag,
					userId,
					moduleName,
				}),
			)
				.catch((err) => {
					handleError(err);
				})
				.then(() => {
					getReportFormGroupListFx({ formId, userId, moduleName });
					toast.success('Группы успешно удалены');
				});
	},
);
