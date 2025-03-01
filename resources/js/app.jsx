

import './bootstrap';
import '../css/app.css';
import '@popperjs/core';
import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { createRoot } from 'react-dom/client'; 

import * as bootstrap from "bootstrap";

import $ from 'jquery';
window.jQuery = window.$ = $

import DataTable from 'datatables.net';
window.DataTable = DataTable;

const appName = import.meta.env.VITE_APP_NAME || 'Laravel';
 

createInertiaApp({
    title: (title) => `${title} - ${appName}`,
    resolve: (name) =>
        resolvePageComponent(
            `./Pages/${name}.jsx`,
            import.meta.glob('./Pages/**/*.jsx'),
        ),
    setup({ el, App, props }) {
        createRoot(el).render(<App {...props} />); 
    },
    progress: {
        color: '#4B5563',
    },
});


// import React, { Component } from 'react';
// import ReactDOM from 'react-dom/client';

// import App from './AppRoute';

// ReactDOM.createRoot(document.getElementById("main-apps")).render(<App />)
