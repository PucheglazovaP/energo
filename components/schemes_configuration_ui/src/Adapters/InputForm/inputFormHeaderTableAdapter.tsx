import React from 'react';
import { Tooltip, TooltipDirection } from '@evraz/ui-kit';
import clsx from 'clsx';

import {
	HeaderGroup,
	InputFormHeader,
} from '../../Models/InputFormHeader/types';
import { ITableColumn } from '../../UI/Table/types';

import styles from '../../Containers/InputFormTable/InputFormTable.module.css';

function inputFormHeaderTableAdapter({
	header,
}: {
	header: InputFormHeader[];
}) {
	const headerGroup: HeaderGroup[] = [];
	header.forEach((item) => {
		const currentGroupIndex = headerGroup.findIndex(
			(group) => group.order === item.parentOrder,
		);
		if (headerGroup[currentGroupIndex]) {
			headerGroup[currentGroupIndex].colSpan += 1;
		} else
			headerGroup.push({
				order: item.parentOrder,
				title: item.parentTitle,
				colSpan: 1,
				isVisible: item.isParentVisible,
				isFixed: Boolean(item.fixed),
			});
	});

	// Рендер шапок для хедера
	function renderSupComponent() {
		let offset = 0;
		return (
			<tr className={styles.groups}>
				{headerGroup.map((group) => {
					const groupStyles: React.CSSProperties = group.isFixed
						? {
								position: 'sticky',
								left: `${offset}px`,
								zIndex: 110,
						  }
						: {};
					offset = group.isFixed ? offset + Number(group.width) : offset;
					return (
						<th
							className={clsx(
								styles.group,
								!group.isVisible && styles.group__hidden,
							)}
							key={group.order}
							colSpan={group.colSpan}
							style={groupStyles}
						>
							{group.isVisible && group.title}
						</th>
					);
				})}
			</tr>
		);
	}

	const headerWidth = header.map((headerItem) => {
		const currentGroup = headerGroup.find(
			(group) => group.order === headerItem.parentOrder,
		);

		return !headerItem.minWidth && headerItem.parentMaxWidth
			? headerItem.parentMaxWidth / (currentGroup?.colSpan || 1)
			: 110;
	});

	// Компонент для рендера <colgroup>, тк без него при двойном хедере не выстраивается ширина

	function renderColGroupComponent() {
		return (
			<colgroup>
				{header.map((headerItem, index) => {
					return (
						<col
							key={`${headerItem.title}-${headerItem.name}`}
							width={headerWidth[index] || headerItem.maxWidth || undefined}
						/>
					);
				})}
			</colgroup>
		);
	}

	const inputFormHeader: ITableColumn[] = header.map((headerItem, index) => {
		return {
			accessor: headerItem.name,
			text: headerItem.title,
			isResizable: false,
			isSortable: false,
			sortOrder: 0,
			width: headerWidth[index] || headerItem.maxWidth || undefined,
			renderHeaderCell: () =>
				headerItem.comment ? (
					<Tooltip
						direction={TooltipDirection.Down}
						tooltip={<span>{headerItem.comment}</span>}
					>
						<span className={styles.header_table_text}>{headerItem.title}</span>
					</Tooltip>
				) : (
					<span className={styles.header_table_text}>{headerItem.title}</span>
				),
			// class для фиксирования таблицы
			className: headerItem.fixed ? 'fixed' : '',
		};
	});

	return { renderSupComponent, renderColGroupComponent, inputFormHeader };
}

export default inputFormHeaderTableAdapter;
