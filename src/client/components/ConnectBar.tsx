import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Check, Copy, Gamepad2 } from 'lucide-react';
import { Button, toast, type SdkServer as Server } from '@pterodactyl/sdk';
import { connectQuery } from '../api';

const LABEL = 'rxcb:inline-flex rxcb:items-center rxcb:gap-2';

/** The core primary Button's look, for the Join link (a real link, so it can be copied or opened elsewhere). */
const PRIMARY_LINK =
    'rxcb:relative rxcb:inline-block rxcb:rounded-sm rxcb:border rxcb:px-4 rxcb:py-2 rxcb:text-sm rxcb:uppercase rxcb:tracking-wide rxcb:no-underline rxcb:transition-colors rxcb:duration-150 rxcb:border-primary rxcb:bg-primary rxcb:text-primary-foreground rxcb:[&:hover]:border-primary rxcb:[&:hover]:bg-primary/80 rxcb:[&:active]:border-primary/70 rxcb:[&:active]:bg-primary/70';

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
        <div className='rxcb:mt-0 rxcb:mb-3 rxcb:flex rxcb:flex-wrap rxcb:items-center rxcb:gap-2'>
            {data.url && (
                <a href={data.url} className={PRIMARY_LINK}>
                    <span className={LABEL}>
                        <Gamepad2 size={16} aria-hidden='true' />
                        Join server
                    </span>
                </a>
            )}
            {data.address && (
                <Button
                    isSecondary
                    className='rxcb:max-w-full'
                    onClick={() => void copy()}
                    aria-label={copied ? 'Copied' : `Copy address ${data.address}`}
                >
                    <span className={LABEL}>
                        {copied ? <Check size={16} aria-hidden='true' /> : <Copy size={16} aria-hidden='true' />}
                        <span className='rxcb:font-mono rxcb:break-all rxcb:normal-case rxcb:tracking-normal'>{data.address}</span>
                    </span>
                </Button>
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
