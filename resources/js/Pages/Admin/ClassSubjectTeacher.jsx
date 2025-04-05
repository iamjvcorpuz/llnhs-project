import React,{ Component } from "react";
import { Link } from '@inertiajs/react';
import { EachMethod } from '@/Components/EachMethod'
import swal from 'sweetalert';
import Swal from 'sweetalert2';

import ReactTable from "@/Components/ReactTable"; 

import DashboardLayout from '@/Layouts/DashboardLayout';


export default class ClassSubjectTeacher extends Component {
    constructor(props) {
		super(props);
        this.state = {            
            data: [],
            subjects: this.props.subjects, 
            teachers: this.props.teacher,
            advisoryList: this.props.advisory,
            sectionListTemp: this.props.sections,
            sectionList: [],
            yeargrade: this.props.schoolyeargrades,
            class: this.props.class,
            selected_grade: "",
            selected_grade_id: "",
            selected_section: "",
            selected_section_id: "",
            selected_teacher_name: "",
            selected_teacher_id: "",
            selected_subject: "",
            selected_subejct_id: "",
            selected_school_year: "",
            columns: [
                {
                    id: "no",
                    accessor: 'id',
                    Header: 'No.', 
                    width: 70,
                    className: "center"
                }, 
                {
                    id: "teacher",
                    Header: 'Teacher',  
                    width: 200,
                    accessor: 'teacher_fullname',
                    className: ""
                },
                {
                    id: "section",
                    Header: 'Section',  
                    accessor: 'section_name', 
                    width: 200,
                },
                {
                    id: "year_level",
                    Header: 'Grade Level',  
                    width: 200,
                    accessor: 'year_level'
                },
                {
                    id: "room",
                    Header: 'Room No.',  
                    width: 200,
                    accessor: 'year_level'
                },
                {
                    id: "time",
                    Header: 'Time',  
                    width: 200,
                    accessor: 'year_level'
                },
                {
                    id: "Action",
                    Header: 'Status',  
                    width: 150,
                    accessor: 'status',
                    className: "center",
                    Cell: ({row}) => { 
                       return <>                       
                        <button className="btn btn-danger btn-block btn-sm col-12 mb-1" onClick={()=>{this.deleteAdvisory(row.original.id);}} > <i className="bi bi-person-fill-x"></i> Remove</button>    
                        <button className="btn btn-info btn-block btn-sm col-12"> <i className="bi bi-pen"></i> Edit</button> 
                       </>            
                    }
                }
            ],
            track: this.props.track,
            strand: this.props.strand
        }

    }
    render() {
        return <DashboardLayout title="Class Subject" user={this.props.auth.user} ><div className="noselect">
            <div className="app-content-header"> 
                <div className="container-fluid"> 
                    <div className="row">
                    <div className="col-sm-6"><h3 className="mb-0"><i className="nav-icon bi bi-microsoft-teams"></i> Class Subject Teacher</h3></div>
                    <div className="col-sm-6">
                        <ol className="breadcrumb float-sm-end">
                            <li className="breadcrumb-item"><Link href="/admin/dashboard">Dashboard</Link></li>
                            <li className="breadcrumb-item active" aria-current="page">Class Subject</li>
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
                                    <h3 className="card-title"> <i className="bi bi-microsoft-teams"></i> Class Subject List</h3> 
                                    <button className="btn btn-primary float-right mr-1"> <i className="bi bi-person-plus-fill"></i> Add</button>    
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
            
        </div>
    </DashboardLayout>}
}
