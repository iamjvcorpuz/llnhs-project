import React,{ Component } from "react";
import { Head } from '@inertiajs/react';
import { EachMethod } from '@/Components/EachMethod';
import { Pagination , AlertSound,sortTimeDESC} from '@/Components/commonFunctions'; 
import swal from 'sweetalert';
import Swal from 'sweetalert2';
import moment from 'moment';
import axios from 'axios';
import ReactTable from "@/Components/ReactTable"; 

import DashboardLayout from '@/Layouts/DashboardLayout';

import { Scanner } from '@yudiel/react-qr-scanner';

setInterval( async () => {
    let dt = new Date();
    let time = moment(dt);  
    let dates = moment(dt);  
    let timecountings = time.format('hh:mm:ss A');
    let timedates = dates.format('LL');
    $("#timers").text(timecountings);
    $("#timesdates").text(timedates);
}, 800);

export default class AttendancePage extends Component {
    constructor(props) {
		super(props);
        this.state = {
            class_teaching: this.props.class_teaching,
            events: this.props.events,
            userdata: this.props.auth.user,
            requestimg: '/adminlte/dist/assets/img/avatar.png',
            timeCount: "00:00:00 AM",
            datenow: "00/00/000 Monday",
            profileImageBase64: "",
            lrn: "",
            idnumber: "",
            fullname: "",
            logger_type: "",
            logger_section: "",
            data: [],
            columns: [
                {
                    Header: 'Name', 
                    width: 197,
                    accessor: 'fullname',
                    className: "text-start"
                },  
                {
                    Header: 'Time Logs',
                    accessor: 'timelogs', 
                    maxWidth: 800
                }
            ],
            time_logs_status: "",
            time_logs_status_message: "",
            attendance_data: [],
            attendance_data_temp: [],
            pagenationIndex: 0,
            scanned_code: "",
            scan_paused: false,
            start_scanning: false,
            loading_subject_fetch: false,
            scan_type: "",
            subject_id:"",
            subject_name:"",
            classStudentList: []
        }
        this.intervals = null;
        let loop_test = 0;
        this.handleFocusableElements = true;
        this.eventKeys = this.eventKeys.bind(this);
        this.eventKeys2 = this.eventKeys2.bind(this);
        this.queryAccounts = this.queryAccounts.bind(this);
        this.queryAttendanceLogs = this.queryAttendanceLogs.bind(this);
        this.insertLogs = this.insertLogs.bind(this);
        this.loadStudentClass = this.loadStudentClass.bind(this);
        this.speak = this.speak.bind(this);
        this.AlertSound = AlertSound;
        this.timeoutScan = null;
        console.log(this.state.userdata);
    }

    componentDidMount() {
        let self = this;
        let count = 0;
        // let t = setInterval(() => {
        //     self.setState({
        //         attendance_data: [...self.state.attendance_data,{
        //             id: self.state.attendance_data.length,
        //             fullname: "Juan Dela Filipe y Cresostomo Ibarra",
        //             nicname: "Juan",
        //             timelogs: "Time In: 08:00 AM",
        //             section: "Section 1"
        //         }]
        //     },() => {
        //         Pagination(self.state.attendance_data,self.state.pagenationIndex,4,null).Content("",(result) => { 
        //             // console.log(result)
        //             if(typeof(result)!="undefined") { 
        //                 self.setState({attendance_data_temp: result}); 
        //             } else { 
        //                 self.setState({attendance_data_temp: result}); 
        //             }
        //         });
        //         if(count==10) {
        //             clearInterval(t)
        //         }
        //         count++;
        //     })
        // }, 500);
                // this.setState({
                //     idnumber: "00003",
                //     lrn: "00003",
                //     fullname: "Jose RizalJosé Protacio Rizal Mercado y Alonso Realonda",
                //     logger_type: "Student",
                //     logger_section: "Section 3",
                //     time_logs_status: "bg-success",
                //     time_logs_status_message:"Time Out"
                // });
        window.addEventListener('keydown', this.eventKeys);
        this.getAllTodaysTimeLogs();
    }

