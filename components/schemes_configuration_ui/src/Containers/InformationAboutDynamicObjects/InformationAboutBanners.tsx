import React, {
	ChangeEvent,
	useCallback,
	useEffect,
	useMemo,
	useState,
} from 'react';
import { toast } from 'react-toastify';
import { Button } from '@evraz/ui-kit';
import clsx from 'clsx';
import { useEvent, useStore } from 'effector-react';

import dynamicObjectsAdapter, {
	tableDataExcelAdapter,
} from '../../Adapters/dynamicObjects/dynamicObjectsAdapter';
import CopyIcon from '../../Icons/Copy';
import MoreIcon from '../../Icons/More';
import SaveIcon from '../../Icons/Save';
import { $informationDynamic } from '../../Models/DynamicObjects';
import { $editMode } from '../../Models/EditMode';
import { setShowSelectedDynamicObject } from '../../Models/EditMode/events';
import { switchModalsDynamicObject } from '../../Models/Modal/events';
import ContextMenu from '../../UI/ContextMenu';
import {
	ContextMenuItem,
	ContextMenuPosition,
} from '../../UI/ContextMenu/types';
import exportInfoTableToExcel, {
	createTextContentForClipboard,
} from '../../Utils/exportToExcel';

import { COLUMNS } from './const';
import InformationRendering from './InformationRendering';
import ModalClose from './ModalClose';
import ModalIcon from './ModalIcon';
import SortingArrows from './SortingArrows';
import { DynamicObjectsInfo, InformationAboutBannersProps } from './types';
import { useInformation } from './utilts';

import styles from './InformationAboutBanners.module.css';

