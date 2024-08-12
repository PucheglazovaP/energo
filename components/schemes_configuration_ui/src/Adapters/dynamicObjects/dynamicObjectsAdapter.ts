// import { InformationBannersProps } from '../../Containers/InformationAboutBanners/types';

import { DynamicObjectsInfo } from '../../Containers/InformationAboutDynamicObjects/types';

export default function dynamicObjectsAdapter(data: any) {
	return data.map((item: any) => ({
		codeObject: item.КодОбъекта,
		numberGroupData: item.НомерГруппыДанных,
		eWork: item.НомерEWorkГруппыДанных,
		groupData: item.ГруппаДанных,
		nameObject: item.НазваниеОбъекта,
	}));
}
export function tableDataExcelAdapter(data: DynamicObjectsInfo[]) {
	return data.map((item) => ({
		nameObject: item.nameObject,
		numberGroupData: item.numberGroupData != null ? item.numberGroupData : '',
		groupData: item.groupData,
		eWork: item.eWork != null ? item.eWork : '',
	}));
}
