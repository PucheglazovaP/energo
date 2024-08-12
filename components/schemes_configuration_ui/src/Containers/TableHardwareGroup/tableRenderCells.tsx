import { ReactNode, useEffect, useState } from 'react';
import clsx from 'clsx';
import { useStore } from 'effector-react';

import { $activeIds } from '../../Models/ActiveIds';
import { $user } from '../../Models/Auth';
import {
	getDataForDynamicChart,
	setChartIds,
} from '../../Models/DynamicChart/events';
import { $editMode, $selectedObjectsState } from '../../Models/EditMode';
import {
	updateFormParameter,
	updateObjectParameter,
} from '../../Models/EditMode/events';
import { FormParameters } from '../../Models/EditMode/types';
import { $formSettings } from '../../Models/FormSettings';
import { $requestData, $sorting } from '../../Models/HardwareGroup';
import {
	fetchGroupList,
	setFilter,
	setFilterVNEd,
	setRequestData,
} from '../../Models/HardwareGroup/event';
import { closeModal } from '../../Models/Modal/events';
import { $multichartSettings } from '../../Models/MultichartSettings';
import { setGroupNumberInfo } from '../../Models/NewEmergencyEventParameter/events';
import { RegisteredModals } from '../../Shared/modalsConfig';
import { FormTypes } from '../../Shared/types';

import ModalIconArrows from './TableHardwareGroupIcon/HardwareModalIconArrows';
import HardwareModalIconArrowsName from './TableHardwareGroupIcon/HardwareModalIconArrowsName';
import HardwareModalIconArrowsNameUnit from './TableHardwareGroupIcon/HardwareModalIconArrowsNameUnit';
import ModalIconSearch from './TableHardwareGroupIcon/HardwareModalIconSearch';
import { GroupIdProperty, GroupProperty } from './type';

import styles from '../../UI/TablePair/TablePair.module.css';

export function RenderHardwareGroupColumnFilterNumber() {
	const user = useStore($user);
	const requestData = useStore($requestData);

	const [numberSearch, setNumberSearch] = useState('');
	const [orderM, setOrderM] = useState(2);
	useEffect(() => {
		setFilter({ searchValue: numberSearch, searchName: '' });
	}, [numberSearch]);

	const count = (e: number) => {
		setOrderM(e);
	};
	const sortingList = (order: number) => {
		setFilter({ searchValue: '', searchName: '' });
		if (order === orderM && user) {
			count(1);
			fetchGroupList({
				pageNumber: 0,
				pageRowCount: 30,
				filterStr: null,
				fkChannel: null,
				serverId: null,
				filterMode: 0,
				orderMode: 2,
				mode: 0,
				userId: user.preferredUsername,
			});
			setRequestData({
				pageNumber: 0,
				pageRowCount: 30,
				filterStr: null,
				fkChannel: null,
				serverId: null,
				filterMode: 0,
				orderMode: 2,
				mode: 0,
				userId: user.preferredUsername,
			});
		} else {
			count(2);
			requestData.orderMode = 1;
			setRequestData(requestData);
		}
	};

	return (
		<span className={clsx(styles.span)}>
			<div className={clsx(styles.search_input)}>
				<input
					type="text"
					min="0"
					max="999999"
					placeholder="№"
					onChange={(e) => setNumberSearch(e.target.value)}
				/>
				<ModalIconSearch />
			</div>
			<ModalIconArrows sortingList={sortingList} order={orderM} />
		</span>
	);
}

