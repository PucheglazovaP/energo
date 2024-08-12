import { ReactNode } from 'react';

import { Permissions } from '../../packages/KeycloakInstance/types';

export type AuthenticatedProps = {
	allowed: Permissions;
	children: ReactNode;
};
