<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Inertia\Inertia;
use Symfony\Component\HttpKernel\Exception\HttpExceptionInterface;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware) {
        $middleware->web(append: [
            \App\Http\Middleware\HandleInertiaRequests::class,
            \Illuminate\Http\Middleware\AddLinkHeadersForPreloadedAssets::class,
        ]);
        $middleware->validateCsrfTokens(except: [
            'stripe/*',
            '*'
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions) {
        $exceptions->renderable(function (\Symfony\Component\HttpKernel\Exception\NotFoundHttpException $e, $request) {
            if ($request->expectsJson()) {
                return response()->json(['message' => 'Not Found'], 404);
            }
            
            $status = $e->getStatusCode();
            $message = $e->getMessage();
    
            return inertia('Errors/Default',["version" =>  env('VERSION',"v1.0.9"),"error_code" => $status,"message" => $message])
                ->toResponse($request)
                ->setStatusCode($status);
        });
    
        $exceptions->renderable(function (Throwable $e, $request) {
            if ($e instanceof \Symfony\Component\HttpKernel\Exception\HttpException && $e->getStatusCode() === 500) {
                $status = $e->getStatusCode();
                $message = "Internal Server Error";
                return inertia('Errors/Default',["version" =>  env('VERSION',"v1.0.9"),"error_code" => $status,"message" => $message])
                ->toResponse($request)
                ->setStatusCode($status);
            }
        });

    })->create();
