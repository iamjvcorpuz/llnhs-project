<?php

namespace App\Providers;

use Illuminate\Support\Facades\URL;
use Illuminate\Support\Facades\Vite;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
        // //check that app is local
        // if ($this->app->isLocal()) {
        // //if local register your services you require for development
        //     $this->app->register('Barryvdh\Debugbar\ServiceProvider');
        // } else {
        // //else register your services you require for production
        //     $this->app['request']->server->set('HTTPS', true);
        // }
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        Vite::prefetch(concurrency: 3);
        if($this->app->environment('production')) {
            URL::forceScheme('https');
        }
    }
}
