import { Link } from '@inertiajs/react';

export default function SideNav({
    active = false,
    className = '',
    children,
    ...props
}) {
    return (<aside className="app-sidebar shadow bg-info " data-bs-theme=""> 
        <div className="sidebar-brand bg-info"> 
          <a href="#" className="brand-link"> 
            <img
              src="/images/ic_launcher.png"
              alt="AdminLTE Logo"
              className="brand-image opacity-75"
            /> 
            <span className="brand-text fw-light">LLNHS</span> 
          </a>
        </div>
        <div className="sidebar-wrapper">
          <nav className="mt-2">
            <ul className="nav nav-sidebar sidebar-menu flex-column" data-lte-toggle="treeview" role="menu" data-accordion="true" >
              <li className="nav-item">
                <Link href="/admin/dashboard" className="nav-link">
                  <i className="nav-icon bi bi-speedometer"></i>
                  <p>
                    Dashboard 
                  </p>
                </Link> 
              </li>
              <li className="nav-item">
                <Link href="/admin/dashboard/student" className="nav-link">
                  <i className="nav-icon bi bi-person-lines-fill"></i>
                  <p>Student</p>
                </Link>
              </li>
              <li className="nav-item">
                <Link href="/admin/dashboard/parents" className="nav-link">
                  <i className="nav-icon bi bi-person-lines-fill"></i>
                  <p>Parents</p>
                </Link>
              </li>
              <li className="nav-item">
                <Link href="/admin/dashboard/employee" className="nav-link">
                  <i className="nav-icon bi bi-person-lines-fill"></i>
                  <p>Employee</p>
                </Link>
              </li>
              <li className="nav-item">
                <Link href="/admin/dashboard/class/subject/teacher" className="nav-link">
                  <i className="nav-icon bi bi-microsoft-teams"></i>
                  <p>Class Teacher</p>
                </Link>
              </li>
              <li className="nav-item">
                <Link href="/admin/dashboard/advisory" className="nav-link">
                  <i className="nav-icon bi bi-book-half"></i>
                  <p>Class Advisory</p>
                </Link>
              </li>
              <li className="nav-item">
                <Link href="/admin/dashboard/class" className="nav-link">
                  <i className="nav-icon bi bi-people-fill"></i>
                  <p>Class</p>
                </Link>
              </li>
              <li className="nav-item">
                <Link href="/admin/dashboard/class/rooms" className="nav-link">
                  <i className="nav-icon bi bi-door-closed"></i>
                  <p>Classroom</p>
                </Link>
              </li>
              <li className="nav-item">
                <Link href="/admin/dashboard/school/subjects" className="nav-link">
                  <i className="nav-icon bi bi-journals"></i>
                  <p>Subjects</p>
                </Link>
              </li>
              <li className="nav-item">
                <a href="#" className="nav-link">
                  <i className="nav-icon bi bi-calendar-check-fill"></i>
                  <p>Schedule</p>
                  <i className="nav-arrow bi bi-chevron-right"></i>
                </a>
                <ul className="nav nav-treeview">
                  <li className="nav-item">
                    <Link href="/teacher/attendance/list" className="nav-link">
                      <i className="nav-icon bi bi-calendar2-check"></i>
                      <p>Advisory Schedules</p>
                    </Link>
                  </li>
                </ul>
              </li>
              <li className="nav-item">
                <Link href="/admin/dashboard/programs/curricular" className="nav-link" title="Track & Strand">
                  <i className="nav-icon bi bi-list"></i>
                  <p>Programs & Curricular </p>
                </Link>
              </li>
              <li className="nav-item">
                <Link href="/admin/dashboard/events" className="nav-link">
                  <i className="nav-icon bi bi-calendar"></i>
                  <p>Events</p>
                </Link>
              </li>
              <li className="nav-item">
                <Link href="/admin/dashboard/holidays" className="nav-link">
                  <i className="nav-icon bi bi-calendar"></i>
                  <p>Holiday</p>
                </Link>
              </li>
              <li className="nav-item">
                <a href="#" className="nav-link">
                  <i className="nav-icon bi bi-printer"></i>
                  <p>Report</p>
                  <i className="nav-arrow bi bi-chevron-right"></i>
                </a>
                <ul className="nav nav-treeview">
                  <li className="nav-item">
                    <Link href="/teacher/attendance/list" className="nav-link">
                      <i className="nav-icon bi bi-calendar2-check"></i>
                      <p>Advisory Schedules</p>
                    </Link>
                  </li>
                </ul>
              </li>
              <li className="nav-item">
                <Link href="/admin/dashboard/users" className="nav-link">
                  <i className="nav-icon bi bi-person-gear"></i>
                  <p>Users</p>
                </Link>
              </li>
              <li className="nav-item">
                <a href="#" className="nav-link">
                  <i className="nav-icon bi bi-gear"></i>
                  <p>System</p>
                  <i className="nav-arrow bi bi-chevron-right"></i>
                </a>
                <ul className="nav nav-treeview">
                  <li className="nav-item">
                    <Link href="/teacher/attendance/list" className="nav-link">
                      <i className="nav-icon bi bi-gear"></i>
                      <p>Notification Settings</p>
                    </Link>
                  </li>
                </ul>
              </li>
              {/* <li className="nav-item" disabled="disabled" >
                <Link href="/admin/dashboard/settings" className="nav-link">
                  <i className="nav-icon bi bi-gear"></i>
                  <p>Settings</p>
                </Link>
              </li> */}

            </ul>
          </nav>
        </div>
      </aside>);
}

