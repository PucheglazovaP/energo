export enum Permissions {
	// Access to pages
	CanAccessMonitoring = 'canAccessMonitoring',
	CanAccessNsi = 'canAccessNsi', // Доступ к НСИ
	CanAccessOperWork = 'canAccessOperWork', // Доступ к оперативной работе
	CanSeeDeviceReports = 'canSeeDeviceReports',
	CanAccessNSIPage = 'canAccessNSIPage', // Доступ к модулю НСИ
	// Tree forms context menu (monitoring)
	CanSeeFormContextMenu = 'canSeeFormContextMenu', // Возможность вызова контекстного меню
	CanCreateNewForm = 'canCreateNewForm', // Создание новой формы
	CanCopyForm = 'canCopyForm', // Копирование формы
	CanPasteForm = 'canPasteForm', // Вставка формы
	CanDeleteForm = 'canDeleteForm', // Удаление формы
	CanPublishForm = 'canPublishForm', // Публикация формы
	CanEditForm = 'canEditForm', // Редактирование формы
	CanMoveForm = 'canMoveForm', //  Перемещение формы
	// Transparant context menu
	CanViewDevicesArchive = 'canViewDevicesArchive', // Просмотр архива приборов
	// Просмотр аварийных событий
	CanViewEmergencyEvents = 'сanViewEmergencyEvents',
	// Редактирование аварийных событий
	CanEditEmergencyEvents = 'сanEditEmergencyEvents',
	CanAccessDevicesStatus = 'canAccessDevicesStatus',
	CanAccessRetrofittingAccountingNodes = 'canAccessRetrofittingAccountingNodes',
	CanAccessStatisticalProcessing = 'canAccessStatisticalProcessing',
	CanAccessElectricPower = 'canAccessElectricPower',
	CanAccessNaturalGas = 'canAccessNaturalGas',
	// Редактирование данных в модуле НСИ
	CanEditNSIPage = 'canEditNSIPage',
}
