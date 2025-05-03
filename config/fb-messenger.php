<?php
return [
    'debug' => env('APP_DEBUG', false),
    'verify_token' => env('MESSENGER_VERIFY_TOKEN'),
    'app_token' => env('MESSENGER_PAGE_TOKEN'),
    'auto_typing' => true,
    'debug' => true,
    'handlers' => [
        // Casperlaitw\LaravelFbMessenger\Contracts\DefaultHandler::class
    ],
    'custom_url' => '/webhook'
];
