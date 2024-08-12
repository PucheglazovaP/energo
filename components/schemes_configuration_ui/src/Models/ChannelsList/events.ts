import { createEvent } from 'effector';

import { SelectOption } from '../../UI/Select/types';

import { ChannelsList, SelectedChannel } from './types';

export const setChannelsList = createEvent<ChannelsList[]>();

export const setChannelOptions = createEvent<SelectOption[]>();
export const changeChannelOptions = createEvent<SelectOption[]>();

export const setSelectedChannel = createEvent<SelectedChannel>();
