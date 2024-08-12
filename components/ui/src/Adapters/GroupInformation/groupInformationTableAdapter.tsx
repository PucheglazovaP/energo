/* global CSSModuleClasses */
import clsx from 'clsx';

import { Arrow, CheckMark, IconButton } from '../../Components/Icons';
import { ArrowDirection } from '../../Components/Icons/types';
import { Cell, Row } from '../../Components/Table/types';
import {
	FORMS_HEADER,
	GROUPS_HEADER,
} from '../../Containers/GroupInformation/const';
import { Form } from '../../Store/reducers/GroupInformationSlice/types';

export function groupInformationTableAdapter(
	forms: Form[],
	onCollapse: (id: string) => void,
	onSelect: (id: string) => void,
	styles: CSSModuleClasses,
) {
	const header: Cell[] = FORMS_HEADER;
	const rows: Row[] = forms.map((form) => {
		return {
			id: form.id,
			isCollapsed: form.isCollapsed,
			className: clsx(styles.row, {
				[styles.row_isCollapsed]: form.isCollapsed,
			}),
			cells: [
				{
					name: 'collapse',
					className: styles.cell__collapse,
					renderFn: () =>
						form.groups.length ? (
							<IconButton onClick={() => onCollapse(form.id)}>
								<Arrow
									direction={
										form.isCollapsed
											? ArrowDirection.DOWN
											: ArrowDirection.RIGHT
									}
								/>
							</IconButton>
						) : (
							<span />
						),
				},
				{
					name: 'name',
					value: form.name,
				},
				{
					name: 'type',
					value: form.type,
				},
				{
					name: 'selection',
					renderFn: () => (
						<button
							className={clsx(styles.checkMark, {
								[styles.checkMark__selected]: form.isSelected,
							})}
							onClick={() => onSelect(form.id)}
						>
							<CheckMark />
						</button>
					),
				},
			],
			child: {
				header: GROUPS_HEADER,
				className: styles.inner__table,
				rows: form.groups.map((group) => ({
					id: group.id,
					cells: [
						{
							name: 'name',
							value: group.name ?? '',
						},
						{
							name: 'type',
							value: group.type,
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
