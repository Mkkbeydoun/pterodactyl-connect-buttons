<?php

namespace RustixDev\ConnectButtons\Support;

/**
 * How players join each kind of game. "auto" picks one from the egg's name.
 */
final class ConnectPresets
{
    public const array TYPES = ['auto', 'steam', 'minecraft', 'fivem', 'teamspeak', 'mumble', 'copy', 'custom', 'none'];

    /** Schemes a custom template may produce. */
    public const array SCHEMES = ['http', 'https', 'steam', 'fivem', 'ts3server', 'mumble'];

    private const array DETECT = [
        'minecraft' => ['minecraft', 'paper', 'spigot', 'bukkit', 'purpur', 'forge', 'fabric', 'sponge', 'bungeecord', 'velocity', 'waterfall', 'neoforge', 'quilt'],
        'fivem' => ['fivem'],
        'teamspeak' => ['teamspeak', 'ts3'],
        'mumble' => ['mumble'],
        'steam' => ['rust', 'garry', 'gmod', 'counter-strike', 'cs2', 'csgo', 'team fortress', 'tf2', 'insurgency', 'left 4 dead', 'l4d', 'source engine', 'ark:', 'ark survival', 'day of defeat', 'half-life'],
    ];

    public static function detect(string $eggName): string
    {
        $name = strtolower($eggName);

        foreach (self::DETECT as $type => $needles) {
            foreach ($needles as $needle) {
                if (str_contains($name, $needle)) {
                    return $type;
                }
            }
        }

        return 'copy';
    }

    /**
     * The join URL for a type, or null when players can only copy the address.
     * Without the port (a domain with an SRV record) the game looks the port up itself;
     * a custom template still gets {port}.
     */
    public static function url(string $type, string $host, int $port, ?string $template, bool $withPort = true): ?string
    {
        $suffix = $withPort ? ":{$port}" : '';
        $url = match ($type) {
            'steam' => "steam://connect/{$host}{$suffix}",
            'fivem' => "fivem://connect/{$host}{$suffix}",
            'teamspeak' => $withPort ? "ts3server://{$host}?port={$port}" : "ts3server://{$host}",
            'mumble' => "mumble://{$host}{$suffix}",
            'custom' => $template === null ? null : strtr($template, ['{ip}' => rawurlencode($host), '{port}' => (string) $port]),
            default => null,
        };

        return $url !== null && self::hasAllowedScheme($url) ? $url : null;
    }

    /** What players paste into the game. Minecraft leaves off its default port, and an SRV record any port. */
    public static function address(string $type, string $host, int $port, bool $withPort = true): string
    {
        return ! $withPort || ($type === 'minecraft' && $port === 25565) ? $host : "{$host}:{$port}";
    }

    public static function hasAllowedScheme(string $url): bool
    {
        return in_array(strtolower((string) parse_url($url, PHP_URL_SCHEME)), self::SCHEMES, true);
    }
}
