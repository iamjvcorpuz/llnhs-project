import { Link } from '@inertiajs/react';

export default function Footer({
    active = false,
    className = '',
    children,
    ...props
}) {
    return (<footer className="app-footer"> 
        <div className="float-end d-none d-sm-inline">Version 0.6.5</div> 
        <strong>
          Copyright &copy; 2025&nbsp;
          <a href="#" className="text-decoration-none">Lebak Legislated National High School</a>.
        </strong> 
        {/* <script src="{{ url('adminlte/dist/js/adminlte.js') }}"></script> */}
      </footer>);
}