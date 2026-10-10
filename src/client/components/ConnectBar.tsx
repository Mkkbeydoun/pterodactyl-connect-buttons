import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Check, Copy, Gamepad2 } from 'lucide-react';
import { toast, type SdkServer as Server } from '@pterodactyl/sdk';
import { connectQuery } from '../api';

const BUTTON =
    'rxcb:inline-flex rxcb:min-h-9 rxcb:items-center rxcb:gap-2 rxcb:rounded-md rxcb:px-3 rxcb:py-1.5 rxcb:text-sm rxcb:font-medium rxcb:no-underline rxcb:transition-colors rxcb:focus-visible:outline-2 rxcb:focus-visible:outline-ring';

/** Join and Copy address buttons above the console, with the server's other ports and their notes. */
export default function ConnectBar({ data: server }: { data: Server }) {
    const uuid = server.attributes.uuid;
    const { data } = useQuery({ ...connectQuery(uuid), enabled: Boolean(uuid) });
    const [copied, setCopied] = useState(false);

    if (!data || (!data.url && !data.address)) return null;

    const copy = async () => {
        if (!data.address) return;
        try {
            await navigator.clipboard.writeText(data.address);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch {
            toast.error('Could not copy. Select the address and copy it yourself.');
        }
    };

    const others = data.ports.filter((port) => !port.is_default);

    return (
        <div className='rxcb:mb-4 rxcb:flex rxcb:flex-wrap rxcb:items-center rxcb:gap-2'>
            {data.url && (
                <a href={data.url} className={`${BUTTON} rxcb:bg-primary rxcb:text-primary-foreground rxcb:hover:opacity-90`}>
                    <Gamepad2 size={16} aria-hidden='true' />
                    Join server
                </a>
            )}
            {data.address && (
                <button
                    type='button'
                    onClick={() => void copy()}
                    className={`${BUTTON} rxcb:border rxcb:border-border rxcb:bg-card rxcb:text-card-foreground rxcb:hover:bg-accent rxcb:hover:text-accent-foreground`}
                >
                    {copied ? <Check size={16} aria-hidden='true' /> : <Copy size={16} aria-hidden='true' />}
                    <span className='rxcb:font-mono'>{data.address}</span>
                    <span className='rxcb:sr-only'>{copied ? 'Copied' : 'Copy address'}</span>
                </button>
            )}
            {others.length > 0 && (
                <ul className='rxcb:m-0 rxcb:flex rxcb:list-none rxcb:flex-wrap rxcb:gap-x-4 rxcb:gap-y-1 rxcb:p-0 rxcb:text-sm rxcb:text-muted-foreground'>
                    {others.map((port) => (
                        <li key={port.address}>
                            {port.notes ? `${port.notes}: ` : ''}
                            <span className='rxcb:font-mono'>{port.address}</span>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
