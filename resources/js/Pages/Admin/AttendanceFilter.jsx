import React,{ Component } from "react";
import { Head, Link } from '@inertiajs/react';
import { EachMethod } from '@/Components/EachMethod';
import swal from 'sweetalert';
import Swal from 'sweetalert2';
import axios from 'axios';
// import QRCode from 'qrcode';
import QRCode from "react-qr-code";
import ReactTable from "@/Components/ReactTable"; 

import DashboardLayout from '@/Layouts/DashboardLayout';
import { ReactNotificationManager,ReactNotificationContainer } from '@/Components/Notification'; 
// const generateQR = async text => {
//     try {
//       console.log(await QRCode.toDataURL(text))
//     } catch (err) {
//       console.error(err)
//     }
//   }
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
// import globalize from 'globalize';
// const localizer = globalizeLocalizer(globalize);
const localizer = momentLocalizer(moment);


export default class Student extends Component {
    constructor(props) {
		super(props);
        this.state = {
            data: typeof(this.props.result)!="undefined"&&typeof(this.props.result.logs)!="undefined"?this.props.result.logs:[],
            columns: [
                {
                    Header: 'Date', 
                    width: 100,
                    accessor: 'date',
                    className: "text-start"
                },  
                {
                    Header: 'Time Logs', 
                    accessor: 'logs',
                    className: "text-wrap",
                    minWidth: 800,
                    Cell: ({row}) => {  
                        let timelogs = "wait";
                        let key = row.original.id;
                        timelogs = row.original.logs.map((element,i) => {
                            if(element.mode != "absent") {
                                return <div key={`xt_${i}`} className={`btn btn-xs btn-${(element.mode=="IN"?'primary':'danger')} mr-1`} >{key} TIME {element.mode}: {element.time}</div>;
                            }                            
                        });
                       return <div key={`t_${key}`}> 
                        {timelogs}
                       </div>            
                    }
                }
            ],
            eventsList: [],
            holidaysList: [
                {
                    id: 1,
                    title: "Araw",
                    start: "2025-04-19",
                    end: "2025-04-19",
                    color: "#ff4646",
                    resource: "false",
                    type: "holiday",
                    allDay: "true"
                }
            ],
            AttendanceList: [
                {
                    id: 3,
                    title: "Present Subject 1",
                    start: new Date(moment("2025-04-19 08:00 AM").toString()),
                    end: new Date(moment("2025-04-19 09:00 AM").toString()),
                    color: "#2bd34a",
                    resource: "false",
                    type: "Attendance",
                    allDay: false
                },
                {
                    id: 4,
                    title: "Present Subject 2",
                    start: new Date(moment("2025-04-19 09:00 AM").toString()),
                    end: new Date(moment("2025-04-19 10:00 AM").toString()),
                    color: "#2bd34a",
                    resource: "false",
                    type: "Attendance",
                    allDay: false
                },
                {
                    id: 5,
                    title: "Present Subject 3",
                    start: new Date(moment("2025-04-19 10:00 AM").toString()),
                    end: new Date(moment("2025-04-19 11:00 AM").toString()),
                    color: "#2bd34a",
                    resource: "false",
                    type: "Attendance",
                    allDay: false
                }
            ],
            student_list: this.props.student,
            employee_list: this.props.employee,
            data_list: [],
            monthYear: "",
            loading: false,
            queryType: "",
            selectedQr: "",
            selectedID: ""
        }
        this._isMounted = false;
        this.loadAttendanceList = this.loadAttendanceList.bind(this);
        this.loadFilter = this.loadFilter.bind(this);
        this.selectedMonthYear = this.selectedMonthYear.bind(this);
        console.log(this.props)
    }
    
    componentDidMount() {
        // console.log(typeof(this.props.result)!="undefined"&&typeof(this.props.result.logs)!="undefined"?this.props.result.logs:[])
        this._isMounted = true;
        let self = this;
        $("#data-list" ).select2({
            theme: "bootstrap",
            selectionCssClass: 'form-control',
            containerCssClass: 'form-control'
        });
        $('#data-list').on('select2:select', function (e) { 
            var selectedData = e.params.data; 
            self.setState({
                selectedQr: selectedData.id
            }) 
        });
        // this.loadStudentList();
        // console.log(this.props)
        if(typeof(this.props.holidays)!="undefined"&&this.props.holidays!=null&&this.props.holidays.length>0) {
            let holidaysList = [];
            this.props.holidays.forEach((val,i,arr) => {
                holidaysList.push({
                    id: 1,
                    title: val.event_name,
                    start: val.time_start,
                    end: val.time_end,
                    color: "#ff4646",
                    resource: "false",
                    type: val.type,
                    allDay: true
                });
                if((i + 1) == arr.length) {
                    this.setState({
                        holidaysList,
                        eventsList: [...holidaysList,...this.state.AttendanceList]
                    },() => {
                        console.log(this.state.eventsList);
                    });
                }
            });
        }
        // console.log(this)
        // let list  = [];
        // for (let index = 0; index < 10; index++) {

        //     list.push({
        //         no: index + 1,
        //         photo: "",
        //         lrn: '00000000000000000000',
        //         fullname: "Student " + index,
        //         level: " Grade " + index,
        //         section: "Section "  + index,
        //         status: "Active"
        //     })
            
        // }
        // this.setState({data: list});
    //     const holidays = []
    //    this.state.holidaysList.forEach((holiday) => {
    //        let start = moment(holiday.for_date).toDate()
    //        holidays.push({ id: holiday.id, title: holiday.occasion, start: start, end: start, color: holiday.color, resource: holiday.is_restricted, type: 'holiday', allDay: 'true' })
    //    })
    //    const leaves = []
    //    this.state.absentiesList.forEach((leave) => {
    //        let start_at = (new Date(leave.start_at))
    //        let end_at = (new Date(leave.end_at))
    //        leaves.push({ id: leave.id, title: leave.username, start: start_at, end: end_at, color: leave.color, type: 'leave', allDay: 'true' })
    //    })
    //    const list = [...holidays, ...leaves]
    }


