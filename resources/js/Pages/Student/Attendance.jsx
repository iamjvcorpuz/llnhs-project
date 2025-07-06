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
            data: [],
            columns: [
                {
                    Header: 'Date', 
                    width: 150,
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
                            if(element.mode == "absent") {
                                return <div key={`xt_${i}`} className={`btn btn-xs btn-${(element.mode=="IN"?'primary':'danger')} mr-1`} >{key} {element.mode.toUpperCase()}: {element.time}</div>;
                            } else {
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
                // {
                //     id: 3,
                //     title: "Present Subject 1",
                //     start: new Date(moment("2025-04-19 08:00 AM").toString()),
                //     end: new Date(moment("2025-04-19 09:00 AM").toString()),
                //     color: "#2bd34a",
                //     resource: "false",
                //     type: "Attendance",
                //     allDay: false
                // },
                // {
                //     id: 4,
                //     title: "Present Subject 2",
                //     start: new Date(moment("2025-04-19 09:00 AM").toString()),
                //     end: new Date(moment("2025-04-19 10:00 AM").toString()),
                //     color: "#2bd34a",
                //     resource: "false",
                //     type: "Attendance",
                //     allDay: false
                // },
                // {
                //     id: 5,
                //     title: "Present Subject 3",
                //     start: new Date(moment("2025-04-19 10:00 AM").toString()),
                //     end: new Date(moment("2025-04-19 11:00 AM").toString()),
                //     color: "#2bd34a",
                //     resource: "false",
                //     type: "Attendance",
                //     allDay: false
                // }
            ]
        }
        this._isMounted = false;
        this.loadAttendanceList = this.loadAttendanceList.bind(this); 
        console.log(this.props)
    }
    
    componentDidMount() {
        this._isMounted = true;
        let date = moment(new Date()).format('YYYY-MM')
        this.loadAttendanceList(date);
        // if(typeof(this.props.holidays)!="undefined"&&this.props.holidays!=null&&this.props.holidays.length>0) {
        //     let holidaysList = [];
        //     this.props.holidays.forEach((val,i,arr) => {
        //         holidaysList.push({
        //             id: 1,
        //             title: val.event_name,
        //             start: val.time_start,
        //             end: val.time_end,
        //             color: "#ff4646",
        //             resource: "false",
        //             type: val.type,
        //             allDay: true
        //         });
        //         if((i + 1) == arr.length) {
        //             this.setState({
        //                 holidaysList,
        //                 eventsList: [...holidaysList,...this.state.AttendanceList]
        //             },() => {
        //                 console.log(this.state.eventsList);
        //             });
        //         }
        //     });
        // } 
    }

    loadAttendanceList(month) {
        let list  = []; 
        let self = this;
        self.setState({data: this.props.timelogs.length>0?this.props.timelogs.filter(e=>e.month==month):[]});
        // axios.get('/student').then(function (response) {
        //   // handle success
        // //   console.log(response)
        //     if( typeof(response.status) != "undefined" && response.status == "200" ) {
        //         let data = typeof(response.data) != "undefined" && typeof(response.data.data)!="undefined"?response.data.data:[];
        //         data.forEach((element,index,arr) => {
        //             if(element.status != "remove") {
        //                 list.push({
        //                     no: index + 1,
        //                     id: element.id,
        //                     photo: element.picture_base64,
        //                     lrn: element.lrn,
        //                     fullname: `${element.last_name}, ${element.first_name} ${(element.extension_name!=null)?element.extension_name:''} ${element.middle_name}`.toLocaleUpperCase(),
        //                     level: "None",
        //                     section: "None",
        //                     sex: element.sex,
        //                     status: element.status
        //                 });
        //             }
        //             if((index + 1) == arr.length) {
        //                 self.setState({data: list});
        //             }                    
        //         });
        //         // console.log(data);
        //     }
        // }).catch(function (error) {
        //   // handle error
        // //   console.log(error);
        // }).finally(function () {
        //   // always executed
        // });
    }
 

    render() { 
        return <DashboardLayout title="Attendance" user={this.props.auth.user} profile={this.props.auth.profile}>
            <div className="app-content-header"> 
                <div className="container-fluid"> 
                    <div className="row">
                    <div className="col-sm-6"><h3 className="mb-0"><i className="nav-icon bi bi-person-lines-fill"></i> My Attendance</h3></div>
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
                    
                    <div className="row">
                        <div className="col-lg-12">
                            <div className="card mb-4">
                                <div className="card-header">
                                    <div className="row d-flex">
                                        <div className="col-lg-2 me-auto">
                                            <h3 className="card-title mt-2 "> <i className="bi bi-person"></i> Attendance</h3>
                                        </div>                                        
                                        <div className="col-lg-4">
                                            <div className="input-group">
                                                <span  className="input-group-text">Month</span>
                                                <input type="month" onChange={(e) => this.loadAttendanceList(e.target.value)} />
                                                {/* <select  className="form-select" id="gender" required="" defaultValue="" >
                                                    <option disabled>Choose...</option>
                                                    <option>This Month</option>
                                                    <option>2021-2022</option>
                                                    <option>2022-2023</option>
                                                    <option>2023-2024</option>
                                                    <option>2024-2025</option>
                                                    <option>2025-2026</option>
                                                </select> */}
                                            </div> 
                                        </div>
                                        {/* <Link className="btn btn-primary col-lg-1 mr-1" href="/admin/dashboard/student/new" > <i className="bi bi-person-plus-fill"></i> Add</Link>     */}
                                    </div>
                                    
                                </div>
                                <div className="card-body">
                                {/* <Calendar
                                    events={this.state.eventsList}
                                    localizer={localizer}
                                    startAccessor="start"
                                    endAccessor="end"
                                    // popup
                                    style={{ height: 500 }}
                                    // eventPropGetter={event => {
                                    //     const eventData = this.state.eventsList.find(ot => ot.id === event.id);
                                    //     const backgroundColor = eventData && eventData.color;
                                    //     return { style: { backgroundColor } };
                                    // }}
                                /> */}
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