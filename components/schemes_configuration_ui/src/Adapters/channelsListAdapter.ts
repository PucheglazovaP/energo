import {
	ChannelsList,
	ChannelsListResponse,
} from '../Models/ChannelsList/types';
import { BackendResponse } from '../Shared/types';

export function channelsListAdapter(response: string): ChannelsList[] {
	const { Response }: BackendResponse = JSON.parse(response);
	const data = Response.Tables[0].Rows as ChannelsListResponse[];
	const channelsList: ChannelsList[] = data.map((channel) => ({
		channelNumber: channel.НомерКанала,
		channelName: channel.НазваниеКанала,
		deviceNumber: channel.НомерПрибора,
		tspDevice: channel.ТСП_МТС_или_более_ранний_прибор,
		name: channel.Наименование,
	}));

	return channelsList;
}
