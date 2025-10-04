import React,{ Component } from "react";
import { Link } from '@inertiajs/react';
import { EachMethod } from '@/Components/EachMethod'
import { ReactNotificationManager,ReactNotificationContainer } from '@/Components/Notification';  
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


export default class ClassSchedule extends Component {
    constructor(props) {
		super(props);
        this.state = {
            schedules: typeof(this.props.schedules)!="undefined"?this.props.schedules:[],
            classDetails: typeof(this.props.classDetails)!="undefined"?this.props.classDetails:[],
            data: [],
            columns: [
                // {
                //     id: "no",
                //     accessor: 'id',
                //     Header: 'No.', 
                //     width: 50,
                //     className: "center"
                // }, 
                {
                    id: "level",
                    Header: 'Subject Name',  
                    accessor: 'subject_name',
                    className: "center",
                    filterable: true,
                    width: 226,
                }, 
                {
                    id: "teacher",
                    Header: 'Teacher',  
                    accessor: 'last_name',
                    className: "center",
                    filterable: true,
                    width: 226,
                    Cell: ({row}) => {
                        return <label>{`${row.original.last_name}, ${row.original.first_name} `}</label>
                    }
                }, 
                {
                    id: "time",
                    Header: 'Time',  
                    accessor: 'grade',
                    filterable: false,
                    Cell: ({row}) => { 
                        let schedule_day = [];                      
                        if(row.original.monday=="1"){
                            schedule_day.push("Mon");
                        } 
                        if(row.original.tuesday=="1"){
                            schedule_day.push("Tue");
                        } 
                        if(row.original.wednesday=="1"){
                            schedule_day.push("Wed");
                        } 
                        if(row.original.thursday=="1"){
                            schedule_day.push("Thu");
                        } 
                        if(row.original.friday=="1"){
                            schedule_day.push("Fri");
                        } 
                        if(row.original.saturday=="1"){
                            schedule_day.push("Sat");
                        } 
                       return <> 
                        {moment(row.original.time_start, 'hh:mm A').format('hh:mm A')} - {moment(row.original.time_end, 'hh:mm A').format('hh:mm A')} <br />
                        {(schedule_day.length>0)?schedule_day.toString().replaceAll(',',' - '):""}
                       </>     
                    }
                    // Cell: ({row}) => { 
                    //    return <> 
                    //     {row.original.time_start} - {row.original.time_end} <br /> 
                    //    </>            
                    // }
                }
            ],
            columns_all: [
                // {
                //     id: "no",
                //     accessor: 'id',
                //     Header: 'No.', 
                //     width: 50,
                //     className: "center"
                // }, 
                {
                    id: "level",
                    Header: 'Subject Name',  
                    accessor: 'subject_name',
                    className: "center",
                    filterable: true,
                    width: 226,
                }, 
                {
                    id: "teacher",
                    Header: 'Teacher',  
                    accessor: 'last_name',
                    className: "center",
                    filterable: true,
                    width: 226,
                    Cell: ({row}) => {
                        return <label>{`${row.original.last_name}, ${row.original.first_name} `}</label>
                    }
                }, 
                {
                    id: "time",
                    Header: 'Time',  
                    accessor: 'grade',
                    filterable: false,
                    Cell: ({row}) => { 
                        let schedule_day = [];                      
                        if(row.original.monday=="1"){
                            schedule_day.push("Mon");
                        } 
                        if(row.original.tuesday=="1"){
                            schedule_day.push("Tue");
                        } 
                        if(row.original.wednesday=="1"){
                            schedule_day.push("Wed");
                        } 
                        if(row.original.thursday=="1"){
                            schedule_day.push("Thu");
                        } 
                        if(row.original.friday=="1"){
                            schedule_day.push("Fri");
                        } 
                        if(row.original.saturday=="1"){
                            schedule_day.push("Sat");
                        } 
                       return <> 
                        {moment(row.original.time_start, 'hh:mm A').format('hh:mm A')} - {moment(row.original.time_end, 'hh:mm A').format('hh:mm A')} <br />
                        {(schedule_day.length>0)?schedule_day.toString().replaceAll(',',' - '):""}
                       </>     
                    }
                }
            ],
            loading: false,
            overAllSchedule: false
        }
        this.loadSched = this.loadSched.bind(this);
        console.log(this.props)
    }
    componentDidMount() {
        this.loadSched("all");
    }
    loadSched(day) { 
        let temp_data = [];
        this.setState({loading: true,overAllSchedule:false});
        if(day == "monday") { 
            this.state.schedules.forEach(val => { 
                if(val.monday == "1") {
                    temp_data.push(val);
                }
            });
        } else if(day == "tuesday") { 
            this.state.schedules.forEach(val => { 
                if(val.tueday == "1") {
                    temp_data.push(val);
                }
            });
        } else if(day == "wednesday") { 
            this.state.schedules.forEach(val => { 
                if(val.wednesday == "1") {
                    temp_data.push(val);
                }
            });
        } else if(day == "thursday") { 
            this.state.schedules.forEach(val => { 
                if(val.thursday == "1") {
                    temp_data.push(val);
                }
            });
        } else if(day == "friday") { 
            this.state.schedules.forEach(val => { 
                if(val.friday == "1") {
                    temp_data.push(val);
                }
            });
            
        } else  if(day == "all") { 
            this.state.schedules.forEach(val => {  
                temp_data.push(val); 
            });
            this.setState({overAllSchedule: true});
        }

        setTimeout(() => {
            this.setState({
                data: temp_data,
                loading: false
            })
        }, 1000);


    }
    render() {
        return <DashboardLayout title="Student" user={this.props.auth.user} ><div className="noselect">
            <div className="app-content-header"> 
                <div className="container-fluid"> 
                    <div className="row">
                    <div className="col-sm-6"><h3 className="mb-0"><i className="nav-icon bi bi-door-open-fill"></i> Class Schedule</h3></div>
                    <div className="col-sm-6">
                        <ol className="breadcrumb float-sm-end">
                            <li className="breadcrumb-item"><Link href="/admin/dashboard">Dashboard</Link></li>
                            {/* <li className="breadcrumb-item"><Link href="/admin/dashboard/class">Class</Link></li> */}
                            <li className="breadcrumb-item active" aria-current="page">Schedule</li>
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

                                    <div className="row mb-2">
                                        <div className="col-lg-10">
                                            <h3 className="mb-0"><i className="nav-icon bi bi-bookmark"></i> Class Name: <strong className="badge bg bg-primary">{(this.state.classDetails.length>0)?this.state.classDetails[0].section_name:""}</strong></h3>
                                            <div className="col-lg-12"> 
                                                STRAND: {(this.state.classDetails.length>0)?this.state.classDetails[0].strands:""} 
                                            </div>
                                            <div className="col-lg-12"> 
                                                TRACK: {(this.state.classDetails.length>0)?this.state.classDetails[0].track:""} 
                                            </div>
                                        </div>
                                        <div className="col-lg-2">
                                            <div className="col-lg-12"> 
                                                    SY: {(this.state.classDetails.length>0)?this.state.classDetails[0].school_year:""} 
                                            </div>
                                            <div className="col-lg-12"> 
                                                    Grade: {(this.state.classDetails.length>0)?this.state.classDetails[0].grade:""} 
                                            </div>
                                            <div className="col-lg-12"> 
                                                    Level: {(this.state.classDetails.length>0)?this.state.classDetails[0].level:""} 
                                            </div>
                                        </div>
                                       
                                    </div> 
                                    <hr />
                                    <div className="col-lg-12">                                        
                                        <button className="btn btn-primary mr-1" onClick={() => {
                                            this.loadSched("monday");
                                        }}>Monday</button>
                                        <button className="btn btn-primary mr-1" onClick={() => {
                                            this.loadSched("tuesday");
                                        }}>Tuesday</button>
                                        <button className="btn btn-primary mr-1" onClick={() => {
                                            this.loadSched("wednesday");
                                        }}>Wednesday</button>
                                        <button className="btn btn-primary mr-1" onClick={() => {
                                            this.loadSched("thursday");
                                        }}>Thursday</button>
                                        <button className="btn btn-primary mr-1" onClick={() => {
                                            this.loadSched("friday");
                                        }}>Friday</button>
                                        <button className="btn btn-info mr-1" onClick={() => {
                                            this.loadSched("all");
                                        }}>View All</button>
                                    </div>
                                </div>
                                <div className="card-body p-0"> 
                                    {this.state.overAllSchedule==false?<ReactTable
                                        key={"react-tables"}
                                        className={"table table-bordered table-striped "}
                                        data={this.state.data} 
                                        columns={this.state.columns}
                                        defaultPageSize={15}
                                        loading={this.state.loading} 
                                    />:<ReactTable
                                        key={"react-tables"}
                                        className={"table table-bordered table-striped "}
                                        data={this.state.data} 
                                        columns={this.state.columns_all}
                                        defaultPageSize={15}
                                        loading={this.state.loading} 
                                    />}
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
            
        </div>
    </DashboardLayout>}
}
