import { ChangeEvent, useCallback, useEffect, useReducer, useRef } from 'react';
import React, { useMemo, useState } from 'react';
import { format } from 'date-fns';
import { useStore } from 'effector-react';

import EditIcon from '../../Icons/Edit';
import { $emergencyEventsInfo } from '../../Models/EmergencyEvents';
import {
	setEditMode,
	setReportType,
} from '../../Models/EmergencyEvents/events';
import { fetchReportLinkListFx } from '../../Models/Report/effects';
import { Permissions } from '../../packages/KeycloakInstance/types';
import usePermissions from '../../packages/KeycloakInstance/usePermissions';
import { checkPermission } from '../../packages/KeycloakInstance/utils';
import { EmergencyEventsReportTypes } from '../../Shared/types';
import { ReportLinkType } from '../../Shared/Types/report';
import {
	ContextMenuItem,
	ContextMenuPosition,
} from '../../UI/ContextMenu/types';
import { SelectOption } from '../../UI/Select/types';

import {
	DATE_FORMAT,
	EVENT_STATUS_LIST,
	EVENT_TYPE_LIST,
	KVIT_STATUS_LIST,
} from './consts';
import { ReportActions, ReportActionType, ReportForm } from './types';

import styles from './EmergencyEventsReportForm.module.css';

function ReportReducer(state: ReportForm, action: ReportActions) {
	switch (action.type) {
		case ReportActionType.UpdateList:
			return {
				...state,
				[action.listName as keyof ReportForm]: action.payload,
			};
		case ReportActionType.SetFlag:
			return {
				...state,
				[action.flagName]: !state[action.flagName as keyof ReportForm],
			};
		case ReportActionType.UpdateReportLink:
			return {
				...state,
				reportLink: action.payload,
			};
		case ReportActionType.UpdateMinDurationValue:
			return {
				...state,
				minDuration: action.payload,
			};
		case ReportActionType.SetReportPath:
			return {
				...state,
				[action.reportName]: action.payload,
			};
		default:
			return state;
	}
}

export default function useReportFormInfo() {
	const { startDateTime, endDateTime, activeNode, selectedReportType } =
		useStore($emergencyEventsInfo);
	const iframeRef = useRef<HTMLIFrameElement>(null);
	const [position, setPosition] = useState<ContextMenuPosition | null>(null);
	const [report, setReportData] = useReducer(ReportReducer, {
		kvitStatusList: KVIT_STATUS_LIST,
		eventTypeList: EVENT_TYPE_LIST,
		eventStatusList: EVENT_STATUS_LIST,
		reportLink: '',
		minDuration: 5,
		reportPath: '',
		criterionsReportPath: '',
	});
	const permissions = usePermissions();

	const isEditDisabled = !checkPermission(
		permissions,
		Permissions.CanEditEmergencyEvents,
	);

	const handleKvitStatusSelect = (kvitStatusList: SelectOption[]) => {
		setReportData({
			type: ReportActionType.UpdateList,
			payload: kvitStatusList,
			listName: 'kvitStatusList',
		});
	};
	const handleEventStatusSelect = (eventStatusList: SelectOption[]) => {
		setReportData({
			type: ReportActionType.UpdateList,
			payload: eventStatusList,
			listName: 'eventStatusList',
		});
	};
	const handleEventTypeSelect = (eventTypeList: SelectOption[]) => {
		setReportData({
			type: ReportActionType.UpdateList,
			payload: eventTypeList,
			listName: 'eventTypeList',
		});
	};
	const handleMinDurationChange = (e: ChangeEvent<HTMLInputElement>) => {
		setReportData({
			type: ReportActionType.UpdateMinDurationValue,
			payload: Number(e.target.value),
		});
	};
	const hadnleReportTypeSelect = (id: string) => {
		setReportType(id as EmergencyEventsReportTypes);
	};

	const handleContextMenu = (evt: React.MouseEvent<HTMLButtonElement>) => {
		evt.stopPropagation();
		if (!position) setPosition({ x: 0, y: 30 });
		else setPosition(null);
	};

	const contextMenuItems: ContextMenuItem[] = useMemo(
		() => [
			{
				name: 'Редактировать',
				isDisabled: isEditDisabled,
				renderFn: () => (
					<span className={styles.menu_item}>
						<EditIcon className={styles.menu_icon} />
						<span className={styles.menu_name}>Редактировать</span>
					</span>
				),
				onClick: () => {
					setEditMode(true);
				},
			},
		],
		[isEditDisabled],
	);

	const createReportLink = useCallback(() => {
		setReportData({
			type: ReportActionType.UpdateReportLink,
			payload: '',
		});

		const selectedKvitStatusCode =
			report.kvitStatusList.find((item) => item.isSelected)?.value || 0;
		const selectedEventTypeCode =
			report.eventTypeList.find((item) => item.isSelected)?.value || 0;
		const selectedEventStatusCode =
			report.eventStatusList.find((item) => item.isSelected)?.value || 0;
		let link = new URL(report.reportPath);
		if (selectedReportType === EmergencyEventsReportTypes.Events) {
			const searchParams: URLSearchParams = new URLSearchParams({
				fromd: format(startDateTime, DATE_FORMAT),
				tod: format(endDateTime, DATE_FORMAT),
				parent_node_id: String(activeNode || 0),
				min_duration: String(report.minDuration),
				kvit_status: String(selectedKvitStatusCode),
				event_status: String(selectedEventStatusCode),
				event_type: String(selectedEventTypeCode),
			});
			link = new URL(`${report.reportPath}&${searchParams}&rs:Embed=true`);
		} else {
			const searchParams: URLSearchParams = new URLSearchParams({
				parent_node_id: String(activeNode || 0),
			});
			link = new URL(
				`${report.criterionsReportPath}&${searchParams}&rs:Embed=true`,
			);
		}

		setReportData({
			type: ReportActionType.UpdateReportLink,
			payload: link.href,
		});
		const iframe = iframeRef.current;
		if (iframe) {
			iframe.src = link.href;
		}
	}, [
		activeNode,
		startDateTime,
		endDateTime,
		report.kvitStatusList,
		report.eventTypeList,
		report.eventStatusList,
		report.minDuration,
		report.criterionsReportPath,
		report.reportPath,
		selectedReportType,
	]);

	useEffect(() => {
		fetchReportLinkListFx(ReportLinkType.EmergencyEvents).then((url) => {
			const result = decodeURI(url).split('&')[0];
			setReportData({
				type: ReportActionType.SetReportPath,
				payload: result,
				reportName: 'reportPath',
			});
		});
		fetchReportLinkListFx(ReportLinkType.EmergencyEventsCriterions).then(
			(url) => {
				const result = decodeURI(url).split('&')[0];
				setReportData({
					type: ReportActionType.SetReportPath,
					payload: result,
					reportName: 'criterionsReportPath',
				});
			},
		);
	}, []);

	useEffect(() => {
		if (
			activeNode != null &&
			report.reportPath != '' &&
			report.criterionsReportPath
		)
			createReportLink();
	}, [
		activeNode,
		selectedReportType,
		report.reportPath,
		report.criterionsReportPath,
	]);

	return {
		handleKvitStatusSelect,
		handleEventStatusSelect,
		handleEventTypeSelect,
		handleMinDurationChange,
		createReportLink,
		handleContextMenu,
		hadnleReportTypeSelect,
		selectedReportType,
		setPosition,
		setReportData,
		...report,
		activeNode,
		position,
		contextMenuItems,
		iframeRef,
	};
}
