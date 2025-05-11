import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import react from '@vitejs/plugin-react';

import path from 'path';

export default defineConfig({
    plugins: [
        react(),
        laravel({
            input: ['resources/js/app.jsx','resources/css/app.scss'],
            refresh: true,
        })
    ],
    resolve: {
        alias: {
            '@':'/resources/js',
            '@import': './public',
            '$': path.resolve(__dirname,'node_modules/jquery/dist/jquery'),
            '~bootstrap': path.resolve(__dirname,'node_modules/bootstrap/dist/js/bootstrap.js')
        }
    },
    build: {
        outDir: 'public/build',
    },
    define: {
        'process.env.APP_URL': JSON.stringify(process.env.APP_URL || 'https://correct-snapper-remarkably.ngrok-free.app'),
    }
});
