import React,{ Component } from "react";
import { Head, Link } from '@inertiajs/react';
import { EachMethod } from '@/Components/EachMethod';
import swal from 'sweetalert';
import Swal from 'sweetalert2';

import ReactTable from "@/Components/ReactTable"; 

import DashboardLayout from '@/Layouts/DashboardLayout';


export default class Advisory extends Component {
    constructor(props) {
		super(props);
        this.state = {
            data: this.props.advisory,
            subjects: this.props.subjects,
            columns: [
                {
                    id: "no",
                    accessor: 'no',
                    Header: 'No.', 
                    width: 70,
                    className: "center"
                }, 
                {
                    id: "section",
                    Header: 'Section',  
                    accessor: 'section', 
                    width: 200,
                }, 
                {
                    id: "grade",
                    Header: 'Grade', 
                    width: 200,
                    accessor: 'fullname'
                }, 
                {
                    id: "year_level",
                    Header: 'Year Level',  
                    width: 200,
                    accessor: 'year_level'
                },  
                {
                    id: "teacher",
                    Header: 'Teacher',  
                    width: 200,
                    accessor: 'teacher',
                    className: "center"
                },
                {
                    id: "Action",
                    Header: 'Status',  
                    width: 200,
                    accessor: 'status',
                    className: "center",
                    Cell: ({row}) => { 
                       return <>                       
                        <button className="btn btn-danger btn-block btn-sm col-12 mb-1"> <i className="bi bi-person-fill-x"></i> Remove</button>    
                        <button className="btn btn-info btn-block btn-sm col-12"> <i className="bi bi-pen"></i> Edit</button> 
                       </>            
                    }
                }
            ]            
        }
        this._isMounted = false;
        // this.getAllRequiredData = this.getAllRequiredData.bind(this);
        // console.log(this.props.teacher)
    }

    componentDidMount() {
        this._isMounted = true; 
        // console.log(this);
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    getAllRequiredData() {

    }

    render() {
        return <DashboardLayout title="Subject">
            <div className="app-content-header"> 
                <div className="container-fluid"> 
                    <div className="row">
                    <div className="col-sm-6"><h3 className="mb-0"><i className="nav-icon bi bi-book-half"></i> Steacher's Advisory</h3></div>
                    <div className="col-sm-6">
                        <ol className="breadcrumb float-sm-end">
                            <li className="breadcrumb-item"> <i className="bi bi-speedometer mr-2"></i><Link href="/admin/dashboard">Dashboard</Link></li>
                            <li className="breadcrumb-item active" aria-current="page">Advisory</li>
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
                                    <h3 className="card-title  mt-2"> <i className="bi bi-person"></i> List</h3> 
                                    <Link className="btn btn-primary float-right mr-1" href="/admin/dashboard/advisory/new" > <i className="bi bi-person-plus-fill"></i> Add</Link>    
                                </div>
                                <div className="card-body">
                                    <ReactTable
                                        key={"react-tables"}
                                        className={"table table-bordered table-striped "}
                                        data={this.state.data} 
                                        columns={this.state.columns}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>

        </DashboardLayout>
    }
}