{/*
              <li className="nav-item">
                <a href="#" className="nav-link">
                  <i className="nav-icon bi bi-tree-fill"></i>
                  <p>
                    UI Elements
                    <i className="nav-arrow bi bi-chevron-right"></i>
                  </p>
                </a>
                <ul className="nav nav-treeview">
                  <li className="nav-item">
                    <a href="../UI/general.html" className="nav-link">
                      <i className="nav-icon bi bi-circle"></i>
                      <p>General</p>
                    </a>
                  </li>
                  <li className="nav-item">
                    <a href="../UI/icons.html" className="nav-link">
                      <i className="nav-icon bi bi-circle"></i>
                      <p>Icons</p>
                    </a>
                  </li>
                  <li className="nav-item">
                    <a href="../UI/timeline.html" className="nav-link">
                      <i className="nav-icon bi bi-circle"></i>
                      <p>Timeline</p>
                    </a>
                  </li>
                </ul>
              </li>
              <li className="nav-item">
                <a href="#" className="nav-link">
                  <i className="nav-icon bi bi-tree-fill"></i>
                  <p>
                    UI Elements
                    <i className="nav-arrow bi bi-chevron-right"></i>
                  </p>
                </a>
                <ul className="nav nav-treeview">
                  <li className="nav-item">
                    <a href="../UI/general.html" className="nav-link">
                      <i className="nav-icon bi bi-circle"></i>
                      <p>General</p>
                    </a>
                  </li>
                  <li className="nav-item">
                    <a href="../UI/icons.html" className="nav-link">
                      <i className="nav-icon bi bi-circle"></i>
                      <p>Icons</p>
                    </a>
                  </li>
                  <li className="nav-item">
                    <a href="../UI/timeline.html" className="nav-link">
                      <i className="nav-icon bi bi-circle"></i>
                      <p>Timeline</p>
                    </a>
                  </li>
                </ul>
              </li>  
  
*/}
{/* <li className="nav-item">
<a href="#" className="nav-link">
  <i className="nav-icon bi bi-box-seam-fill"></i>
  <p>
    Widgets
    <i className="nav-arrow bi bi-chevron-right"></i>
  </p>
</a>
<ul className="nav nav-treeview">
  <li className="nav-item">
    <a href="./widgets/small-box.html" className="nav-link">
      <i className="nav-icon bi bi-circle"></i>
      <p>Small Box</p>
    </a>
  </li>
  <li className="nav-item">
    <a href="./widgets/info-box.html" className="nav-link">
      <i className="nav-icon bi bi-circle"></i>
      <p>info Box</p>
    </a>
  </li>
  <li className="nav-item">
    <a href="./widgets/cards.html" className="nav-link">
      <i className="nav-icon bi bi-circle"></i>
      <p>Cards</p>
    </a>
  </li>
</ul>
</li>
<li className="nav-item">
<a href="#" className="nav-link">
  <i className="nav-icon bi bi-clipboard-fill"></i>
  <p>
    Layout Options
    <span className="nav-badge badge text-bg-secondary me-3">6</span>
    <i className="nav-arrow bi bi-chevron-right"></i>
  </p>
</a>
<ul className="nav nav-treeview">
  <li className="nav-item">
    <a href="./layout/unfixed-sidebar.html" className="nav-link">
      <i className="nav-icon bi bi-circle"></i>
      <p>Default Sidebar</p>
    </a>
  </li>
  <li className="nav-item">
    <a href="./layout/fixed-sidebar.html" className="nav-link">
      <i className="nav-icon bi bi-circle"></i>
      <p>Fixed Sidebar</p>
    </a>
  </li>
  <li className="nav-item">
    <a href="./layout/layout-custom-area.html" className="nav-link">
      <i className="nav-icon bi bi-circle"></i>
      <p>Layout <small>+ Custom Area </small></p>
    </a>
  </li>
  <li className="nav-item">
    <a href="./layout/sidebar-mini.html" className="nav-link">
      <i className="nav-icon bi bi-circle"></i>
      <p>Sidebar Mini</p>
    </a>
  </li>
  <li className="nav-item">
    <a href="./layout/collapsed-sidebar.html" className="nav-link">
      <i className="nav-icon bi bi-circle"></i>
      <p>Sidebar Mini <small>+ Collapsed</small></p>
    </a>
  </li>
  <li className="nav-item">
    <a href="./layout/logo-switch.html" className="nav-link">
      <i className="nav-icon bi bi-circle"></i>
      <p>Sidebar Mini <small>+ Logo Switch</small></p>
    </a>
  </li>
  <li className="nav-item">
    <a href="./layout/layout-rtl.html" className="nav-link">
      <i className="nav-icon bi bi-circle"></i>
      <p>Layout RTL</p>
    </a>
  </li>
</ul>
</li>
<li className="nav-item">
<a href="#" className="nav-link">
  <i className="nav-icon bi bi-tree-fill"></i>
  <p>
    UI Elements
    <i className="nav-arrow bi bi-chevron-right"></i>
  </p>
</a>
<ul className="nav nav-treeview">
  <li className="nav-item">
    <a href="./UI/general.html" className="nav-link">
      <i className="nav-icon bi bi-circle"></i>
      <p>General</p>
    </a>
  </li>
  <li className="nav-item">
    <a href="./UI/icons.html" className="nav-link">
      <i className="nav-icon bi bi-circle"></i>
      <p>Icons</p>
    </a>
  </li>
  <li className="nav-item">
    <a href="./UI/timeline.html" className="nav-link">
      <i className="nav-icon bi bi-circle"></i>
      <p>Timeline</p>
    </a>
  </li>
</ul>
</li>
<li className="nav-item">
<a href="#" className="nav-link">
  <i className="nav-icon bi bi-pencil-square"></i>
  <p>
    Forms
    <i className="nav-arrow bi bi-chevron-right"></i>
  </p>
</a>
<ul className="nav nav-treeview">
  <li className="nav-item">
    <a href="./forms/general.html" className="nav-link">
      <i className="nav-icon bi bi-circle"></i>
      <p>General Elements</p>
    </a>
  </li>
</ul>
</li>
<li className="nav-item">
<a href="#" className="nav-link">
  <i className="nav-icon bi bi-table"></i>
  <p>
    Tables
    <i className="nav-arrow bi bi-chevron-right"></i>
  </p>
</a>
<ul className="nav nav-treeview">
  <li className="nav-item">
    <a href="./tables/simple.html" className="nav-link">
      <i className="nav-icon bi bi-circle"></i>
      <p>Simple Tables</p>
    </a>
  </li>
</ul>
</li>
<li className="nav-header">EXAMPLES</li>
<li className="nav-item">
<a href="#" className="nav-link">
  <i className="nav-icon bi bi-box-arrow-in-right"></i>
  <p>
    Auth
    <i className="nav-arrow bi bi-chevron-right"></i>
  </p>
</a>
<ul className="nav nav-treeview">
  <li className="nav-item">
    <a href="#" className="nav-link">
      <i className="nav-icon bi bi-box-arrow-in-right"></i>
      <p>
        Version 1
        <i className="nav-arrow bi bi-chevron-right"></i>
      </p>
    </a>
    <ul className="nav nav-treeview">
      <li className="nav-item">
        <a href="./examples/login.html" className="nav-link">
          <i className="nav-icon bi bi-circle"></i>
          <p>Login</p>
        </a>
      </li>
      <li className="nav-item">
        <a href="./examples/register.html" className="nav-link">
          <i className="nav-icon bi bi-circle"></i>
          <p>Register</p>
        </a>
      </li>
    </ul>
  </li>
  <li className="nav-item">
    <a href="#" className="nav-link">
      <i className="nav-icon bi bi-box-arrow-in-right"></i>
      <p>
        Version 2
        <i className="nav-arrow bi bi-chevron-right"></i>
      </p>
    </a>
    <ul className="nav nav-treeview">
      <li className="nav-item">
        <a href="./examples/login-v2.html" className="nav-link">
          <i className="nav-icon bi bi-circle"></i>
          <p>Login</p>
        </a>
      </li>
      <li className="nav-item">
        <a href="./examples/register-v2.html" className="nav-link">
          <i className="nav-icon bi bi-circle"></i>
          <p>Register</p>
        </a>
      </li>
    </ul>
  </li>
  <li className="nav-item">
    <a href="./examples/lockscreen.html" className="nav-link">
      <i className="nav-icon bi bi-circle"></i>
      <p>Lockscreen</p>
    </a>
  </li>
</ul>
</li>
<li className="nav-header">DOCUMENTATIONS</li>
<li className="nav-item">
<a href="./docs/introduction.html" className="nav-link">
  <i className="nav-icon bi bi-download"></i>
  <p>Installation</p>
</a>
</li>
<li className="nav-item">
<a href="./docs/layout.html" className="nav-link">
  <i className="nav-icon bi bi-grip-horizontal"></i>
  <p>Layout</p>
</a>
</li>
<li className="nav-item">
<a href="./docs/color-mode.html" className="nav-link">
  <i className="nav-icon bi bi-star-half"></i>
  <p>Color Mode</p>
</a>
</li>
<li className="nav-item">
<a href="#" className="nav-link">
  <i className="nav-icon bi bi-ui-checks-grid"></i>
  <p>
    Components
    <i className="nav-arrow bi bi-chevron-right"></i>
  </p>
</a>
<ul className="nav nav-treeview">
  <li className="nav-item">
    <a href="./docs/components/main-header.html" className="nav-link">
      <i className="nav-icon bi bi-circle"></i>
      <p>Main Header</p>
    </a>
  </li>
  <li className="nav-item">
    <a href="./docs/components/main-sidebar.html" className="nav-link">
      <i className="nav-icon bi bi-circle"></i>
      <p>Main Sidebar</p>
    </a>
  </li>
</ul>
</li>
<li className="nav-item">
<a href="#" className="nav-link">
  <i className="nav-icon bi bi-filetype-js"></i>
  <p>
    Javascript
    <i className="nav-arrow bi bi-chevron-right"></i>
  </p>
</a>
<ul className="nav nav-treeview">
  <li className="nav-item">
    <a href="./docs/javascript/treeview.html" className="nav-link">
      <i className="nav-icon bi bi-circle"></i>
      <p>Treeview</p>
    </a>
  </li>
</ul>
</li>
<li className="nav-item">
<a href="./docs/browser-support.html" className="nav-link">
  <i className="nav-icon bi bi-browser-edge"></i>
  <p>Browser Support</p>
</a>
</li>
<li className="nav-item">
<a href="./docs/how-to-contribute.html" className="nav-link">
  <i className="nav-icon bi bi-hand-thumbs-up-fill"></i>
  <p>How To Contribute</p>
</a>
</li>
<li className="nav-item">
<a href="./docs/faq.html" className="nav-link">
  <i className="nav-icon bi bi-question-circle-fill"></i>
  <p>FAQ</p>
</a>
</li>
<li className="nav-item">
<a href="./docs/license.html" className="nav-link">
  <i className="nav-icon bi bi-patch-check-fill"></i>
  <p>License</p>
</a>
</li>
<li className="nav-header">MULTI LEVEL EXAMPLE</li>
<li className="nav-item">
<a href="#" className="nav-link">
  <i className="nav-icon bi bi-circle-fill"></i>
  <p>Level 1</p>
</a>
</li>
<li className="nav-item">
<a href="#" className="nav-link">
  <i className="nav-icon bi bi-circle-fill"></i>
  <p>
    Level 1
    <i className="nav-arrow bi bi-chevron-right"></i>
  </p>
</a>
<ul className="nav nav-treeview">
  <li className="nav-item">
    <a href="#" className="nav-link">
      <i className="nav-icon bi bi-circle"></i>
      <p>Level 2</p>
    </a>
  </li>
  <li className="nav-item">
    <a href="#" className="nav-link">
      <i className="nav-icon bi bi-circle"></i>
      <p>
        Level 2
        <i className="nav-arrow bi bi-chevron-right"></i>
      </p>
    </a>
    <ul className="nav nav-treeview">
      <li className="nav-item">
        <a href="#" className="nav-link">
          <i className="nav-icon bi bi-record-circle-fill"></i>
          <p>Level 3</p>
        </a>
      </li>
      <li className="nav-item">
        <a href="#" className="nav-link">
          <i className="nav-icon bi bi-record-circle-fill"></i>
          <p>Level 3</p>
        </a>
      </li>
      <li className="nav-item">
        <a href="#" className="nav-link">
          <i className="nav-icon bi bi-record-circle-fill"></i>
          <p>Level 3</p>
        </a>
      </li>
    </ul>
  </li>
  <li className="nav-item">
    <a href="#" className="nav-link">
      <i className="nav-icon bi bi-circle"></i>
      <p>Level 2</p>
    </a>
  </li>
</ul>
</li>
<li className="nav-item">
<a href="#" className="nav-link">
  <i className="nav-icon bi bi-circle-fill"></i>
  <p>Level 1</p>
</a>
</li>
<li className="nav-header">LABELS</li>
<li className="nav-item">
<a href="#" className="nav-link">
  <i className="nav-icon bi bi-circle text-danger"></i>
  <p className="text">Important</p>
</a>
</li>
<li className="nav-item">
<a href="#" className="nav-link">
  <i className="nav-icon bi bi-circle text-warning"></i>
  <p>Warning</p>
</a>
</li>
<li className="nav-item">
<a href="#" className="nav-link">
  <i className="nav-icon bi bi-circle text-info"></i>
  <p>Informational</p>
</a>
</li> */}