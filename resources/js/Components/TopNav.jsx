import { Link } from '@inertiajs/react';
import ResponsiveNavLink from '@/Components/ResponsiveNavLinkCustom';

export default function TopNav({
    active = false,
    className = '',
    children,
    user,
    profile,
    ...props
}) {
    let profile_link = "";
    // console.log(user)
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
                {/* <img
                  src="/adminlte/dist/assets/img/avatar.png"
                  className="user-image rounded-circle shadow auto-margin-lr"
                  alt="User Image"
                /> */}
                <img
                  src={typeof(user.profile)!="undefined"&&user.profile!=null&&typeof(user.profile.picture_base64)!="undefined"&&user.profile.picture_base64!=null&&user.profile.picture_base64!=""?user.profile.picture_base64:"/adminlte/dist/assets/img/avatar.png"}
                  className="user-image rounded-circle shadow auto-margin-lr"
                  alt="User Image"
                  onError={(e)=>{ 
                    this.upload_view_image.src='/adminlte/dist/assets/img/avatar.png'; 
                }}
                />
                {/* <span className="d-none d-md-inline">Alexander Pierce</span> */}
              </a>
              <ul className="dropdown-menu dropdown-menu-lg dropdown-menu-end"> 
                <li className="user-header text-bg-info">
                  <img
                    // src="/adminlte/dist/assets/img/avatar.png"

                  src={typeof(user.profile)!="undefined"&&user.profile!=null&&typeof(user.profile.picture_base64)!="undefined"&&user.profile.picture_base64!=null&&user.profile.picture_base64!=""?user.profile.picture_base64:"/adminlte/dist/assets/img/avatar.png"}
                    className="rounded-circle shadow auto-margin-lr"
                    alt="User Image"
                    onError={(e)=>{ 
                      this.upload_view_image.src='/adminlte/dist/assets/img/avatar.png'; 
                    }}
                  />
                  <p>
                    {(typeof(user.user)!="undefined"&&user.user!=null&&typeof(user.user.fullname)!="undefined")?user?.user?.fullname:'Guest'}
                    {/* <small>Member since Nov. 2023</small> */}
                  </p>
                </li>  
                <li className="user-footer">
                {(typeof(user.user)!="undefined"&&user.user!=null&&typeof(user.user.user_type)!="undefined"&&user.user.user_type=="Teacher")?<Link href="/profile/dashboard" className="btn btn-primary btn-flat">Profile</Link>:null}
                {(typeof(user.user)!="undefined"&&user.user!=null&&typeof(user.user.user_type)!="undefined"&&user.user.user_type=="Student")?<Link href="/student/profiles" className="btn btn-primary btn-flat">Profile</Link>:null}
                {(typeof(user.user)!="undefined"&&user.user!=null&&typeof(user.user.user_type)!="undefined"&&user.user.user_type=="Guardian")?<Link href="/parents/profile" className="btn btn-primary btn-flat">Profile</Link>:null}
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
