export type ChannelsList = {
	channelNumber: number;
	channelName: string;
	deviceNumber: number;
	tspDevice: string;
	name: string;
};

export type ChannelsListResponse = {
	НомерКанала: number;
	НазваниеКанала: string;
	НомерПрибора: number;
	ТСП_МТС_или_более_ранний_прибор: string;
	Наименование: string;
};

export type SelectedChannel = {
	name: string;
	value: number;
};
