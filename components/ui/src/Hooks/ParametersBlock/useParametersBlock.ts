import { useEffect, useMemo } from 'react';

import {
	CHANNEL,
	CHANNEL_PARAMETERS,
	CHANNEL_TO_GROUP_PARAMETERS,
	CHANNElS_LIST_PARAMETER,
	CHANNELS_PARAMETERS,
	COEFFICIENT,
	COUNT_DEVICES_PARAM,
	CREATE_CHANNEL_PARAMETERS,
	CREATE_DEVICE_PARAMETERS,
	CREATE_DEVICE_SERIAL_PARAMETERS,
	CREATE_GROUP_COPY_PARAMETERS,
	CREATE_GROUP_FROM_CHANNEL_PARAMETERS,
	CREATE_GROUP_FROM_CHANNELS_PARAMETERS,
	CREATE_GROUP_PARAMETERS,
	CREATE_GROUPS_FROM_CHANNELS_PARAMETERS,
	DEVICE,
	DEVICE_INFO_PARAM,
	DEVICE_PARAMETERS,
	EWORK_NUMBER_PARAM,
	GROUP,
	GROUP_PARAMETERS,
	METHOD_PARAM,
	NAME_PARAM,
	NAME_PREFIX_DEVICE_PARAM,
	NAME_PREFIX_GROUP_PARAM,
	NUMBER_GROUP_PARAM,
	NUMBER_PARAM,
	NUMBER_START_DEVICE_PARAM,
	NUMBER_START_GROUP_PARAM,
	STORAGE_TYPE_PARAM,
	UNIT_PARAM,
	UPDATE_CHANNEL_PARAMETERS,
	UPDATE_CHANNELS_PARAMETERS,
	UPDATE_DEVICE_PARAMETERS,
	UPDATE_GROUP_PARAMETERS,
} from '../../Const';
import {
	CREATE_DEVICE,
	CREATE_DEVICES,
	CREATE_GROUP_COPY,
	CREATE_GROUP_FROM_CHANNELS,
	CREATE_GROUPS,
	CREATE_GROUPS_FROM_CHANNELS,
	CREATE_NEW_CHANNELS,
	INCLUDE_CHANNELS_TO_GROUP,
	INCLUDE_UNUSED_CHANNELS_TO_GROUP,
	UPDATE_CHANNEL,
	UPDATE_CHANNEL_COEFFICIENT,
	UPDATE_DEVICE,
	UPDATE_GROUP,
	UPDATE_UNUSED_CHANNEL,
} from '../../Const/parametersBlock';
import { compareNumbers } from '../../Const/utils';
import usePermissions from '../../Packages/KeycloakInstance/usePermissions';
import { setParamsItemValue } from '../../Store/reducers/ParametersSlice/parametersActions';
import {
	setIsCreating,
	setParameterItems,
	setParametersActive,
	setParametersData,
} from '../../Store/reducers/ParametersSlice/parametersSlice';
import { selectUserGroups } from '../../Store/reducers/UserGroupsSlice/UserGroupsSelectors';
import { VacantEntityType } from '../../Store/reducers/VacantEntitySlice/types';
import { setVacantEntityTypeActive } from '../../Store/reducers/VacantEntitySlice/VacantEntitiesActions';
import { ParamsBlock } from '../../Types/ParametersBlockTypes';
import useAppDispatch from '../Store/useAppDispatch';
import { useAppSelector } from '../Store/useAppSelector';

