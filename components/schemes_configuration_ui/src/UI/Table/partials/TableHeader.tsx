/* eslint-disable jsx-a11y/no-static-element-interactions */
import React, { FC, memo, useEffect, useRef } from 'react';
import { Button } from '@evraz/ui-kit';
import clsx from 'clsx';

// Icons
import sortDownIcon from '../assets/sort_down.svg';
import sortUpIcon from '../assets/sort_up.svg';
import { ITableHeader } from '../types';

import ColumnResizer from './ColumnResizer';

// Styles
import styles from '../Table.module.css';

const getClassSort = (sort?: number): string => {
	if (sort === -1) return styles['sort--down'];
	if (sort === 1) return styles['sort--up'];
	return '';
};

const TableHeader: FC<ITableHeader> = ({
	headers,
	handleSorting = () => {},
	headerSupComponent,
}) => {
	const containerRef = useRef<HTMLTableRowElement>(null);
	// class для фиксирования таблицы
	useEffect(() => {
		const length = containerRef?.current?.children.length || 0;
		let offsetLeft = 0;
		for (let i = 0; i < length; i++) {
			const item = containerRef?.current?.children[i] as HTMLElement;
			if (item?.className.includes('fixed')) {
				item.style.position = 'sticky';
				item.style.left = `${offsetLeft}px`;
				item.style.zIndex = '25';
				offsetLeft += item.clientWidth;
			}
		}
	}, [headers]);
	return (
		<>
			<thead className={styles['header']}>
				{headerSupComponent ? headerSupComponent() : null}
				<tr ref={containerRef}>
					{headers.map((column, index) => {
						if (column.isVisible == null || column.isVisible)
							return (
								<th
									ref={column.ref}
									key={`${column.text}-${index}`}
									className={clsx(styles['header__cell'], column.className)}
									style={{
										minWidth: `${column.minWidth}px`,
										width: `${column.width}px`,
										maxWidth: `${column.maxWidth}px`,
									}}
								>
									{column.isSortable ? (
										<Button
											className={styles['header__title']}
											onClick={() => handleSorting(column.accessor)}
											type="button"
										>
											<span>{column.text}</span>
											<div
												className={clsx(
													styles['sort'],
													getClassSort(column.sortOrder),
												)}
											>
												<img src={sortUpIcon} alt="up" />
												<img src={sortDownIcon} alt="down" />
											</div>
										</Button>
									) : column.renderHeaderCell ? (
										column.renderHeaderCell()
									) : (
										<span>{column.text}</span>
									)}
									<ColumnResizer
										disabled={!column.isResizable}
										minWidth={column.minWidth}
									/>
								</th>
							);
					})}
				</tr>
			</thead>
		</>
	);
};

export default memo(TableHeader);
