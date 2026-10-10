<?php

use Illuminate\Support\Facades\Route;
use RustixDev\ConnectButtons\Http\Controllers\ConnectController;

// Anyone who can see the server can see how to join it, like its address on the console.
Route::get('/connect', [ConnectController::class, 'show']);
