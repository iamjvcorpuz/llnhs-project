import React,{ Component } from "react";
import { Link } from '@inertiajs/react';
import { EachMethod } from '@/Components/EachMethod'
import swal from 'sweetalert';
import Swal from 'sweetalert2';

import ReactTable from "@/Components/ReactTable"; 

import DashboardLayout from '@/Layouts/DashboardLayout';


export default class Event extends Component {
    constructor(props) {
		super(props);
        this.state = {
            
        }

    }
    render() {
        return <DashboardLayout title="Student" user={this.props.auth.user} ><div className="noselect">
            <div className="app-content-header"> 
                <div className="container-fluid"> 
                    <div className="row">
                    <div className="col-sm-6"><h3 className="mb-0"><i className="nav-icon bi bi-person-lines-fill"></i> Event</h3></div>
                    <div className="col-sm-6">
                        <ol className="breadcrumb float-sm-end">
                            <li className="breadcrumb-item"><Link href="/admin/dashboard">Dashboard</Link></li>
                            <li className="breadcrumb-item active" aria-current="page">Event</li>
                        </ol>
                    </div>
                    </div> 
                </div> 
            </div>

            <div className="app-content">
                <div className="container-fluid">
                    
                    <div className="row">
                        <div className="col-lg-12">
                            <div className="card mb-4">
                                <div className="card-header">
                                    <h3 className="card-title"> <i className="bi bi-person"></i> Student List</h3>
                                    <button className="btn btn-danger float-right"> <i className="bi bi-person-fill-x"></i> Remove</button>    
                                    <button className="btn btn-info float-right mr-1"> <i className="bi bi-pen"></i> Edit</button> 
                                    <button className="btn btn-primary float-right mr-1"> <i className="bi bi-person-plus-fill"></i> Add</button>    
                                </div>
                                <div className="card-body"> 
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
            
        </div>
    </DashboardLayout>}
}
