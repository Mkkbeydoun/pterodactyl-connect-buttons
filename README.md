# Connect Buttons

One-click Join and Copy address buttons on every server's console page, set up automatically for Minecraft, Rust, Source games, FiveM, TeamSpeak and Mumble.

## Features

- **Join server button** on the console page that opens the game straight onto the server: `steam://connect` for Rust, Garry's Mod, Counter-Strike and other Source games, `fivem://connect` for FiveM, `ts3server://` for TeamSpeak and `mumble://` for Mumble.
- **Copy address button** for every game. Minecraft addresses leave off the default `:25565`.
- **Other ports listed with their notes**, such as "RCON: 1.2.3.4:28016". The notes are the ones you already set on the server's **Network** page, so there is nothing new to fill in.
- **Works out the game by itself** from the egg's name. To change it, open **Admin → Eggs → (egg)** and pick a join method under **Connect Buttons**: Steam, Minecraft, FiveM, TeamSpeak, Mumble, copy only, hidden, or your own link with `{ip}` and `{port}` (http, https, steam, fivem, ts3server and mumble links only).
- **Works with the [Domains](https://github.com/Rustix-Development/pterodactyl-domains) extension.** When the server's main allocation has a working domain, Join and Copy use it instead of the IP: just the name when the domain has an SRV record for the game, otherwise `domain:port`. Other ports on the same IP, such as RCON, show the domain too. Without Domains, or without a domain, the allocation's IP alias (or IP) is used.
- **Matches the console.** Join and Copy look exactly like the panel's own buttons (Join stays a normal link), and the row lines up with Announcements, Custom Links and Next Wipe above the console.

## API

| Method | Path | Who |
|---|---|---|
| GET | `/api/client/servers/{server}/extensions/connect-buttons/connect` | Anyone who can see the server |

The egg setting is saved through the normal egg update (`PUT /api/admin/eggs/{egg}`) under `extensions.connect-buttons` with `type` and `template`.

## Requirements

- Pterodactyl Panel 2.0 (2.0-develop or later)
- PHP 8.3+

## Install

1. Download `connect-buttons-<version>.pteroext` from the [latest release](https://github.com/Rustix-Development/pterodactyl-connect-buttons/releases/latest).
2. In the panel, open **Admin → Extensions**, upload the file and enable it.
3. Reload the panel.

From a terminal instead:

```sh
php artisan p:extension:install /path/to/connect-buttons-<version>.pteroext --enable
```

## Build from source

```sh
npm install
npm run typecheck
npm test
npm run build
php artisan p:extension:doctor /path/to/connect-buttons
php artisan p:extension:pack /path/to/connect-buttons
```

## Uninstall

Remove it under **Admin → Extensions**, or from a terminal:

```sh
php artisan p:extension:remove connect-buttons
```

## License

MIT. See [LICENSE](LICENSE).

This is a community extension and is not affiliated with or endorsed by Pterodactyl.
