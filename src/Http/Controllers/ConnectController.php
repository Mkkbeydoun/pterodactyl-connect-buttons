<?php

namespace RustixDev\ConnectButtons\Http\Controllers;

use Illuminate\Http\JsonResponse;
use Pterodactyl\Models\Allocation;
use Pterodactyl\Models\Server;
use Pterodactyl\Services\Extensions\ExtensionSettings;
use RustixDev\ConnectButtons\Support\ConnectPresets;
use RustixDev\ConnectButtons\Support\ServerDomains;

class ConnectController
{
    public function __construct(private readonly ExtensionSettings $settings) {}

    public function show(Server $server): JsonResponse
    {
        $server->loadMissing(['egg', 'allocation', 'allocations']);

        $fields = $server->egg ? $this->settings->fields($server->egg)->all() : [];
        $type = $fields['type'] ?? 'auto';
        if ($type === 'auto' || $type === null) {
            $type = ConnectPresets::detect((string) $server->egg?->name);
        }

        $default = $server->allocation;
        $domains = ServerDomains::forServer($server);
        $domain = $default ? ($domains[$default->id] ?? null) : null;

        $host = $default ? ($domain['name'] ?? ServerDomains::ip($default)) : null;
        // An SRV record for the game's port means players need only the name.
        $withPort = ! ($domain !== null && $domain['srv'] && $domain['port'] === $default?->port);
        $hidden = $type === 'none' || $default === null;

        return new JsonResponse([
            'type' => $type,
            'url' => $hidden ? null : ConnectPresets::url($type, $host, $default->port, $fields['template'] ?? null, $withPort),
            'address' => $hidden ? null : ConnectPresets::address($type, $host, $default->port, $withPort),
            'domain' => $domain['name'] ?? null,
            'ports' => $server->allocations
                ->sortBy(fn (Allocation $a) => [$a->id !== $server->allocation_id, $a->port])
                ->map(fn (Allocation $a) => [
                    'address' => ServerDomains::hostFor($a, $default, $domains).':'.$a->port,
                    'notes' => $a->notes,
                    'is_default' => $a->id === $server->allocation_id,
                ])
                ->values(),
        ]);
    }
}
