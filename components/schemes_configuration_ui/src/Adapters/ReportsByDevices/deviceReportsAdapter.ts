import {
	DeviceReport,
	DeviceReportResponse,
} from '../../Models/DeviceReports/types';
import { BackendResponse } from '../../Shared/types';
import { getNumber, getString } from '../../Utils/guards';

export function getDeviceReportsAdapter(response: string): DeviceReport[] {
	const { Response }: BackendResponse = JSON.parse(response);
	const data = Response.Tables[0].Rows as DeviceReportResponse[];
	const deviceReports: DeviceReport[] = data.map((param) => ({
		deviceType: getNumber(param.КодТипаПрибора, 'КодТипаПрибора'),
		reportUrl: getString(param.UrlОтчета, 'UrlОтчета'),
		// заменяем пробел на '_' в итоговой строке, если он там есть
		report: getString(param.Наименование, 'Наименование').replace(' ', '_'),
		reportDescription: getString(param.Описание, 'Описание'),
		reportType: getNumber(param.ReportVid, 'ReportVid'),
	}));

	return deviceReports;
}
