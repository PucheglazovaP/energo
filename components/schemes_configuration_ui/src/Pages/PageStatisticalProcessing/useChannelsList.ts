import { useCallback, useEffect } from 'react';
import { useStore } from 'effector-react';

import {
	$channelOptions,
	$channelsList,
	$selectedChannel,
} from '../../Models/ChannelsList';
import { fetchChannelsListFx } from '../../Models/ChannelsList/effects';
import { changeChannelOptions } from '../../Models/ChannelsList/events';
import { ChannelsList, SelectedChannel } from '../../Models/ChannelsList/types';
import { SelectOption } from '../../UI/Select/types';

function useChannelsList() {
	const channelsList: ChannelsList[] = useStore($channelsList);
	const channelOptions: SelectOption[] = useStore($channelOptions);
	const selectedChannel: SelectedChannel = useStore($selectedChannel);

	// изменение выбранного канала приборов
	const onChangeChannelOptions = useCallback(
		(channelOptions: SelectOption[]) => {
			changeChannelOptions(channelOptions);
		},
		[],
	);

	useEffect(() => {
		if (channelsList.length === 0) fetchChannelsListFx();
	}, [channelsList]);

	return {
		channelsList,
		channelOptions,
		onChangeChannelOptions,
		selectedChannel,
	};
}

export default useChannelsList;
