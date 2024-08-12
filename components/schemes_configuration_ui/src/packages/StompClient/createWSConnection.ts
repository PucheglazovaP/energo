import { RxStomp, RxStompRPC } from '@stomp/rx-stomp';

export const rpcEndPoint = window.appConfig.RABBIT_WS_CHANNEL_NAME;

function createWSConnection(): { rxStomp: RxStomp; rxStompRPC: RxStompRPC } {
	const stompConfig = {
		connectHeaders: {
			login: window.appConfig.RABBIT_USER,
			passcode: window.appConfig.RABBIT_PASS,
		},
		brokerURL: window.appConfig.RABBIT_WS_URL,
		reconnectDelay: 200,
	};
	const rxStomp = new RxStomp();

	const rxStompRPC = new RxStompRPC(rxStomp);

	rxStomp.configure(stompConfig);

	rxStomp.activate();
	if (!rxStomp.connected) {
		alert("Broker disconnected, can't send message.");
	}
	return { rxStomp, rxStompRPC };
}
export default createWSConnection;
