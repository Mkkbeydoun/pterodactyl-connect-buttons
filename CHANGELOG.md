# Changelog

## 1.1.0

- Works with the Domains extension. When the server's main allocation has a working domain, Join and Copy use it instead of the IP. If the domain has an SRV record for the game, the port is left off; otherwise it is shown as domain:port.
- Other ports on the same IP, such as RCON, show the domain too. Ports on another IP keep their IP.
- Without the Domains extension, or without a domain, nothing changes: the IP alias or IP is used as before.
- Join and Copy now look exactly like the panel's own buttons, so their height, corners and font match the rest of the console. Join is the main button and Copy the outlined one. Join is still a normal link, so it can be copied or opened in a new tab.
- The button row has the same 12px gap below it as the other extensions above the console.

## 1.0.0

- First release.
