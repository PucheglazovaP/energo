import { ReplaceReportUrlValuesProps, ReportUrl } from '../Shared/types';

export function getReportUrl(props: ReportUrl) {
	const { path, toDate, fromDate, id } = props;

	const url = `${path}${fromDate ? `&fromd=${fromDate}` : ''}${
		toDate ? `&tod=${toDate}` : ''
	}${id ? `&id=${id}` : ''}&rs:Embed=true`;

	return String(new URL(url));
}

export function getReplacedReportUrlValues(props: ReplaceReportUrlValuesProps) {
	const { fromDate, toDate, url } = props;
	const dateRegex = /[0-9]{2}.[0-9]{2}.[0-9]{4}/i;
	const dateRegexGlobal = /[0-9]{2}.[0-9]{2}.[0-9]{4}/g;
	const reportUrl = url
		.replace(dateRegexGlobal, String(toDate))
		.replace(dateRegex, String(fromDate));

	return String(new URL(reportUrl));
}
