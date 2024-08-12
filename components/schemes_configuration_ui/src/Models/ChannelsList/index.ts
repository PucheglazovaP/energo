import { createStore, sample } from 'effector';

import { SelectOption } from '../../UI/Select/types';

import { fetchChannelsListFx } from './effects';
import {
	changeChannelOptions,
	setChannelOptions,
	setChannelsList,
	setSelectedChannel,
} from './events';
import { ChannelsList, SelectedChannel } from './types';

export const DEFAULT_CHANNEL_NUMBER: number = 23373;
export const DEFAULT_CHANNEL_LABEL: string =
	'Прибор 4372. ТСП33. Тепловая мощность подача';

export const $channelsList = createStore<ChannelsList[]>([]);

export const $channelOptions = createStore<SelectOption[]>([]);

export const $selectedChannel = createStore<SelectedChannel>({
	name: DEFAULT_CHANNEL_LABEL,
	value: DEFAULT_CHANNEL_NUMBER,
});

$channelsList.on(setChannelsList, (_state, data) => data);

$channelOptions
	.on(setChannelOptions, (_state, data) => data)
	.on(changeChannelOptions, (_state, data) => data);

$selectedChannel.on(setSelectedChannel, (_state, data) => data);

sample({
	clock: fetchChannelsListFx.doneData,
	target: setChannelsList,
});

sample({
	clock: setChannelsList,
	fn: (channelsList) => {
		const channelOptions: SelectOption[] = channelsList.map((channel) => ({
			value: channel.channelNumber,
			label: `Прибор ${channel.deviceNumber}. ${channel.channelName}`,
			isSelected: channel.channelNumber === DEFAULT_CHANNEL_NUMBER,
		}));

		return channelOptions;
	},
	target: setChannelOptions,
});

sample({
	clock: [setChannelOptions, changeChannelOptions],
	fn: (channelOptions) => {
		const channelNumber: number =
			Number(channelOptions.find((item) => item.isSelected)?.value) ||
			DEFAULT_CHANNEL_NUMBER;

		const channelLabel: string =
			channelOptions.find((item) => item.isSelected)?.label ||
			DEFAULT_CHANNEL_LABEL;

		return {
			name: channelLabel,
			value: channelNumber,
		};
	},
	target: setSelectedChannel,
});
