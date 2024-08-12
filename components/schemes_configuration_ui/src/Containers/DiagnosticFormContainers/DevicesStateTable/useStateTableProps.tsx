import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useStore } from 'effector-react';

import $diagnosticCurrentModel from '../../../Models/DiagnosticCurrent';
import {
	getCurrentDiagnosticDevicesDataEvent,
	toggleBooleanStorageEvent,
} from '../../../Models/DiagnosticCurrent/events';
import {
	ExpressionFieldName,
	StorageFieldName,
} from '../../../Models/DiagnosticCurrent/types';
import { $navigation } from '../../../Models/Navigation';
import {
	Cell,
	ITableBody,
	ITableColumn,
	TableSection,
} from '../../../UI/Table/types';
import { updateSearchParams } from '../../../Utils/searchParams';

import { TRANSLATIONS } from './constants';
import DevicesStateTableDefaultCell from './DevicesStateTableDefaultCell';
import DevicesStateTableDefaultSection from './DevicesStateTableDefaultSection';
import DevicesStateTableFavoriteButtonCell from './DevicesStateTableFavoriteButtonCell';
import DevicesStateTableFilterHeader from './DevicesStateTableFilterHeader';
import DevicesStateTableFilterHeaderNumber from './DevicesStateTableFilterHeaderNumber';
import DevicesStateTableHighlightCell from './DevicesStateTableHighlightCell';
import DevicesStateTableRadioButtonCell from './DevicesStateTableRadioButtonCell';
import { DiagnosticCurrentTableColumn } from './types';

import styles from './DevicesStateTable.module.css';

