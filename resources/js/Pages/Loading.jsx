import ApplicationLogo from '@/Components/ApplicationLogo';
import { Link } from '@inertiajs/react';

export default function LoadingLayout({ children }) {
    return (
        <div className="login-bg flex min-h-screen flex-col items-center bg-gray-100 pt-6 sm:justify-center sm:pt-0"> 
            <center>
                <ApplicationLogo className="h-20 w-20 fill-current text-gray-500" />
            </center>            
            <div className="h-20 w-20 fill-current text-gray-500">
                <img src="/images/bagongtae.png" alt="AdminLTE Logo" className="img-circle" /> 
            </div> 
            <div className="spinner-border" role="status">
                <span className="sr-only">Loading...</span>
            </div>
        </div>
    );
}