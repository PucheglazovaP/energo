export function getSetPicturesDynamicObject(
	codeForm: number | null,
	codeObject: number,
	nameParameter: string,
) {
	return {
		Sql: '[Редактор].[dbo].Get_ЗначенияTStringsПараметра',
		CommandType: 'StoredProcedure',
		Parameters: [
			{
				Name: '@КодФормы',
				DbType: 'int',
				Value: codeForm,
				Direction: 'Input',
			},
			{
				Name: '@КодОбъектаФормы',
				DbType: 'int',
				Value: codeObject,
				Direction: 'Input',
			},
			{
				Name: '@НазваниеПараметра',
				DbType: 'String',
				Value: nameParameter,
				Direction: 'Input',
			},
		],
	};
}
