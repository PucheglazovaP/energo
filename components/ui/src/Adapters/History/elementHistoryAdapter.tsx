/* global CSSModuleClasses */
import clsx from 'clsx';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';

import { Arrow } from '../../Components/Icons';
import { IconButton } from '../../Components/Icons';
import { ArrowDirection } from '../../Components/Icons/types';
import { Cell, Row } from '../../Components/Table/types';
import {
	ELEMENT_HISTORY_HEADER,
	HISTORY_OBJECT_HEADER,
} from '../../Containers/History/const';
import HistoryStatus from '../../Containers/History/HistoryStatus';
import { History } from '../../Store/reducers/HistorySlice/types';

/* Used to adapt general history data from store to the table component*/
export function elementHistoryAdapter(
	history: History[],
	onCollapse: (id: string | number) => void,
	styles: CSSModuleClasses,
) {
	const header: Cell[] = ELEMENT_HISTORY_HEADER;
	const rows: Row[] = history.map((elem) => {
		return {
			id: elem.lastModifiedId,
			className: clsx(styles?.row, {
				[styles.row_isCollapsed]: elem.isCollapsed,
			}),
			isCollapsed: elem.isCollapsed,
			cells: [
				{
					name: 'collapse',
					renderFn: () => (
						<IconButton onClick={() => onCollapse(elem.lastModifiedId)}>
							<Arrow
								direction={
									elem.isCollapsed ? ArrowDirection.DOWN : ArrowDirection.RIGHT
								}
							/>
						</IconButton>
					),
					className: styles?.table__cell,
				},
				{
					name: 'status',
					renderFn: () => <HistoryStatus status={elem.status} />,
				},
				{
					name: 'fullDate',
					value: format(new Date(elem.validFrom), 'dd.MM.yyyy HH:mm', {
						locale: ru,
					}),
				},
				{
					name: 'user',
					value: elem.user,
				},
				{
					name: 'number',
					value: elem.id,
				},
				{
					name: 'subsystem',
					value: elem.moduleName,
				},
			],
			child: {
				header: HISTORY_OBJECT_HEADER,
				className: styles?.inner__table,
				rows: elem.changesList.map((changedObj, idx) => ({
					id: idx,
					cells: [
						{
							name: 'parameter',
							value: changedObj.name,
						},
						{
							name: 'previous',
							value: changedObj.prev ?? '',
						},
						{
							name: 'current',
							value: changedObj.next ?? '',
						},
					],
				})),
			},
		};
	});
	return {
		header,
		rows,
	};
}
