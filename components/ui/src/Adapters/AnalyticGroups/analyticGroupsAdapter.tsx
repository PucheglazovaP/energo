/* global CSSModuleClasses */
import { Button } from '@evraz/ui-kit';
import clsx from 'clsx';

import { Arrow, IconButton } from '../../Components/Icons';
import { ArrowDirection } from '../../Components/Icons/types';
import { Cell, Row } from '../../Components/Table/types';
import { AnalyticRanges } from '../../Containers/AnalyticGroups/AnalyticRanges';
import { ANALYTIC_RANGES_HEADER } from '../../Containers/AnalyticGroups/const';
import Close from '../../Icons/Close';
import {
	AnalyticGroups,
	AnalyticRangeType,
	CreateLocalRangeCallback,
	DeleteRangeCallback,
	SetSearchValueCallback,
	UpdateGroupCallback,
} from '../../Store/reducers/AnalyticGroupsSlice/types';
import Input from '../../UI/Input';

/* Used to adapt analytic groups data from store to the table component*/
export function analyticGroupsAdapter(
	isRangeCreationMode: boolean,
	analyticGroups: AnalyticGroups[],
	searchValue: string,
	onCollapse: (id: string) => void,
	styles: CSSModuleClasses,
	handleUpdateLocalAnalyticRange: UpdateGroupCallback,
	handleUpdateAnalyticRange: UpdateGroupCallback,
	handleCreateLocalRange: CreateLocalRangeCallback,
	handleDeleteRange: DeleteRangeCallback,
	handleSetSearchValue: SetSearchValueCallback,
) {
	const header: Cell[] = [
		{
			name: 'collapse',
			value: '',
		},
		{
			name: 'name',
			renderFn: () => (
				<Input
					placeholder={'ФИО'}
					value={searchValue}
					onChange={handleSetSearchValue}
				/>
			),
		},
		{
			name: 'job',
			value: 'Должность',
		},
	];

	const rows: Row[] = analyticGroups.map((group) => {
		const { analyticId, isCollapsed } = group;
		return {
			id: analyticId,
			className: clsx(styles?.row, {
				[styles.row_isCollapsed]: isCollapsed,
			}),
			isCollapsed: isCollapsed,
			cells: [
				{
					name: 'collapse',
					renderFn: () => (
						<IconButton onClick={() => onCollapse(analyticId)}>
							<Arrow
								direction={
									isCollapsed ? ArrowDirection.DOWN : ArrowDirection.RIGHT
								}
							/>
						</IconButton>
					),
					className: styles?.table__cell,
				},
				{
					name: 'name',
					value: group.name,
				},
				{
					name: 'job',
					value: group.job,
				},
			],
			child: {
				header: ANALYTIC_RANGES_HEADER,
				className: styles?.inner__table,
				nodeBeforeHeader: (
					<AnalyticRanges
						onCreateRange={handleCreateLocalRange(analyticId)}
						isButtonDisabled={isRangeCreationMode}
					/>
				),
				rows: group.ranges.map((range) => {
					const { rangeId, rangeEnd, rangeStart, lastModified } = range;
					const resultUpdateProps = {
						analyticId,
						rangeId,
						lastModified,
						rangeEnd,
						rangeStart,
						range: AnalyticRangeType.Start,
					};
					return {
						id: rangeId,
						cells: [
							{
								name: 'start',
								renderFn: () => (
									<Input
										type="number"
										value={rangeStart || ''}
										onChange={handleUpdateLocalAnalyticRange({
											...resultUpdateProps,
											rangeType: AnalyticRangeType.Start,
										})}
										onBlur={handleUpdateAnalyticRange({
											...resultUpdateProps,
											rangeType: AnalyticRangeType.Start,
										})}
										onKeyDown={(event: any) => {
											if (event.key === 'Enter') {
												return handleUpdateAnalyticRange({
													...resultUpdateProps,
													rangeType: AnalyticRangeType.Start,
												})(event);
											}
										}}
									/>
								),
							},
							{
								name: 'end',
								renderFn: () => (
									<Input
										type="number"
										value={rangeEnd || ''}
										onChange={handleUpdateLocalAnalyticRange({
											...resultUpdateProps,
											rangeType: AnalyticRangeType.End,
										})}
										onBlur={handleUpdateAnalyticRange({
											...resultUpdateProps,
											rangeType: AnalyticRangeType.End,
										})}
										onKeyDown={(event: any) => {
											if (event.key === 'Enter') {
												return handleUpdateAnalyticRange({
													...resultUpdateProps,
													rangeType: AnalyticRangeType.End,
												})(event);
											}
										}}
									/>
								),
							},
							{
								name: 'delete',
								renderFn: () => (
									<Button
										className={styles?.button_delete}
										onClick={handleDeleteRange({
											analyticId,
											rangeId,
											lastModified,
										})}
									>
										<Close className={styles?.icon_delete} />
									</Button>
								),
							},
						],
					};
				}),
			},
		};
	});
	return {
		header,
		rows,
	};
}
