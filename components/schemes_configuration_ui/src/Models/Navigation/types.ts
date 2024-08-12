import { FormTypes, TreeTypes } from '../../Shared/types';

export type NavigationModel = {
	versionId?: number;
	formId?: number;
	treeType: TreeTypes;
	activeFormType: FormTypes;
	activeFormName: string;
	deviceId?: number;
	serverId?: number;
	channelId?: number;
	nodeId?: number;
	nodeItemId?: number;
	diagnosticId?: number;
	controlParameterId?: number;
};
