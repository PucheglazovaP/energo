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

import InformationAboutBannersAdapter, {
	tableDataExcelAdapter,
} from '../../Adapters/InformationAboutBanners/InformationAboutBannersAdapter';
import CopyIcon from '../../Icons/Copy';
import MoreIcon from '../../Icons/More';
import SaveIcon from '../../Icons/Save';
import { $editMode } from '../../Models/EditMode';
import { setShowSelectedTransparentObject } from '../../Models/EditMode/events';
import { $information } from '../../Models/InformationAboutBanners';
import { switchModalsBanners } from '../../Models/Modal/events';
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
import { ModalClose, ModalIcon } from './ModalIcontBooleean';
import SortingArrows from './SortingArrows';
import { InformationAboutBannersProps, InformationBanners } from './types';
import { useInformation } from './utilts';

import styles from './InformationAboutBanners.module.css';

function InformationAboutBanners({
	className,
	style,
	codeForm,
	codeVersion,
	title,
}: InformationAboutBannersProps) {
	const info = useStore($information);
	const { formTransparentObjects } = useStore($editMode);
	const setShowSelectedTransparentObjectFx = useEvent(
		setShowSelectedTransparentObject,
	);
	const [sort, setSort] = useState<Boolean | null>(null);
	const switchModalsBannersFn = useEvent(switchModalsBanners);
	const [filteredData, setFilteredData] = useState<InformationBanners[]>([]);
	const [dataFromAdapter, setDataFromAdapter] = useState([]);

	const [keySearch, setKeySearch] = useState('');
	const [position, setPosition] = useState<ContextMenuPosition | null>(null);
	const [numberGD, setNumberGD] = useState('');
	const [numberCode, setNumberCode] = useState('');

	useEffect(() => {
		setFilteredData(readyData);
	}, [keySearch]);

	useEffect(() => {
		setFilteredData(readyDataNumberGD);
	}, [numberGD]);

	const readyData = dataFromAdapter.filter((item: any) => {
		return item.keyTransparency.toLowerCase().includes(keySearch.toLowerCase());
	});

	useEffect(() => {
		setFilteredData(readyDataNumberCode);
	}, [numberCode]);

	useInformation(codeForm, codeVersion);

	const searchKey = (e: ChangeEvent<HTMLInputElement>) => {
		setKeySearch(e.target.value);
		setNumberGD('');
		setNumberCode('');
	};
	const searchNumberGD = (e: ChangeEvent<HTMLInputElement>) => {
		setNumberGD(e.target.value);
		setKeySearch('');
		setNumberCode('');
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

	const readyDataNumberGD = dataFromAdapter.filter((item: any) => {
		return item.numberGD == numberGD;
	});

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
			`Информация о транспарантах ${title}`,
		);
		setPosition(null);
	}, [title, filteredData]);

	const handleCopyTableData = useCallback(() => {
		const preparedData = tableDataExcelAdapter(filteredData);
		const textContent = createTextContentForClipboard(
			COLUMNS,
			preparedData,
			`Информация о транспарантах ${title}`,
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

	const readyDataNumberCode = dataFromAdapter.filter((item: any) => {
		if (item.dataGroup == null) {
			return dataFromAdapter;
		} else {
			return item.dataGroup.toLowerCase().includes(numberCode.toLowerCase());
		}
	});

	const sorting = () => {
		sort ? setSort(false) : setSort(true);
	};

	let data: Array<[]> = [];
	if (Array.isArray(info)) {
		data = info;
	} else {
		data;
	}
	const adaptedData = InformationAboutBannersAdapter(data);

	useEffect(() => {
		setDataFromAdapter(adaptedData);
		setFilteredData(adaptedData);
	}, [data]);

	function transmitsTransparencyCode(e: number) {
		const selectedTransparentObject = formTransparentObjects.find(
			(element) => element.id === e,
		);
		if (selectedTransparentObject != null) {
			setShowSelectedTransparentObjectFx([selectedTransparentObject]);
		}
		switchModalsBannersFn();
	}
	useEffect(() => {
		if (keySearch == '' && numberGD == '' && numberCode == '') {
			setFilteredData(adaptedData);
		}
	}, [keySearch, numberGD, numberCode]);

	function closeBannerInformation(): void {
		switchModalsBannersFn();
	}
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

	return (
		<div className={clsx(styles.root, className)} style={style}>
			<div className={styles.modal_window}>
				<div className={styles.data_location}>
					<div>
						<p className={styles.data_location_h1}>
							Информация о транспарантах
						</p>
						<p className={styles.data_location_p}>Форма {title}</p>
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

				<div className={styles.search}>
					<div className={styles.key_div}>
						<ModalIcon />
						<input
							type="search"
							placeholder="Ключ"
							value={keySearch}
							className={styles.key}
							onChange={searchKey}
						/>
					</div>

					<p className={styles.data_SUBD}>Данные из СУБД</p>

					<div className={styles.data_number_div}>
						<ModalIcon />
						<input
							type="search"
							placeholder="Номер группы "
							value={numberGD}
							className={styles.data_number}
							onChange={searchNumberGD}
						/>
					</div>

					<div className={styles.eWork_div}>
						<p className={styles.eWork}>№ eWork</p>
						<SortingArrows sortingList={sorting} arrow={sort} />
					</div>

					<div className={styles.data_number_two_div}>
						<ModalIcon />
						<input
							type="search"
							value={numberCode}
							placeholder="Название группы данных"
							className={styles.data_number_two}
							onChange={searchNumberCode}
						/>
					</div>
				</div>
				<div className={styles.rendering_list}></div>
				<InformationRendering
					data={filteredData}
					clickCodeT={transmitsTransparencyCode}
				/>
			</div>
		</div>
	);
}

export default InformationAboutBanners;
