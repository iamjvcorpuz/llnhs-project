import React,{ Component } from "react";
import { Head, Link } from '@inertiajs/react';
import { EachMethod } from '@/Components/EachMethod';
import swal from 'sweetalert';
import Swal from 'sweetalert2';
import axios from 'axios';
// import QRCode from 'qrcode';
import QRCode from "react-qr-code";
import ReactTable from "@/Components/ReactTable"; 

import {capitalizeWords} from "@/Components/commonFunctions";

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


export default class AttendanceEvents extends Component {
    constructor(props) {
		super(props);
        this.state = {
            data: [],
            data_temp: [],
            columns: [
                {
                    Header: 'Date', 
                    width: 130,
                    accessor: 'date',
                    className: "text-start"
                },  
                {
                    Header: 'Day', 
                    width: 100,
                    accessor: 'day',
                    className: "center"
                },  
                {
                    Header: 'Time Logs', 
                    accessor: 'logs',
                    className: "text-wrap",
                    width: 800,
                    Cell: ({row}) => {  
                        let timelogs = "wait";
                        let key = row.original.id;
                        timelogs = row.original.logs.map((element,i) => {
                            let attendancestatus = $('input:radio[name="attendancestatus"]:checked').val();
                            // console.log(attendancestatus)
                            if( typeof(attendancestatus) != "undefined" && attendancestatus == "all" && element.mode != "absent") {
                                return <div key={`xt_${i}`} className={`btn btn-xs btn-${(element.mode=="IN"?'success':'info')} mr-1`} >TIME {element.mode}: {element.time}</div>;
                            } else if(typeof(attendancestatus) != "undefined" && attendancestatus == "all" && element.mode == "absent") {
                                return <div key={`xt_${i}`} className={`btn btn-xs btn-danger mr-1`} >Absent</div>;
                            } else if( typeof(attendancestatus) != "undefined" && attendancestatus == "present" && element.mode != "absent") {
                                return <div key={`xt_${i}`} className={`btn btn-xs btn-${(element.mode=="IN"?'success':'info')} mr-1`} >TIME {element.mode}: {element.time}</div>;
                            } else if(typeof(attendancestatus) != "undefined"  && attendancestatus == "absent" && element.mode == "absent") {
                                return <div key={`xt_${i}`} className={`btn btn-xs btn-danger mr-1`} >Absent</div>;
                            }
                        });
                       return <div key={`t_${key}`}> 
                        {timelogs}
                       </div>            
                    }
                }
            ],
            columns_classroom_status_monthly: [
                {
                    Header: 'Date', 
                    width: 200,
                    accessor: 'date',
                    className: "text-start"
                },  
                {
                    Header: 'Student Name', 
                    accessor: 'logs',
                    className: "text-wrap",
                    width: 800,
                    Cell: ({row}) => {  
                        let timelogs = "";
                        let key = row.original.id;
                        let date = row.original.date;
                        let filter_redundunt = [];
                        if(typeof(row.original) != "undefined") {
                            timelogs = row.original.logs.map((element1,i1) => {
                                if( typeof(element1.logs) !="undefined" &&  element1.logs.length > 0) {
                                    return element1.logs.map((element,i) => {
                                        if(element.date == date) {
                                            if(filter_redundunt.includes(element1.fullname) == false){
                                                filter_redundunt.push(element1.fullname);
                                                if(element.mode == "absent") {
                                                    return <div key={`xt_${i1+i}`} title="Absent" className={"btn btn-xs btn-danger mr-1"} >{element1.fullname}</div>;
                                                } else {
                                                    return <div key={`xt_${i1+i}`} title="Present" className={"btn btn-xs btn-success mr-1"} >{element1.fullname}</div>;
                                                }
                                            } 
                                        }
                                    });
                                } else {
                                    return <></>
                                }
                            });                            
                        }
                    return <div key={`t_${key}`}> 
                        {timelogs}
                    </div>            
                    }
                }
            ],
            columns_classroom_status_daily: [ 
                {
                    Header: 'Student Name', 
                    accessor: 'fullname',
                    className: "text-wrap",
                    filterable: true,
                    width: 800
                },
                {
                    Header: 'Room/Section', 
                    accessor: 'section_name',
                    className: "text-wrap center",
                    filterable: true,
                    width: 200,
                    Cell: ({row}) => { 
                        return <div className={`btn btn-xs btn-primary mr-1`} >{row.original.section_name.toUpperCase()}</div>;
                    }
                },
                {
                    Header: 'Status', 
                    accessor: 'logs',
                    className: "text-wrap center",
                    filterable: true,
                    width: 150,
                    Cell: ({row}) => {
                        if( typeof(row.original.logs) != "undefined" && row.original.logs == "present") {
                            return <div className={`btn btn-xs btn-success mr-1`} >{row.original.logs.toUpperCase()}</div>;
                        } else if( typeof(row.original.logs) != "undefined" && row.original.logs == "absent") {
                            return <div className={`btn btn-xs btn-danger mr-1`} >{row.original.logs.toUpperCase()}</div>;                            
                        }
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
            advisory_list: this.props.advisory,
            data_list: [],
            monthYear: typeof(this.props.result)!="undefined"&&typeof(this.props.result.date)!="undefined"?this.props.result.date:"",
            loading: false,
            queryType: typeof(this.props.result)!="undefined"&&typeof(this.props.result.type)!="undefined"?this.props.result.type:"",
            selectedQr: typeof(this.props.result)!="undefined"&&typeof(this.props.result.qrcode)!="undefined"?this.props.result.qrcode:"",
            selectedID: "",
            calendar: "monthly",
            events_list: this.props.eventsAll
        }
        this._isMounted = false;
        this.loadAttendanceList = this.loadAttendanceList.bind(this);
        this.loadFilter = this.loadFilter.bind(this);
        this.selectedMonthYear = this.selectedMonthYear.bind(this);
        this.loadAttendanceClassroom = this.loadAttendanceClassroom.bind(this);
        console.log(this.props)
    }
    
    componentDidMount() {
        this._isMounted = true;
        let self = this;
        let selected = $("#data-list" ).select2({
            theme: "bootstrap",
            selectionCssClass: 'form-control',
            containerCssClass: 'form-control',
            width: '100%'
        });
        
        $('#data-list').on('select2:select', function (e) { 
            var selectedData = e.params.data; 
            self.setState({
                selectedQr: selectedData.id
            }) 
        });

        $('input:radio[name="attendancestatus"]').on('change', function (e) { 
            let calendar = $('input:radio[name="calendar"]:checked').val();
            self.setState({loading: true});
            // console.log(e.target.value,self.state.data_temp.length,self.state.queryType,calendar); 
            if(self.state.data_temp.length > 0) { 
                let attendancestatus = $('input:radio[name="attendancestatus"]:checked').val();
                let data = [];
                console.log(attendancestatus);
                if(attendancestatus == "all") {
                    data = self.state.data_temp;
                } else {
                    self.state.data_temp.forEach(element => {
                        if(element.logs == attendancestatus) {
                            data.push(element);
                        }
                    });
                }
                self.setState({data: data,loading: false});
            } else {
                self.setState({loading: false});                
            }

        });

        if(this.state.queryType == "employee") {
            this.setState({data_list: this.state.employee_list},() => {
                selected.val(this.state.selectedQr).trigger('change'); 
            });
        } else if(this.state.queryType == "student") { 
            this.setState({data_list: this.state.student_list},() => {
                selected.val(this.state.selectedQr).trigger('change'); 
            });
        } else if(this.state.queryType == "classroom") { 
            this.setState({data_list: this.state.advisory_list},() => {
                selected.val(this.state.selectedQr).trigger('change'); 
            });
        }

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
        let calendar = $('input:radio[name="calendar"]:checked').val();
        $("#printbtn").attr("href",`/admin/attendance/print/${this.state.queryType}/${this.state.selectedQr}/${this.state.selectedMonthYear}`);
        if( typeof(this.state.selectedMonthYear) != "undefined" && this.state.selectedQr != "" && this.state.queryType != "" && this.state.selectedMonthYear != "") {
            self.setState({loading: true})
            // console.log({qrcode: this.state.selectedQr,type: this.state.queryType ,date:this.state.selectedMonthYear})
            axios.post('/attendance/filter/time/logs',{qrcode: this.state.selectedQr,type: this.state.queryType ,date:this.state.selectedMonthYear}).then(function (response) {
                // console.log(response)
                if( typeof(response.status) != "undefined" && response.status == "200" ) {
                    let data = typeof(response.data) != "undefined" && typeof(response.data.data)!="undefined"?response.data.data:{};
                    // console.log("aw",response.data.status,data);
                    if(typeof(response.data)!="undefined"&&response.data.status == "success") {
                        if(calendar == "monthly") {
                            let temp_list = [];

                            for (let index = 0; index < moment(self.state.selectedMonthYear).daysInMonth(); index++) {
                                let atten = [];
                                if(data.some(e=>e.date==`${self.state.selectedMonthYear}-${String(index+1).padStart(2, '0')}`)) { 
                                    try {                                        
                                        atten = data.find(e=>e.date==`${self.state.selectedMonthYear}-${String(index+1).padStart(2, '0')}`).logs;
                                    } catch (error) {
                                        
                                    }
                                }
                                temp_list.push({
                                    id: `list1_` +index+1,
                                    date: `${self.state.selectedMonthYear}-${String(index+1).padStart(2, '0')}`,
                                    day: moment(`${self.state.selectedMonthYear}-${String(index+1).padStart(2, '0')}`).format('ddd'),
                                    logs: atten,
                                    month: self.state.selectedMonthYear
                                });                                
                            }
                            self.setState({data: temp_list,data_temp: temp_list ,loading: false});
                        } else {
                            self.setState({data: data,data_temp: data,loading: false});
                        }
                        self.forceUpdate();
                    }
                    $("#printbtn").attr("href",`/admin/attendance/print/${self.state.queryType}/${self.state.selectedQr}/${self.state.selectedMonthYear}`);
                }
            });            
        } else if( typeof(this.state.selectedMonthYear) != "undefined" && this.state.selectedQr == "" && this.state.queryType != "" && this.state.selectedMonthYear != "") {
            self.setState({loading: true})
            // console.log({qrcode: this.state.selectedQr,type: this.state.queryType ,date:this.state.selectedMonthYear})
            axios.post('/attendance/filter/time/logs',{qrcode: this.state.selectedQr,type: this.state.queryType ,date:this.state.selectedMonthYear}).then(function (response) {
                // console.log(response)
                if( typeof(response.status) != "undefined" && response.status == "200" ) {
                    let data = typeof(response.data) != "undefined" && typeof(response.data.data)!="undefined"?response.data.data:{};
                    // console.log("aw",response.data.status,data);
                    if(typeof(response.data)!="undefined"&&response.data.status == "success") {
                        if(calendar == "monthly") {
                            let temp_list = [];

                            for (let index = 0; index < moment(self.state.selectedMonthYear).daysInMonth(); index++) {
                                let atten = [];
                                if(data.some(e=>e.date==`${self.state.selectedMonthYear}-${String(index+1).padStart(2, '0')}`)) { 
                                    try {                                        
                                        atten = data.find(e=>e.date==`${self.state.selectedMonthYear}-${String(index+1).padStart(2, '0')}`).logs;
                                    } catch (error) {
                                        
                                    }
                                }
                                temp_list.push({
                                    id: `list1_` +index+1,
                                    date: `${self.state.selectedMonthYear}-${String(index+1).padStart(2, '0')}`,
                                    day: moment(`${self.state.selectedMonthYear}-${String(index+1).padStart(2, '0')}`).format('ddd'),
                                    logs: atten,
                                    month: self.state.selectedMonthYear
                                });                                
                            }
                            self.setState({data: temp_list,data_temp: temp_list ,loading: false});
                        } else {
                            self.setState({data: data,data_temp: data,loading: false});
                        }
                        self.forceUpdate();
                    }
                    $("#printbtn").attr("href",`/admin/attendance/print/${self.state.queryType}/${self.state.selectedQr}/${self.state.selectedMonthYear}`);
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


    loadAttendanceAllList() {
        let self = this;
        let date = moment(new Date()).format("YYYY-MM-DD");
        let calendar = $('input:radio[name="calendar"]:checked').val();
        $("#printbtn").attr("href",`/admin/attendance/print/${this.state.queryType}/${this.state.selectedQr}/${this.state.selectedMonthYear}`);
        if( typeof(this.state.selectedMonthYear) != "undefined" && this.state.selectedQr != "" && this.state.queryType != "" && this.state.selectedMonthYear != "") {
            self.setState({loading: true})
            // console.log({qrcode: this.state.selectedQr,type: this.state.queryType ,date:this.state.selectedMonthYear})
            axios.post('/attendance/filter/time/logs',{qrcode: this.state.selectedQr,type: this.state.queryType ,date:this.state.selectedMonthYear}).then(function (response) {
                // console.log(response)
                if( typeof(response.status) != "undefined" && response.status == "200" ) {
                    let data = typeof(response.data) != "undefined" && typeof(response.data.data)!="undefined"?response.data.data:{};
                    // console.log("aw",response.data.status,data);
                    if(typeof(response.data)!="undefined"&&response.data.status == "success") {
                        if(calendar == "monthly") {
                            let temp_list = [];

                            for (let index = 0; index < moment(self.state.selectedMonthYear).daysInMonth(); index++) {
                                let atten = [];
                                if(data.some(e=>e.date==`${self.state.selectedMonthYear}-${String(index+1).padStart(2, '0')}`)) { 
                                    try {                                        
                                        atten = data.find(e=>e.date==`${self.state.selectedMonthYear}-${String(index+1).padStart(2, '0')}`).logs;
                                    } catch (error) {
                                        
                                    }
                                }
                                temp_list.push({
                                    date: `${self.state.selectedMonthYear}-${String(index+1).padStart(2, '0')}`,
                                    day: moment(`${self.state.selectedMonthYear}-${String(index+1).padStart(2, '0')}`).format('ddd'),
                                    logs: atten,
                                    month: self.state.selectedMonthYear
                                });                                
                            }

                            self.setState({data: temp_list,data_temp: temp_list,loading: false});
                        } else {
                            self.setState({data: data,data_temp: data,loading: false});
                        }
                        self.forceUpdate();
                    }
                    $("#printbtn").attr("href",`/admin/attendance/print/${self.state.queryType}/${self.state.selectedQr}/${self.state.selectedMonthYear}`);
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

    loadAttendanceClassroom() {
        let self = this;
        let date = moment(new Date()).format("YYYY-MM-DD");
        // $("#printbtn").attr("href",`/admin/attendance/print/${this.state.queryType}/${this.state.selectedQr}/${this.state.selectedMonthYear}`); 
        if(this.state.selectedQr != "") {
            self.setState({loading: true})  
            axios.post('/attendance/filter/time/logs/events',{qrcode: this.state.selectedQr,type: "event"}).then(function (response) {
                if( typeof(response.status) != "undefined" && response.status == "200" ) {
                    let data = typeof(response.data) != "undefined" && typeof(response.data.data)!="undefined"?response.data.data:{};
                    // console.log("aw loadAttendanceClassroom",response.data.status,data);
                    if(typeof(response.data)!="undefined"&&response.data.status == "success") {

                        self.setState({data: data,data_temp: data,loading: false});
                        self.forceUpdate();
                    }
                    $("#printbtn").attr("href",`/admin/events/attendance/print/${self.state.selectedQr}`);
                }
            });            
        } else {
            ReactNotificationManager.error('Sorry','Please select event field')   
        }
    }

    loadFilter(val) {
        let self = this;
        console.log(val);
        // $('input:radio[name="attendancestatus"]').prop('checked', false);
        $('input:radio[name="attendancestatus"]:first').prop('checked', true);
        self.setState({data_list: [],data:[],data_temp:[],selectedQr:""},() => {
            setTimeout(() => {
                self.setState({queryType: val,calendar: "monthly"},() => {
                    if(val == "employee") {
                        self.setState({data_list: self.state.employee_list});
                    } else if(val == "student") {
                        self.setState({data_list: self.state.student_list});
                    } else if(val == "classroom") {
                        self.setState({data_list: self.state.advisory_list});
                    }
                })
            }, 1000);
        });
    }

    selectedMonthYear(val) {
        // console.log("val",val);
        let calendar = $('input:radio[name="calendar"]:checked').val();
        this.setState({selectedMonthYear: val,calendar:calendar});
        
    }

    render() { 
        return <DashboardLayout title="Attendance" user={this.props.auth.user} profile={this.props.auth.profile}>
            <div className="app-content-header"> 
                <div className="container-fluid"> 
                    <div className="row">
                    <div className="col-sm-6"><h3 className="mb-0"><i className="nav-icon bi bi-person-lines-fill"></i> Event Attendance</h3></div>
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

                                <div className="col-lg-1">
                                    <div className="form-group"> 
                                        <div className="form-check">
                                            <input type="radio" className="form-check-input" id="radioAll" name="attendancestatus" defaultChecked="checked" value="all" />
                                            <label htmlFor="radioAll" className="form-check-label">
                                                All
                                            </label>
                                        </div> 
                                        <div className="form-check">
                                            <input type="radio" className="form-check-input" id="radioPresent" name="attendancestatus" defaultChecked="" value="present" />
                                            <label htmlFor="radioPresent" className="form-check-label">
                                                Present
                                            </label>
                                        </div> 
                                        <div className="form-check">
                                            <input type="radio" className="form-check-input" id="radioAbsent" name="attendancestatus" defaultChecked="" value="absent" />
                                            <label htmlFor="radioAbsent" className="form-check-label">
                                                Absent
                                            </label>
                                        </div> 
                                    </div>
                                </div>
                                
                                <div className={`col-lg-9`}>

                                    <div className="form-group">
                                        <label >Select Events</label>
                                        <select id="data-list" className="form-control form-block"> 
                                        <option value="" ></option>
                                            <EachMethod of={this.state.events_list} render={(element,index) => {
                                                return <option value={element.id} >{`Section: ${element.event_name} (${element.date} ${element.time_start} - ${element.time_end})`}</option>
                                            }} />
                                        </select>
                                    </div>

                                </div>
                                <div className="col-lg-2 mt-3"> 
                                    <button className="btn btn-primary btn-block mr-1" title="Load Search" onClick={() => {
                                       this.loadAttendanceClassroom();
                                    }}>
                                        <i className="bi bi-search"></i>
                                    </button>
                                    <a target="_blank" id="printbtn" disable="disabled" href={"#!"} className="btn btn-primary btn-block  mr-1" title="Print" ><i className="bi bi-printer"></i></a>

                                    <button className="btn btn-primary btn-block" title="Clear Search" onClick={() => {
                                        this.setState({selectedMonthYear:"",selectedQr:"",queryType:"",calendar: "monthly",data: []});
                                        $("#type").val("");
                                        $('input:radio[name="attendancestatus"]:first').prop('checked', true);
                                        $('input:radio[name="calendar"]:first').prop('checked', true);

                                    }}>
                                        <i className="bi bi-x-circle"></i>
                                    </button>
                                </div>
                                

                            </div>
                            <div className="row">

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
                                        key={"react-tables2"}
                                        className={"table table-bordered table-striped "}
                                        data={this.state.data} 
                                        columns={this.state.columns_classroom_status_daily}
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