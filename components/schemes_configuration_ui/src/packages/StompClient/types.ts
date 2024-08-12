declare global {
	interface Window {
		RABBIT_HOST: string;
		RABBIT_WS_URL: string;
		RABBIT_PORT: string;
		RABBIT_USER: string;
		RABBIT_PASS: string;
	}
}

export type StompClientOptions = {
	debug?: (messageString: string) => void;
	reconnectDelay?: number;
	heartbeatIncoming?: number;
	heartbeatOutgoing?: number;
};
