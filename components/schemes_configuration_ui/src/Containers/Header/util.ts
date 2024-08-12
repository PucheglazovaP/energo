import { Path } from '../../Shared/types';

import { Report } from './types';

/**
 * Получаем из url-строки путь в компоненте дропдауна при перезагрузке страницы
 * @returns путь в компоненте дропдауна при перезагрузке страницы
 */
export function getPathByPathname(pathname: string): Path {
	if (
		pathname === Path.ReportByPoints ||
		pathname === Path.ReportByParameters ||
		pathname === Path.ReferenceByReports ||
		pathname === Path.ReferenceByForms
	) {
		return Path.ReportByPoints;
	}

	if (pathname !== Path.ReportByDevices && pathname !== Path.ReportsTechnical) {
		return Path.ReportByDevices;
	}

	return pathname as Path;
}

/**
 * Получаем из url-строки название отчета в компоненте дропдауна при перезагрузке страницы
 * @returns название отчета в компоненте дропдауна при перезагрузке страницы
 */
export function getReportLabelByPathname(pathname: string): Report {
	if (
		pathname === Path.ReportByPoints ||
		pathname === Path.ReportByParameters ||
		pathname === Path.ReferenceByReports ||
		pathname === Path.ReferenceByForms
	) {
		return Report.NSI;
	}

	if (pathname === Path.ReportsTechnical) {
		return Report.Technical;
	}

	return Report.ByDevices;
}

export default {};