export function RenderHardwareGroupColumnFilterEWork(): ReactNode {
	return (
		<span className={clsx(styles.span)}>
			<div className={clsx(styles.table_selection_search_units)}>№ eWork</div>
		</span>
	);
}
export function RenderHardwareGroupColumnFilterName() {
	const user = useStore($user);
	const sorting = useStore($sorting);
	const requestData = useStore($requestData);
	const [nameSearch, setNameSearch] = useState('');
	const [orderM, setOrderM] = useState(4);

	// TODO поиск с задержкой
	// const handleFormName = useCallback((e: ChangeEvent<HTMLInputElement>) => {
	// 	setNameSearch(e.target.value);
	// }, []);
	// const onFormNameChange = useDebounce(handleFormName, 500);

	useEffect(() => {
		setFilter({ searchValue: '', searchName: nameSearch });
	}, [nameSearch]);

	const count = (e: number) => {
		setOrderM(e);
	};
	const sortingList = (order: number) => {
		setFilter({ searchValue: '', searchName: '' });
		if (order === orderM && user) {
			count(3);
			fetchGroupList({
				pageNumber: 0,
				pageRowCount: 30,
				filterStr: null,
				fkChannel: null,
				serverId: null,
				filterMode: 0,
				orderMode: 4,
				mode: 0,
				userId: user.preferredUsername,
			});
			setRequestData({
				pageNumber: 0,
				pageRowCount: 30,
				filterStr: null,
				fkChannel: null,
				serverId: null,
				filterMode: 0,
				orderMode: 4,
				mode: 0,
				userId: user.preferredUsername,
			});
		} else {
			count(4);
			requestData.orderMode = 3;
			setRequestData(requestData);
		}
	};
	return (
		<span className={clsx(styles.span)}>
			<div className={clsx(styles.search_input_name)}>
				<input
					type="text"
					placeholder="Наименование"
					value={sorting.searchName}
					onChange={(e) => setNameSearch(e.target.value)}
					className={clsx(styles.table_selection_search_name)}
				/>
				<ModalIconSearch />
			</div>
			<HardwareModalIconArrowsName sortingList={sortingList} order={orderM} />
		</span>
	);
}
export function RenderHardwareGroupColumnFilterEd(): ReactNode {
	const user = useStore($user);
	const requestData = useStore($requestData);
	const [orderM, setOrderM] = useState(6);
	const count = (e: number) => {
		setOrderM(e);
	};
	const sortingList = (order: number) => {
		setFilter({ searchValue: '', searchName: '' });
		if (order === orderM && user) {
			count(5);
			fetchGroupList({
				pageNumber: 0,
				pageRowCount: 30,
				filterStr: null,
				fkChannel: null,
				serverId: null,
				filterMode: 0,
				orderMode: 6,
				mode: 0,
				userId: user.preferredUsername,
			});
			setRequestData({
				pageNumber: 0,
				pageRowCount: 30,
				filterStr: null,
				fkChannel: null,
				serverId: null,
				filterMode: 0,
				orderMode: 6,
				mode: 0,
				userId: user.preferredUsername,
			});
		} else {
			count(6);

			requestData.orderMode = 5;
			setRequestData(requestData);
		}
	};
	return (
		<span className={clsx(styles.span)}>
			<div className={clsx(styles.table_selection_search_units)}>Ед. изм.</div>
			<HardwareModalIconArrowsNameUnit
				sortingList={sortingList}
				order={orderM}
			/>
		</span>
	);
}
export function RenderHardwareGroupColumnFilterMethod(): ReactNode {
	return (
		<span className={clsx(styles.span)}>
			<div className={clsx(styles.table_selection_search_units)}>Метод</div>
		</span>
	);
}
export function RenderHardwareGroupColumnFilterChannel(): ReactNode {
	return (
		<span className={clsx(styles.span)}>
			<div className={clsx(styles.table_selection_search_units)}>
				Кол-во каналов
			</div>
		</span>
	);
}
export function RenderHardwareGroupColumnFilterButton(): ReactNode {
	const requestData = useStore($requestData);
	const update = () => {
		setFilterVNEd({
			sortingV: 2,
			sortingN: 4,
			sortingEd: 6,
		});

		setFilter({ searchValue: '', searchName: '' });
		requestData.orderMode = 1;
		setRequestData(requestData);
	};
	return (
		<span className={clsx(styles.span)}>
			<button
				onClick={update}
				className={clsx(styles.table_selection_search_button)}
			>
				Обновить
			</button>
		</span>
	);
}

