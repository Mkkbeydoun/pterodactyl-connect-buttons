<?php

namespace RustixDev\ConnectButtons;

use Pterodactyl\Extensions\ExtensionProvider;
use Pterodactyl\Models\Egg;
use Pterodactyl\Services\Extensions\ExtensionSettings;
use RustixDev\ConnectButtons\Fields\EggConnectFields;
use RustixDev\ConnectButtons\Http\Controllers\ConnectController;

class ConnectButtonsProvider extends ExtensionProvider
{
    public function boot(): void
    {
        $this->registerApiRoutes();
        $this->registerFields(Egg::class, EggConnectFields::class);

        $this->app->when(ConnectController::class)
            ->needs(ExtensionSettings::class)
            ->give(fn () => $this->settings());
    }
}
