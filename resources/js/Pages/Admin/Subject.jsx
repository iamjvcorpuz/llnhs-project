import React,{ Component } from "react";
import { Head , Link} from '@inertiajs/react';
import { EachMethod } from '@/Components/EachMethod'
import swal from 'sweetalert';
import Swal from 'sweetalert2';
import DashboardLayout from '@/Layouts/DashboardLayout';


export default class Subject extends Component {
    constructor(props) {
		super(props);
        this.state = {
            
        }

    }
    render() {
        return <DashboardLayout title="Subject">
            <div className="app-content-header"> 
                <div className="container-fluid"> 
                    <div className="row">
                    <div className="col-sm-6"><h3 className="mb-0"><i className="nav-icon bi bi-book-half"></i> Subject</h3></div>
                    <div className="col-sm-6">
                        <ol className="breadcrumb float-sm-end">
                            <li className="breadcrumb-item"><Link href="/admin/dashboard">Dashboard</Link></li>
                            <li className="breadcrumb-item active" aria-current="page">Subject</li>
                        </ol>
                    </div>
                    </div> 
                </div> 
            </div>
        </DashboardLayout>
    }
}