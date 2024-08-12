import {
	AnalyticGroups,
	AnalyticGroupsResponse,
	GroupRangeResponse,
} from './types';

/**
 * Converts response data to the data compatible with store
 * Used for analytic groups
 */
export function convertAnalyticGroups(response: AnalyticGroupsResponse[]) {
	const result: AnalyticGroups[] = response.map((item) => {
		const responseRanges: GroupRangeResponse[] = JSON.parse(item.ranges);
		const ranges = responseRanges.map((range) => {
			return {
				rangeId: range.rangeId,
				rangeStart: range.ID_Group_Start,
				rangeEnd: range.ID_Group_End,
				lastModified: range.LastModified,
			};
		});
		return {
			analyticId: item.ACC_UID,
			name: item.ACC_NAME,
			job: item.ACC_POST,
			ranges: ranges,
			isCollapsed: false,
		};
	});
	return result;
}
