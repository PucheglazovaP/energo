import { ChangeEvent, useEffect, useReducer } from 'react';
import { Color } from 'react-color';
import { useStore } from 'effector-react';

import { $user } from '../../../Models/Auth';
import { openModal } from '../../../Models/Modal/events';
import {
	$printFormPriorityInfo,
	$printFormPriorityMethods,
	$selectedPrintFormPosition,
} from '../../../Models/PrintForms';
import { savePrintFormPositionSettingsFx } from '../../../Models/PrintForms/effects';
import { RegisteredModals } from '../../../Shared/modalsConfig';
import {
	PrintFormPosition,
	PrintFormTextAlign,
	PriorityMethod,
} from '../../../Shared/types';
import { ModuleName } from '../../../Shared/Types/moduleName';
import { TOption } from '../../../UI/Dropdown/types';

import { ListInformationItem } from './types';

type PrintFormPositionActions =
	| { type: 'set'; position: PrintFormPosition }
	| {
			type: 'changeName';
			evt: ChangeEvent<HTMLInputElement>;
	  }
	| { type: 'changeNumber'; value: string }
	| {
			type: 'changeAlign';
			value: PrintFormTextAlign;
	  }
	| {
			type: 'changeBoldness';
			value: boolean;
	  }
	| {
			type: 'changeBgColor';
			color: Color;
	  }
	| {
			type: 'changeFontColor';
			color: Color;
	  }
	| { type: 'changePriority'; flag: boolean }
	| {
			type: 'changePriorityMethod';
			value: number;
	  }
	| {
			type: 'partial';
			position: Partial<PrintFormPosition>;
	  };

function positionReducer(
	position: PrintFormPosition,
	action: PrintFormPositionActions,
): PrintFormPosition {
	switch (action.type) {
		case 'set': {
			return action.position;
		}
		case 'changeName': {
			return { ...position, name: action.evt.target.value };
		}
		case 'changeNumber': {
			return { ...position, positionNumber: action.value };
		}
		case 'changeAlign': {
			return {
				...position,
				textAlign: action.value,
			};
		}
		case 'changeBoldness': {
			return {
				...position,
				bold: action.value,
			};
		}
		case 'changeBgColor': {
			return {
				...position,
				bgColor: action.color as string,
			};
		}
		case 'changeFontColor': {
			return {
				...position,
				fontColor: action.color as string,
			};
		}
		case 'changePriority': {
			return {
				...position,
				priority: Number(action.flag),
			};
		}
		case 'changePriorityMethod': {
			return {
				...position,
				priorityMethod: action.value,
				// Clear info based on priority method
				deviceId: null,
				channelId: null,
				methodName: null,
				channelName: null,
				deviceName: null,
			};
		}
		case 'partial': {
			return {
				...position,
				...action.position,
			};
		}
		default:
			return position;
	}
}

function useSettings() {
	const selectedPrintFormPosition = useStore($selectedPrintFormPosition);
	const priorityMethods = useStore($printFormPriorityMethods);
	const priorityInfo = useStore($printFormPriorityInfo);
	const user = useStore($user);

	const [position, dispatch] = useReducer(
		positionReducer,
		selectedPrintFormPosition || ({} as PrintFormPosition),
	);

	const selectedPriorityMethod: PriorityMethod | undefined =
		priorityMethods.find(
			(method) => Number(method.value) == position.priorityMethod,
		);

	const isActionsDisabled =
		JSON.stringify(selectedPrintFormPosition) === JSON.stringify(position);

	const getListInformationItems = (): ListInformationItem[] => {
		const list: ListInformationItem[] = [];
		if (!Object.keys(position).length) {
			return list;
		}
		if (position.deviceName) {
			list.push({
				title: 'Прибор',
				value: position.deviceName,
			});
		}
		if (position.deviceId) {
			list.push({
				title: '№ прибора',
				value: String(position.deviceId),
			});
		}
		if (position.channelName) {
			list.push({
				title: 'Канал',
				value: position.channelName,
			});
		}
		if (position.channelId) {
			list.push({
				title: '№ канала',
				value: String(position.channelId),
			});
		}
		if (position.methodName) {
			list.push({
				title: 'Метод расчета',
				value: String(position.methodName),
			});
		}
		return list;
	};

	const onChangeName = (evt: ChangeEvent<HTMLInputElement>) => {
		dispatch({ type: 'changeName', evt });
	};

	const onChangeNumber = (evt: ChangeEvent<HTMLInputElement>) => {
		const { value } = evt.target;
		dispatch({ type: 'changeNumber', value: value });
	};

	const onChangeAlign = (id: string) => {
		dispatch({
			type: 'changeAlign',
			value: id as unknown as PrintFormTextAlign,
		});
	};

	const onChangeBold = (id: string) => {
		dispatch({ type: 'changeBoldness', value: !!Number(id) });
	};

	const onChangeBackgroundColor = (color: Color) => {
		dispatch({ type: 'changeBgColor', color });
	};

	const onChangeFontColor = (color: Color) => {
		dispatch({
			type: 'changeFontColor',
			color,
		});
	};

	const onChangePriority = () => {
		dispatch({
			type: 'changePriority',
			flag: !position.priority,
		});
	};

	const onChangePriorityMethod = (option: TOption) => {
		dispatch({
			type: 'changePriorityMethod',
			value: Number(option.value),
		});
	};

	const onAddPriority = () => {
		if (!selectedPriorityMethod) {
			return;
		}
		if (selectedPriorityMethod.value === '1') {
			openModal(RegisteredModals.PickPriorityMethodByArchive);
		} else {
			openModal(RegisteredModals.PickPriorityMethodByChannel);
		}
	};

	const onResetPosition = () => {
		if (!selectedPrintFormPosition) {
			return;
		}
		dispatch({ type: 'set', position: selectedPrintFormPosition });
	};

	const onPreview = () => {
		openModal(RegisteredModals.PrintFormReportPreview);
	};

	const onSavePosition = () => {
		savePrintFormPositionSettingsFx({
			id: position.id,
			channelId: position.channelId,
			deviceId: position.deviceId,
			methodId: position.priorityMethod,
			priority: position.priority,
			bgColor: position.bgColor,
			bold: Number(position.bold),
			fontColor: position.fontColor,
			name: position.name,
			number: position.positionNumber
				? position.positionNumber.toString()
				: null,
			textAlign: position.textAlign,
			userId: user?.preferredUsername || '',
			moduleName: ModuleName.UseSettings_savePrintFormPositionSettingsFx,
		});
	};

	useEffect(() => {
		if (!selectedPrintFormPosition) {
			return;
		}
		dispatch({ type: 'set', position: selectedPrintFormPosition });
	}, [selectedPrintFormPosition]);

	// Update priority info on the position when priorityInfo model is changed
	useEffect(() => {
		dispatch({ type: 'partial', position: priorityInfo });
	}, [priorityInfo]);

	return {
		position: Object.keys(position).length ? position : undefined,
		priorityMethods,
		selectedPriorityMethod,
		listInformationItems: getListInformationItems(),
		isActionsDisabled,
		onChangeName,
		onChangeNumber,
		onChangeAlign,
		onChangeBold,
		onChangeBackgroundColor,
		onChangeFontColor,
		onChangePriority,
		onChangePriorityMethod,
		onAddPriority,
		onResetPosition,
		onSavePosition,
		onPreview,
	};
}

export default useSettings;
