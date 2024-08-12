import { LogItem } from './types';

export function getGroupsList(logList: LogItem[]): string[] {
	return [...new Set<string>(logList.map(({ groupName }) => groupName))];
}

export function getListOfGroup(
	filteredGroupName: string,
	logList: LogItem[] = [],
): LogItem[] {
	return logList.filter(({ groupName }) => groupName === filteredGroupName);
}