function useStateTableProps() {
	const {
		devices,
		devicesExpandStorage,
		currentPage,
		totalPages,
		interfaces,
		portsLines,
		deviceStatuses,
		deviceTypes,
		deviceNames,
		deviceNumbers,
		deviceStatusFilterStorage,
		interfaceFilterStorage,
		portLineFilterStorage,
		deviceTypeFilterStorage,
		deviceNameFilterStorage,
		deviceNumberFilterStorage,
		selectedDeviceId,
	} = useStore($diagnosticCurrentModel);
	const { deviceId } = useStore($navigation);

	const [searchParams, setSearchParams] = useSearchParams();

	// Fetch data with new filter, also clean initiated search params
	const handleApplyClick = () => {
		getCurrentDiagnosticDevicesDataEvent();
		const updatedSearchParams: URLSearchParams = updateSearchParams(
			searchParams,
			{
				deviceId: undefined,
			},
		);
		setSearchParams(updatedSearchParams);
	};

	const header: ITableColumn[] = Object.values(
		DiagnosticCurrentTableColumn,
	).map((column) => {
		const defaultData: ITableColumn = {
			accessor: column,
			text: TRANSLATIONS[column] || '',
			isResizable: true,
			isSortable: false,
			sortOrder: 0,
			minWidth: 80,
		};

		switch (column) {
			case DiagnosticCurrentTableColumn.Interface:
				return {
					...defaultData,
					minWidth: 150,
					width: 130,
					renderCell: DevicesStateTableRadioButtonCell,
					renderHeaderCell: DevicesStateTableFilterHeader({
						filterItems: interfaces,
						filterStorage: interfaceFilterStorage,
						title: defaultData.text,
						storageFieldName: StorageFieldName.InterfaceFilterStorage,
						onApply: handleApplyClick,
						isSearchBoxVisible: true,
						isSelectAllVisible: true,
						isItemsListVisible: true,
					}),
				};
			case DiagnosticCurrentTableColumn.Status:
				return {
					...defaultData,
					minWidth: 100,
					renderCell: DevicesStateTableHighlightCell,
					renderHeaderCell: DevicesStateTableFilterHeader({
						filterItems: deviceStatuses,
						filterStorage: deviceStatusFilterStorage,
						title: defaultData.text,
						storageFieldName: StorageFieldName.DeviceStatusFilterStorage,
						onApply: handleApplyClick,
						isItemsListVisible: true,
					}),
				};
			case DiagnosticCurrentTableColumn.Crc:
				return {
					...defaultData,
					minWidth: 70,
					width: 78,
					renderCell: DevicesStateTableHighlightCell,
					renderHeaderCell: DevicesStateTableFilterHeaderNumber({
						title: defaultData.text,
						expressionFieldName: ExpressionFieldName.DeviceCrcFilterExpression,
						onApply: handleApplyClick,
					}),
				};
			case DiagnosticCurrentTableColumn.To:
				return {
					...defaultData,
					minWidth: 80,
					width: 80,
					renderCell: DevicesStateTableHighlightCell,
					renderHeaderCell: DevicesStateTableFilterHeaderNumber({
						title: defaultData.text,
						expressionFieldName: ExpressionFieldName.DeviceToFilterExpression,
						onApply: handleApplyClick,
					}),
				};
			case DiagnosticCurrentTableColumn.Ok:
				return {
					...defaultData,
					minWidth: 70,
					width: 74,
					renderCell: DevicesStateTableHighlightCell,
					renderHeaderCell: DevicesStateTableFilterHeaderNumber({
						title: defaultData.text,
						expressionFieldName: ExpressionFieldName.DeviceOkFilterExpression,
						onApply: handleApplyClick,
					}),
				};
			case DiagnosticCurrentTableColumn.IcpTo:
				return {
					...defaultData,
					minWidth: 90,
					width: 95,
					renderCell: DevicesStateTableHighlightCell,
					renderHeaderCell: DevicesStateTableFilterHeaderNumber({
						title: defaultData.text,
						expressionFieldName:
							ExpressionFieldName.DeviceIcpToFilterExpression,
						onApply: handleApplyClick,
					}),
				};
			case DiagnosticCurrentTableColumn.Number:
				return {
					...defaultData,
					minWidth: 100,
					width: 100,
					renderCell: DevicesStateTableDefaultCell,
					renderHeaderCell: DevicesStateTableFilterHeader({
						filterItems: deviceNumbers,
						filterStorage: deviceNumberFilterStorage,
						title: defaultData.text,
						storageFieldName: StorageFieldName.DeviceNumberFilterStorage,
						onApply: handleApplyClick,
						isSearchBoxVisible: true,
						isSelectAllVisible: true,
						isItemsListVisible: true,
					}),
				};
			case DiagnosticCurrentTableColumn.NetworkNumber:
				return {
					...defaultData,
					minWidth: 70,
					width: 70,
					renderCell: DevicesStateTableDefaultCell,
				};
			case DiagnosticCurrentTableColumn.Name:
				return {
					...defaultData,
					minWidth: 100,
					width: 250,
					renderCell: DevicesStateTableDefaultCell,
					renderHeaderCell: DevicesStateTableFilterHeader({
						filterItems: deviceNames,
						filterStorage: deviceNameFilterStorage,
						title: defaultData.text,
						storageFieldName: StorageFieldName.DeviceNameFilterStorage,
						onApply: handleApplyClick,
						isSearchBoxVisible: true,
						isSelectAllVisible: true,
						isItemsListVisible: true,
					}),
				};
			case DiagnosticCurrentTableColumn.Type:
				return {
					...defaultData,
					minWidth: 150,
					renderCell: DevicesStateTableDefaultCell,
					renderHeaderCell: DevicesStateTableFilterHeader({
						filterItems: deviceTypes,
						filterStorage: deviceTypeFilterStorage,
						title: defaultData.text,
						storageFieldName: StorageFieldName.DeviceTypeFilterStorage,
						onApply: handleApplyClick,
						isSearchBoxVisible: true,
						isSelectAllVisible: true,
						isItemsListVisible: true,
					}),
				};
			case DiagnosticCurrentTableColumn.PortLine:
				return {
					...defaultData,
					minWidth: 200,
					renderCell: DevicesStateTableDefaultCell,
					renderHeaderCell: DevicesStateTableFilterHeader({
						filterItems: portsLines,
						filterStorage: portLineFilterStorage,
						title: defaultData.text,
						storageFieldName: StorageFieldName.PortLineFilterStorage,
						onApply: handleApplyClick,
						isSearchBoxVisible: true,
						isSelectAllVisible: true,
						isItemsListVisible: true,
					}),
				};
			case DiagnosticCurrentTableColumn.Favorite:
				return {
					...defaultData,
					isResizable: false,
					minWidth: 80,
					width: 80,
					renderCell: DevicesStateTableFavoriteButtonCell,
				};
			case DiagnosticCurrentTableColumn.Date:
				return {
					...defaultData,
					minWidth: 90,
					width: 130,
					renderCell: DevicesStateTableDefaultCell,
				};
			default:
				return {
					...defaultData,
					renderCell: DevicesStateTableDefaultCell,
				};
		}
	});

	const { data, sections } = devices.reduce(
		(accumulator: { data: ITableBody[]; sections: TableSection[] }, device) => {
			const { data, sections } = accumulator;
			const isSelectedDevice = device.number === selectedDeviceId;
			const selectedClassName = isSelectedDevice ? styles.cell__selected : '';

			// Подготовить данные ячеек
			const dataLine: Cell[] = [];
			Object.values(DiagnosticCurrentTableColumn).forEach((column) => {
				switch (column) {
					case DiagnosticCurrentTableColumn.Interface:
						dataLine.push({
							accessor: column,
							text: '',
							deviceId: device.number,
							className: selectedClassName,
						});
						break;
					case DiagnosticCurrentTableColumn.To:
						dataLine.push({
							accessor: column,
							text: device.to,
							backgroundColor: device.toColor,
							className: selectedClassName,
						});
						break;
					case DiagnosticCurrentTableColumn.Crc:
						dataLine.push({
							accessor: column,
							text: device.crc,
							backgroundColor: device.crcColor,
							className: selectedClassName,
						});
						break;
					case DiagnosticCurrentTableColumn.Ok:
						dataLine.push({
							accessor: column,
							text: device.ok,
							backgroundColor: device.okColor,
							className: selectedClassName,
						});
						break;
					case DiagnosticCurrentTableColumn.IcpTo:
						dataLine.push({
							accessor: column,
							text: device.icpTo,
							backgroundColor: device.icpToColor,
							className: selectedClassName,
						});
						break;
					case DiagnosticCurrentTableColumn.Status:
						dataLine.push({
							accessor: column,
							text: device.status,
							backgroundColor: device.statusColor,
							className: selectedClassName,
						});
						break;
					case DiagnosticCurrentTableColumn.Favorite:
						dataLine.push({
							accessor: column,
							text: '',
							deviceId: device.number,
							className: selectedClassName,
						});
						break;
					default:
						dataLine.push({
							accessor: column,
							text: device[column],
							className: selectedClassName,
						});
				}
			});
			data.push({ dataLine, sectionAccessor: device.interface });

			// Подготовить данные секций
			if (!sections.some((item) => item.sectionAccessor === device.server)) {
				sections.push({
					sectionAccessor: device.server,
					text: device.server,
					isExpanded: devicesExpandStorage[device.server],
					renderSection: (
						<DevicesStateTableDefaultSection title={device.server} />
					),
				});
			}

			if (!sections.some((item) => item.sectionAccessor === device.interface)) {
				sections.push({
					sectionAccessor: device.interface,
					parentAccessor: device.server,
					text: device.interface,
					isExpanded: devicesExpandStorage[device.interface],
					renderSection: (
						<DevicesStateTableDefaultSection title={device.interface} />
					),
				});
			}

			return accumulator;
		},
		{ data: [], sections: [] },
	);

	useEffect(() => {
		getCurrentDiagnosticDevicesDataEvent();
	}, [currentPage]);

	// Set device id filter
	useEffect(() => {
		if (deviceId) {
			toggleBooleanStorageEvent({
				storageFieldName: StorageFieldName.DeviceNumberFilterStorage,
				dictionaryKey: String(deviceId),
				initialValue: true,
			});
			getCurrentDiagnosticDevicesDataEvent();
		}
	}, [deviceId]);

	return { header, data, sections, totalPages };
}

export default useStateTableProps;
