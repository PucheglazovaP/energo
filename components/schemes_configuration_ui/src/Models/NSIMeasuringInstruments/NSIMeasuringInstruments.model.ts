import { createStore } from 'effector';

import {
	PAGE_NUMBER_DEFAULT,
	PAGE_ROW_COUNT_DEFAULT,
	PAGE_TOTAL_COUNT_DEFAULT,
	ROW_HEIGHT,
} from './constants';
import {
	addMeasuringInstrumentsList,
	changeAllInstrumentsCheckedState,
	changeEquipmentShortName,
	changeFactoryNumber,
	changeInstrumentCheckedState,
	changeLocation,
	changeManufacturerTypeName,
	clearExtendedFilter,
	clearSearchValues,
	setCurrentDeviceId,
	setCurrentNodeId,
	setInstrumentTypesCheckedIds,
	setMeasuringInstrumentsList,
	setMeasuringInstrumentsPageNumber,
	setMeasuringInstrumentTypes,
	setMeasuringInstrumentUserStatuses,
	setNsiMeasuringInstrumentsFilters,
	setPagination,
	setPaginationResponse,
	setSelectedRow,
	setUserStatusesCheckedIds,
} from './events';
import {
	NSIMeasuringInstrumentsFiltersModel,
	NSIMeasuringInstrumentsModel,
	NSIMeasuringInstrumentsPagination,
	NSIMeasuringInstrumentsPaginationResponse,
	NSIMeasuringInstrumentsSearchValuesModel,
	NSIMeasuringInstrumentsType,
	NSIMeasuringInstrumentsUserStatus,
} from './types';

export const $nsiMeasuringInstruments =
	createStore<NSIMeasuringInstrumentsModel>({
		pageNumber: 1,
		allInstrumentsChecked: false,
		instrumentsList: [],
		pagination: {
			pageTotalCount: PAGE_TOTAL_COUNT_DEFAULT,
			pageRowCount: PAGE_ROW_COUNT_DEFAULT,
			topPageNumber: PAGE_NUMBER_DEFAULT,
			bottomPageNumber: PAGE_NUMBER_DEFAULT,
			isFirstFetching: true,
			paginationAvailable: true,
			needToScroll: false,
			scrollbarPosition: null,
		},
	})
		.on(
			setPaginationResponse,
			(
				state,
				{
					pageNumber,
					pageTotalCount,
				}: NSIMeasuringInstrumentsPaginationResponse,
			) => {
				const pageTotalCountValue = pageTotalCount
					? pageTotalCount
					: PAGE_TOTAL_COUNT_DEFAULT;
				const pageNumberValue = pageNumber ? pageNumber : PAGE_NUMBER_DEFAULT;

				return {
					...state,
					pagination: {
						...state.pagination,
						pageTotalCount: pageTotalCountValue,
					},
					pageNumber: pageNumberValue,
				};
			},
		)
		.on(
			setPagination,
			(state, pagination: NSIMeasuringInstrumentsPagination) => {
				return {
					...state,
					pagination,
				};
			},
		)
		.on(
			setMeasuringInstrumentsList,
			(state, { instrumentsList, pagination }) => {
				let scrollbarPositionValue =
					pagination.selectedRow !== null && pagination.firstRow !== null
						? (pagination.selectedRow - pagination.firstRow) * ROW_HEIGHT
						: null;
				const paginationPageNumberValue = pagination.pageNumber || 2;

				if (
					pagination.pageNumber &&
					pagination.pageNumber > 1 &&
					scrollbarPositionValue !== null
				) {
					scrollbarPositionValue += state.pagination.pageRowCount * ROW_HEIGHT;
				}

				const shouldScroll = !!scrollbarPositionValue;

				return {
					...state,
					pageNumber: paginationPageNumberValue,
					allInstrumentsChecked: false,
					instrumentsList,
					pagination: {
						...state.pagination,
						scrollbarPosition: scrollbarPositionValue,
						needToScroll: shouldScroll,
						topPageNumber: paginationPageNumberValue - 1,
						bottomPageNumber: paginationPageNumberValue + 1,
						pageTotalCount:
							pagination.pageTotalCount || PAGE_TOTAL_COUNT_DEFAULT,
					},
				};
			},
		)
		.on(
			addMeasuringInstrumentsList,
			(state, { instrumentsList, pageNumber, shouldAddToTop }) => {
				const listToAdd = instrumentsList.filter((requestedInstrument) => {
					return !state.instrumentsList.some((stateInstrument) => {
						return (
							requestedInstrument.equipmentNumber ===
							stateInstrument.equipmentNumber
						);
					});
				});

				const newInstrumentsList = shouldAddToTop
					? [...listToAdd, ...state.instrumentsList]
					: [...state.instrumentsList, ...listToAdd];
				const scrollbarPositionValue = shouldAddToTop
					? listToAdd.length * ROW_HEIGHT
					: state.pagination.scrollbarPosition;

				return {
					...state,
					pageNumber,
					instrumentsList: newInstrumentsList,
					pagination: {
						...state.pagination,
						scrollbarPosition: scrollbarPositionValue,
						needToScroll: !!shouldAddToTop,
					},
				};
			},
		)
		.on(setMeasuringInstrumentsPageNumber, (state, pageNumber) => {
			return {
				...state,
				pageNumber,
			};
		})
		.on(changeAllInstrumentsCheckedState, (state) => {
			return {
				...state,
				allInstrumentsChecked: !state.allInstrumentsChecked,
				instrumentsList: state.instrumentsList.map((instrument) => {
					if (
						instrument.checked !== !state.allInstrumentsChecked &&
						!instrument.linkedToUnit
					) {
						return {
							...instrument,
							checked: !state.allInstrumentsChecked,
						};
					}

					return instrument;
				}),
			};
		})
		.on(changeInstrumentCheckedState, (state, selectedInstrument) => {
			return {
				...state,
				instrumentsList: state.instrumentsList.map((instrument) => {
					if (
						instrument.equipmentNumber === selectedInstrument.equipmentNumber &&
						instrument.factoryNumber === selectedInstrument.factoryNumber
					) {
						return {
							...instrument,
							checked: !instrument.checked,
						};
					}

					return instrument;
				}),
			};
		});

