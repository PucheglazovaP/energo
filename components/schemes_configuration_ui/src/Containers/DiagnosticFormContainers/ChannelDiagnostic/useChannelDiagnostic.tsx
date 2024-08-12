import { useLocation } from 'react-router';
import { useSearchParams } from 'react-router-dom';
import clsx from 'clsx';
import { useStore } from 'effector-react';

import Filter from '../../../Icons/Filter';
import { $user } from '../../../Models/Auth';
import { $channelsDiagnostic } from '../../../Models/ChannelDiagnostic';
import {
	applyFilters,
	toggleFilterIndicator,
	toggleFilterIndicatorAll,
} from '../../../Models/ChannelDiagnostic/events';
import { FilterIndicator } from '../../../Models/ChannelDiagnostic/types';
import { addTab } from '../../../Models/FormTabs/events';
import { $navigation } from '../../../Models/Navigation';
import { setNavigation } from '../../../Models/Navigation/events';
import {
	ChannelStatusCode,
	FormTypes,
	SortOrder,
	statusDetails,
	TreeTypes,
} from '../../../Shared/types';
import MultiselectDropdown from '../../../UI/MultiselectDropdown/MultiselectDropdown';
import MultiselectDropdownSearchAndSortRender from '../../../UI/MultiselectDropdown/MultiselectDropdownSearchAndSortRender';
import TableHighlightCell from '../../../UI/Table/partials/TableHighlightCell';
import { ITableBody, ITableColumn } from '../../../UI/Table/types';
import TextLine from '../../../UI/TextLine';
import { DateFormat, formatDate } from '../../../Utils/dateUtils';
import { updateSearchParams } from '../../../Utils/searchParams';
import { sortByOrder } from '../../../Utils/tableUtils';

import LinkCell from './partials/LinkCell';
import { AddTabParams } from './types';
import useSortOptions from './useSortOptions';
import { mapFilterStorageWithIndicator } from './utils';

import styles from './ChannelDiagnostic.module.css';

