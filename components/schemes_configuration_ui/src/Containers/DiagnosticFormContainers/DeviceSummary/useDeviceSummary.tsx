import { useStore } from 'effector-react';

import { $diagnosticChart } from '../../../Models/DiagnosticChart';
import { DiagnosticShape } from '../../../Models/DiagnosticChart/types';
import $diagnosticCurrentModel from '../../../Models/DiagnosticCurrent';
import { ICardItem } from '../../../UI/Card/types';
import { calculatePercentage } from '../DeviceConnection/utils';

import styles from './DeviceSummary.module.css';

type DiagnosticQuery = Omit<DiagnosticShape, 'date'>;
type QueryResults = {
	total: number;
} & DiagnosticQuery;

function useDeviceSummary(id: number) {
	const { shapes } = useStore($diagnosticChart);
	const { selectedDeviceId } = useStore($diagnosticCurrentModel);

	const chosenShape: DiagnosticShape[] = shapes.get(id) || [];
	const chosenId: string = id ? String(id) : selectedDeviceId;

	const totalQueries: QueryResults = chosenShape.reduce(
		(acc, curr) => {
			acc.crc += curr.crc;
			acc.good += curr.good;
			acc.timeout += curr.timeout;
			acc.timeoutICPCON += curr.timeoutICPCON;
			acc.lost += curr.lost;
			acc.total += curr.good + curr.crc + curr.timeout;
			return acc;
		},
		{
			crc: 0,
			good: 0,
			lost: 0,
			timeout: 0,
			timeoutICPCON: 0,
			total: 0,
		} as QueryResults,
	);

	const list: ICardItem[] = [
		{
			name: 'Номер прибора',
			value: chosenId,
			className: styles.card_item,
		},
		{
			name: 'Общее число запросов',
			value: totalQueries.total,
			className: styles.card_item,
		},
		{
			name: 'Получено ответов:',
			value: '',
			className: styles.card_item,
		},
		{
			name: 'Правильных',
			value: (
				<span>
					{totalQueries.good}&nbsp;
					<span className={styles.percentage}>
						({calculatePercentage(totalQueries.good, totalQueries.total)}%)
					</span>
				</span>
			),
			className: styles.card_item,
		},
		{
			name: 'Ошибок CRC в ответе',
			value: (
				<span>
					{totalQueries.crc}&nbsp;
					<span className={styles.percentage}>
						({calculatePercentage(totalQueries.crc, totalQueries.total)}%)
					</span>
				</span>
			),
			className: styles.card_item,
		},
		{
			name: 'Таймаутов (не ответил)',
			value: (
				<span>
					{totalQueries.timeout}&nbsp;
					<span className={styles.percentage}>
						({calculatePercentage(totalQueries.timeout, totalQueries.total)}%)
					</span>
				</span>
			),
			className: styles.card_item,
		},
	];

	return {
		list,
	};
}

export default useDeviceSummary;