    paganationPosition(index) { 
        if(index < this.state.attendance_data_temp.length && index > 0) { 
            this.setState({pagenationIndex: index});
        } else if(index==0) { 
            this.setState({pagenationIndex: index});
        }
    }

    async eventKeys(key_, e){
        let self = this;
        let key = key_.key; 
        try {
            if(self.timeoutScan != null){
                self.setState({
                    userdata: {},
                    idnumber: "",
                    fullname: "",
                    logger_type: "",
                    logger_section: "",
                    time_logs_status: "bg-danger",
                    time_logs_status_message:"Please Try Again"
                });                
                return;
            } else {
                self.setState({
                    userdata: {},
                    idnumber: "",
                    fullname: "",
                    logger_type: "",
                    logger_section: "",
                    time_logs_status: "",
                    time_logs_status_message:""
                });
            }
            if (key == "Enter" && self.state.scanned_code != "Enter" && self.state.scanned_code.trim() !== "" ) { 
                console.log(self.state.scanned_code, " - aw");
                self.timeoutScan = setTimeout(() => {
                    clearTimeout(self.timeoutScan);
                    self.timeoutScan = null;
                }, 2000);
                self.queryAccounts(self.state.scanned_code);
                self.setState({
                    scanned_code: ""
                }); 
            } else {
                let card = self.state.scanned_code + key; 
                // console.log(card);
                if(key === 'Enter') {
                    self.setState({
                        scanned_code_history: "",
                        scanned_code: ""
                    });
                } else {
                    self.setState({
                        scanned_code_history: card,
                        scanned_code: card
                    });  
                }
        
            }            
        } catch (error) {
            
        }
    }

    eventKeys2(key_){
        let self = this;
        let key = key_; 
        try {
            if(self.timeoutScan != null){
                self.setState({
                    userdata: {},
                    idnumber: "",
                    fullname: "",
                    logger_type: "",
                    logger_section: "",
                    time_logs_status: "bg-danger",
                    time_logs_status_message:"Please Try Again"
                });                
                return;
            } else {
                self.setState({
                    userdata: {},
                    idnumber: "",
                    fullname: "",
                    logger_type: "",
                    logger_section: "",
                    time_logs_status: "",
                    time_logs_status_message:""
                });
            }
            if (key.trim() !== "" ) { 
                // console.log(self.state.scanned_code, " - aw");
                self.setState({
                    scanned_code: key,
                    scanned_code_history: key,
                    scan_paused: true
                },() => {
                    self.timeoutScan = setTimeout(() => {
                        clearTimeout(self.timeoutScan);
                        self.timeoutScan = null;
                        self.setState({scan_paused: false});
                    }, 5000);
                    self.queryAccounts(key);
                    self.setState({
                        scanned_code: ""
                    }); 
                }); 
            } else {
                let card = self.state.scanned_code + key; 
                // console.log(card);
                if(key === 'Enter') {
                    self.setState({
                        scanned_code_history: "",
                        scanned_code: ""
                    });
                } else {
                    self.setState({
                        scanned_code_history: card,
                        scanned_code: card
                    });  
                }
        
            }            
        } catch (error) {
            
        }
    }

    getTimeLogs(qrcode) {
        let date = moment(new Date()).format("YYYY-MM-DD")
        axios.post('/attendance/time/logs',{qrcode: qrcode,date:date}).then(function (response) {
            console.log(response)
            if( typeof(response.status) != "undefined" && response.status == "200" ) {
                let data = typeof(response.data) != "undefined" && typeof(response.data.data)!="undefined"?response.data.data:{};
                // console.log("aw",response.data.status,data);
                if(typeof(response.data)!="undefined"&&response.data.status == "success") {

                }
            }
        });
    }

    getAllTodaysTimeLogs() {
        let self = this;
        let date = moment(new Date()).format("YYYY-MM-DD")
        axios.post('/attendance/time/today/all/timelogs',{date:date}).then(function (response) {
            console.log(response)
            if( typeof(response.status) != "undefined" && response.status == "200" ) {
                let data = typeof(response.data) != "undefined" && typeof(response.data.data)!="undefined"?response.data.data:[];
                if(typeof(response.data)!="undefined"&&response.data.status == "success") {
                    self.setState({attendance_data: data.sort(sortTimeDESC)},() => {

                        Pagination(self.state.attendance_data,self.state.pagenationIndex,4,null).Content("",(result) => { 
                            // console.log(result)
                            if(typeof(result)!="undefined") { 
                                self.setState({attendance_data_temp: result}); 
                            } else { 
                                self.setState({attendance_data_temp: result}); 
                            }
                        });

                    });
                }
            }
        });
    }

