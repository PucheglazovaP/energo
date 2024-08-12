import { ChangeEvent } from 'react';
import { Checkbox } from '@evraz/ui-kit';

import debounce from '../../Facades/useDebouce';
import { Search } from '../../Icons';
import { getMeasuringInstrumentsListFx } from '../../Models/NSIMeasuringInstruments/effects';
import {
	changeAllInstrumentsCheckedState,
	changeEquipmentShortName,
	changeFactoryNumber,
	changeInstrumentCheckedState,
	changeLocation,
	changeManufacturerTypeName,
} from '../../Models/NSIMeasuringInstruments/events';
import {
	NSIMeasuringInstrument,
	NSIMeasuringInstrumentsFiltersModel,
	NSIMeasuringInstrumentsSearchValuesModel,
} from '../../Models/NSIMeasuringInstruments/types';
import { ModuleName } from '../../Shared/Types/moduleName';
import Input from '../../UI/Input';
import {
	DataTableCell,
	TableDataItem,
} from '../NSIUserParameters/components/DataTable/types';

import { InstrumentSearchInputName } from './types';

import styles from './NSIMeasuringInstrumentsJournal.module.css';

export function getTableData(
	isEditPermitted: boolean,
	userId: string,
	instrumentsList: NSIMeasuringInstrument[],
	searchValues: NSIMeasuringInstrumentsSearchValuesModel,
	filters: NSIMeasuringInstrumentsFiltersModel,
): {
	header: DataTableCell[];
	body: TableDataItem[];
} {
	let linkedInstrumentsCount = 0;

	const checkedInstrumentsCount = instrumentsList.filter((instrument) => {
		if (instrument.linkedToUnit) {
			linkedInstrumentsCount = linkedInstrumentsCount + 1;
		}

		return instrument.checked;
	}).length;

	const handleChangeAllInstrumentsCheckedState = () => {
		changeAllInstrumentsCheckedState();
	};

	const handleChangeSearchValue = (e: ChangeEvent<HTMLInputElement>) => {
		const { id, value } = e.target;

		const isShortNameSearch =
			id === InstrumentSearchInputName.EQUIPMENT_SHORT_NAME;
		const isTypeNameSearch =
			id === InstrumentSearchInputName.MANUFACTURER_TYPE_NAME;
		const isLocationSearch = id === InstrumentSearchInputName.LOCATION;
		const isFactoryNumberSearch =
			id === InstrumentSearchInputName.FACTORY_NUMBER;

		if (isShortNameSearch) {
			changeEquipmentShortName(value);
		}

		if (isTypeNameSearch) {
			changeManufacturerTypeName(value);
		}

		if (isLocationSearch) {
			changeLocation(value);
		}

		if (isFactoryNumberSearch) {
			changeFactoryNumber(value);
		}

		const getCorrectValue = (storedValue: string) => {
			if (storedValue === '') {
				return null;
			}

			return storedValue;
		};

		getMeasuringInstrumentsListFx({
			action: 'set',
			measurementTypeCode: filters.measurementType,
			equipmentShortName: isShortNameSearch
				? value
				: getCorrectValue(searchValues.equipmentShortName),
			manufacturerTypeName: isTypeNameSearch
				? value
				: getCorrectValue(searchValues.manufacturerTypeName),
			productionYear: null,
			userStatusCode: filters.userStatus,
			equipmentNumber: null,
			location: isLocationSearch
				? value
				: getCorrectValue(searchValues.location),
			factoryNumber: isFactoryNumberSearch
				? value
				: getCorrectValue(searchValues.factoryNumber),
			pageRowCount: 20,
			pageNumber: 1,
			firstRow: 0,
			selectRow: null,
			pageTotalCount: 0,
			userId,
			moduleName:
				ModuleName.NSIMeasuringInstrumentsJournal_utils_getMeasuringInstrumentsListFx,
		});
	};

	const debouncedSearch = debounce(handleChangeSearchValue, 300);

	const header: DataTableCell[] = [
		{
			cellId: 'measuring-instruments-control-header-cell',
			cellClassName: styles.table_cell__control,
			content: (
				<Checkbox
					className={
						checkedInstrumentsCount !== 0 &&
						instrumentsList.length - linkedInstrumentsCount !==
							checkedInstrumentsCount
							? styles.checkbox__semi_checked
							: styles.checkbox
					}
					isChecked={
						checkedInstrumentsCount !== 0 &&
						instrumentsList.length - linkedInstrumentsCount ===
							checkedInstrumentsCount
					}
					onChange={handleChangeAllInstrumentsCheckedState}
					isDisabled={!isEditPermitted}
				/>
			),
		},
		{
			cellId: 'measuring-instruments-equipment-number-header-cell',
			cellClassName: styles.table_cell__equnr,
			content: 'Номер',
		},
		{
			cellId: 'measuring-instruments-measurements-type-header-cell',
			cellClassName: styles.table_cell__eqart,
			content: 'Вид измерений',
		},
		{
			cellId: 'measuring-instruments-short-name-header-cell',
			cellClassName: styles.table_cell__eqtx,
			content: (
				<Input
					id={InstrumentSearchInputName.EQUIPMENT_SHORT_NAME}
					type="search"
					isSearch
					placeholder="Наименование СИ"
					onChange={debouncedSearch}
					className={styles.search_field}
					glyph={<Search className={styles.icon} />}
				/>
			),
		},
		{
			cellId: 'measuring-instruments-manufacturer-name-header-cell',
			cellClassName: styles.table_cell__search,
			content: (
				<Input
					id={InstrumentSearchInputName.MANUFACTURER_TYPE_NAME}
					type="search"
					isSearch
					placeholder="Тип (марка)"
					onChange={debouncedSearch}
					className={styles.search_field}
					glyph={<Search className={styles.icon} />}
				/>
			),
		},
		{
			cellId: 'measuring-instruments-factory-number-header-cell',
			cellClassName: styles.table_cell__search,
			content: (
				<Input
					id={InstrumentSearchInputName.FACTORY_NUMBER}
					type="search"
					isSearch
					placeholder="Заводской номер"
					onChange={debouncedSearch}
					className={styles.search_field}
					glyph={<Search className={styles.icon} />}
				/>
			),
		},
		{
			cellId: 'measuring-instruments-production-year-header-cell',
			cellClassName: styles.table_cell__baujj,
			content: 'Год выпуска',
		},
		{
			cellId: 'measuring-instruments-verification-date-header-cell',
			cellClassName: styles.table_cell__datslp,
			content: 'Дата поверки',
		},
		{
			cellId: 'measuring-instruments-calibration-date-header-cell',
			cellClassName: styles.table_cell,
			content: 'Дата калибровки',
		},
		{
			cellId: 'measuring-instruments-precision-class-header-cell',
			cellClassName: styles.table_cell,
			content: 'Класс точности',
		},
		{
			cellId: 'measuring-instruments-location-header-cell',
			cellClassName: styles.table_cell__search,
			content: (
				<Input
					id={InstrumentSearchInputName.LOCATION}
					type="search"
					isSearch
					placeholder="Местонахождение"
					onChange={debouncedSearch}
					className={styles.search_field}
					glyph={<Search className={styles.icon} />}
				/>
			),
		},
		{
			cellId: 'measuring-instruments-user-status-header-cell',
			cellClassName: styles.table_cell__status,
			content: 'Статус',
		},
	];

	const body: TableDataItem[] = instrumentsList.map((instrument) => {
		return {
			columnId: `${instrument.equipmentNumber}--${instrument.factoryNumber}`,
			equipmentNumber: instrument.equipmentNumber,
			cells: [
				{
					cellId: `files-list-table-row`,
					cellClassName: styles.table_row,
					content: (
						<>
							<Checkbox
								className={styles.checkbox__extended}
								isChecked={instrument.linkedToUnit || instrument.checked}
								isDisabled={instrument.linkedToUnit || !isEditPermitted}
								onChange={() => {
									changeInstrumentCheckedState({
										equipmentNumber: instrument.equipmentNumber,
										factoryNumber: instrument.factoryNumber,
									});
								}}
							/>
							<p className={styles.row_item__equnr}>
								{instrument.equipmentNumber}
							</p>
							<p className={styles.row_item__eqart}>
								{instrument.measurementType}
							</p>
							<p className={styles.row_item__eqtx}>
								{instrument.equipmentShortName}
							</p>
							<p className={styles.row_item}>
								{instrument.manufacturerTypeName}
							</p>
							<p className={styles.row_item}>{instrument.factoryNumber}</p>
							<p className={styles.row_item__baujj}>
								{instrument.productionYear}
							</p>
							<p className={styles.row_item__datslp}>
								{instrument.verificationDate}
							</p>
							<p className={styles.row_item}>{instrument.calibrationDate}</p>
							<p className={styles.row_item}>{instrument.precisionClass}</p>
							<p className={styles.row_item}>{instrument.location}</p>
							<p className={styles.row_item__status}>{instrument.userStatus}</p>
						</>
					),
				},
			],
		};
	});

	return {
		header,
		body,
	};
}
