import React from 'react';
import { Button } from '@evraz/ui-kit';
import clsx from 'clsx';

import { Comment, Plus, Search } from '../../Icons';
import ContextMenu from '../../UI/ContextMenu';
import Divider from '../../UI/Divider';
import Input from '../../UI/Input';

import { useReportsSection } from './useReportsSection';

import styles from './ReportsSection.module.css';

function ReportsSection() {
	const {
		searchFilter,
		handleSearch,
		filteredReports,
		handleActiveReportId,
		selectedReportId,
		position,
		setPosition,
		onOpen,
		items,
		handleCreateReport,
	} = useReportsSection();
	return (
		<div className={styles.container}>
			<div className={styles.header}>
				<h3>Отчетные формы</h3>
				<div className={styles.controls}>
					<Divider />
					<Button className={styles.header_button} onClick={handleCreateReport}>
						<Plus className={styles.plus} />
						<span>Добавить</span>
					</Button>
				</div>
			</div>
			<div className={styles.list_header}>
				<Input
					type="search"
					isSearch
					placeholder="Отчетная форма"
					value={searchFilter}
					onChange={handleSearch}
					className={styles.search}
					glyph={<Search className={styles.search_icon} />}
				/>
				<div className={styles.header_comment}>
					<Comment className={styles.comment_icon} />
				</div>
			</div>
			<ul className={styles.list}>
				{filteredReports.map((report) => (
					<li key={report.id}>
						<Button
							className={clsx(
								styles.item,
								report.id === selectedReportId
									? styles.item__active
									: undefined,
							)}
							onClick={() => handleActiveReportId(report.id)}
							onContextMenu={(e) => onOpen(e, report.id)}
						>
							<span title={report.name} className={styles.name}>
								{report.name}
							</span>
							<span title={report.comment} className={styles.comment}>
								<Comment
									className={clsx(
										styles.comment_icon,
										report.comment && styles.comment_icon__active,
									)}
								/>
							</span>
						</Button>
					</li>
				))}
			</ul>
			<ContextMenu
				items={items}
				position={position}
				setPosition={setPosition}
			/>
		</div>
	);
}

export default ReportsSection;