    queryAccounts(code) {
        let self = this;
        console.log("queryAccounts code",code)
        axios.post('/attendance/account/find',{code: code}).then(function (response) {
            // handle success
            console.log(response)
            if( typeof(response.status) != "undefined" && response.status == "200" ) {
                let data = typeof(response.data) != "undefined" && typeof(response.data.data)!="undefined"?response.data.data:{};
                // console.log("aw",response.data.status,data);
                if(typeof(response.data)!="undefined"&&response.data.status == "success") {
                    console.log("aw",data);
                    if(self.state.classStudentList.length>0) {
                        if(self.state.classStudentList.some(e=>e.qr_code==code)) {
                            self.setState({
                                scan_paused: true,
                                userdata: data,
                                _id: data.id,
                                lrn: typeof(data.lrn)!="undefined"?data.lrn:data.qr_code,
                                profileImageBase64: data.picture_base64,
                                fullname: `${data.first_name} ${data.last_name}`.toLocaleUpperCase(),
                                idnumber: data.id,
                                logger_type: data.type,
                                logger_section: typeof(data.section)!="undefined"?data.section:""
                            },() => {
                                self.queryAttendanceLogs(code,data);                       
                            });
                        } else {
                            self.AlertSound.denied();
                            self.alertMessages();
                            self.setState({
                                scan_paused: false,
                                idnumber: "",
                                fullname: "",
                                logger_type: "",
                                logger_section: "",
                                time_logs_status: "bg-danger",
                                time_logs_status_message:"Sorry Not Allowed"
                            });
                            Swal.fire({  
                                title: "Sorry the student is not allowed to this class", 
                                showCancelButton: true,
                                showConfirmButton: false,
                                allowOutsideClick: false,
                                allowEscapeKey: false,
                                cancelButtonText: "Ok",
                                confirmButtonText: "Continue",
                                confirmButtonColor: "#DD6B55",
                                icon: "error",
                                showLoaderOnConfirm: false, 
                                closeOnClickOutside: false,  
                                dangerMode: true,
                            });
                        }
                    } else {
                        Swal.fire({  
                            title: "No Student added", 
                            showCancelButton: true,
                            showConfirmButton: false,
                            allowOutsideClick: false,
                            allowEscapeKey: false,
                            cancelButtonText: "Ok",
                            confirmButtonText: "Continue",
                            confirmButtonColor: "#DD6B55",
                            icon: "error",
                            showLoaderOnConfirm: false, 
                            closeOnClickOutside: false,  
                            dangerMode: true,
                        });
                    }
                } else if(typeof(response.data)!="undefined"&&response.data.status == "not_found") { 
                    self.AlertSound.denied();
                    self.alertMessages();
                    self.setState({
                        scan_paused: false,
                        idnumber: "",
                        fullname: "",
                        logger_type: "",
                        logger_section: "",
                        time_logs_status: "bg-danger",
                        time_logs_status_message:"Not Found"
                    });
                }
            } else {
                self.AlertSound.denied();
                self.alertMessages();
                self.setState({
                    scan_paused: false,
                    idnumber: "",
                    fullname: "",
                    logger_type: "",
                    logger_section: "",
                    time_logs_status: "bg-danger",
                    time_logs_status_message:"Sorry Please Try Again"
                });
            }
        }).catch(function (error) {
        // handle error
            console.log(error);
        }).finally(function () {
        // always executed
        });
    }

