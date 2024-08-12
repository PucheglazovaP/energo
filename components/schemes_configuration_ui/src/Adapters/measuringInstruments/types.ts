export interface RequestedMeasuringInstrument {
	EQUNR: string;
	EQART: string;
	ВидИзмерений: string;
	EQKTX: string;
	TYPBZ: string;
	SERGE: string;
	BAUJJ: string;
	Z_DATSL: string | null;
	Z_DATSLP: string | null;
	STAT_P: string;
	ПользовательскийСтатус: string | null;
	НомерПрибора: string | null;
	НомерКанала: string | null;
	ЕОСоотнесена: boolean;
	RowNumber: number;
	КлассТочности: string | null;
	Местонахождение: string | null;
}

export interface RequestedMeasuringInstrumentsType {
	Код: string;
	Название: string;
}

export interface RequestedMeasuringInstrumentsUserStatus {
	Код: string;
	ПорядковыйНомер: number;
	Статус: string;
	Описание: string;
}

export interface GetDeviceByEquipmentNumberResponse {
	ID_Device: number;
	КодУзлаУчета: number;
}
