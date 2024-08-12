import { BackendResponse } from '../../Shared/types';

export function reportLinkAdapter(response: string): string {
	const { Response }: BackendResponse = JSON.parse(response);
	const urlResponse = Response.Tables[0]?.Rows as { RepURL: string }[];
	if (urlResponse[0]) return urlResponse[0].RepURL;
	return '';
}
