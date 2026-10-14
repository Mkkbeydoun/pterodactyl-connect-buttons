One-click Join and Copy address buttons on every server's console page, set up automatically for Minecraft, Rust, Source games, FiveM, TeamSpeak and Mumble.

## Install

Download `connect-buttons-${VERSION}.pteroext` below, then upload it under **Admin → Extensions** and enable it. From a terminal instead:

```sh
php artisan p:extension:install /path/to/connect-buttons-${VERSION}.pteroext --enable
```

### What's new in ${VERSION}

- Join and Copy show the server's domain from the Domains extension when it has one, without the port when an SRV record covers the game.
- The buttons now look like the panel's own buttons and line up with the other extensions above the console.

Requires Pterodactyl Panel v2.0.0-beta.1 or later and PHP 8.3+. See the README for features and settings.

This is a community extension and is not affiliated with or endorsed by Pterodactyl.
