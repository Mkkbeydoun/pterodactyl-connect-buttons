import { afterEach, beforeEach, expect, test } from 'vitest';
import { cleanup, render, screen, waitFor } from '@testing-library/react';
import { createExtensionTestHost, createTestServer } from '@pterodactyl/sdk/testing';
import ConnectBar from './components/ConnectBar';
import { connectQuery } from './api';

const server = createTestServer({ uuid: 'f1a1b2c3-0000-4000-8000-000000000004' });
let host: ReturnType<typeof createExtensionTestHost>;

beforeEach(() => {
    host = createExtensionTestHost({ extensionId: 'connect-buttons', prefix: 'rxcb', server });
});

afterEach(() => {
    cleanup();
    host.dispose();
});

const key = connectQuery(server.attributes.uuid).queryKey;

test('a Steam game gets a Join button, the address and its other ports', async () => {
    host.queryClient.setQueryData(key, {
        type: 'steam',
        url: 'steam://connect/203.0.113.10:28015',
        address: '203.0.113.10:28015',
        ports: [
            { address: '203.0.113.10:28015', notes: null, is_default: true },
            { address: '203.0.113.10:28016', notes: 'RCON', is_default: false },
        ],
    });
    render(<ConnectBar data={server} />, { wrapper: host.Wrapper });

    const join = (await screen.findByText('Join server')).closest('a')!;
    expect(join.getAttribute('href')).toBe('steam://connect/203.0.113.10:28015');
    expect(screen.getByText('203.0.113.10:28015')).toBeTruthy();
    expect(screen.getByText(/RCON/)).toBeTruthy();
});

test('Minecraft gets a copy button and no Join link', async () => {
    host.queryClient.setQueryData(key, { type: 'minecraft', url: null, address: 'mc.example.com', ports: [] });
    render(<ConnectBar data={server} />, { wrapper: host.Wrapper });

    expect(await screen.findByText('mc.example.com')).toBeTruthy();
    expect(screen.queryByText('Join server')).toBeNull();
});

test('nothing shows when the egg is set to no buttons', async () => {
    host.queryClient.setQueryData(key, { type: 'none', url: null, address: null, ports: [] });
    const { container } = render(<ConnectBar data={server} />, { wrapper: host.Wrapper });

    await waitFor(() => expect(container.textContent).toBe(''));
});

test('Join is a link styled as the primary button and Copy a secondary core button', async () => {
    host.queryClient.setQueryData(key, {
        type: 'steam',
        url: 'steam://connect/203.0.113.10:28015',
        address: '203.0.113.10:28015',
        ports: [],
    });
    const { container } = render(<ConnectBar data={server} />, { wrapper: host.Wrapper });

    const join = (await screen.findByText('Join server')).closest('a')!;
    const copy = screen.getByRole('button', { name: /Copy address/ });
    expect(join.getAttribute('href')).toBe('steam://connect/203.0.113.10:28015');
    expect(join.className.split(' ')).toEqual(expect.arrayContaining(['rxcb:bg-primary', 'rxcb:px-4', 'rxcb:py-2', 'rxcb:uppercase']));
    expect(copy.className).toContain('bg-transparent');
    expect(copy.className.split(' ')).not.toContain('bg-primary');
    expect((container.firstElementChild as HTMLElement).className).toContain('rxcb:mb-3');
});

test('a domain with an SRV record is shown without the port', async () => {
    host.queryClient.setQueryData(key, {
        type: 'minecraft',
        url: null,
        address: 'mc.example.com',
        domain: 'mc.example.com',
        ports: [{ address: 'mc.example.com:25575', notes: 'RCON', is_default: false }],
    });
    render(<ConnectBar data={server} />, { wrapper: host.Wrapper });

    expect(await screen.findByText('mc.example.com')).toBeTruthy();
    expect(screen.getByText('mc.example.com:25575')).toBeTruthy();
});

test('a domain without an SRV record keeps the port in Join and Copy', async () => {
    host.queryClient.setQueryData(key, {
        type: 'steam',
        url: 'steam://connect/rust.example.com:28015',
        address: 'rust.example.com:28015',
        domain: 'rust.example.com',
        ports: [],
    });
    render(<ConnectBar data={server} />, { wrapper: host.Wrapper });

    expect(await screen.findByText('rust.example.com:28015')).toBeTruthy();
    expect(screen.getByText('Join server').closest('a')!.getAttribute('href')).toBe('steam://connect/rust.example.com:28015');
});
