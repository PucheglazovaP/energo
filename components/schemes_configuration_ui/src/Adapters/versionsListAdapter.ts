import { VersionsListResponse } from '../Shared/types';

export default function versionsListAdapter(result: string) {
	const data: VersionsListResponse[] =
		JSON.parse(result).Response.Tables[0].Rows;
	return data
		.filter((item) => item.АктуальнаяВерсия)
		.map((item) => ({
			code: item.КодВерсии,
			name: item.НазваниеСистемы,
			systemCode: item.КодСистемы,
		}));
}
