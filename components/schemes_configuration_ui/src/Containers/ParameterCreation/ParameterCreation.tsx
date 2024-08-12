import React, { useCallback, useEffect } from 'react';
import { Button, Tooltip, TooltipDirection } from '@evraz/ui-kit';
import clsx from 'clsx';
import { useStore } from 'effector-react';

import IconClose from '../../Icons/Close';
import EditIcon from '../../Icons/Edit';
import AddIcon from '../../Icons/Plus';
import IconRefresh from '../../Icons/Refresh';
import { $user } from '../../Models/Auth';
import { $emergencyEventsInfo } from '../../Models/EmergencyEvents';
import { setSearchInfo } from '../../Models/HardwareGroup/event';
import { closeModal, openModal } from '../../Models/Modal/events';
import { $newEmergencyEventParameter } from '../../Models/NewEmergencyEventParameter';
import {
	fetchResponsiblePersonsListFx,
	getEnumValuesFx,
} from '../../Models/NewEmergencyEventParameter/effects';
import {
	addResponsiblePerson,
	changeResponsiblePerson,
	deleteResponsiblePerson,
	resetParameterCreationData,
	saveNewParameter,
	saveParameter,
	setControlGroupNumber,
	setControlParameterFlag,
	setDataTypeList,
	setDynamicObjectGroupNumber,
	setName,
	setNewPosition,
	setSelectGroupType,
} from '../../Models/NewEmergencyEventParameter/events';
import {
	ParameterOperation,
	ParameterPosition,
	ResponsiblePersonOperationStatus,
	ResponsiblePersons,
	SelectGroupType,
} from '../../Models/NewEmergencyEventParameter/types';
import { RegisteredModals } from '../../Shared/modalsConfig';
import Checkbox from '../../UI/Checkbox';
import Input from '../../UI/Input';
import Select from '../../UI/Select';
import { SelectOption, SelectVariant } from '../../UI/Select/types';
import Table from '../../UI/Table';
import { ITableBody, ITableColumn } from '../../UI/Table/types';

import RadioGroupSection from './RadioGroupSection';

import styles from './ParameterCreation.module.css';

