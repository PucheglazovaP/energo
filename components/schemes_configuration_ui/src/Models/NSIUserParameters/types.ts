export interface NSIUserParameter {
	id: number;
	name: string;
	dataTypeId: number;
	dataType: string;
	comment: string;
	lastModified: string;
	valueId: number | null;
	value: string | null;
	valueLastModified: string | null;
	touched: boolean;
	expanded: boolean;
	deleted: boolean;
}

export interface NSIUserParametersModel {
	viewMode: 'read' | 'edit';
	defaultParameters: 'actual' | 'static';
	staticParametersList: NSIUserParameter[];
	parametersList: NSIUserParameter[];
	allParametersExpanded: boolean;
	selectedListId: number;
}

export interface NSIUserParameterOption {
	valueId: number;
	value: string;
	lastModified: string;
	touched: boolean;
	deleted: boolean;
}

export type NSIUserParameterOptionsModel = Map<
	number,
	{
		staticParameterOptions: NSIUserParameterOption[];
		parameterOptions: NSIUserParameterOption[];
	}
>;

export interface NSIUserParameterFilesListItem
	extends Pick<NSIUserParameter, 'id' | 'name'> {
	uploadDate: string;
	checked: boolean;
}

export interface NSIUserParameterDataType {
	typeId: number;
	typeName: string;
}
