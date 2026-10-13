<?php

namespace RustixDev\ConnectButtons\Support;

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Pterodactyl\Models\Allocation;
use Pterodactyl\Models\Server;

/**
 * Reads the server's domains from the Domains extension when it is installed.
 * Nothing here depends on that extension's code: only its table is read, and
 * when the table is missing the server simply has no domains.
 */
final class ServerDomains
{
    public const string TABLE = 'ext_domains_domains';

    /** DNS states in which the domain points at the server. */
    public const array LIVE = ['active', 'verified'];

    /**
     * The server's working domains, one per allocation id.
     *
     * @return array<int, array{name: string, target: string|null, port: int|null, srv: bool}>
     */
    public static function forServer(Server $server): array
    {
        try {
            if (! Schema::hasTable(self::TABLE)) {
                return [];
            }

            $rows = DB::table(self::TABLE)
                ->where('server_id', $server->id)
                ->whereIn('dns_status', self::LIVE)
                ->orderBy('id')
                ->get(['kind', 'name', 'allocation_id', 'target', 'port', 'srv_service', 'dns_records', 'dns_status', 'dns_error'])
                ->map(fn (object $row) => (array) $row)
                ->all();
        } catch (\Throwable) {
            return [];
        }

        return self::byAllocation($rows, $server->allocation_id);
    }

    /**
     * Picks one domain per allocation. A domain without an allocation belongs to the
     * primary one. When an allocation has several, one with a working SRV record wins,
     * then the oldest.
     *
     * @param list<array<string, mixed>> $rows
     *
     * @return array<int, array{name: string, target: string|null, port: int|null, srv: bool}>
     */
    public static function byAllocation(array $rows, ?int $primaryAllocationId): array
    {
        $domains = [];
        foreach ($rows as $row) {
            if (! in_array($row['dns_status'] ?? null, self::LIVE, true) || ! is_string($row['name'] ?? null) || $row['name'] === '') {
                continue;
            }

            $allocation = isset($row['allocation_id']) ? (int) $row['allocation_id'] : $primaryAllocationId;
            if ($allocation === null) {
                continue;
            }

            $domain = [
                'name' => $row['name'],
                'target' => is_string($row['target'] ?? null) && $row['target'] !== '' ? $row['target'] : null,
                'port' => isset($row['port']) ? (int) $row['port'] : null,
                'srv' => self::hasSrv($row),
            ];
            if (! isset($domains[$allocation]) || ($domain['srv'] && ! $domains[$allocation]['srv'])) {
                $domains[$allocation] = $domain;
            }
        }

        return $domains;
    }

    /**
     * Whether players can join with the name alone: the domain has an SRV service
     * and the record is in place. Subdomains keep the provider's record id; own
     * domains report a missing SRV record in their DNS check.
     *
     * @param array<string, mixed> $row
     */
    public static function hasSrv(array $row): bool
    {
        if (empty($row['srv_service']) || ! isset($row['port'])) {
            return false;
        }

        if (($row['kind'] ?? 'subdomain') === 'own') {
            return $row['dns_status'] === 'verified' && ! str_contains((string) ($row['dns_error'] ?? ''), 'SRV record');
        }

        $records = is_string($row['dns_records'] ?? null) ? json_decode($row['dns_records'], true) : ($row['dns_records'] ?? null);

        return is_array($records) && isset($records['srv']);
    }

    /** The address players use for an allocation: its IP alias, else its IP. */
    public static function ip(Allocation $allocation): string
    {
        return $allocation->ip_alias ?: $allocation->ip;
    }

    /**
     * The host to show for an allocation: its own domain, else the primary
     * allocation's domain when the domain points at this allocation's address too
     * (such as RCON next to the game port), else its IP.
     *
     * @param array<int, array{name: string, target: string|null, port: int|null, srv: bool}> $domains
     */
    public static function hostFor(Allocation $allocation, ?Allocation $primary, array $domains): string
    {
        if (isset($domains[$allocation->id])) {
            return $domains[$allocation->id]['name'];
        }

        $domain = $primary !== null ? ($domains[$primary->id] ?? null) : null;
        if ($domain !== null && self::ip($allocation) === ($domain['target'] ?? self::ip($primary))) {
            return $domain['name'];
        }

        return self::ip($allocation);
    }
}
