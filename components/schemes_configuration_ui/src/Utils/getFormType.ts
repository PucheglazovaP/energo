import { FormTypes, TreeTypes } from '../Shared/types';

export function getFormType(treeType: TreeTypes) {
	if (treeType === TreeTypes.Devices) {
		return FormTypes.DeviceChart;
	}
	if (treeType === TreeTypes.Channels) {
		return FormTypes.ChannelChart;
	}
	return FormTypes.Form;
}
