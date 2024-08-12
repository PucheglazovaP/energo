export enum SortedColumnName {
	ShortName = 'shortName',
	Name = 'name',
	ChannelNumber = 'channelNumber',
	DeviceNumber = 'deviceNumber',
	Coefficient = 'coefficient',
}

export type SortedColumnsOrder = Record<SortedColumnName, number>;
