<?php

namespace RustixDev\ConnectButtons\Http\Controllers;

use Illuminate\Http\JsonResponse;
use Pterodactyl\Models\Allocation;
use Pterodactyl\Models\Server;
use Pterodactyl\Services\Extensions\ExtensionSettings;
use RustixDev\ConnectButtons\Support\ConnectPresets;

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
        $host = $default ? ($default->ip_alias ?: $default->ip) : null;

        return new JsonResponse([
            'type' => $type,
            'url' => $type === 'none' || $default === null
                ? null
                : ConnectPresets::url($type, $host, $default->port, $fields['template'] ?? null),
            'address' => $type === 'none' || $default === null ? null : ConnectPresets::address($type, $host, $default->port),
            'ports' => $server->allocations
                ->sortBy(fn (Allocation $a) => [$a->id !== $server->allocation_id, $a->port])
                ->map(fn (Allocation $a) => [
                    'address' => ($a->ip_alias ?: $a->ip).':'.$a->port,
                    'notes' => $a->notes,
                    'is_default' => $a->id === $server->allocation_id,
                ])
                ->values(),
        ]);
    }
}
