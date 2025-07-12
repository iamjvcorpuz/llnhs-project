import React,{ Component } from "react";
import { Link } from '@inertiajs/react';
import { EachMethod } from '@/Components/EachMethod'
import swal from 'sweetalert';
import Swal from 'sweetalert2';
import moment from 'moment';
import Select from 'react-select'  
import QRCode from "react-qr-code";
import Webcam from "react-webcam";
import { ImageCrop } from '@/Components/ImageCrop';
import axios from 'axios';
import ApexCharts from 'apexcharts'

import ReactTable from "@/Components/ReactTable"; 

import DashboardLayout from '@/Layouts/DashboardLayout';


export default class NewStudent extends Component {
    constructor(props) {
		super(props);
        this.state = {
            data: this.props.mygrades,
            columns: [ 
                {
                    id: "subjects",
                    Header: 'Subject', 
                    width: 200,
                    className: "text-left",
                    accessor: 'subject_name'
                }, 
                {
                    id: "q1",
                    Header: 'Q1',   
                    className: "center",
                    accessor: 'q1'
                }, 
                {
                    id: "q2",
                    Header: 'Q2',   
                    className: "center",
                    accessor: 'q2'
                }, 
                {
                    id: "q3",
                    Header: 'Q3',   
                    className: "center",
                    accessor: 'q3'
                }, 
                {
                    id: "q4",
                    Header: 'Q4',   
                    className: "center",
                    accessor: 'q4'
                }
            ],   
            eq1: false,
            eq2: false,
            eq3: false,
            eq4: false,      
            sy: this.props.sy   
        };
        console.log(this.props);
    }

    render() {
        return <DashboardLayout title="Student" user={this.props.auth.user} profile={this.props.auth.profile} ><div className="noselect">
            <div className="app-content-header"> 
                <div className="container-fluid"> 
                    <div className="row">
                    <div className="col-sm-6"><h3 className="mb-0"><i className="nav-icon bi bi-person-lines-fill"></i> Grades</h3></div>
                    <div className="col-sm-6">
                        <ol className="breadcrumb float-sm-end">
                            <li className="breadcrumb-item"><Link href="/admin/dashboard">Dashboard</Link></li>
                            <li className="breadcrumb-item active" aria-current="page">Grades</li>
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
                                <div className="row d-flex">
                                        <div className="col-lg-2 me-auto">
                                            <h3 className="card-title mt-2 "> <i className="bi bi-person"></i> Grades</h3>
                                        </div>                                        
                                        <div className="col-lg-4 text-right"> 
                                            <label htmlFor="" className="badge bg-primary">School Year: {this.state.sy}</label>
                                        </div>
                                        {/* <Link className="btn btn-primary col-lg-1 mr-1" href="/admin/dashboard/student/new" > <i className="bi bi-person-plus-fill"></i> Add</Link>     */}
                                    </div>
                                </div>
                                <div className="card-body"> 
                                    <ReactTable
                                        key={"react-tables"}
                                        className={"table table-bordered table-striped "}
                                        data={this.state.data} 
                                        columns={this.state.columns}
                                        showHeader={true}
                                        showPagenation={false}
                                        defaultPageSize={20}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
            
        </div>
    </DashboardLayout>}
}
