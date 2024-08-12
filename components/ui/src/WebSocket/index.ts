import { RxStomp, RxStompRPC } from '@stomp/rx-stomp';

const apiUser = window.appConfig.RABBIT_USER;
const apiPass = window.appConfig.RABBIT_PASS;

export const rpcEndPoint = window.appConfig.RABBIT_WS_CHANNEL_NAME;

function createWSConnection(): { rxStomp: RxStomp; rxStompRPC: RxStompRPC } {
	const stompConfig = {
		connectHeaders: {
			login: apiUser,
			passcode: apiPass,
		},
		brokerURL: window.appConfig.RABBIT_WS_URL,
		reconnectDelay: 200,
	};
	const rxStomp = new RxStomp();

	// RPC Client
	const rxStompRPC = new RxStompRPC(rxStomp);

	rxStomp.configure(stompConfig);

	// Attempt to connect
	rxStomp.activate();
	if (!rxStomp.connected) {
		alert("Broker disconnected, can't send message.");
	}
	return { rxStomp, rxStompRPC };
}
export default createWSConnection;
