import React,{ Component } from "react";
import { Head } from '@inertiajs/react';
import { EachMethod } from '@/Components/EachMethod'
import swal from 'sweetalert';
import Swal from 'sweetalert2';
// import {
//     createColumnHelper,
//     flexRender,
//     getCoreRowModel,
//     useReactTable,
//   } from '@tanstack/react-table'


// import ReactTable from "react-table"; 
// import 'react-table/react-table.css';  

export default class AttendancePage extends Component {
    constructor(props) {
		super(props);
        this.state = {
            requestimg: '/adminlte/dist/assets/img/avatar.png',
            timeCount: "00:00:00 AM",
            datenow: "00/00/000 Monday",
            idnumber: "00001",
            fullname: "Juan Dela Filipe y Cresostomo Ibarra",
            logger_type: "Student",
            logger_section: "Section 1",
            data: [],
            columns: [
                {
                    Header: 'Employee Name', 
                    width: 197,
                    accessor: 'employee.fullNameReverse',
                  },  
                  {
                    Header: 'Time Logs',
                    accessor: 'logs', 
                    maxWidth: 800
                  }
            ],
            time_logs_status: "",
            time_logs_status_message: "",
            attendance_data: []
        }
        let loop_test = 0;
        setInterval(() => {
            this.setState({
                attendance_data: [...this.state.attendance_data,{
                    id: 0,
                    fullname: "Juan Dela Filipe y Cresostomo Ibarra",
                    nicname: "Juan",
                    timelogs: "Time In: 08:00 AM",
                    section: "Section 1"
                }]
            })
            if(loop_test==0) {
                this.setState({
                    time_logs_status: "bg-success",
                    time_logs_status_message:"Time In",
                    idnumber: "00001",
                    fullname: "Marco Polo",
                    logger_type: "Student",
                    logger_section: "Section 2"
                });
                loop_test++;
            } else if(loop_test==1) {
                this.setState({
                    idnumber: "00003",
                    fullname: "Jose RizalJosé Protacio Rizal Mercado y Alonso Realonda",
                    logger_type: "Student",
                    logger_section: "Section 3",
                    time_logs_status: "bg-success",
                    time_logs_status_message:"Time Out"
                });
                loop_test++;
            } else if(loop_test==2) {
                this.setState({
                    idnumber: "00003",
                    fullname: "Eric Santos",
                    logger_type: "Student",
                    logger_section: "Section 11",
                    time_logs_status: "bg-danger",
                    time_logs_status_message:"Scan Fail"
                });
                loop_test++;
            } else if(loop_test==3) {
                this.setState({
                    idnumber: "",
                    fullname: "",
                    logger_type: "",
                    logger_section: "",
                    time_logs_status: "bg-danger",
                    time_logs_status_message:"Sorry Please Try Again"
                });
                loop_test=0;
            }
        }, 2000);

    }
    render() {
        return <div className="noselect">
            <Head title="Attendance" />
            <nav className="main-header navbar attendance-nav">
                <div className="attendance-nav-container">
                    <div className="col-lg-1">
                        <center>
                            <img src="/images/ic_launcher.png" alt="AdminLTE Logo" className="img-circle" height={100} width={100} />
                        </center>
                    </div> 
                    <div className="col-lg-9">
                        <label className="attendance-school-font">Lebak Legislated National High School </label>  
                        <p className="h5">Poblacion III Lebak, Sultan Kudarat, 9807 Philippines</p>
                    </div> 
                    <div className="col-lg-2">
                        <img src="/images/depedlogo.png" alt="AdminLTE Logo" className="img-circle" width={250} /> 
                    </div> 
                </div>
            </nav>
            <div className="">
                <div className="log-user-photo">
                    <center> 
                        <img className="attendance-login-profile logo_round shadow" src={this.state.requestimg!=""?this.state.requestimg:"/adminlte/dist/assets/img/avatar.png"}
                        ref={t=> this.photo_time_view_image = t}
                        onError={(e)=>{ 
                            this.photo_time_view_image.src='/images/adminlte/dist/assets/img/avatar.png'; 
                        }} alt="Picture Error" />
                    </center> 
                    {(this.state.time_logs_status!="")?<div className={`time-logs center text-white ${this.state.time_logs_status}`}>
                        <label>{this.state.time_logs_status_message}</label>
                    </div>:null}

                </div>
                <div className="log-center-data">
                    <div className="header_time">  
                        <div className="timeCount">{this.state.timeCount}</div>  
                        <div className="dateCount" >{this.state.datenow}</div>
                    </div>
                    {/* <hr /> */}
                    <br />
                    <br />
                    <br />
                    <div className="header_time">
                        <div className="logger-name-small">LRN : {this.state.idnumber}</div> 
                        <div className="logger-name"><strong>{(this.state.fullname!="")?this.state.fullname:"-"}</strong></div> 
                        <div className="logger-name-small">{(this.state.logger_section!="")?this.state.logger_section:"-"}</div>
                        
                    </div>
                    {/* <hr /> */}
                    <div className="header_time">
                        {/* <ReactTable  
                            resizable={true} 
                            showPaginationTop={false} 
                            showPaginationBottom={true}
                            showPageSizeOptions={false} 
                            data={this.state.data} 
                            columns={this.state.columns}
                        /> */}
                    </div>
                    <div className="log-center-data-total-logs">
                        Total Logs: {this.state.attendance_data.length}
                    </div>
                </div>
                <div className="log-right-photo-list">
                    <div className="view_list_right_side">
                        <EachMethod of={this.state.attendance_data} render={(element,index) => {
                            return <div className="image_list"  key={index}>
                                <img className={`logo_round_mini_mobile`} style={{height: "100px" }} 
                                    onError={(e)=>{
                                        e.target.error=null;
                                        e.target.src='/adminlte/dist/assets/img/avatar.png';
                                    }}
                                    src={'/adminlte/dist/assets/img/avatar.png'} 
                                    onClick={() => {
                                        console.log("image call single click"); 
                                    }} 
                                    onDoubleClick={()=>{
                                        
                                    }} alt="profile picture"  />
                                <p className="logo_round_mini_name" ><strong>{element.fullname}</strong></p>
                                <hr />
                                {/* <p className="logo_round_mini_name" >{element.section}</p> */}
                                <p className="logo_round_mini_name log-right-photo-list-time badge bg-success" >{element.timelogs}</p>
                            </div>                    
                        }} />                        
                    </div>
                </div>
            </div>
        </div>
    }
}