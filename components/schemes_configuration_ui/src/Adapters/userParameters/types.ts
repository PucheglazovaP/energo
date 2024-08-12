export interface RequestedUserParameter {
	КодПараметра: number;
	НазваниеПараметра: string;
	КодТипаДанныхПараметра: number;
	ТипДанныхПараметра: string;
	Комментарий: string;
	LastModified_ДинамическогоПараметра: string;
	КодЗначенияПараметра: number | null;
	ЗначениеПараметра: string | null;
	LastModified_ЗначенияПараметра: string | null;
}

export interface RequestedUserParameterOption {
	КодВозможногоЗначения: number;
	Значение: string;
	LastModified: string;
}

export interface RequestedUserPrameterFilesListItem {
	Код: number;
	Наименование: string;
	ДатаЗагрузки: string;
}

export interface RequestedUserPrameterFile {
	BASE64_FILE: string;
}

export interface RequestedAllObjectsValue {
	RowsUpdated: number;
}

export interface RequestedUserParameterValue {
	RowsUpdated: number;
	КодЗначения: number;
	LastModified: string;
	КодФайла: number | null;
}

export interface RequestedUserParameterDataType {
	Код: number;
	ТипДанных: string;
}

export interface RequestedAddUserParameter {
	RowsUpdated: number;
	КодСозданногоПараметра: number;
	LastModified: string;
}

export interface RequestedAddUserParameterOption {
	RowsUpdated: number;
	КодДобавленногоЗначения: number;
	LastModified: string;
}

export interface RequestedUpdateUserParameter {
	RowsUpdated: number;
	LastModified: string;
}