export const $nsiMeasuringInstrumentsSearchValues =
	createStore<NSIMeasuringInstrumentsSearchValuesModel>({
		equipmentShortName: '',
		manufacturerTypeName: '',
		location: '',
		factoryNumber: '',
	})
		.on(changeEquipmentShortName, (state, equipmentShortName) => {
			return {
				...state,
				equipmentShortName,
			};
		})
		.on(changeManufacturerTypeName, (state, manufacturerTypeName) => {
			return {
				...state,
				manufacturerTypeName,
			};
		})
		.on(changeLocation, (state, location) => {
			return {
				...state,
				location,
			};
		})
		.on(changeFactoryNumber, (state, factoryNumber) => {
			return {
				...state,
				factoryNumber,
			};
		})
		.reset(clearSearchValues);

export const $nsiMeasuringInstrumentTypes = createStore<
	NSIMeasuringInstrumentsType[]
>([]).on(setMeasuringInstrumentTypes, (state, measuringInstrumentTypes) => {
	return measuringInstrumentTypes;
});

export const $nsiMeasuringInstrumentUserStatuses = createStore<
	NSIMeasuringInstrumentsUserStatus[]
>([]).on(
	setMeasuringInstrumentUserStatuses,
	(state, measuringInstrumentUserStatuses) => {
		return measuringInstrumentUserStatuses;
	},
);

export const $nsiMeasuringInstrumentsFilters =
	createStore<NSIMeasuringInstrumentsFiltersModel>({
		measurementType: null,
		userStatus: null,
	})
		.on(
			setNsiMeasuringInstrumentsFilters,
			(_state, filters: NSIMeasuringInstrumentsFiltersModel) => filters,
		)
		.on(clearExtendedFilter, () => ({
			measurementType: null,
			userStatus: null,
		}));

export const $nsiInstrumentTypesCheckedIds = createStore<string[]>([])
	.on(
		setInstrumentTypesCheckedIds,
		(_state, checkedIds: string[]) => checkedIds,
	)
	.reset(clearExtendedFilter);
export const $nsiUserStatusesCheckedIds = createStore<string[]>([])
	.on(setUserStatusesCheckedIds, (_state, checkedIds: string[]) => checkedIds)
	.reset(clearExtendedFilter);

export const $selectedRow = createStore<string>('').on(
	setSelectedRow,
	(state, selectedRow: string) => selectedRow,
);

export const $currentDeviceId = createStore<number | null>(null).on(
	setCurrentDeviceId,
	(state, currentDeviceId: number | null) => currentDeviceId,
);

export const $currentNodeId = createStore<number | null>(null).on(
	setCurrentNodeId,
	(state, currentNodeId: number | null) => currentNodeId,
);