export const ButtonContainer = (number: number, name: string) => {
	const { objectParameters, editableParameterName, formParameters } =
		useStore($editMode);
	const { selectedObjects, isFormSelected } = useStore($selectedObjectsState);
	const { activeVersion } = useStore($activeIds);
	const { activeId, formType } = useStore($formSettings);
	const { activeId: multichartActiveId } = useStore($multichartSettings);

	const handleObjectUpdate = () => {
		const parameters = objectParameters.get(
			selectedObjects[0]?.id || multichartActiveId || 0,
		);
		let parameterName: string = '';
		let pairedIdName: string | undefined;
		let objectId: number | null = null;
		let parameterValue: string | number = name;
		let pairedParameterValue: string | number | undefined = number;

		if (formType === FormTypes.MultiChart) {
			parameterName = GroupProperty.asqlGroupName;
			pairedIdName = GroupIdProperty.asqlGroupId;
			objectId = multichartActiveId;
		} else {
			if (editableParameterName === 'groupName') {
				parameterName = GroupProperty.csqlGroupName;
				pairedIdName = GroupIdProperty.groupId;
			} else if (editableParameterName === 'groupId') {
				parameterName = GroupIdProperty.groupId;
				pairedIdName = GroupProperty.csqlGroupName;
				parameterValue = number;
				pairedParameterValue = name;
			} else {
				parameterName = editableParameterName;
				parameterValue = number;
				pairedParameterValue = undefined;
			}
			objectId = selectedObjects[0]?.id;
		}
		const groupNameParameter = parameters?.find(
			(item) => item.parameterName === parameterName,
		);

		if (groupNameParameter)
			updateObjectParameter({
				objectId,
				value: parameterValue,
				parameterCode: groupNameParameter.parameterCode,
				parameterName,
				versionCode: activeVersion?.code as number,
				pairedParameterName: pairedIdName,
				pairedParameterValue: pairedParameterValue,
			});
		closeModal(RegisteredModals.SelectGroup);
	};

	const handleFormUpdate = () => {
		const asqlGroupNameParameter: FormParameters | undefined =
			formParameters.find(
				(parameter) => parameter.parameterName === GroupProperty.asqlGroupName,
			);
		if (asqlGroupNameParameter && formType === FormTypes.Chart) {
			updateFormParameter({
				formId: activeId || 0,
				value: name,
				parameterCode: asqlGroupNameParameter.parameterCode,
				parameterName: GroupProperty.asqlGroupName,
				versionCode: activeVersion?.code as number,
				pairedParameterName: GroupIdProperty.asqlGroupId,
				pairedParameterValue: number,
			});
			closeModal(RegisteredModals.SelectGroup);
		}
	};

	const onSelectGroup = isFormSelected ? handleFormUpdate : handleObjectUpdate;

	return (
		<button onClick={onSelectGroup} className={styles.select_button}>
			Выбрать
		</button>
	);
};
export const ControlParameterGroupButtonContainer = (
	number: number,
	name: string,
	unitId: number,
) => {
	const onSelectGroup = () => {
		setGroupNumberInfo({ number, name, unitId });
		closeModal(RegisteredModals.ControlParameterSelectGroup);
	};

	return (
		<button onClick={onSelectGroup} className={styles.select_button}>
			Выбрать
		</button>
	);
};
export const DynamicChartGroupButtonContainer = (
	number: number,
	name: string,
) => {
	const onSelectGroup = () => {
		setChartIds({
			isChecked: true,
			groupNumber: number,
			name: name || '',
		});
		getDataForDynamicChart();
		closeModal(RegisteredModals.DynamicChartSelectGroup);
	};

	return (
		<button onClick={onSelectGroup} className={styles.select_button}>
			Выбрать
		</button>
	);
};
