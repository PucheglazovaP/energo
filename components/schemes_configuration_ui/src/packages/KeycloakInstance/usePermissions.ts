import { useMemo } from 'react';
import { useStore } from 'effector-react';

import { $roles } from '../../Models/Auth';
import { Role } from '../../Shared/types';

import {
	administratorPermissions,
	analyticPermissions,
	balancePermissions,
	emergencyEventsEditPermissions,
	emergencyEventsViewPermissions,
	operInformPermissions,
	pageNSIEditPermissions,
	pageNSIViewPermissions,
	reportArchivePermissions,
	reportUgeEditPermissions,
	reportUgeOperPermissions,
	viewerPermissions,
} from './permissions';
import { Permissions } from './types';
import { addPermission } from './utils';

function usePermissions(): Permissions[] {
	const roles: Role[] = useStore($roles);

	return useMemo(() => {
		const resultPermissions: Set<Permissions> = new Set();

		// Добавляем новые кейсы для новых ролей со своей спецификой
		for (let role of roles) {
			switch (role) {
				case Role.EM_ADMIN:
					addPermission(resultPermissions, administratorPermissions);
					break;
				case Role.EM_ANALITIC:
					addPermission(resultPermissions, analyticPermissions);
					break;
				case Role.EM_VIEW:
					addPermission(resultPermissions, viewerPermissions);
					break;
				case Role.EM_REPORT_ARCHIVE:
					addPermission(resultPermissions, reportArchivePermissions);
					break;
				case Role.EM_REPORTUGE_EDIT:
					addPermission(resultPermissions, reportUgeEditPermissions);
					break;
				case Role.EM_REPORTUGE_OPER:
					addPermission(resultPermissions, reportUgeOperPermissions);
					break;
				case Role.EM_EMERGEVENTS_EDIT:
					addPermission(resultPermissions, emergencyEventsEditPermissions);
					break;
				case Role.EM_EMERGEVENTS_CONFIRM:
					addPermission(resultPermissions, emergencyEventsViewPermissions);
					break;
				case Role.EM_BALANCE:
					addPermission(resultPermissions, balancePermissions);
					break;
				case Role.EM_OPERATIONALINFORM:
					addPermission(resultPermissions, operInformPermissions);
					break;
				case Role.EM_NSI_EDIT:
					addPermission(resultPermissions, pageNSIEditPermissions);
					break;
				case Role.EM_NSI_VIEW:
					addPermission(resultPermissions, pageNSIViewPermissions);
					break;
			}
		}

		return Array.from(resultPermissions);
	}, [roles]);
}

export default usePermissions;
