import React,{ Component } from "react";
import ApplicationLogo from '@/Components/ApplicationLogo';
import Dropdown from '@/Components/Dropdown';
import NavLink from '@/Components/NavLink';
import TopNav from '@/Components/TopNav';
import SideNav from '@/Components/SideNav';
import Footer from '@/Components/Footer';
import ResponsiveNavLink from '@/Components/ResponsiveNavLink';
import { Link, usePage } from '@inertiajs/react';
import { useState } from 'react';
import { Head } from '@inertiajs/react';
import $ from 'jquery';
// window.$ = window.jQuery = {...$,...window.adminlte};
// console.log(window.adminlte)
import 'bootstrap/dist/css/bootstrap.min.css';
export default class DashboardLayout extends Component {
    constructor(props) {
		super(props);
        this.state = {
            
        }
        // console.log(this.props);
        // console.log(window.adminlte);
        // console.log(window);
        // let adminlte = new window.adminlte.PushMenu();
        // console.log(adminlte)
        // const user = usePage();
        // console.log(user);
    }
    componentDidMount() {
        $(function () { 
            const Default$1 = {
                animationSpeed: 300,
                accordion: true
            };

            if($('[data-lte-toggle="treeview"]').length > 0) {
                const button = document.querySelectorAll('[data-lte-toggle="treeview"]');
                button.forEach(btn => {
                    btn.addEventListener('click', event => {
                        const target = event.target;
                        const targetItem = target.closest('.nav-item');
                        const targetLink = target.closest('.nav-link');
                        if ((target === null || target === void 0 ? void 0 : target.getAttribute('href')) === '#' || (targetLink === null || targetLink === void 0 ? void 0 : targetLink.getAttribute('href')) === '#') {
                            event.preventDefault();
                        }
                        if (targetItem) {
                            const data = new window.adminlte.Treeview(targetItem, Default$1);
                            data.toggle();
                        }
                    });
                });
            }

            if($('[data-lte-toggle="sidebar"]').length > 0) {

                const DATA_KEY$4 = 'lte.push-menu';
                const EVENT_KEY$4 = `.${DATA_KEY$4}`;
                const EVENT_OPEN = `open${EVENT_KEY$4}`;
                const EVENT_COLLAPSE = `collapse${EVENT_KEY$4}`;
                const CLASS_NAME_SIDEBAR_MINI = 'sidebar-mini';
                const CLASS_NAME_SIDEBAR_COLLAPSE = 'sidebar-collapse';
                const CLASS_NAME_SIDEBAR_OPEN = 'sidebar-open';
                const CLASS_NAME_SIDEBAR_EXPAND = 'sidebar-expand';
                const CLASS_NAME_SIDEBAR_OVERLAY = 'sidebar-overlay';
                const CLASS_NAME_MENU_OPEN$1 = 'menu-open';
                const SELECTOR_APP_SIDEBAR = '.app-sidebar';
                const SELECTOR_SIDEBAR_MENU = '.sidebar-menu';
                const SELECTOR_NAV_ITEM$1 = '.nav-item';
                const SELECTOR_NAV_TREEVIEW = '.nav-treeview';
                const SELECTOR_APP_WRAPPER = '.app-wrapper';
                const SELECTOR_SIDEBAR_EXPAND = `[class*="${CLASS_NAME_SIDEBAR_EXPAND}"]`;
                const SELECTOR_SIDEBAR_TOGGLE = '[data-lte-toggle="sidebar"]';
                const Defaults = {
                    sidebarBreakpoint: 992
                };
                var _a;
                const sidebar = document === null || document === void 0 ? void 0 : document.querySelector(SELECTOR_APP_SIDEBAR);
                if (sidebar) {
                    const data = new window.adminlte.PushMenu(sidebar, Defaults);
                    data.init();
                    window.addEventListener('resize', () => {
                        data.init();
                    });
                }
                const sidebarOverlay = document.createElement('div');
                sidebarOverlay.className = CLASS_NAME_SIDEBAR_OVERLAY;
                (_a = document.querySelector(SELECTOR_APP_WRAPPER)) === null || _a === void 0 ? void 0 : _a.append(sidebarOverlay);
                sidebarOverlay.addEventListener('touchstart', event => {
                    event.preventDefault();
                    const target = event.currentTarget;
                    const data = new window.adminlte.PushMenu(target, Defaults);
                    data.collapse();
                }, { passive: true });
                sidebarOverlay.addEventListener('click', event => {
                    event.preventDefault();
                    const target = event.currentTarget;
                    const data = new window.adminlte.PushMenu(target, Defaults);
                    data.collapse();
                });
                const fullBtn = document.querySelectorAll(SELECTOR_SIDEBAR_TOGGLE);
                fullBtn.forEach(btn => {
                    btn.addEventListener('click', event => {
                        event.preventDefault();
                        let button = event.currentTarget;
                        if ((button === null || button === void 0 ? void 0 : button.dataset.lteToggle) !== 'sidebar') {
                            button = button === null || button === void 0 ? void 0 : button.closest(SELECTOR_SIDEBAR_TOGGLE);
                        }
                        if (button) {
                            event === null || event === void 0 ? void 0 : event.preventDefault();
                            const data = new window.adminlte.PushMenu(button, Defaults);
                            data.toggle();
                        }
                    });
                });

            }

        }); 
    }
    render() {
    return (<div className="app-wrapper">
         <Head title={this.props.title} />
        <TopNav />
        <SideNav />
        <main className="app-main">{this.props.children}</main>
        <Footer />
    </div>);
    }
}

// export default function DashboardLayout({ header, children }) {
//     const user = usePage().props.auth.user;
//     console.log("DashboardLayout")
//     $('[data-widget="collapse"]');
//     let a = setInterval(() => { 
//         if($('[data-widget="treeview"]').length > 0) {
//           const trees = $('[data-widget="treeview"]');
//           trees.Treeview('init');
//           clearInterval(a)
//         }
//     }, 1000);

//     // const [showingNavigationDropdown, setShowingNavigationDropdown] = useState(false);

//     return (<div className="app-wrapper">
//         <TopNav />
//         <SideNav />
//         <main className="app-main">{children}</main>
//         <Footer />
//     </div>);
// }




{/* <div className="min-h-screen bg-gray-100">
            
{header && (
    <header className="bg-white shadow">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
            {header}
        </div>
    </header>
)}

<main>{children}</main>
</div> */}