function useChannelDiagnostic() {
	const { handleSortOptions, getSortStyles, sortOptions } =
		useSortOptions(styles);

	const {
		filteredChannels: channelsList,
		channelNameFilterStorage,
		channelNameFilterIndicator,
		deviceNameFilterStorage,
		deviceNameFilterIndicator,
		channelIdFilterStorage,
		channelIdFilterIndicator,
		deviceIdFilterIndicator,
		deviceIdFilterStorage,
		errorFilterIndicator,
		errorFilterStorage,
	} = useStore($channelsDiagnostic);
	const user = useStore($user);
	const { versionId } = useStore($navigation);
	const location = useLocation();
	const [searchParams] = useSearchParams();

	const getErrorColor = (errCode: ChannelStatusCode): string => {
		const statusDetail = statusDetails[errCode];
		return statusDetail.color;
	};

	const handleFilterIndicator = (key: string, accessor: FilterIndicator) => {
		toggleFilterIndicator({ id: key, accessor: accessor });
	};

	const handleFilterIndicatorAll = (accessor: FilterIndicator) => {
		toggleFilterIndicatorAll(accessor);
	};

	const handleFilterApply = (accessor: FilterIndicator) => {
		applyFilters(accessor);
	};

	const handleAddTab = (params: AddTabParams) => {
		if (!user) return;
		const { serverId, deviceId, channelId } = params;
		//const searchParams: URLSearchParams = new URLSearchParams(location.search);
		const updatedSearchParams: URLSearchParams = updateSearchParams(
			searchParams,
			{
				serverId,
				channelId,
				deviceId,
				formId: undefined,
				treeType: TreeTypes.Devices,
			},
		);
		const newUrl: string = `${
			location.pathname
		}?${updatedSearchParams.toString()}`;
		addTab({
			versionCode: Number(versionId),
			url: newUrl,
			id: Number(channelId),
			formType: FormTypes.DeviceChart,
			userId: user.preferredUsername,
		});
		setNavigation({ activeFormType: FormTypes.DeviceChart });
	};

	const mappedChannelNameFilterStorage = mapFilterStorageWithIndicator(
		channelNameFilterStorage,
		channelNameFilterIndicator,
	);
	const mappedDeviceNameFilterStorage = mapFilterStorageWithIndicator(
		deviceNameFilterStorage,
		deviceNameFilterIndicator,
	);

	const mappedChannelIdFilterStorage = mapFilterStorageWithIndicator(
		channelIdFilterStorage,
		channelIdFilterIndicator,
	);

	const mappedDeviceIdFilterStorage = mapFilterStorageWithIndicator(
		deviceIdFilterStorage,
		deviceIdFilterIndicator,
	);

	const mappedErrorFilterStorage = mapFilterStorageWithIndicator(
		errorFilterStorage,
		errorFilterIndicator,
	);

	const headers: ITableColumn[] = [
		{
			accessor: 'channelNumber',
			sortOrder: 0,
			text: '',
			width: 145,
			renderHeaderCell: MultiselectDropdownSearchAndSortRender({
				title: 'Номер',
				items: mappedChannelIdFilterStorage,
				isSortable: true,
				sortClassName: clsx(getSortStyles('channelNumber')),
				hasFilterControl: true,
				className: styles.header_cell,
				onSortClick: () => handleSortOptions('channelNumber'),
				onApply: () => handleFilterApply(FilterIndicator.ChannelId),
				onSelect: (key: string) =>
					handleFilterIndicator(key, FilterIndicator.ChannelId),
				onSelectAll: () => handleFilterIndicatorAll(FilterIndicator.ChannelId),
				rightIcon: (
					<Filter
						className={clsx(
							styles.filter,
							channelIdFilterIndicator.size && styles.filter__applied,
						)}
					/>
				),
			}),
		},
		{
			accessor: 'channelName',
			sortOrder: 0,
			text: '',
			minWidth: 490,
			renderHeaderCell: () => (
				<MultiselectDropdown
					title={'Наименование'}
					items={mappedChannelNameFilterStorage}
					rightIcon={
						<Filter
							className={clsx(
								styles.filter,
								channelNameFilterIndicator.size && styles.filter__applied,
							)}
						/>
					}
					className={styles.header_cell}
					isItemsListVisible
					isSearchBoxVisible
					isSelectAllVisible
					onSelect={(key: string) =>
						handleFilterIndicator(key, FilterIndicator.ChannelName)
					}
					onSelectAll={() =>
						handleFilterIndicatorAll(FilterIndicator.ChannelName)
					}
					onApply={() => handleFilterApply(FilterIndicator.ChannelName)}
				/>
			),
			renderCell: ({ data }) => <LinkCell {...data} onClick={handleAddTab} />,
		},
		{
			accessor: 'error',
			sortOrder: 0,
			text: '',
			width: 250,
			renderHeaderCell: MultiselectDropdownSearchAndSortRender({
				title: 'Ошибка',
				items: mappedErrorFilterStorage,
				isSortable: false,
				hasFilterControl: true,
				className: styles.header_cell,
				onApply: () => handleFilterApply(FilterIndicator.Error),
				onSelect: (key: string) =>
					handleFilterIndicator(key, FilterIndicator.Error),
				onSelectAll: () => handleFilterIndicatorAll(FilterIndicator.Error),
				rightIcon: (
					<Filter
						className={clsx(
							styles.filter,
							errorFilterIndicator.size && styles.filter__applied,
						)}
					/>
				),
			}),
			renderCell: ({ data }) => {
				return <TableHighlightCell {...data} />;
			},
		},
		{
			accessor: 'deviceNumber',
			sortOrder: 0,
			text: '',
			width: 145,
			renderHeaderCell: MultiselectDropdownSearchAndSortRender({
				title: 'Номер',
				items: mappedDeviceIdFilterStorage,
				isSortable: true,
				sortClassName: clsx(getSortStyles('deviceNumber')),
				hasFilterControl: true,
				className: styles.header_cell,
				onSortClick: () => handleSortOptions('deviceNumber'),
				onApply: () => handleFilterApply(FilterIndicator.DeviceId),
				onSelect: (key: string) =>
					handleFilterIndicator(key, FilterIndicator.DeviceId),
				onSelectAll: () => handleFilterIndicatorAll(FilterIndicator.DeviceId),
				rightIcon: (
					<Filter
						className={clsx(
							styles.filter,
							deviceIdFilterIndicator.size && styles.filter__applied,
						)}
					/>
				),
			}),
		},
		{
			accessor: 'deviceName',
			sortOrder: 0,
			text: '',
			minWidth: 490,
			renderCell: ({ data }) => (
				<TextLine textContent={data.text} className={styles.text} />
			),
			renderHeaderCell: () => (
				<MultiselectDropdown
					title={'Наименование'}
					items={mappedDeviceNameFilterStorage}
					rightIcon={
						<Filter
							className={clsx(
								styles.filter,
								deviceNameFilterIndicator.size && styles.filter__applied,
							)}
						/>
					}
					isItemsListVisible
					isSearchBoxVisible
					isSelectAllVisible
					className={styles.header_cell}
					onSelect={(key: string) =>
						handleFilterIndicator(key, FilterIndicator.DeviceName)
					}
					onSelectAll={() =>
						handleFilterIndicatorAll(FilterIndicator.DeviceName)
					}
					onApply={() => handleFilterApply(FilterIndicator.DeviceName)}
				/>
			),
		},
		{
			accessor: 'errorCount',
			sortOrder: 0,
			text: '',
			width: 165,
			renderHeaderCell: MultiselectDropdownSearchAndSortRender({
				title: 'Ошибок за сутки, %',
				isSortable: true,
				sortClassName: clsx(getSortStyles('errorCount')),
				hasFilterControl: false,
				className: styles.header_cell,
				onSortClick: () => handleSortOptions('errorCount'),
			}),
		},
		{
			accessor: 'errorDate',
			sortOrder: 0,
			text: '',
			width: 190,
			renderHeaderCell: MultiselectDropdownSearchAndSortRender({
				title: 'Дата последней ошибки',
				isSortable: true,
				sortClassName: clsx(getSortStyles('errorDate')),
				hasFilterControl: false,
				className: styles.header_cell,
				onSortClick: () => handleSortOptions('errorDate'),
			}),
		},
	];

	const channels: ITableBody[] = channelsList.map((channel) => ({
		dataLine: [
			{
				accessor: 'channelNumber',
				text: channel.channelId,
			},
			{
				accessor: 'channelName',
				text: channel.channelName,
				channelId: channel.channelId,
				deviceId: channel.deviceId,
				serverId: channel.serverId,
			},
			{
				accessor: 'error',
				text: channel.errName,
				backgroundColor: getErrorColor(channel.errCode as ChannelStatusCode),
			},
			{
				accessor: 'deviceNumber',
				text: channel.deviceId,
			},
			{
				accessor: 'deviceName',
				text: channel.deviceName,
			},
			{
				accessor: 'errorCount',
				text: channel.errCount,
			},
			{
				accessor: 'errorDate',
				text: formatDate(channel.errDate, DateFormat.DefaultDisplayFormat),
			},
		],
		rowClassName: styles.table_row,
	}));

	const finalChannels: ITableBody[] =
		sortOptions.order === SortOrder.None
			? channels
			: sortByOrder(channels, sortOptions.accessor, sortOptions.order);

	return {
		headers,
		channels: finalChannels,
	};
}

export default useChannelDiagnostic;