    queryAttendanceLogs(code,userdata) {    
        let self = this;
        let date = moment(new Date()).format("YYYY-MM-DD")
        axios.post('/attendance/time/logs',{qrcode: code,date:date}).then(function (response) {
            console.log(response);
            if( typeof(response.status) != "undefined" && response.status == "200" ) {
                let data = typeof(response.data) != "undefined" && typeof(response.data.data)!="undefined"?response.data.data:{};
                console.log("aw---",response.data.status,data);
                if(typeof(response.data)!="undefined"&&response.data.status == "success") {

                    let logs_stats = "Time In: " + moment(new Date()).format('hh:mm A');
                    let xx = self.state.attendance_data.filter(e => e._id==self.state._id); 
                    let mode = "";
                    let mode2 = "";
                    if(xx.length % 2 == 0) {
                        logs_stats = "Time In: " + moment(new Date()).format('hh:mm A');
                        mode = "IN";
                        mode2 = "TIME IN.";
                    } else {
                        logs_stats = "Time Out: " + moment(new Date()).format('hh:mm A');
                        mode = "OUT";
                        mode2 = "TIME OUT.";
                    }
                    if(xx.length==0) {
                        self.insertLogs({
                            code: code,
                            date: date,
                            time: moment(new Date()).format('hh:mm A'),
                            mode: mode,
                            class_id: self.state.subject_id,
                            subject_name: self.state.subject_name,
                            subject_id: self.state.subject_id,
                            teacher_id: self.props.auth.user.user_id
                        },userdata, () => {                            
                            self.speak(`${mode2}. Welcome ${self.state.fullname}`);
                            self.setState({
                                attendance_data: [...self.state.attendance_data,{
                                    _id: self.state._id,
                                    profile_photo: self.state.profileImageBase64,
                                    fullname: self.state.fullname,
                                    nicname: "",
                                    timelogs: logs_stats,
                                    section: "Section 1",
                                    mode: mode
                                }]
                            },() => {                
                                self.AlertSound.success_timelogs();
                                Pagination(self.state.attendance_data,self.state.pagenationIndex,4,null).Content("",(result) => { 
                                    // console.log(result)
                                    if(typeof(result)!="undefined") { 
                                        self.setState({attendance_data_temp: result}); 
                                    } else { 
                                        self.setState({attendance_data_temp: result}); 
                                    }
                                });
                            });
    
                        });
                    } else {
                        self.AlertSound.denied();
                        self.alertMessages();
                        self.setState({
                            scan_paused: false,
                            idnumber: "",
                            fullname: "",
                            logger_type: "",
                            logger_section: "",
                            time_logs_status: "bg-danger",
                            time_logs_status_message:"Already Login"
                        });
                        Swal.fire({  
                            title: "Already Login",
                            showCancelButton: true,
                            showConfirmButton: false,
                            allowOutsideClick: false,
                            allowEscapeKey: false,
                            cancelButtonText: "Ok",
                            confirmButtonText: "Continue",
                            confirmButtonColor: "#DD6B55",
                            icon: "error",
                            showLoaderOnConfirm: false, 
                            closeOnClickOutside: false,  
                            dangerMode: true,
                        });
                    }
                    
                    // self.alertMessages();
                }
            }  else {
                self.AlertSound.denied();
                self.alertMessages();
                self.setState({
                    scan_paused: false,
                    idnumber: "",
                    fullname: "",
                    logger_type: "",
                    logger_section: "",
                    time_logs_status: "bg-danger",
                    time_logs_status_message:"Sorry Please Try Again"
                });
            }
        });
    }

