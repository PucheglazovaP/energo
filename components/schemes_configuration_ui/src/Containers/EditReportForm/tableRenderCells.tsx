import { ReactNode, useCallback, useEffect, useState } from 'react';
import clsx from 'clsx';
import { useStore } from 'effector-react';

import FilterIcon from '../../Icons/Filter';
import { $requestData, $sorting } from '../../Models/HardwareGroup';
import { setFilter, setRequestData } from '../../Models/HardwareGroup/event';
import MultiselectDropdown from '../../UI/MultiselectDropdown';

import GroupArrows from './TableHardwareGroupIcon/GroupArrows';
import GroupNameArrows from './TableHardwareGroupIcon/GroupNameArrows';
import ModalIconSearch from './TableHardwareGroupIcon/HardwareModalIconSearch';
import MethodArrows from './TableHardwareGroupIcon/MethodArrows';

import styles from '../../UI/TablePair/TablePair.module.css';
import editReportFormStyles from './EditReportForm.module.css';

export function RenderHardwareGroupColumnFilterNumber() {
	const sorting = useStore($sorting);
	const requestData = useStore($requestData);

	const [numberSearch, setNumberSearch] = useState('');
	const [groupOrder, setOrder] = useState(1);
	useEffect(() => {
		setFilter({ searchValue: numberSearch, searchName: '' });
	}, [numberSearch]);

	useEffect(() => {
		setOrder(requestData.orderMode);
	}, [requestData]);

	const sortingList = useCallback(
		(order: number) => {
			setFilter({ searchValue: '', searchName: '' });
			if (order === groupOrder) {
				setRequestData({
					...requestData,
					orderMode: 1,
				});
			} else {
				setRequestData({ ...requestData, orderMode: 2 });
			}
		},
		[groupOrder, requestData],
	);

	return (
		<span className={clsx(styles.span)}>
			<div className={clsx(styles.search_input)}>
				<input
					type="text"
					min="0"
					max="999999"
					placeholder="Группа"
					value={sorting.searchValue}
					onChange={(e) => setNumberSearch(e.target.value)}
				/>
				<ModalIconSearch />
			</div>
			<GroupArrows sortingList={sortingList} order={groupOrder} />
		</span>
	);
}

export function RenderHardwareGroupColumnFilterEWork(): ReactNode {
	return (
		<span className={clsx(styles.span)}>
			<div className={clsx(styles.table_selection_search_units)}>EWork</div>
		</span>
	);
}

export function RenderHardwareGroupColumnFilterName() {
	const sorting = useStore($sorting);
	const requestData = useStore($requestData);
	const [nameSearch, setNameSearch] = useState('');
	const [groupNameOrder, setOrder] = useState(4);

	useEffect(() => {
		setFilter({ searchValue: '', searchName: nameSearch });
	}, [nameSearch]);

	useEffect(() => {
		setOrder(requestData.orderMode);
	}, [requestData]);

	const sortingList = useCallback(
		(order: number) => {
			setFilter({ searchValue: '', searchName: '' });
			if (order === groupNameOrder) {
				setRequestData({
					...requestData,
					orderMode: 3,
				});
			} else {
				setRequestData({ ...requestData, orderMode: 4 });
			}
		},
		[requestData, groupNameOrder],
	);
	return (
		<span className={clsx(styles.span)}>
			<div className={clsx(styles.search_input_name)}>
				<input
					type="text"
					placeholder="Название группы"
					value={sorting.searchName}
					onChange={(e) => setNameSearch(e.target.value)}
					className={clsx(styles.table_selection_search_name)}
				/>
				<ModalIconSearch />
			</div>
			<GroupNameArrows sortingList={sortingList} order={groupNameOrder} />
		</span>
	);
}

export function RenderHardwareGroupColumnFilterMethod(): ReactNode {
	const requestData = useStore($requestData);
	const [methodOrder, setOrder] = useState(4);

	useEffect(() => {
		setOrder(requestData.orderMode);
	}, [requestData]);
	const sortingList = useCallback(
		(order: number) => {
			setFilter({ searchValue: '', searchName: '' });
			if (order === methodOrder) {
				setRequestData({
					...requestData,
					orderMode: 9,
				});
			} else {
				setRequestData({
					...requestData,
					orderMode: 10,
				});
			}
		},
		[methodOrder, requestData],
	);
	const [methodItems, setMethodItems] = useState([
		{ name: 'Сумма', key: '1', isChecked: true },
		{ name: 'Среднее', key: '2', isChecked: true },
		{ name: 'Текущее', key: '3', isChecked: true },
	]);
	const onApply = () => {
		const methods = methodItems
			.filter((item) => item.isChecked)
			.map((item) => item.key)
			.join(',');
		const methodsCount = methodItems.filter((item) => item.isChecked).length;
		const params = {
			filterStr: methodsCount === methodItems.length ? null : methods,
			filterMode: methodsCount === methodItems.length ? 1 : 5,
		};
		setRequestData({ ...requestData, ...params });
	};

	const onSelectMethod = (key: string) => {
		setMethodItems((methodItems) => {
			return methodItems.map((item) => {
				if (item.key === key) return { ...item, isChecked: !item.isChecked };
				return item;
			});
		});
	};
	return (
		<>
			<span className={clsx(editReportFormStyles.method_cell)}>
				<div className={clsx(editReportFormStyles.table_selection_method)}>
					Метод
				</div>
				<MethodArrows sortingList={sortingList} order={methodOrder} />
				<MultiselectDropdown
					title={''}
					className={editReportFormStyles.filter_header}
					rightIcon={<FilterIcon className={editReportFormStyles.icon} />}
					onApply={onApply}
					isItemsListVisible
					items={methodItems}
					onSelect={onSelectMethod}
				/>
			</span>
		</>
	);
}
