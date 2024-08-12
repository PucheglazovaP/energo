import { FC, useRef } from 'react';
import React from 'react';
import { DropResult } from 'react-beautiful-dnd';
import clsx from 'clsx';

import Spinner from '../Spinner';

// Components
import TableBody from './partials/TableBody';
import TableBodySections from './partials/TableBodySections';
import TableDndWrapper from './partials/TableDndWrapper';
import TableHeader from './partials/TableHeader';
// Types
import { ITableBody, ITableColumn, TableSection } from './types';

// Styles
import styles from './Table.module.css';

interface IProps {
	className?: string;
	headers: ITableColumn[];
	data: ITableBody[];
	sections?: TableSection[];
	isLoading?: boolean;
	handleSorting?: (accessor: string) => void;
	handleExpandCollapse?: (accessor: string) => void;
	renderSupHeaderFn?: () => JSX.Element;
	renderColGroupComponent?: () => JSX.Element;
	onDragEnd?: (result: DropResult) => void;
	isDraggable?: boolean;
	droppableId?: string;
	activeIndex?: number | null;
}

const Table: FC<IProps> = ({
	className,
	headers,
	data,
	sections,
	isLoading,
	handleSorting,
	handleExpandCollapse,
	renderSupHeaderFn,
	renderColGroupComponent,
	onDragEnd = () => {},
	isDraggable = false,
	droppableId,
	activeIndex,
}) => {
	const tableElement = useRef(null);
	const headerRefs = useRef<(React.RefObject<HTMLTableCellElement> | null)[]>(
		[],
	);

	const columnsWithRefs = headers.map((item, index) => {
		const ref =
			headerRefs.current[index] ??
			(headerRefs.current[index] = React.createRef());

		return {
			...item,
			ref,
		};
	});

	return (
		<section className={clsx(styles.table_section, className, styles['root'])}>
			<table ref={tableElement} className={styles['table']}>
				{renderColGroupComponent ? renderColGroupComponent() : null}
				<TableHeader
					headers={columnsWithRefs}
					handleSorting={handleSorting}
					headerSupComponent={renderSupHeaderFn}
				/>
				<TableDndWrapper
					onDragEnd={onDragEnd}
					droppableId={droppableId}
					isDraggable={isDraggable}
				>
					{data.length > 0 || sections ? (
						sections ? (
							<TableBodySections
								headers={headers}
								data={data}
								sections={sections}
								handleExpandCollapse={handleExpandCollapse}
							/>
						) : (
							<TableBody
								headers={headers}
								data={data}
								isDraggable={isDraggable}
								activeIndex={activeIndex}
							/>
						)
					) : isLoading ? (
						<tr>
							<td>
								<Spinner />
							</td>
						</tr>
					) : (
						<tr className={styles['no-data']}>
							<td colSpan={headers.length}>Нет данных</td>
						</tr>
					)}
				</TableDndWrapper>
			</table>
		</section>
	);
};

export default Table;