export function useParametersBlock() {
	const { parameterItems, isCreating, parametersData, operationType } =
		useAppSelector((state) => state.parameterReducer);
	const { groupsList, devicesList, channelsList, unusedChannelsList } =
		useAppSelector((state) => state.configuratorReducer);
	const unitsTree = useAppSelector((state) => state.preferenceReducer.units);
	const userGroups = useAppSelector(selectUserGroups);
	const { methods, storageTypes } = useAppSelector(
		(state) => state.preferenceReducer,
	);
	const dispatch = useAppDispatch();
	const { canSeeGroupRangeTooltip } = usePermissions();

	const groupNumberTooltip = useMemo(
		() => userGroups.map((group) => `${group.start}-${group.end}`).join(', '),
		[userGroups],
	);

	useEffect(() => {
		if (parameterItems.length) dispatch(setParametersActive(true));
	}, [parameterItems, dispatch]);

	const paramsData = useMemo((): ParamsBlock[] => {
		const resultParams: ParamsBlock[] = [];

		// Создание группы
		if (isCreating && operationType === CREATE_GROUPS) {
			dispatch(setVacantEntityTypeActive(VacantEntityType.Group));
			return [
				{
					header: CREATE_GROUP_PARAMETERS,
					sortParams: [
						{
							value: '',
							placeholder: NAME_PARAM,
							canCopy: true,
							dropdown: false,
						},
						{
							value: '',
							placeholder: NUMBER_PARAM,
							canCopy: true,
							dropdown: false,
							title: canSeeGroupRangeTooltip ? groupNumberTooltip : undefined,
						},
						{
							value: '',
							placeholder: UNIT_PARAM,
							canCopy: false,
							dropdown: true,
							options: unitsTree,
							isTree: true,
						},
						{
							value: '',
							placeholder: METHOD_PARAM,
							canCopy: false,
							dropdown: true,
							options: methods,
						},
						{
							value: '',
							placeholder: STORAGE_TYPE_PARAM,
							canCopy: false,
							dropdown: true,
							options: storageTypes,
						},
					],
				},
			];
		}

		// Создание прибора
		if (isCreating && operationType === CREATE_DEVICE) {
			dispatch(setVacantEntityTypeActive(VacantEntityType.Device));
			return [
				{
					header: CREATE_DEVICE_PARAMETERS,
					sortParams: [
						{
							placeholder: NAME_PARAM,
							canCopy: true,
							dropdown: false,
							value: '',
						},
						{
							placeholder: NUMBER_PARAM,
							canCopy: true,
							dropdown: false,
							value: '',
						},
						{
							placeholder: DEVICE_INFO_PARAM,
							canCopy: false,
							dropdown: false,

							value: '',
						},
					],
				},
			];
		}

		// Создание серии приборов
		if (isCreating && operationType === CREATE_DEVICES) {
			dispatch(setVacantEntityTypeActive(VacantEntityType.Device));
			return [
				{
					header: CREATE_DEVICE_SERIAL_PARAMETERS,
					sortParams: [
						{
							placeholder: NAME_PREFIX_DEVICE_PARAM,
							canCopy: true,
							dropdown: false,
							value: '',
						},
						{
							placeholder: NUMBER_START_DEVICE_PARAM,
							canCopy: false,
							dropdown: false,
							value: '',
						},
						{
							placeholder: COUNT_DEVICES_PARAM,
							canCopy: false,
							dropdown: false,
							value: '',
						},
						{
							placeholder: DEVICE_INFO_PARAM,
							canCopy: false,
							dropdown: false,

							value: '',
						},
					],
				},
			];
		}

		// Создание канала/каналов
		if (isCreating && operationType === CREATE_NEW_CHANNELS) {
			dispatch(setVacantEntityTypeActive(VacantEntityType.Channel));
			return [
				{
					header: CREATE_CHANNEL_PARAMETERS,
					sortParams: [
						{
							placeholder: NAME_PARAM,
							canCopy: true,
							dropdown: false,
							value: '',
						},
						{
							placeholder: NUMBER_PARAM,
							canCopy: true,
							dropdown: false,
							value: '',
						},
						{
							placeholder: UNIT_PARAM,
							canCopy: false,
							dropdown: true,
							options: unitsTree,
							value: '',
							isTree: true,
						},
						{
							placeholder: METHOD_PARAM,
							canCopy: false,
							dropdown: true,
							options: methods,
							value: '',
						},
						{
							placeholder: STORAGE_TYPE_PARAM,
							canCopy: false,
							dropdown: true,
							options: storageTypes,
							value: '',
						},
					],
				},
			];
		}
		const paramGroupItem = parameterItems.find(
			(el) => el.parameterType === GROUP,
		);
		const paramChannelItem = parameterItems.find(
			(el) => el.parameterType === CHANNEL,
		);

		const paramDeviceItem = parameterItems.find(
			(el) => el.parameterType === DEVICE,
		);

		// Создание копии группы
		if (isCreating && operationType === CREATE_GROUP_COPY) {
			dispatch(setVacantEntityTypeActive(VacantEntityType.Group));
			if (paramGroupItem) {
				const groupItem = groupsList.find(
					(el) => el.Number === paramGroupItem.parameterId,
				);
				resultParams.push({
					header: CREATE_GROUP_COPY_PARAMETERS.concat(` №${groupItem?.Number}`),
					sortParams: [
						{
							placeholder: NAME_PARAM,
							canCopy: true,
							dropdown: false,
							value: '',
						},
						{
							placeholder: NUMBER_PARAM,
							canCopy: true,
							dropdown: false,
							value: '',
							title: canSeeGroupRangeTooltip ? groupNumberTooltip : undefined,
						},
					],
				});
			}

			return resultParams;
		}

		// Редактирование группы
		if (isCreating && operationType === UPDATE_GROUP) {
			// Отображение выбранной группы
			if (paramGroupItem) {
				const groupItem = groupsList.find(
					(el) => el.Number === paramGroupItem.parameterId,
				);
				resultParams.push({
					header: UPDATE_GROUP_PARAMETERS,
					sortParams: [
						{
							placeholder: NAME_PARAM,
							canCopy: true,
							dropdown: false,
							value: groupItem?.Name || '',
						},
						{
							placeholder: NUMBER_PARAM,
							canCopy: true,
							dropdown: false,
							value: groupItem?.Number || '',
							readOnly: true,
						},
						{
							placeholder: UNIT_PARAM,
							canCopy: false,
							dropdown: true,
							options: unitsTree,
							value: groupItem?.Unit_ID || '',
							isTree: true,
						},
						{
							placeholder: METHOD_PARAM,
							canCopy: false,
							dropdown: true,
							options: methods,
							value: groupItem?.FK_Methods || '',
						},
						{
							placeholder: EWORK_NUMBER_PARAM,
							canCopy: false,
							dropdown: false,
							value: (groupItem?.Number_EWork as number) || '',
						},
						{
							placeholder: STORAGE_TYPE_PARAM,
							canCopy: false,
							dropdown: true,
							options: storageTypes,
							value: groupItem ? groupItem.FK_TypesStorage : '',
						},
					],
				});
			}

			return resultParams;
		}

		// Редактирование прибора
		if (isCreating && operationType === UPDATE_DEVICE) {
			// Отображение выбранного прибора
			if (paramDeviceItem) {
				const deviceItem = devicesList.find(
					(el) => el.Number === paramDeviceItem.parameterId,
				);
				return [
					{
						header: UPDATE_DEVICE_PARAMETERS,
						sortParams: [
							{
								placeholder: NAME_PARAM,
								canCopy: true,
								dropdown: false,
								value: deviceItem?.Name || '',
							},
							{
								placeholder: NUMBER_PARAM,
								canCopy: true,
								dropdown: false,
								value: deviceItem?.Number || '',
								readOnly: true,
							},
							{
								placeholder: DEVICE_INFO_PARAM,
								canCopy: false,
								dropdown: false,
								value: deviceItem?.Comment || '',
							},
						],
					},
				];
			}

			return resultParams;
		}

		// Включение каналов в группу
		if (isCreating && operationType === INCLUDE_CHANNELS_TO_GROUP) {
			resultParams.push({
				header: CHANNEL_TO_GROUP_PARAMETERS,
				sortParams: [
					{
						placeholder: COEFFICIENT,
						canCopy: true,
						dropdown: false,
						value: '',
					},
				],
			});
			// Отображение выбранных каналов
			if (paramChannelItem) {
				const channelItems = parameterItems
					.filter((el) => el.parameterType === CHANNEL)
					.map((item) => item.parameterId)
					.sort(compareNumbers);
				resultParams.push({
					header: CHANNElS_LIST_PARAMETER,
					sortParams: [
						{
							placeholder: '',
							canCopy: false,
							dropdown: false,
							value: '',
							listItems: channelItems,
							withUnderLine: true,
						},
					],
				});
			}
			// Отображение выбранной группы
			if (paramGroupItem) {
				const groupItem = groupsList.find(
					(el) => el.Number === paramGroupItem.parameterId,
				);
				resultParams.push({
					header: GROUP_PARAMETERS,
					sortParams: [
						{
							placeholder: NAME_PARAM,
							canCopy: true,
							dropdown: false,
							value: groupItem?.Name || '',
							readOnly: true,
						},
						{
							placeholder: NUMBER_PARAM,
							canCopy: true,
							dropdown: false,
							value: groupItem?.Number || '',
							readOnly: true,
						},
						{
							placeholder: UNIT_PARAM,
							canCopy: false,
							dropdown: true,
							options: unitsTree,
							value: groupItem?.Unit_ID || '',
							isTree: true,
							readOnly: true,
						},
						{
							placeholder: METHOD_PARAM,
							canCopy: false,
							dropdown: true,
							options: methods,
							value: groupItem?.FK_Methods || '',
							readOnly: true,
						},
						{
							placeholder: EWORK_NUMBER_PARAM,
							canCopy: false,
							dropdown: false,
							value: (groupItem?.Number_EWork as number) || '',
							readOnly: true,
						},
						{
							placeholder: STORAGE_TYPE_PARAM,
							canCopy: false,
							dropdown: true,
							options: storageTypes,
							value: groupItem ? groupItem.FK_TypesStorage : '',
							readOnly: true,
						},
					],
				});
			}

			return resultParams;
		}

		// Включение неподключенных каналов в группу
		if (isCreating && operationType === INCLUDE_UNUSED_CHANNELS_TO_GROUP) {
			resultParams.push({
				header: CHANNEL_TO_GROUP_PARAMETERS,
				sortParams: [
					{
						placeholder: COEFFICIENT,
						canCopy: true,
						dropdown: false,
						value: '',
					},
				],
			});
			// Отображение выбранных каналов
			if (paramChannelItem) {
				const channelItems = parameterItems
					.filter((el) => el.parameterType === CHANNEL)
					.map((item) => item.parameterId)
					.sort(compareNumbers);
				resultParams.push({
					header: CHANNElS_LIST_PARAMETER,
					sortParams: [
						{
							placeholder: '',
							canCopy: false,
							dropdown: false,
							value: '',
							listItems: channelItems,
							withUnderLine: true,
						},
					],
				});
			}

			// Отображение выбранных групп
			if (paramGroupItem) {
				const groupItem = groupsList.find(
					(el) => el.Number === paramGroupItem.parameterId,
				);
				resultParams.push({
					header: GROUP_PARAMETERS,
					sortParams: [
						{
							placeholder: NAME_PARAM,
							canCopy: true,
							dropdown: false,
							value: groupItem?.Name || '',
							readOnly: true,
						},
						{
							placeholder: NUMBER_PARAM,
							canCopy: true,
							dropdown: false,
							value: groupItem?.Number || '',
							readOnly: true,
						},
						{
							placeholder: UNIT_PARAM,
							canCopy: false,
							dropdown: true,
							options: unitsTree,
							value: groupItem?.Unit_ID || '',
							isTree: true,
							readOnly: true,
						},
						{
							placeholder: METHOD_PARAM,
							canCopy: false,
							dropdown: true,
							options: methods,
							value: groupItem?.FK_Methods || '',
							readOnly: true,
						},
						{
							placeholder: EWORK_NUMBER_PARAM,
							canCopy: false,
							dropdown: false,
							value: (groupItem?.Number_EWork as number) || '',
							readOnly: true,
						},
						{
							placeholder: STORAGE_TYPE_PARAM,
							canCopy: false,
							dropdown: true,
							options: storageTypes,
							value: groupItem ? groupItem.FK_TypesStorage : '',
							readOnly: true,
						},
					],
				});
			}

			return resultParams;
		}

		// Создание группы из каналов
		if (isCreating && operationType === CREATE_GROUPS_FROM_CHANNELS) {
			dispatch(setVacantEntityTypeActive(VacantEntityType.Group));
			// Отображение выбранных каналов
			if (paramChannelItem) {
				const channelItems = parameterItems
					.filter((el) => el.parameterType === CHANNEL)
					.map((item) => item.parameterId)
					.sort(compareNumbers);
				resultParams.push({
					header:
						channelItems.length === 1
							? CREATE_GROUP_FROM_CHANNEL_PARAMETERS
							: CREATE_GROUPS_FROM_CHANNELS_PARAMETERS,
					sortParams: [
						{
							value: '',
							canCopy: false,
							dropdown: false,
							listItems: channelItems ? channelItems : [1],
							withUnderLine: true,
						},
						{
							placeholder: NAME_PREFIX_GROUP_PARAM,
							canCopy: true,
							dropdown: false,
							value: '',
						},
						{
							placeholder: NUMBER_START_GROUP_PARAM,
							canCopy: true,
							dropdown: false,
							value: channelItems.length === 1 ? channelItems[0] : '',
							title: canSeeGroupRangeTooltip ? groupNumberTooltip : undefined,
						},
					],
				});
			} else {
				dispatch(setIsCreating(false));
				dispatch(setParameterItems([]));
			}

			return resultParams;
		}

		// Создание группы из каналов
		if (isCreating && operationType === CREATE_GROUP_FROM_CHANNELS) {
			dispatch(setVacantEntityTypeActive(VacantEntityType.Group));
			// Отображение выбранных каналов
			if (paramChannelItem) {
				const channelItems = parameterItems
					.filter((el) => el.parameterType === CHANNEL)
					.map((item) => item.parameterId)
					.sort(compareNumbers);
				resultParams.push({
					header: CREATE_GROUP_FROM_CHANNELS_PARAMETERS,
					sortParams: [
						{
							placeholder: '',
							canCopy: false,
							dropdown: false,
							value: '',
							listItems: channelItems,
							withUnderLine: true,
						},
						{
							placeholder: NAME_PARAM,
							canCopy: true,
							dropdown: false,
							value: '',
						},
						{
							placeholder: NUMBER_GROUP_PARAM,
							canCopy: true,
							dropdown: false,
							value: channelItems[0],
							title: canSeeGroupRangeTooltip ? groupNumberTooltip : undefined,
						},
					],
				});
			} else {
				dispatch(setIsCreating(false));
				dispatch(setParameterItems([]));
			}

			return resultParams;
		}

		// Редактирование канала/каналов
		if (isCreating && operationType === UPDATE_CHANNEL) {
			// Параметры для редактирования
			if (paramChannelItem) {
				const channelItems = parameterItems
					.filter((el) => el.parameterType === CHANNEL)
					.map((item) => item.parameterId)
					.sort(compareNumbers);
				let channelItem = channelsList.find(
					(el) => el.Number === paramChannelItem.parameterId,
				);
				if (channelItem === undefined) {
					channelItem = unusedChannelsList.find(
						(el) => el.Number === paramChannelItem.parameterId,
					);
				}

				const isMultipleUpdate = channelItems.length > 1;
				if (isMultipleUpdate) {
					resultParams.push({
						header: UPDATE_CHANNELS_PARAMETERS,
						sortParams: [
							{
								value: '',
								canCopy: false,
								dropdown: false,
								listItems: channelItems,
								withUnderLine: false,
							},
						],
					});
					resultParams.push({
						header: CHANNELS_PARAMETERS,
						sortParams: [
							{
								placeholder: UNIT_PARAM,
								canCopy: false,
								dropdown: true,
								value: channelItem?.Unit_ID || '',
								options: unitsTree,
								isTree: true,
							},
							{
								placeholder: METHOD_PARAM,
								canCopy: false,
								dropdown: true,
								value: channelItem?.FK_Methods || '',
								options: methods,
							},
							{
								placeholder: STORAGE_TYPE_PARAM,
								canCopy: false,
								dropdown: true,
								value: channelItem ? channelItem.FK_TypeStorage : '',
								options: storageTypes,
							},
						],
					});
				} else
					resultParams.push({
						header: UPDATE_CHANNEL_PARAMETERS,
						sortParams: [
							{
								placeholder: NAME_PARAM,
								canCopy: true,
								dropdown: false,
								value: channelItem?.Name || '',
							},
							{
								placeholder: NUMBER_PARAM,
								canCopy: true,
								dropdown: false,
								value: channelItem?.Number || '',
								readOnly: true,
							},
							{
								placeholder: UNIT_PARAM,
								canCopy: false,
								dropdown: true,
								value: channelItem?.Unit_ID || '',
								options: unitsTree,
								isTree: true,
							},
							{
								placeholder: METHOD_PARAM,
								canCopy: false,
								dropdown: true,
								value: channelItem?.FK_Methods || '',
								options: methods,
							},
							{
								placeholder: STORAGE_TYPE_PARAM,
								canCopy: false,
								dropdown: true,
								value: channelItem ? channelItem.FK_TypeStorage : '',
								options: storageTypes,
							},
						],
					});
			}

			return resultParams;
		}

		// Редактирование неподключенного канала/каналов
		if (isCreating && operationType === UPDATE_UNUSED_CHANNEL) {
			// Параметры редактирования
			if (paramChannelItem) {
				let channelItem = unusedChannelsList.find(
					(el) => el.Number === paramChannelItem.parameterId,
				);
				if (channelItem === undefined) {
					channelItem = channelsList.find(
						(el) => el.Number === paramChannelItem.parameterId,
					);
				}
				const channelItems = parameterItems
					.filter((el) => el.parameterType === CHANNEL)
					.map((item) => item.parameterId)
					.sort(compareNumbers);

				const isMultipleUpdate = channelItems.length > 1;
				if (isMultipleUpdate) {
					resultParams.push({
						header: UPDATE_CHANNELS_PARAMETERS,
						sortParams: [
							{
								value: '',
								canCopy: false,
								dropdown: false,
								listItems: channelItems,
								withUnderLine: false,
							},
						],
					});
					resultParams.push({
						header: CHANNELS_PARAMETERS,
						sortParams: [
							{
								placeholder: UNIT_PARAM,
								canCopy: false,
								dropdown: true,
								value: channelItem?.Unit_ID || '',
								options: unitsTree,
								isTree: true,
							},
							{
								placeholder: METHOD_PARAM,
								canCopy: false,
								dropdown: true,
								value: channelItem?.FK_Methods || '',
								options: methods,
							},
							{
								placeholder: STORAGE_TYPE_PARAM,
								canCopy: false,
								dropdown: true,
								value: channelItem ? channelItem.FK_TypeStorage : '',
								options: storageTypes,
							},
						],
					});
				} else {
					resultParams.push({
						header: UPDATE_CHANNEL_PARAMETERS,
						sortParams: [
							{
								placeholder: NAME_PARAM,
								canCopy: true,
								dropdown: false,
								value: channelItem?.Name || '',
							},
							{
								placeholder: NUMBER_PARAM,
								canCopy: true,
								dropdown: false,
								value: channelItem?.Number || '',
							},
							{
								placeholder: UNIT_PARAM,
								canCopy: false,
								dropdown: true,
								value: channelItem?.Unit_ID || '',
								options: unitsTree,
								isTree: true,
							},
							{
								placeholder: METHOD_PARAM,
								canCopy: false,
								dropdown: true,
								value: channelItem?.FK_Methods || '',
								options: methods,
							},
							{
								placeholder: STORAGE_TYPE_PARAM,
								canCopy: false,
								dropdown: true,
								value: channelItem ? channelItem.FK_TypeStorage : '',
								options: storageTypes,
							},
						],
					});
				}
			}

			return resultParams;
		}

		//Редактирование коэффициента канала в группе
		if (isCreating && operationType === UPDATE_CHANNEL_COEFFICIENT) {
			// Отображение выбранных каналов
			if (paramChannelItem) {
				const channelItem = channelsList.find(
					(el) => el.Number === paramChannelItem.parameterId,
				);
				if (channelItem) {
					const groupNumber = parameterItems.filter(
						(item) => item.parameterType === GROUP,
					)[0].parameterId;

					const groupIndex = channelItem.GroupsList.findIndex(
						(item) => item === groupNumber,
					);
					const coefficient = channelItem.KoefList[groupIndex];
					resultParams.push(
						{
							header: CHANNEL_TO_GROUP_PARAMETERS,
							sortParams: [
								{
									placeholder: COEFFICIENT,
									canCopy: true,
									dropdown: false,
									value: coefficient,
								},
							],
						},
						{
							header: CHANNEL_PARAMETERS,
							sortParams: [
								{
									placeholder: NAME_PARAM,
									canCopy: true,
									dropdown: false,
									value: channelItem?.Name || '',
									readOnly: true,
								},
								{
									placeholder: NUMBER_PARAM,
									canCopy: true,
									dropdown: false,
									value: channelItem?.Number || '',
									readOnly: true,
								},
								{
									placeholder: UNIT_PARAM,
									canCopy: false,
									dropdown: true,
									value: channelItem?.Unit_ID || '',
									options: unitsTree,
									isTree: true,
									readOnly: true,
								},
								{
									placeholder: METHOD_PARAM,
									canCopy: false,
									dropdown: true,
									value: channelItem?.FK_Methods || '',
									options: methods,
									readOnly: true,
								},
								{
									placeholder: STORAGE_TYPE_PARAM,
									canCopy: false,
									dropdown: true,
									value: channelItem ? channelItem.FK_TypeStorage : '',
									options: storageTypes,
									readOnly: true,
								},
							],
						},
					);
				}
			}

			return resultParams;
		}

		// Дефолтное отображение выбранных групп
		if (paramGroupItem) {
			dispatch(setVacantEntityTypeActive(VacantEntityType.Group));
			const groupItem = groupsList.find(
				(el) => el.Number === paramGroupItem.parameterId,
			);
			resultParams.push({
				header: GROUP_PARAMETERS,
				sortParams: [
					{
						placeholder: NAME_PARAM,
						canCopy: true,
						dropdown: false,
						value: groupItem?.Name || '',
						readOnly: true,
					},
					{
						placeholder: NUMBER_PARAM,
						canCopy: true,
						dropdown: false,
						value: groupItem?.Number || '',
						readOnly: true,
					},
					{
						placeholder: UNIT_PARAM,
						canCopy: false,
						dropdown: true,
						options: unitsTree,
						value: groupItem?.Unit_ID || '',
						isTree: true,
						readOnly: true,
					},
					{
						placeholder: METHOD_PARAM,
						canCopy: false,
						dropdown: true,
						options: methods,
						value: groupItem?.FK_Methods || '',
						readOnly: true,
					},
					{
						placeholder: EWORK_NUMBER_PARAM,
						canCopy: false,
						dropdown: false,
						value: (groupItem?.Number_EWork as number) || '',
						readOnly: true,
					},
					{
						placeholder: STORAGE_TYPE_PARAM,
						canCopy: false,
						dropdown: true,
						options: storageTypes,
						value: groupItem ? groupItem.FK_TypesStorage : '',
						readOnly: true,
					},
				],
			});
		}

		// Дефолтное отображение выбранных приборов
		if (paramDeviceItem) {
			dispatch(setVacantEntityTypeActive(VacantEntityType.Device));
			const deviceItem = devicesList.find(
				(el) => el.Number === paramDeviceItem.parameterId,
			);
			resultParams.push({
				header: DEVICE_PARAMETERS,
				sortParams: [
					{
						placeholder: NAME_PARAM,
						canCopy: true,
						dropdown: false,
						value: deviceItem?.Name || '',
						readOnly: true,
					},
					{
						placeholder: NUMBER_PARAM,
						canCopy: true,
						dropdown: false,
						value: deviceItem?.Number || '',
						readOnly: true,
					},
					{
						placeholder: DEVICE_INFO_PARAM,
						canCopy: false,
						dropdown: false,
						value: deviceItem?.Comment || '',
						readOnly: true,
					},
				],
			});
		}

		// Дефолтное отображение выбранных каналов
		if (paramChannelItem) {
			dispatch(setVacantEntityTypeActive(VacantEntityType.Channel));
			const channelItem = channelsList.find(
				(el) => el.Number === paramChannelItem.parameterId,
			);
			if (channelItem) {
				resultParams.push({
					header: CHANNEL_PARAMETERS,
					sortParams: [
						{
							placeholder: NAME_PARAM,
							canCopy: true,
							dropdown: false,
							value: channelItem?.Name || '',
							readOnly: true,
						},
						{
							placeholder: NUMBER_PARAM,
							canCopy: true,
							dropdown: false,
							value: channelItem?.Number || '',
							readOnly: true,
						},
						{
							placeholder: UNIT_PARAM,
							canCopy: false,
							dropdown: true,
							value: channelItem?.Unit_ID || '',
							options: unitsTree,
							isTree: true,
							readOnly: true,
						},
						{
							placeholder: METHOD_PARAM,
							canCopy: false,
							dropdown: true,
							value: channelItem?.FK_Methods || '',
							options: methods,
							readOnly: true,
						},
						{
							placeholder: STORAGE_TYPE_PARAM,
							canCopy: false,
							dropdown: true,
							value: channelItem ? channelItem.FK_TypeStorage : '',
							options: storageTypes,
							readOnly: true,
						},
					],
				});
			} else {
				// Дефолтное отображение неподключеных каналов
				if (paramChannelItem) {
					dispatch(setVacantEntityTypeActive(VacantEntityType.Channel));
					const channelItem = unusedChannelsList.find(
						(el) => el.Number === paramChannelItem.parameterId,
					);
					resultParams.push({
						header: CHANNEL_PARAMETERS,
						sortParams: [
							{
								placeholder: NAME_PARAM,
								canCopy: true,
								dropdown: false,
								value: channelItem?.Name || '',
								readOnly: true,
							},
							{
								placeholder: NUMBER_PARAM,
								canCopy: true,
								dropdown: false,
								value: channelItem?.Number || '',
								readOnly: true,
							},
							{
								placeholder: UNIT_PARAM,
								canCopy: false,
								dropdown: true,
								value: channelItem?.Unit_ID || '',
								options: unitsTree,
								isTree: true,
								readOnly: true,
							},
							{
								placeholder: METHOD_PARAM,
								canCopy: false,
								dropdown: true,
								value: channelItem?.FK_Methods || '',
								options: methods,
								readOnly: true,
							},
							{
								placeholder: STORAGE_TYPE_PARAM,
								canCopy: false,
								dropdown: true,
								value: channelItem ? channelItem.FK_TypeStorage : '',
								options: storageTypes,
								readOnly: true,
							},
						],
					});
				}
			}
		}

		return resultParams;
	}, [
		groupsList,
		channelsList,
		devicesList,
		parameterItems,
		isCreating,
		methods,
		storageTypes,
		operationType,
		unusedChannelsList,
		groupNumberTooltip,
	]);

	useEffect(() => {
		dispatch(setParametersData(paramsData));
	}, [paramsData, dispatch]);

	return { parametersData, setParamsItemValue, isCreating };
}
