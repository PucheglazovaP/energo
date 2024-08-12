import {
	Form,
	FormResponse,
	Mnemoscheme,
	MnemoschemeResponse,
	System,
	SystemResponse,
	Version,
	VersionResponse,
} from './types';

export const convertSystems = (systems: SystemResponse[]): System[] => {
	const result: System[] = systems.map((system) => ({
		value: system['КодСистемы'],
		label: system['НазваниеСистемы'],
		isSelected: Boolean(system['SelectByDefault']),
	}));
	return result;
};

export const convertVersions = (versions: VersionResponse[]): Version[] => {
	const result: Version[] = versions.map((version) => ({
		value: version['Код'], // id
		label: version['Номер'].toString(), // number
		parentNumber: version['НомерРодительскойВерсии'],
		comment: version['Комментарий'],
		createdDate: version['ДатаСоздания'],
		lastModifiedDate: version['ДатаПоследнегоИзменения'],
		isActualVersion: version['АктуальнаяВерсия'],
		isWorkableVersion: version['РаботоспособнаяВерсия'],
		isSelected: false,
	}));
	return result;
};

export const convertForms = (forms: FormResponse[]): Form[] => {
	const result: Form[] = forms.map((form) => ({
		id: form.КодФормы.toString(),
		name: form.НазваниеФормы,
		type: form.НазваниеТипаФормы,
		isCollapsed: false,
		isSelected: false,
		groups: JSON.parse(form.ObjectsList).map((group) => ({
			id: group.КодОбъекта,
			name: group.НазваниеОбъекта,
			type: group.НазваниеТипаОбъекта,
		})),
	}));
	return result;
};

export const convertMnemoschemes = (
	mnemoschemes: MnemoschemeResponse[],
): Mnemoscheme[] => {
	const result: Mnemoscheme[] = mnemoschemes.map((mnemoscheme) => ({
		id: mnemoscheme.КодФормы.toString(),
		parentId: mnemoscheme.КодРодительскойФормы
			? mnemoscheme.КодРодительскойФормы.toString()
			: null,
		number: mnemoscheme.НомерТипаФормы,
		name: mnemoscheme.НазваниеФормы,
		isExpanded: false,
		isSelected: false,
		children: [],
	}));

	return result;
};
