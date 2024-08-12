import Keycloak from 'keycloak-js';

const keycloakConfig: Keycloak.KeycloakConfig = {
	url: window.appConfig.KEYCLOAK_CONFIG_URL,
	realm: window.appConfig.KEYCLOAK_CONFIG_REALM,
	clientId: window.appConfig.KEYCLOAK_CONFIG_CLIENT_ID,
};

// хак: запись вида new Keycloak() приводит к ошибке
const keycloak: Keycloak.KeycloakInstance = new (Keycloak as any)(
	keycloakConfig,
);

export default keycloak;
