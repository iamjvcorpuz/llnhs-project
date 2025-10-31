<?php

namespace App\Exceptions;

use Inertia\Inertia;
use Throwable;
use Illuminate\Foundation\Exceptions\Handler as ExceptionHandler;
use Symfony\Component\HttpKernel\Exception\HttpExceptionInterface;

class ErrorHandler extends ExceptionHandler
{
    public function render($request, Throwable $e)
    {
        $response = parent::render($request, $e);

        // Only apply Inertia error pages in non-API, non-production debug mode if needed
        if ($request->inertia() && !app()->environment('production')) {
            // You can also force this in production
        }

        // Always use Inertia for HTTP exceptions
        if ($request->inertia() && $this->isHttpException($e)) {
            return $this->renderInertiaError($e);
        }

        return $response;
    }

    protected function renderInertiaError(Throwable $e)
    {
        $status = $e instanceof HttpExceptionInterface ? $e->getStatusCode() : 500;

        $page = match ($status) {
            403 => 'Error',
            404 => 'Error',
            419 => 'Error',
            500 => 'Error',
            503 => 'Error',
            default => 'Error',
        };

        return Inertia::render($page, [
            'status' => $status,
            'message' => $e->getMessage() ?: 'An error occurred',
        ])->toResponse(request())->setStatusCode($status);
    }

    protected function isHttpException($exception)
    {
        return $exception instanceof HttpExceptionInterface;
    }

}
