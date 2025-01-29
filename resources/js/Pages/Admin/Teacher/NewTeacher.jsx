import React,{ Component } from "react";
import { Link } from '@inertiajs/react';
import { EachMethod } from '@/Components/EachMethod'
import swal from 'sweetalert';
import Swal from 'sweetalert2';


import ReactTable from "@/Components/ReactTable"; 

import DashboardLayout from '@/Layouts/DashboardLayout';

export default class NewTeacher extends Component {
    constructor(props) {
		super(props);
        this.state = {
            photoupload: ""
        }

    }
    render() {
        return <DashboardLayout title="New Student" ><div className="noselect">
            <div className="app-content-header"> 
                <div className="container-fluid"> 
                    <div className="row">
                    <div className="col-sm-6"><h3 className="mb-0"><i className="nav-icon bi bi-person-lines-fill"></i> Teacher</h3></div>
                    <div className="col-sm-6">
                        <ol className="breadcrumb float-sm-end">
                            <li className="breadcrumb-item"><Link href="/admin/dashboard">Dashboard</Link></li>
                            <li className="breadcrumb-item"><Link href="/admin/dashboard/teacher">Teacher</Link></li>
                            <li className="breadcrumb-item active" aria-current="page">Create</li>
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
                                    <button className="btn btn-danger float-right"> <i className="bi bi-person-fill-x"></i> Cancel</button>     
                                    <button className="btn btn-success float-right mr-1"> <i className="bi bi-person-plus-fill"></i> Save</button>    
                                </div>
                                <div className="card-body"> 
                                    <div className="row g-3"> 
                                        <div className="col-md-6">
                                            <div className="col-md-6">
                                                <img className="photo-upload" src={this.state.photoupload!=""?this.state.photoupload:"/adminlte/dist/assets/img/avatar.png"}
                                                ref={t=> this.upload_view_image = t}
                                                onError={(e)=>{ 
                                                    this.upload_view_image.src='/adminlte/dist/assets/img/avatar.png'; 
                                                }} alt="Picture Error" />
                                            </div>
                                            <div className="input-group">
                                                <input type="file" className="form-control" id="inputGroupFile02" /> 
                                            </div>
                                        </div> 
                                        <div className="col-md-6 d-flex flex-column justify-content-end">
                                            <label htmlFor="validationCustom01" className="form-label ">LRN</label>
                                            <input type="text" className="form-control" id="validationCustom01" defaultValue="" required="" />
                                            <div className="valid-feedback">Looks good!</div>
                                        </div> 
                                        <div className="col-md-4">
                                            <label htmlFor="validationCustom01" className="form-label">First name</label>
                                            <input type="text" className="form-control" id="validationCustom01" defaultValue="" required="" />
                                            <div className="valid-feedback">Looks good!</div>
                                        </div> 
                                        <div className="col-md-3">
                                            <label htmlFor="validationCustom02" className="form-label">Middle name</label>
                                            <input type="text" className="form-control" id="validationCustom02" defaultValue="" required="" />
                                            <div className="valid-feedback">Looks good!</div>
                                        </div> 
                                        <div className="col-md-3">
                                            <label htmlFor="validationCustom02" className="form-label">Last name</label>
                                            <input type="text" className="form-control" id="validationCustom02" defaultValue="" required="" />
                                            <div className="valid-feedback">Looks good!</div>
                                        </div> 
                                        <div className="col-md-2">
                                            <label htmlFor="validationCustom04" className="form-label">Extention name</label>
                                            <select className="form-select" id="validationCustom04" required="" defaultValue="" >
                                                <option disabled>Choose...</option>
                                                <option></option>
                                                <option>Jr.</option>
                                                <option>Sr.</option>
                                                <option>II</option>
                                                <option>III</option>
                                                <option>VI</option>
                                                <option>V</option>
                                            </select>
                                            <div className="invalid-feedback">Please select a valid state.</div>
                                        </div>
                                        <div className="col-md-3">
                                            <label htmlFor="validationCustom04" className="form-label">Gender</label>
                                            <select className="form-select" id="validationCustom04" required="" defaultValue="" >
                                                <option disabled>Choose...</option>
                                                <option></option>
                                                <option>Male</option>
                                                <option>Female</option>
                                            </select>
                                            <div className="invalid-feedback">Please select a valid state.</div>
                                        </div>
                                        <div className="col-md-3">
                                            <label htmlFor="validationCustom02" className="form-label">Birth Date</label>
                                            <input type="date" className="form-control" id="validationCustom02" defaultValue="" required="" />
                                            <div className="valid-feedback">Looks good!</div>
                                        </div> 
                                    </div> 
                                    <div className="col-12">
                                        <div className="form-check">
                                            <input className="form-check-input" type="checkbox" defaultValue="" id="invalidCheck" required="" />
                                            <label className="form-check-label" htmlFor="invalidCheck">
                                            Agree to terms and conditions
                                            </label>
                                            <div className="invalid-feedback">You must agree before submitting.</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
            
        </div>
    </DashboardLayout>}
}