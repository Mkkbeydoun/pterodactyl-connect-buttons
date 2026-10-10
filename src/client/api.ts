import { queryOptions } from '@tanstack/react-query';
import { http } from '@pterodactyl/sdk';

export interface Port {
    address: string;
    notes: string | null;
    is_default: boolean;
}

export interface Connect {
    type: string;
    url: string | null;
    address: string | null;
    ports: Port[];
}

export const connectQuery = (uuid: string) =>
    queryOptions({
        queryKey: ['connect-buttons', uuid],
        queryFn: async () =>
            (await http.get<Connect>(`/api/client/servers/${uuid}/extensions/connect-buttons/connect`)).data,
        staleTime: 5 * 60_000,
    });

export const JOIN_TYPES = [
    { value: 'auto', label: 'Work it out from the egg name' },
    { value: 'steam', label: 'Steam (steam://connect)' },
    { value: 'minecraft', label: 'Minecraft (copy address)' },
    { value: 'fivem', label: 'FiveM (fivem://connect)' },
    { value: 'teamspeak', label: 'TeamSpeak 3' },
    { value: 'mumble', label: 'Mumble' },
    { value: 'copy', label: 'Copy address only' },
    { value: 'custom', label: 'Custom link' },
    { value: 'none', label: 'No buttons' },
];