    insertLogs(logsdata,userdata,callback) {
        console.log(logsdata,userdata);
        let self = this;
        delete userdata.picture_base64;
        axios.post('/attendance/time/new/entry/by/class',{
            logsdata:logsdata,
            userdata:userdata
        }).then(function (response) {
            // handle success
            console.log(response)
            if( typeof(response.status) != "undefined" && response.status == "200" ) {
                let data = typeof(response.data) != "undefined" && typeof(response.data.data)!="undefined"?response.data.data:{};
                // console.log("aw",response.data.status,data);
                if(typeof(response.data)!="undefined"&&response.data.status == "success") {
                    console.log("aw",data);
                    // self.setState({
                    //     userdata: data,
                    //     _id: data.id,
                    //     lrn: typeof(data.lrn)!="undefined"?data.lrn:data.qr_code,
                    //     profileImageBase64: data.picture_base64,
                    //     fullname: `${data.first_name} ${data.last_name}`.toLocaleUpperCase(),
                    //     idnumber: data.id,
                    //     logger_type: data.type,
                    //     logger_section: typeof(data.section)!="undefined"?data.section:""
                    // },() => {
                    //     self.queryAttendanceLogs(code,data);
                    //     self.alertMessages();
                    // });
                    callback();
                    self.getAllTodaysTimeLogs();
                    self.alertMessages();
                } else if(typeof(response.data)!="undefined"&&response.data.status == "not_found") { 
                    self.AlertSound.denied();
                    self.alertMessages();
                    self.setState({
                        idnumber: "",
                        fullname: "",
                        logger_type: "",
                        logger_section: "",
                        time_logs_status: "bg-danger",
                        time_logs_status_message:"Not Found"
                    });
                    callback();
                }
            } else {
                self.AlertSound.denied();
                self.alertMessages();
                self.setState({
                    idnumber: "",
                    fullname: "",
                    logger_type: "",
                    logger_section: "",
                    time_logs_status: "bg-danger",
                    time_logs_status_message:"Sorry Please Try Again"
                });
                callback();
            }
        }).catch(function (error) {
        // handle error
            console.log(error);
            callback();
        }).finally(function () {
            callback();
        // always executed
        });
    }

    alertMessages() {
        let self = this;
        let timeoutIntervals = 5000;
        if(this.intervals != null) {
            clearTimeout(this.intervals);
            this.intervals = null;
        }
        //
        //
        this.intervals = setTimeout(() => {
            self.setState({
                lrn: "",
                profileImageBase64: "",
                requestimg: "",
                fullname: "",
                idnumber: "",
                logger_type: "",
                logger_section: "",
                time_logs_status: "",
                time_logs_status_message: ""
            },() => {
                clearTimeout(this.intervals);
                this.intervals = null;
            });
        }, timeoutIntervals);
    }

    loadStudentClass(id) {
        let self = this;
        let date = moment(new Date()).format("YYYY-MM-DD")
        axios.post('/attendance/class/students',{id:id}).then(function (response) {
            console.log(response)
            if( typeof(response.status) != "undefined" && response.status == "201" ) {
                let data = typeof(response.data) != "undefined" && typeof(response.data.data)!="undefined"?response.data.data:{};
                console.log("loadStudentClass",response.data.status,data);
                if(typeof(response.data)!="undefined"&&response.data.status == "success") {
                    self.setState({classStudentList: data,start_scanning: true,loading_subject_fetch:false});
                }
            }
        });
    }
    
    speak(text) {
        // Create a SpeechSynthesisUtterance
        const utterance = new SpeechSynthesisUtterance(text);
        const voices = speechSynthesis.getVoices();
        utterance.voice = voices[1];
        speechSynthesis.speak(utterance);
    }

