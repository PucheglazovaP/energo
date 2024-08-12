import { BackendResponse } from '../Shared/types';

function getFilteredDevicesListAdapter(response: string): string {
	const { Response }: BackendResponse = JSON.parse(response);
	const data = Response.Tables[0].Rows as { FilterStr: string | null }[];

	return data[0].FilterStr || '';
}

export default getFilteredDevicesListAdapter;
