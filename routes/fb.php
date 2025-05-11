<?php

// use Illuminate\Foundation\Application;
// use Illuminate\Http\Request;
// use Illuminate\Support\Facades\Route;
// use Casperlaitw\LaravelFbMessenger\Messages\Text;
// use Casperlaitw\LaravelFbMessenger\LaravelFbMessenger;

// Route::post('/webhook', function () {
//     $messenger = new LaravelFbMessenger();
//     $messenger->handle();
// })->name('webhook');

// Route::get('/webhook', function () {
//     $messenger = new LaravelFbMessenger();
//     $messenger->verify();
// });

// Route::post('/send-message', function () {
//     $message = request()->input('message');
//     $messenger = new LaravelFbMessenger();
//     $sender = 'USER_ID'; // Replace with actual user PSID (from webhook)
//     $messenger->send(new Text($sender, $message));
//     return response()->json(['reply' => "Echo: $message"]);
// });