    render() {
        return <DashboardLayout title="Student" user={this.props.auth.user} profile={this.props.auth.profile}><div className="noselect"> 
            <Head title="Attendance" /> 
            <div className="mx-auto">
                {(this.state.start_scanning==true)?<div className="log-center-data-mobile">
                    <div className="row">
                        {(this.state.logger_type=="student")?<div className="logger-name-small">{(this.state.idnumber!="")?`LRN : ${this.state.lrn}`:""}</div>:<div className="logger-name-small">{(this.state.idnumber!="")?`ID : ${this.state.lrn}`:""}</div> }
                        <div className="logger-name"><strong>{(this.state.fullname!="")?this.state.fullname:""}</strong></div> 
                        {(this.state.logger_type=="student")?<div className="logger-name-small">{(this.state.logger_section!="")?this.state.logger_section:""}</div>:null}                        
                    </div> 
                    <div className="row">  
                        <div className="col-lg-6 center" id="timers">-</div>  
                        <div className="col-lg-6 center" id="timesdates" >-</div>
                    </div> 
                    <div className="">
                        <Scanner 
                            scanDelay={5000}
                            scan_paused={this.state.scan_paused}
                            allowMultiple={true}
                            onScan={(result) => {
                                console.log(result[0].rawValue);
                                this
                                this.eventKeys2(result[0].rawValue);
                            }} 
                            onError={(e) => {
                                alert(e)
                            }} 
                        />
                    </div>

                    <div className="row">
                        <div className="col-lg-9 mt-3">
                            Status: {this.state.time_logs_status_message} <br />
                            Total Logs: {this.state.attendance_data.length}
                        </div>
                        <div className="col-lg-3 mt-3">
                            <div className="row mb-1">
                                <button className="btn btn-danger float-right" onClick={() => { this.setState({start_scanning: false,scan_type: ""}) }} > <i className="bi bi-qr-code"></i> Stop</button>
                            </div>
                            <div className="row">
                                <button className="btn btn-primary float-right" onClick={() => {
                                    $("#attendance").modal('show')
                                }}> <i className="bi bi-list"></i> View</button>
                            </div>                            
                        </div>
                    </div> 
                </div>:<div className="log-center-data-mobile">
                <div className="row">
                    <div className="form-group">
                        <label>Select Scan Option</label>
                        <select name="data" className="form-control" id="data" onChange={(e) => { 
                            this.setState({
                                scan_type: e.target.value
                            })
                        }}>
                            <option value="">-- Scan Type --</option> 
                            <option value="class_attendance">Class Attendance</option>
                            <option value="event_attendance">Event Attendance</option>
                        </select>
                    </div>
                    {(this.state.scan_type=="class_attendance")?<div className="form-group">
                        <label>Class Subject Option</label>
                        <select name="subject" className="form-control" id="subject" onChange={(e) => {
                            let temp = this.state.class_teaching.find(ee=>ee.class_id==e.target.value);
                            this.setState({
                                subject_id: e.target.value,
                                subject_name: `${temp.section_name} (${temp.subject_name})`,
                                start_scanning: false,
                                loading_subject_fetch: true
                            },() => {
                                this.loadStudentClass(e.target.value);
                            });
                        }}>
                            <option value="">-- Select --</option> 
                            <EachMethod of={this.state.class_teaching} render={(element,index) => {
                                return <option value={element.class_id} >{`${element.section_name} (${element.subject_name}) Time: ${element.time_start} - ${element.time_end}`}  {(element.monday==1)?"Mon-":""}
                                {(element.tuesday==1)?"Tue-":""}
                                {(element.wednesday==1)?"Wed-":""}
                                {(element.thursday==1)?"Thu-":""}
                                {(element.friday==1)?"Fri-":""}
                                {(element.saturday==1)?"Sat-":""}
                                {(element.sunday==1)?"Sun-":""}</option>
                            }} />
                        </select>
                    </div>:null}
                    {(this.state.scan_type=="event_attendance")?<div className="form-group">
                        <label>Event Option</label>
                        <select name="subject" className="form-control" id="subject" onChange={(e) => { 
                            this.setState({
                                subject_id: e.target.value,
                                subject_name: e.target.value,
                                start_scanning: true
                            })
                        }}>
                            <option value="">-- Select --</option>  
                        </select>
                    </div>:null}
                </div>
                <div className="row">
                    {(this.state.loading_subject_fetch==true)?<div className="col-lg-12 center mt-5">
                        <div className="spinner-border text-primary" role="status">
                      <span className="visually-hidden">Loading...</span>
                    </div>
                    </div>:null}
                </div>
                </div>}
            </div>
            <div className="modal fade" tabIndex="-1" role="dialog" id="attendance" data-bs-backdrop="static">
                <div className="modal-dialog modal-fullscreen" role="document">
                    <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title fs-5">Attendance</h5>
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"> 
                        </button>
                    </div>
                    <div className="modal-body m-0 p-0">
                        <ReactTable
                            key={"react-tables"}
                            className={"table table-bordered table-striped "}
                            data={this.state.attendance_data} 
                            columns={this.state.columns}
                            showHeader={true}
                            showPagenation={true}
                            defaultPageSize={10}
                        />
                    </div>
                    <div className="modal-footer"> 
                        <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                    </div>
                    </div>
                </div>
            </div>
        </div></DashboardLayout>
    }
}