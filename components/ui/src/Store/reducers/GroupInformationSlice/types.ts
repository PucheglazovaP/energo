import { Tree } from '../../../Components/Tree/types';

/* global Stringified */
export interface Form {
	id: string;
	type: string;
	name: string;
	isCollapsed: boolean;
	isSelected: boolean;
	groups: Group[];
}

export interface Group {
	id: number;
	name: string | null;
	type: string;
}

export interface System {
	value: number;
	label: string;
	isSelected: boolean;
}

export interface Version {
	value: number;
	label: string;
	createdDate: string;
	lastModifiedDate: string;
	isActualVersion: boolean;
	isWorkableVersion: boolean;
	comment: string | null;
	parentNumber: number | null;
	isSelected: boolean;
}

export interface SystemResponse {
	КодСистемы: number;
	НазваниеСистемы: string;
	SelectByDefault: number; // 0 or 1
}

export interface VersionResponse {
	Код: number;
	Номер: number;
	ДатаСоздания: string;
	ДатаПоследнегоИзменения: string;
	АктуальнаяВерсия: boolean;
	РаботоспособнаяВерсия: boolean;
	Комментарий: string | null;
	НомерРодительскойВерсии: number | null;
}

export interface GroupResponse {
	КодОбъекта: number;
	НазваниеОбъекта: string | null;
	НазваниеТипаОбъекта: string;
}

export interface FormResponse {
	КодФормы: number;
	НазваниеТипаФормы: string;
	НазваниеФормы: string;
	ObjectsList: Stringified<GroupResponse[]>;
}

export interface MnemoschemeResponse {
	КодФормы: number;
	КодРодительскойФормы: number | null;
	НомерТипаФормы: number;
	НазваниеФормы: string;
	level: number;
}

export interface Mnemoscheme extends Tree {
	isSelected: boolean;
	number: number;
}

export interface FormsParams {
	groupId: number;
	versionId: number;
}

export interface MnemoschemesParams {
	groupId: number;
	versionId: number;
}
