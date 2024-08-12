import { toast } from 'react-toastify';
import { createEffect } from 'effector';

import { reportAdapter } from '../../Adapters/ReportsAdapter/reportAdapter';
import { reportItemsAdapter } from '../../Adapters/ReportsAdapter/reportItemsAdapter';
import {
	createReportItemQuery,
	deleteReportItemQuery,
	editReportItemQuery,
	getReportItemsQuery,
	moveReportItemQuery,
} from '../../Const/Queries/reports';
import {
	CommonIdParams,
	CreateReportItemParams,
	EditReportItemParams,
	MoveReportItemParams,
} from '../../Shared/types';
import { handleError } from '../../Utils/handleToast';
import { RpcError, rpcQuery } from '../../Utils/requests';

import { ReportItem } from './types';

export const fetchReportItemsListFx = createEffect(
	async (params: CommonIdParams) => {
		const reportsItems = await rpcQuery<ReportItem[]>(
			getReportItemsQuery(params),
			reportItemsAdapter,
		);

		return reportsItems;
	},
);

fetchReportItemsListFx.fail.watch(({ error }) => {
	handleError(error);
});

// Создание элемента узла учета'
export const createReportItemFx = createEffect(
	async (data: CreateReportItemParams) => {
		try {
			const reportItem = await rpcQuery<number>(
				createReportItemQuery(data),
				reportAdapter,
			);
			toast.success(`Узел отчета успешно добавлен`);
			return reportItem;
		} catch (err) {
			if (err instanceof RpcError) {
				err.toastMessage();
			} else {
				toast.error('Что-то пошло не так c добавлением узла отчета');
			}

			return 0;
		}
	},
);

// Создание элемента узла учета'
export const editReportItemFx = createEffect(
	async (data: EditReportItemParams) => {
		try {
			const reportItem = await rpcQuery<number>(
				editReportItemQuery(data),
				reportAdapter,
			);
			toast.success(`Узел отчета успешно изменен`);
			return reportItem;
		} catch (err) {
			if (err instanceof RpcError) {
				err.toastMessage();
			} else {
				toast.error('Что-то пошло не так c обновлением узла отчета');
			}

			return 0;
		}
	},
);

// Изменение позиции элемента узла учета'
export const moveReportItemFx = createEffect(
	async (data: MoveReportItemParams) => {
		try {
			const reportItem = await rpcQuery<number>(
				moveReportItemQuery(data),
				reportAdapter,
			);
			toast.success(`Узел отчета успешно изменен`);
			return reportItem;
		} catch (err) {
			if (err instanceof RpcError) {
				err.toastMessage();
			} else {
				toast.error('Что-то пошло не так c обновлением узла отчета');
			}

			return 0;
		}
	},
);

export const deleteReportItemFx = createEffect(async (data: CommonIdParams) => {
	try {
		const reportItem = await rpcQuery<number>(
			deleteReportItemQuery(data),
			reportAdapter,
		);
		toast.success('Узел отчета успешно удален');
		return reportItem;
	} catch (err) {
		if (err instanceof RpcError) {
			err.toastMessage();
		} else {
			toast.error('Что-то пошло не так c удалением узла отчета');
		}

		return 0;
	}
});
