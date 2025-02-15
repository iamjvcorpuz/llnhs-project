import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import react from '@vitejs/plugin-react';

import path from 'path';

export default defineConfig({
    plugins: [
        laravel({
            input: ['resources/js/app.jsx','resources/css/app.scss'],
            refresh: true,
        }),
        react()
    ],
    resolve: {
        alias: {
            '@':'/resources/js',
            '@import': './public',
            '$': path.resolve(__dirname,'node_modules/jquery/dist/jquery'),
            '~bootstrap': path.resolve(__dirname,'node_modules/bootstrap/dist/js/bootstrap.js')
        },
    }
});
