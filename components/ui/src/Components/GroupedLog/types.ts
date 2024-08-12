export type LogItem = {
	dateTime: Date;
	message: string;
	groupName: string;
};

export interface GroupedLogProps {
	className?: string;
	style?: Record<string, string>;
	list: LogItem[];
}

export interface LogListProps {
	className?: string;
	style?: Record<string, string>;
	list: LogItem[];
}