function ParameterCreation() {
	const {
		positions,
		name,
		itHasControlParameter,
		dynamicObjectGroupNumber,
		dataTypeList,
		controlGroupNumber,
		selectedPersonsList,
		operation,
		id,
	} = useStore($newEmergencyEventParameter);

	const { tree } = useStore($emergencyEventsInfo);

	const selectedTreeInfo = tree.find((item) => item.id === id);

	const user = useStore($user);

	const acceptablePositions = positions.map((item) => {
		if (item.value === String(ParameterPosition.CHILD))
			return {
				...item,
				disabled:
					selectedTreeInfo?.controlGroupNumber != null ||
					selectedTreeInfo?.dynamicObjectGroupNumber != null,
			};
		return item;
	});

	const headers: ITableColumn[] = [
		{
			accessor: 'parameter',
			sortOrder: 0,
			text: 'Параметр',
			minWidth: 150,
			width: 150,
		},
		{
			accessor: 'dataType',
			sortOrder: 0,
			text: 'Вид данных',
			minWidth: 130,
			width: 130,
		},
		{
			accessor: 'groupNumber',
			sortOrder: 0,
			text: 'Номер',
		},
		{
			accessor: 'editParameter',
			sortOrder: 0,
			text: '',
		},
		{
			accessor: 'resetParameterGroup',
			sortOrder: 0,
			text: '',
		},
	];
	const configList = [
		{
			label: 'Группа контроля',
			isSelectColumnEnable: true,
			id: controlGroupNumber,
			selectGroupType: SelectGroupType.ControlGroupNumber,
			dataType: 1,
		},
		{
			label: 'Группа динам. объекта',
			isSelectColumnEnable: false,
			id: dynamicObjectGroupNumber,
			selectGroupType: SelectGroupType.DynamicObjectGroupNumber,
			dataType: null,
		},
	];
	const tableData: ITableBody[] = configList.map((item) => ({
		dataLine: [
			{
				accessor: 'parameter',
				text: item.label,
			},
			{
				accessor: 'dataType',
				text: '',
				renderCell: () =>
					item.isSelectColumnEnable ? (
						<Select
							options={dataTypeList}
							onSelect={handleSelectDataType}
							className={clsx(
								styles.selector,
								styles.accounting_node_parameter,
							)}
							label={''}
							disabled={!itHasControlParameter && controlGroupNumber == null}
						/>
					) : (
						<></>
					),
			},
			{
				accessor: 'groupNumber',
				text: item.id || 'Нет',
			},
			{
				accessor: 'editParameter',
				text: '',
				renderCell: () => (
					<Tooltip
						tooltip="Редактировать"
						forceDirection={TooltipDirection.Down}
						className={styles.tooltip}
					>
						<button
							key={id}
							disabled={!itHasControlParameter}
							className={clsx(styles.param_condition)}
							onClick={() => {
								setSearchInfo({
									value: item.id ? String(item.id) : '',
									filterMode: 1,
								});
								setSelectGroupType(item.selectGroupType);
								openModal(RegisteredModals.ControlParameterSelectGroup);
							}}
						>
							<EditIcon className={styles.menu_icon} />
						</button>
					</Tooltip>
				),
			},
			{
				accessor: 'resetParameterGroup',
				text: '',
				renderCell: () => (
					<Tooltip
						tooltip="Сбросить"
						forceDirection={TooltipDirection.Up}
						className={styles.tooltip}
					>
						<button
							key={id}
							disabled={!itHasControlParameter}
							onClick={() => handleResetGroup(item.selectGroupType)}
							className={clsx(styles.param_condition)}
						>
							<IconRefresh className={styles.icon} />
						</button>
					</Tooltip>
				),
			},
		],
	}));

	const handleNameChange = useCallback(
		(evt: React.ChangeEvent<HTMLInputElement>) => {
			setName(evt.target.value);
		},
		[],
	);
	const handleClose = () => {
		closeModal(RegisteredModals.EditParameter);
		resetParameterCreationData();
	};
	const handleSelectDataType = (options: SelectOption[]) => {
		setDataTypeList(options);
	};

	const handleAccept = () => {
		switch (operation) {
			case ParameterOperation.New:
				saveNewParameter(user?.preferredUsername || '');
				break;
			case ParameterOperation.Edit:
				saveParameter(user?.preferredUsername || '');
				break;
			default:
				saveNewParameter(user?.preferredUsername || '');
				break;
		}
		closeModal(RegisteredModals.EditParameter);
	};

	const handlePositionsChange = useCallback(
		(evt: React.ChangeEvent<HTMLInputElement>) => {
			setNewPosition(evt.target.value);
		},
		[],
	);
	const handleResetGroup = (selectGroupType: SelectGroupType) => {
		switch (selectGroupType) {
			case SelectGroupType.ControlGroupNumber: {
				setControlGroupNumber(null);
				break;
			}
			case SelectGroupType.DynamicObjectGroupNumber: {
				setDynamicObjectGroupNumber(null);
				break;
			}
		}
		setControlGroupNumber(null);
	};

	const handleControlParameterChange = () => {
		setControlParameterFlag(!itHasControlParameter);
	};

	const handleAddResponsiblePerson = () => {
		addResponsiblePerson();
	};
	const handleDeleteResponsiblePerson = (index: number) => {
		deleteResponsiblePerson(index);
	};
	const handleResponsiblePersonSelect = (
		options: ResponsiblePersons[],
		index: number,
	) => {
		changeResponsiblePerson({ options, personNumber: index });
	};

	useEffect(() => {
		getEnumValuesFx();
		fetchResponsiblePersonsListFx();
	}, [id]);
	useEffect(() => {
		getEnumValuesFx();
	}, []);

	return (
		<div className={styles.container}>
			<div className={styles.body}>
				<Input
					label={'Наименование'}
					isRequired
					onChange={handleNameChange}
					value={name}
					className={styles.input}
					error={!name.length ? 'Поле обязательно для заполнения' : undefined}
				/>
				{operation === ParameterOperation.New && (
					<RadioGroupSection
						title={'Расположение'}
						options={acceptablePositions}
						onChange={handlePositionsChange}
					/>
				)}
				<Checkbox
					name={'control-parameter'}
					title="Контролируемый параметр"
					checked={itHasControlParameter}
					onChange={handleControlParameterChange}
					className={styles.checkbox}
					disabled={operation === ParameterOperation.Edit}
				/>
				<Table headers={headers} data={tableData} className={styles.table} />
				<div
					className={clsx(
						styles.responsible_persons_wrapper,
						operation === ParameterOperation.Edit &&
							styles.responsible_persons_wrapper__height,
					)}
				>
					{selectedPersonsList.map(({ items, operationStatus }, index) => {
						if (operationStatus !== ResponsiblePersonOperationStatus.Delete)
							return (
								<div key={`person-${index}`} className={styles.item}>
									<Select
										options={items}
										onSelect={(options: ResponsiblePersons[]) =>
											handleResponsiblePersonSelect(options, index)
										}
										placeholder={'please select'}
										legend={'ФИО ответственного'}
										variant={SelectVariant.Secondary}
										className={styles.select}
									/>
									<Button
										className={styles.close}
										onClick={() => handleDeleteResponsiblePerson(index)}
									>
										<IconClose className={styles.icon_close} />
									</Button>
								</div>
							);
						return <></>;
					})}
				</div>
				<Button
					onClick={handleAddResponsiblePerson}
					className={styles.add_button}
				>
					<AddIcon className={styles.add_icon} />
					Добавить ответственного
				</Button>
			</div>
			<div className={styles.footer}>
				<Button onClick={handleClose}>Отменить</Button>
				<Button primary onClick={handleAccept} disabled={name === ''}>
					Сохранить
				</Button>
			</div>
		</div>
	);
}

export default ParameterCreation;
