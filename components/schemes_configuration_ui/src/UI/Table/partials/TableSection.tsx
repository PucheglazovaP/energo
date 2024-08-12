import { AngleDown, Button } from '@evraz/ui-kit';
import clsx from 'clsx';

import { DEFAULT_LEVEL_MARGIN } from '../constants';
import { TableSectionProps } from '../types';

import styles from '../Table.module.css';

function TableSection({
	accessor,
	title,
	children,
	isExpanded = true,
	level = 0,
	colSpan = 1,
	renderSection,
	handleExpandCollapse = () => {},
	onContextMenu,
	className,
}: TableSectionProps) {
	const handleButtonClick = () => {
		handleExpandCollapse(accessor);
	};

	const marginLeft = DEFAULT_LEVEL_MARGIN * level;

	return (
		<>
			<tr className={className} onContextMenu={onContextMenu}>
				<td colSpan={colSpan}>
					<div
						className={styles.table_section}
						style={{
							marginLeft,
							width: `calc(100% - ${marginLeft}px)`,
						}}
					>
						<Button
							className={clsx(styles.section_button, {
								[styles.section_button__expanded]: isExpanded,
							})}
							onClick={handleButtonClick}
						>
							<AngleDown />
						</Button>
						{renderSection ? (
							renderSection
						) : (
							<div className={styles.section_body}>{title}</div>
						)}
					</div>
				</td>
			</tr>
			{isExpanded && children}
		</>
	);
}

export default TableSection;
