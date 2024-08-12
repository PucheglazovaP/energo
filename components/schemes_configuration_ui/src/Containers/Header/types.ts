export interface HeaderProps {
	className?: string;
}

export enum Report {
	ByDevices = 'Отчеты по показаниям приборов',
	NSI = 'Конфигурирование',
	Technical = 'Оперативная работа',
}

export enum Balance {
	DevicesStatus = 'Статус приборов',
	RetrofittingAccountingNodes = 'Дооснащение узлами учёта',
	StatisticalProcessing = 'Статистическая обработка',
}

export enum OperInform {
	ElectricPower = 'Электроэнергия',
	NaturalGas = 'Природный газ',
}
