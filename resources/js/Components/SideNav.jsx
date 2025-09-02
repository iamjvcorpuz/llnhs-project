import { Link } from '@inertiajs/react';

export default function SideNav({
    active = false,
    className = '',
    children,
    ...props
}) {
    return (<aside className="app-sidebar shadow bg-navy " data-bs-theme=""> 
        <div className="sidebar-brand bg-navy"> 
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

                <a href="#" className="nav-link">
                  <i className="nav-icon bi bi-calendar-week"></i>
                  <p>Attendance</p>
                  <i className="nav-arrow bi bi-chevron-right"></i>
                </a>

                <ul className="nav nav-treeview">
                  <li className="nav-item">
                    <Link href="/admin/attendance" className="nav-link">
                      <i className="nav-icon bi bi-people-fill"></i>
                      <p>Student/Employee</p>
                    </Link>
                  </li>
                  <li className="nav-item"> 
                    <Link href="/admin/attendance/event" className="nav-link">
                      <i className="nav-icon bi bi-calendar-week"></i>
                      <p>Event</p>
                    </Link> 
                  </li> 
                </ul>
              </li>

              <li className="nav-item">
                <a href="#" className="nav-link">
                  <i className="nav-icon bi bi-person-lines-fill"></i>
                  <p>Student</p>
                  <i className="nav-arrow bi bi-chevron-right"></i>
                </a>
                <ul className="nav nav-treeview">
                  <li className="nav-item">
                    <Link href="/admin/dashboard/student" className="nav-link">
                      <i className="nav-icon bi bi-person-gear"></i>
                      <p>Info</p>
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link href="/admin/student/movement" className="nav-link">
                      <i className="nav-icon bi bi-arrows-move"></i>
                      <p>Movement</p>
                    </Link>
                  </li> 
                </ul>
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
                <a href="#" className="nav-link">
                  <i className="nav-icon bi bi-journal"></i>
                  <p>CLASS</p>
                  <i className="nav-arrow bi bi-chevron-right"></i>
                </a>
                <ul className="nav nav-treeview">
                  <li className="nav-item">
                    <Link href="/admin/dashboard/advisory" className="nav-link">
                      <i className="nav-icon bi bi-book-half"></i>
                      <p>Class Advisory</p>
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link href="/admin/dashboard/class/subject/teacher" className="nav-link">
                      <i className="nav-icon bi bi-microsoft-teams"></i>
                      <p>Class Teacher</p>
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link href="/admin/dashboard/class" className="nav-link">
                      <i className="nav-icon bi bi-people-fill"></i>
                      <p>Class Info</p>
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link href="/admin/dashboard/advisory/schedules" className="nav-link">
                      <i className="nav-icon bi bi-calendar2-check"></i>
                      <p>Advisory Schedules</p>
                    </Link>
                  </li>
                </ul>
              </li>

              {/* <li className="nav-item">
                <a href="#" className="nav-link">
                  <i className="nav-icon bi bi-calendar-check-fill"></i>
                  <p>Schedule</p>
                  <i className="nav-arrow bi bi-chevron-right"></i>
                </a>
                <ul className="nav nav-treeview">
                  <li className="nav-item">
                    <Link href="/admin/dashboard/advisory/schedules" className="nav-link">
                      <i className="nav-icon bi bi-calendar2-check"></i>
                      <p>Advisory Schedules</p>
                    </Link>
                  </li>
                </ul>
              </li> */}
              <li className="nav-item">
                <a href="#" className="nav-link">
                  <i className="nav-icon bi bi-printer"></i>
                  <p>Report</p>
                  <i className="nav-arrow bi bi-chevron-right"></i>
                </a>
                <ul className="nav nav-treeview">
                  <li className="nav-item">
                    <Link href="/admin/report/sf2" className="nav-link">
                      <i className="nav-icon bi bi-file-pdf"></i>
                      <p>SF2</p>
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link href="/admin/report/sf4" className="nav-link">
                      <i className="nav-icon bi bi-file-pdf"></i>
                      <p>SF4</p>
                    </Link>
                  </li>
                  {/* <li className="nav-item">
                    <Link href="/admin/report/lesf" className="nav-link">
                      <i className="nav-icon bi bi-file-pdf"></i>
                      <p>LEARNER ENROLLMENT AND SURVEY FORM</p>
                    </Link>
                  </li> */}
                </ul>
              </li>
              <li className="nav-item">
                <Link href="/admin/users/ids" className="nav-link">
                  <i className="nav-icon bi bi-person-vcard"></i>
                  <p>ID's</p>
                </Link>
              </li>
              <li className="nav-item">
                <a href="#" className="nav-link">
                  <i className="nav-icon bi bi-gear"></i>
                  <p>MANAGEMENT</p>
                  <i className="nav-arrow bi bi-chevron-right"></i>
                </a>
                <ul className="nav nav-treeview">

                  <li className="nav-item">
                    <Link href="/admin/dashboard/school/subjects" className="nav-link">
                      <i className="nav-icon bi bi-journals"></i>
                      <p>Subjects</p>
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link href="/admin/dashboard/class/rooms" className="nav-link">
                      <i className="nav-icon bi bi-door-closed"></i>
                      <p>Classroom</p>
                    </Link>
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
                    <Link href="/admin/dashboard/users" className="nav-link">
                      <i className="nav-icon bi bi-person-gear"></i>
                      <p>Users</p>
                    </Link>
                  </li>

                </ul>
              </li>
              <li className="nav-item">
                <a href="#" className="nav-link">
                  <i className="nav-icon bi bi-gear"></i>
                  <p>System</p>
                  <i className="nav-arrow bi bi-chevron-right"></i>
                </a>
                <ul className="nav nav-treeview">
                  <li className="nav-item">
                    <Link href="/admin/school/details" className="nav-link">
                      <i className="nav-icon bi bi-house-gear-fill"></i>
                      <p>School Details</p>
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link href="/admin/notifications" className="nav-link">
                      <i className="nav-icon bi bi-gear"></i>
                      <p>Notification Settings</p>
                    </Link>
                  </li>
                </ul>
              </li>
              
            </ul>
          </nav>
        </div>
      </aside>);
}
