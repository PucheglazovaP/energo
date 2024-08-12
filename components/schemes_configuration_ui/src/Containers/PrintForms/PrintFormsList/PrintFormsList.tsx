import { ChangeEvent, MouseEvent, useEffect, useMemo, useState } from 'react';
import { Button } from '@evraz/ui-kit';
import clsx from 'clsx';
import { useStore } from 'effector-react';

import useDebounce from '../../../Facades/useDebouce';
import { Bin, Comment, Edit, Plus, Search } from '../../../Icons';
import { openModal } from '../../../Models/Modal/events';
import { $printForms, $selectedPrintFormId } from '../../../Models/PrintForms';
import { fetchPrintFormsFx } from '../../../Models/PrintForms/effects';
import {
	setContextMenuPrintFormId,
	setSelectedPrintFormId,
} from '../../../Models/PrintForms/events';
import { PrintForm } from '../../../Models/PrintForms/types';
import { $selectedReportId } from '../../../Models/ReferenseByReports';
import { RegisteredModals } from '../../../Shared/modalsConfig';
import ContextMenu from '../../../UI/ContextMenu';
import {
	ContextMenuItem,
	ContextMenuPosition,
} from '../../../UI/ContextMenu/types';
import Divider from '../../../UI/Divider';
import Input from '../../../UI/Input';
import { List } from '../../../UI/List';
import { TListItem } from '../../../UI/List/types';

import PrintFormsListItem from './partials/PrintFormsListItem';
import { PrintFormsListProps } from './types';

import styles from './PrintFormsList.module.css';

function PrintFormsList({ title, isViewMode = false }: PrintFormsListProps) {
	const selectedReportId = useStore($selectedReportId);
	const printForms = useStore($printForms);
	const selectedPrintFormId = useStore($selectedPrintFormId);

	const [position, setPosition] = useState<ContextMenuPosition | null>(null);
	const [search, setSearch] = useState<string>('');
	const [isOnlyCommented, setIsOnlyCommented] = useState<boolean>(false);

	const handleEditClick = () => {
		openModal(RegisteredModals.UpdateReportForm);
	};

	const handleDeleteClick = () => {
		openModal(RegisteredModals.DeletePrintForm);
	};

	const handleAdd = () => {
		openModal(RegisteredModals.CreateReportForm);
	};

	const handleContextMenu = (evt: MouseEvent<HTMLButtonElement>) => {
		evt.preventDefault();
		setContextMenuPrintFormId(Number(evt.currentTarget.id));
		setPosition({ x: evt.pageX, y: evt.pageY });
	};

	const handleSearch = (evt: ChangeEvent<HTMLInputElement>) => {
		setSearch(evt.target.value);
	};

	const toggleOnlyCommented = () => {
		setIsOnlyCommented(!isOnlyCommented);
	};

	const debouncedHandleSearch = useDebounce(handleSearch, 300);

	const filteredPrintForms: PrintForm[] = useMemo(
		() =>
			printForms.filter(
				(form) =>
					form.name.includes(search) && (isOnlyCommented ? form.comment : true),
			),
		[printForms, search, isOnlyCommented],
	);

	const contextMenuItems: ContextMenuItem[] = [
		{
			name: 'Редактировать',
			onClick: handleEditClick,
			renderFn: () => (
				<div className={'context_menu_item'}>
					<Edit className={'context_menu_icon'} />
					<span>Редактировать</span>
				</div>
			),
		},
		{
			name: 'Удалить',
			onClick: handleDeleteClick,
			renderFn: () => (
				<div className={'context_menu_item'}>
					<Bin className={'context_menu_icon'} />
					<span>Удалить</span>
				</div>
			),
		},
	];

	const adaptedPrintForms: TListItem[] = filteredPrintForms.map((form) => ({
		id: String(form.id),
		onClick: () => setSelectedPrintFormId(form.id),
		renderFn: () => (
			<PrintFormsListItem title={form.name} comment={form.comment} />
		),
		onContextMenu: !isViewMode ? handleContextMenu : () => {},
		className: styles.list__button,
	}));

	useEffect(() => {
		if (selectedReportId) {
			fetchPrintFormsFx(selectedReportId);
		}
	}, [selectedReportId]);

	return (
		<div className={styles.container}>
			<div className={styles.header}>
				<h3>{title}</h3>
				{!isViewMode && (
					<div className={styles.header__controls}>
						<Divider />
						<Button
							className={styles.header__button}
							onClick={handleAdd}
							disabled={!selectedReportId}
						>
							<Plus className={styles.plus} />
							<span>Добавить</span>
						</Button>
					</div>
				)}
			</div>
			<div className={styles.list_header}>
				<Input
					type="search"
					isSearch
					disabled={!selectedReportId}
					placeholder="Отчетная форма"
					onChange={debouncedHandleSearch}
					className={styles.search}
					glyph={<Search className={styles.search_icon} />}
				/>
				<button
					className={clsx('button__empty', styles.header_comment)}
					onClick={toggleOnlyCommented}
				>
					<Comment
						className={clsx(
							styles.comment_icon,
							isOnlyCommented && styles.comment_icon__active,
						)}
					/>
				</button>
			</div>
			<div className={styles.body}>
				<List
					items={adaptedPrintForms}
					selectedItemId={String(selectedPrintFormId)}
					className={styles.forms_list}
				/>
			</div>
			<ContextMenu
				items={contextMenuItems}
				position={position}
				setPosition={setPosition}
			/>
		</div>
	);
}

export default PrintFormsList;
