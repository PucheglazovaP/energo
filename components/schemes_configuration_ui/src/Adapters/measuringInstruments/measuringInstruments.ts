import { format } from 'date-fns';

import {
	GetDeviceByEquipmentNumberData,
	NSIMeasuringInstrument,
	NSIMeasuringInstrumentsType,
	NSIMeasuringInstrumentsUserStatus,
} from '../../Models/NSIMeasuringInstruments/types';
import {
	BackendResponse,
	NSIMeasuringInstrumentsResponse,
} from '../../Shared/types';

import {
	GetDeviceByEquipmentNumberResponse,
	RequestedMeasuringInstrument,
	RequestedMeasuringInstrumentsType,
	RequestedMeasuringInstrumentsUserStatus,
} from './types';

export function measuringInstrumentsAdapter(
	response: string,
): NSIMeasuringInstrumentsResponse {
	const { Response: parsedResponse }: BackendResponse = JSON.parse(response);
	const requestedMeasuringInstrumentsList: RequestedMeasuringInstrument[] =
		parsedResponse.Tables[0].Rows as RequestedMeasuringInstrument[];
	const {
		['@FirstRow']: firstRow,
		['@PageNumber']: pageNumber,
		['@PageTotalCount']: pageTotalCount,
		['@SelectRow']: selectedRow,
	} = parsedResponse.OutParameters[0];

	const measuringInstrumentsList: NSIMeasuringInstrument[] =
		requestedMeasuringInstrumentsList.map((requestedMeasuringInstrument) => ({
			equipmentNumber: requestedMeasuringInstrument.EQUNR,
			measurementTypeCode: requestedMeasuringInstrument.EQART,
			measurementType: requestedMeasuringInstrument.ВидИзмерений,
			equipmentShortName: requestedMeasuringInstrument.EQKTX,
			manufacturerTypeName:
				requestedMeasuringInstrument.TYPBZ !== ''
					? requestedMeasuringInstrument.TYPBZ
					: '-',
			factoryNumber:
				requestedMeasuringInstrument.SERGE !== ''
					? requestedMeasuringInstrument.SERGE
					: '-',
			productionYear:
				requestedMeasuringInstrument.BAUJJ !== ''
					? format(new Date(requestedMeasuringInstrument.BAUJJ), 'dd.MM.yyyy')
					: '-',
			calibrationDate:
				requestedMeasuringInstrument.Z_DATSL !== null
					? format(new Date(requestedMeasuringInstrument.Z_DATSL), 'dd.MM.yyyy')
					: '-',
			verificationDate:
				requestedMeasuringInstrument.Z_DATSLP !== null
					? format(
							new Date(requestedMeasuringInstrument.Z_DATSLP),
							'dd.MM.yyyy',
					  )
					: '-',
			userStatusCode:
				requestedMeasuringInstrument.STAT_P !== ''
					? requestedMeasuringInstrument.STAT_P
					: '-',
			userStatus: requestedMeasuringInstrument.ПользовательскийСтатус ?? '-',
			rowNumber: requestedMeasuringInstrument.RowNumber,
			precisionClass: requestedMeasuringInstrument.КлассТочности ?? '-',
			deviceNumber: requestedMeasuringInstrument.НомерПрибора ?? '-',
			channelNumber: requestedMeasuringInstrument.НомерКанала ?? '-',
			linkedToUnit: requestedMeasuringInstrument.ЕОСоотнесена,
			location: requestedMeasuringInstrument.Местонахождение ?? '-',
			checked: false,
		}));

	return {
		instruments: measuringInstrumentsList,
		pagination: {
			firstRow: firstRow ? Number(firstRow) : null,
			pageNumber: pageNumber ? Number(pageNumber) : null,
			pageTotalCount: pageTotalCount ? Number(pageTotalCount) : null,
			selectedRow: selectedRow ? Number(selectedRow) : null,
		},
	};
}

export function measuringInstrumentTypesAdapter(
	response: string,
): NSIMeasuringInstrumentsType[] {
	const requestedMeasuringInstrumentTypes: RequestedMeasuringInstrumentsType[] =
		JSON.parse(response).Response.Tables[0].Rows;

	const measuringInstrumentTypes: NSIMeasuringInstrumentsType[] =
		requestedMeasuringInstrumentTypes.map(
			(requestedMeasuringInstrumentsType) => ({
				typeId: requestedMeasuringInstrumentsType.Код,
				typeName: requestedMeasuringInstrumentsType.Название,
			}),
		);

	return measuringInstrumentTypes;
}

export function measuringInstrumentUserStatusesAdapter(
	response: string,
): NSIMeasuringInstrumentsUserStatus[] {
	const requestedMeasuringInstrumentUserStatuses: RequestedMeasuringInstrumentsUserStatus[] =
		JSON.parse(response).Response.Tables[0].Rows;

	const measuringInstrumentUserStatuses: NSIMeasuringInstrumentsUserStatus[] =
		requestedMeasuringInstrumentUserStatuses.map(
			(requestedMeasuringInstrumentUserStatus) => ({
				statusId: requestedMeasuringInstrumentUserStatus.Код,
				statusSequenceNumber:
					requestedMeasuringInstrumentUserStatus.ПорядковыйНомер,
				statusName: requestedMeasuringInstrumentUserStatus.Статус,
				statusDescription: requestedMeasuringInstrumentUserStatus.Описание,
			}),
		);

	return measuringInstrumentUserStatuses;
}

export function getDeviceByEquipmentNumberAdapter(
	response: string,
): GetDeviceByEquipmentNumberData {
	const parsedResponse: GetDeviceByEquipmentNumberResponse =
		JSON.parse(response).Response.Tables[0].Rows[0];

	return {
		deviceId: parsedResponse.ID_Device,
		nodeId: parsedResponse.КодУзлаУчета,
	};
}
