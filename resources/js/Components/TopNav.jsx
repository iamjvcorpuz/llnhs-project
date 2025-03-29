import { Link } from '@inertiajs/react';
import ResponsiveNavLink from '@/Components/ResponsiveNavLinkCustom';

export default function TopNav({
    active = false,
    className = '',
    children,
    user,
    ...props
}) {
    let profile_link = "";
    // if(user.user.user_type=="user_type") {

    // }
    return (<nav className="app-header navbar navbar-expand bg-info "> 
        <div className="container-fluid"> 
          <ul className="navbar-nav">
            <li className="nav-item">
              <a className="nav-link" data-lte-toggle="sidebar" href="#" role="button">
                <i className="bi bi-list"></i>
              </a>
            </li>
            {/* <li className="nav-item d-none d-md-block"><a href="#" className="nav-link">Home</a></li>
            <li className="nav-item d-none d-md-block"><a href="#" className="nav-link">Contact</a></li> */}
          </ul> 
          <ul className="navbar-nav">   
            <li className="nav-item dropdown user-menu">
              <a href="#" className="nav-link dropdown-toggle" data-bs-toggle="dropdown">
                <img
                  src="/adminlte/dist/assets/img/avatar.png"
                  className="user-image rounded-circle shadow auto-margin-lr"
                  alt="User Image"
                />
                {/* <span className="d-none d-md-inline">Alexander Pierce</span> */}
              </a>
              <ul className="dropdown-menu dropdown-menu-lg dropdown-menu-end"> 
                <li className="user-header text-bg-primary">
                  <img
                    src="/adminlte/dist/assets/img/avatar.png"
                    className="rounded-circle shadow auto-margin-lr"
                    alt="User Image"
                  />
                  <p>
                    {(typeof(user.user)!="undefined"&&user.user!=null&&typeof(user.user.fullname)!="undefined")?user?.user?.fullname:'Guest'}
                    {/* <small>Member since Nov. 2023</small> */}
                  </p>
                </li>  
                <li className="user-footer">
                  {(typeof(user.user)!="undefined"&&user.user!=null&&typeof(user.user.user_type)!="undefined"&&user.user.user_type!="Admin")?<Link href="/profile/dashboard" className="btn btn-primary btn-flat">Profile</Link>:null}
                  {/* <Link href="/logout" className="btn btn-danger btn-flat float-end">Log out</Link> */}
                  <ResponsiveNavLink
                    method="post"
                    href={route('logout')}
                    as="button"
                    className="btn btn-danger btn-flat float-end"
                  >Log Out</ResponsiveNavLink>
                </li> 
              </ul>
            </li> 
          </ul> 
        </div>
    </nav>);
}
