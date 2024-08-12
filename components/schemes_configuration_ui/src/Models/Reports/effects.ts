import { toast } from 'react-toastify';
import { createEffect } from 'effector';

import { reportAdapter } from '../../Adapters/ReportsAdapter/reportAdapter';
import { reportsAdapter } from '../../Adapters/ReportsAdapter/reportsAdapter';
import {
	createReportQuery,
	deleteReportQuery,
	editReportQuery,
	getReportsQuery,
} from '../../Const/Queries/reports';
import { CommonIdParams, EditReportParams } from '../../Shared/types';
import { RpcError, rpcQuery } from '../../Utils/requests';

import { Report } from './types';

// Запрос списка отчетов
export const fetchReportsListFx = createEffect(async () => {
	const reports = await rpcQuery<Report[]>(getReportsQuery(), reportsAdapter);
	return reports;
});

// Создание и редактирование отчета
export const saveReportFx = createEffect(async (data: EditReportParams) => {
	try {
		const report = await rpcQuery<number>(
			data.id ? editReportQuery(data) : createReportQuery(data),
			reportAdapter,
		);
		toast.success(`Отчет успешно ${data.id ? 'изменен' : 'добавлен'}`);
		return report;
	} catch (err) {
		if (err instanceof RpcError) {
			err.toastMessage();
		} else {
			toast.error('Что-то пошло не так c обновлением отчета');
		}

		return 0;
	}
});

export const deleteReportFx = createEffect(async (data: CommonIdParams) => {
	try {
		const report = await rpcQuery<number>(
			deleteReportQuery(data),
			reportAdapter,
		);
		toast.success('Отчет успешно удалена');
		return report;
	} catch (err) {
		if (err instanceof RpcError) {
			err.toastMessage();
		} else {
			toast.error('Что-то пошло не так c удалением отчета');
		}

		return 0;
	}
});
