import usePermissions from '../../packages/KeycloakInstance/usePermissions';

import { AuthenticatedProps } from './types';

function Authenticated(props: AuthenticatedProps) {
	const { allowed, children } = props;
	const userPermissions = usePermissions();

	if (userPermissions.indexOf(allowed) === -1) {
		return <span>Нет прав на просмотр данной страницы</span>;
	}

	return <>{children}</>;
}

export default Authenticated;
