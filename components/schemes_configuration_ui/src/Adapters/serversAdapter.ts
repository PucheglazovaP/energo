import { Server } from '../Models/Servers/types';
import { ServerResponse } from '../Shared/types';

function serversListAdapter(response: string): Server[] {
	const data: ServerResponse[] = JSON.parse(response).Response.Tables[0].Rows;
	const serversList: Server[] = data.map((server) => ({
		id: server.ID,
		domenName: server.FQDN,
		name: server.TextName,
		ip: server.IP,
		comment: server.Comment,
		hasDevices: server.HaveDevices,
		hasGroups: server.HaveGroups,
		hasUnconnChannels: server.HaveUnConnCh,
		lastModified: server.LastModified,
		userId: server.User_ID,
		isOpen: false,
	}));
	return serversList;
}

export default serversListAdapter;
