import { Version } from '../VersionSelector/types';

export type ActiveVersionIdsModel = {
	activeVersionId: number | undefined;
	activeVersion: Version | undefined;
	formContextMenuId: number | null;
	formId: number | null;
};

export default {};
