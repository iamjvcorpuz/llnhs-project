import ApplicationLogo from '@/Components/ApplicationLogo';
import { Link } from '@inertiajs/react';

export default function LoginLayout({ children }) {
    return (
        <div className="login-bg flex min-h-screen flex-col items-center bg-gray-100 pt-6 sm:justify-center sm:pt-0">
            {/* <strong className="cente fs-4">Lebak Legislated National High School </strong>    */}
                <center>
                    <ApplicationLogo className="h-20 w-20 fill-current text-gray-500" />
                </center>
            <div className="mt-6 w-full overflow-hidden bg-white px-6 py-4 shadow-md sm:max-w-md sm:rounded-lg">
                {children}
            </div>
            <div className="h-20 w-20 fill-current text-gray-500 pt-5">
                <img src="/images/bagongtae.png" alt="AdminLTE Logo" className="img-circle" /> 
            </div> 
        </div>
    );
}