function InformationAboutDynamicObjects({
	className,
	style,
	title,
	codeForm,
	codeVersion,
}: InformationAboutBannersProps) {
	const { formDynamicObjects } = useStore($editMode);
	const setShowSelectedDynamicObjectFx = useEvent(setShowSelectedDynamicObject);
	const switchModalsDynamicObjectFn = useEvent(switchModalsDynamicObject);
	const [filteredData, setFilteredData] = useState<DynamicObjectsInfo[]>([]);
	const [dataFromAdapter, setDataFromAdapter] = useState([]);
	const [keySearch, setKeySearch] = useState('');
	const [numberGD, setNumberGD] = useState('');
	const [numberCode, setNumberCode] = useState('');
	const [sort, setSort] = useState<Boolean | null>(null);
	const [position, setPosition] = useState<ContextMenuPosition | null>(null);
	const info = useStore($informationDynamic);

	useInformation(codeForm, codeVersion);

	// input key
	const searchKey = (e: ChangeEvent<HTMLInputElement>) => {
		setKeySearch(e.target.value);
		setNumberGD('');
		setNumberCode('');
	};
	useEffect(() => {
		setFilteredData(readyData);
	}, [keySearch]);

	const readyData = dataFromAdapter.filter((item: any) => {
		return item.nameObject.toLowerCase().includes(keySearch.toLowerCase());
	});

	// input group number
	const searchNumberGD = (e: ChangeEvent<HTMLInputElement>) => {
		setNumberGD(e.target.value);
		setKeySearch('');
		setNumberCode('');
	};

	const readyDataNumberGD = dataFromAdapter.filter((item: any) => {
		return item.numberGroupData == numberGD;
	});
	useEffect(() => {
		setFilteredData(readyDataNumberGD);
	}, [numberGD]);

	// input name group number
	const searchNumberCode = (e: ChangeEvent<HTMLInputElement>) => {
		setNumberCode(e.target.value);
		setKeySearch('');
		setNumberGD('');
	};

	const handleContextMenu = (evt: React.MouseEvent<HTMLButtonElement>) => {
		evt.stopPropagation();
		if (!position) setPosition({ x: 0, y: 20 });
	};
	const handleExportToExcel = useCallback(() => {
		const preparedData = tableDataExcelAdapter(filteredData);
		exportInfoTableToExcel(
			COLUMNS,
			preparedData,
			`Информация о динамических объектах ${title}`,
		);
		setPosition(null);
	}, [title, filteredData]);

	const handleCopyTableData = useCallback(() => {
		const preparedData = tableDataExcelAdapter(filteredData);
		const textContent = createTextContentForClipboard(
			COLUMNS,
			preparedData,
			`Информация о динамических объектах  ${title}`,
		);
		navigator.clipboard
			.writeText(textContent)
			.then(() => {
				toast.success('Данные скопированы в буфер обмена!');
			})
			.catch((error) => {
				toast.error('Ошибка копирования данных:', error);
			});
		setPosition(null);
	}, [title, filteredData]);

	const contextMenuItems: ContextMenuItem[] = useMemo(
		() => [
			{
				name: 'Скопировать таблицу',
				onClick: handleCopyTableData,
				renderFn: () => (
					<span className={styles.menu_item}>
						<CopyIcon className={styles.menu_icon} />
						<span className={styles.menu_name}>Скопировать таблицу</span>
					</span>
				),
			},
			{
				name: 'Сохранить в Excel',
				onClick: handleExportToExcel,
				renderFn: () => (
					<span className={styles.menu_item}>
						<SaveIcon className={styles.menu_icon} />
						<span className={styles.menu_name}>Выгрузить в Excel</span>
					</span>
				),
			},
		],
		[handleExportToExcel, handleCopyTableData],
	);

	const readyDataNumberCode = dataFromAdapter.filter((item: any) => {
		if (item.groupData == null) {
			return dataFromAdapter;
		} else {
			return item.groupData.toLowerCase().includes(numberCode.toLowerCase());
		}
	});

	useEffect(() => {
		setFilteredData(readyDataNumberCode);
	}, [numberCode]);

	// sorting
	const sorting = () => {
		sort ? setSort(false) : setSort(true);
	};

	useEffect(() => {
		if (sort == true) {
			const dataSort = dataFromAdapter.sort((a: any, b: any) =>
				a.eWork > b.eWork ? 1 : -1,
			);
			setFilteredData(dataSort);
		} else {
			const dataSort = dataFromAdapter.sort((a: any, b: any) =>
				a.eWork > b.eWork ? -1 : 1,
			);
			setFilteredData(dataSort);
		}
	}, [sort]);

	let data: Array<[]> = [];
	if (Array.isArray(info)) {
		data = info;
	} else {
		data;
	}
	const adaptedData = dynamicObjectsAdapter(data);

	useEffect(() => {
		setDataFromAdapter(adaptedData);
		setFilteredData(adaptedData);
	}, [data]);

	function transmitsTransparencyCode(e: number) {
		const selectedDynamicObject = formDynamicObjects.find(
			(element) => element.id === e,
		);
		if (selectedDynamicObject != null) {
			setShowSelectedDynamicObjectFx([selectedDynamicObject]);
		}
		switchModalsDynamicObjectFn();
	}
	useEffect(() => {
		if (keySearch == '' && numberGD == '' && numberCode == '') {
			setFilteredData(adaptedData);
		}
	}, [keySearch, numberGD, numberCode]);

	function closeBannerInformation(): void {
		switchModalsDynamicObjectFn();
	}
	return (
		<div className={clsx(styles.root, className)} style={style}>
			<div className={styles.modal_window}>
				<div className={clsx(styles.data_location)}>
					<div>
						<p className={clsx(styles.data_location_h1)}>
							Информация о динамических объектах
						</p>
						<p className={clsx(styles.data_location_p)}>Форма {title}</p>
					</div>
					<ModalClose closeModal={closeBannerInformation} />
				</div>
				<div className={styles.settings}>
					<Button className={styles.menu_btn} onClick={handleContextMenu}>
						<MoreIcon />
					</Button>
					{position && (
						<ContextMenu
							items={contextMenuItems}
							position={position}
							setPosition={setPosition}
							className={styles.menu}
						/>
					)}
				</div>
				<div className={clsx(styles.search)}>
					<div className={clsx(styles.key_div)}>
						<ModalIcon />
						<input
							type="search"
							placeholder="Объект"
							value={keySearch}
							className={clsx(styles.key)}
							onChange={searchKey}
						/>
					</div>

					<div className={clsx(styles.data_number_div)}>
						<ModalIcon />
						<input
							type="search"
							placeholder="Номер "
							value={numberGD}
							className={clsx(styles.data_number)}
							onChange={searchNumberGD}
						/>
					</div>

					<div className={clsx(styles.eWork_div)}>
						<p className={clsx(styles.eWork)}>№ eWork</p>
						<SortingArrows sortingList={sorting} arrow={sort} />
					</div>

					<div className={clsx(styles.data_number_two_div)}>
						<ModalIcon />
						<input
							type="search"
							value={numberCode}
							placeholder="Название групп данных"
							className={clsx(styles.data_number_two)}
							onChange={searchNumberCode}
						/>
					</div>
				</div>
				<div className={clsx(styles.rendering_list)}></div>
				<InformationRendering
					data={filteredData}
					clickCodeT={transmitsTransparencyCode}
				/>
			</div>
		</div>
	);
}

export default InformationAboutDynamicObjects;