    loadAttendanceList() {
        let self = this;
        let date = moment(new Date()).format("YYYY-MM-DD");
        if( typeof(this.state.selectedMonthYear) != "undefined" && this.state.selectedQr != "" && this.state.queryType != "" && this.state.selectedMonthYear != "") {
            self.setState({loading: true})
            // console.log({qrcode: this.state.selectedQr,type: this.state.queryType ,date:this.state.selectedMonthYear})
            axios.post('/attendance/filter/time/logs',{qrcode: this.state.selectedQr,type: this.state.queryType ,date:this.state.selectedMonthYear}).then(function (response) {
                // console.log(response)
                if( typeof(response.status) != "undefined" && response.status == "200" ) {
                    let data = typeof(response.data) != "undefined" && typeof(response.data.data)!="undefined"?response.data.data:{};
                    // console.log("aw",response.data.status,data);
                    if(typeof(response.data)!="undefined"&&response.data.status == "success") {
                        self.setState({data: data,loading: false});
                    }
                }
            });            
        } else if( typeof(this.state.selectedMonthYear) == "undefined" && this.state.selectedQr == "" && this.state.queryType == "" && this.state.selectedMonthYear != ""){
            ReactNotificationManager.error('Sorry','Please fill required field first')   
        } else if(typeof(this.state.selectedMonthYear) == "undefined" || this.state.selectedMonthYear == "" ) {
            ReactNotificationManager.error('Sorry','Please select Year and Month')   
        } else if(typeof(this.state.selectedQr) != "undefined" && this.state.queryType != "" && this.state.selectedQr == "" ) {
            if(this.state.queryType == "student") {
                ReactNotificationManager.error('Sorry','Please select Student')   
            } else if(this.state.queryType == "employee") {
                ReactNotificationManager.error('Sorry','Please select Employee')   
            }
        } else if(typeof(this.state.queryType) != "undefined" && this.state.queryType == "" ) {
            ReactNotificationManager.error('Sorry','Please select Type field')   
        }

    }

    loadFilter(val) {
        // console.log(val);
        this.setState({data_list: [],queryType: ''},() => {
            if(val == "Employee") {
                this.setState({data_list: this.state.employee_list,queryType: 'employee'});
            } else if(val == "Student") {
                this.setState({data_list: this.state.student_list,queryType: 'student'});
            }
        });
    }

    selectedMonthYear(val) {
        // console.log("val",val);
        this.setState({selectedMonthYear: val});
    }
    render() { 
        return <DashboardLayout title="Attendance" user={this.props.auth.user} profile={this.props.auth.profile}>
            <div className="app-content-header"> 
                <div className="container-fluid"> 
                    <div className="row">
                    <div className="col-sm-6"><h3 className="mb-0"><i className="nav-icon bi bi-person-lines-fill"></i> Attendance</h3></div>
                    <div className="col-sm-6">
                        <ol className="breadcrumb float-sm-end">
                            <li className="breadcrumb-item"><i className="bi bi-speedometer mr-2"></i><Link href="/parents/dashboard">Dashboard</Link></li> 
                        </ol>
                    </div>
                    </div> 
                </div> 
            </div>

            <div className="app-content">
                <div className="container-fluid">
                    <div className="card card-default color-palette-box">
                        <div className="card-header">
                            <div className="row">

                                <div className="col-lg-2">
                                    <div className="form-group">
                                        <label >Type</label>
                                        <select id="type" className="form-control" onChange={e => this.loadFilter(e.target.value)}>
                                            <option></option>
                                            <option>Employee</option> 
                                            <option>Student</option> 
                                        </select>
                                    </div>
                                </div>

                                <div className="col-lg-7">

                                    <div className="form-group">
                                        <label >Find</label>
                                        <select id="data-list" className="form-control">
                                            <option></option> 
                                            <EachMethod of={this.state.data_list} render={(element,index) => {
                                                return <option value={element.qr_code} >{`${element.last_name}, ${element.first_name}`}</option>
                                            }} />
                                        </select>
                                    </div>

                                </div>

                                <div className="col-lg-2">
                                    <div className="form-group">
                                        <label >Month</label>
                                        <input type="month" className="form-control" onChange={(e) => this.selectedMonthYear(e.target.value)} /> 
                                    </div> 
                                </div>

                                <div className="col-lg-1">
                                    <br />
                                    <button className="btn btn-primary" onClick={() => {
                                        this.loadAttendanceList();
                                    }}>
                                        <i className="bi bi-search"></i>
                                    </button>
                                </div>
                            </div>

                        </div>
                        <div className="card-body p-0">

                            <div className="row">
                                <div className="col-lg-12">
                                    {/* <div className="loading-overlay">
                                        <div id="loadingSpinner" className="loading-spinner d-flex justify-content-center align-items-center" >
                                            <div className="spinner-border text-primary" role="status">
                                                <span className="visually-hidden">Loading...</span>
                                            </div>
                                        </div>
                                    </div> */}
                                    <ReactTable
                                        key={"react-tables"}
                                        className={"table table-bordered table-striped "}
                                        data={this.state.data} 
                                        columns={this.state.columns}
                                        defaultPageSize={31}
                                        showPagenation={false}
                                        loading={this.state.loading}
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