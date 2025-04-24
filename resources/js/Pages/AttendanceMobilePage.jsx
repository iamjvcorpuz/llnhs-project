import React,{ Component } from "react";
import { Head } from '@inertiajs/react';
import { EachMethod } from '@/Components/EachMethod';
import { Pagination , AlertSound} from '@/Components/commonFunctions'; 
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
            userdata: {},
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
            scanned_code: ""
        }
        this.intervals = null;
        let loop_test = 0;
        this.handleFocusableElements = true;
        this.eventKeys = this.eventKeys.bind(this);
        this.queryAccounts = this.queryAccounts.bind(this);
        this.queryAttendanceLogs = this.queryAttendanceLogs.bind(this);
        this.insertLogs = this.insertLogs.bind(this);
        this.AlertSound = AlertSound;
        this.timeoutScan = null;
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
                // console.log(self.state.scanned_code, " - aw");
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
                    self.setState({attendance_data: data},() => {

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
        // console.log("queryAccounts code",code)
        axios.post('/attendance/account/find',{code: code}).then(function (response) {
            // handle success
            // console.log(response)
            if( typeof(response.status) != "undefined" && response.status == "200" ) {
                let data = typeof(response.data) != "undefined" && typeof(response.data.data)!="undefined"?response.data.data:{};
                // console.log("aw",response.data.status,data);
                if(typeof(response.data)!="undefined"&&response.data.status == "success") {
                    console.log("aw",data);
                    self.setState({
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
                // console.log("aw",response.data.status,data);
                if(typeof(response.data)!="undefined"&&response.data.status == "success") {

                    let logs_stats = "Time In: " + moment(new Date()).format('hh:mm A');
                    let xx = self.state.attendance_data.filter(e => e._id==self.state._id); 
                    let mode = "";
                    if(xx.length % 2 == 0) {
                        logs_stats = "Time In: " + moment(new Date()).format('hh:mm A');
                        mode = "IN";
                    } else {
                        logs_stats = "Time Out: " + moment(new Date()).format('hh:mm A');
                        mode = "OUT";
                    }
                    self.insertLogs({
                        code: code,
                        date: date,
                        time: moment(new Date()).format('hh:mm A'),
                        mode: mode
                    },userdata, () => {
                        
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

                    // self.alertMessages();
                }
            }
        });
    }

    insertLogs(logsdata,userdata,callback) {
        let self = this;
        delete userdata.picture_base64;
        axios.post('/attendance/time/new/entry',{
            logsdata:logsdata,
            userdata:userdata
        }).then(function (response) {
            // handle success
            // console.log(response)
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
                    self.getAllTodaysTimeLogs();
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
            }
        }).catch(function (error) {
        // handle error
            console.log(error);
        }).finally(function () {
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
                time_logs_status_message:""
            },() => {
                clearTimeout(this.intervals);
                this.intervals = null;
            });
        }, timeoutIntervals);
    }

    render() {
        return <DashboardLayout title="Student" user={this.props.auth.user} profile={this.props.auth.profile}><div className="row"> 
            <Head title="Attendance" /> 
            <div className="mx-auto">
                {/* <div className="log-user-photo">
                    <center> 
                        <img className="attendance-login-profile logo_round shadow" src={this.state.profileImageBase64!=""?this.state.profileImageBase64:"/adminlte/dist/assets/img/avatar.png"}
                        ref={t=> this.photo_time_view_image = t}
                        onError={(e)=>{ 
                            this.photo_time_view_image.src='/images/adminlte/dist/assets/img/avatar.png'; 
                        }} alt="Picture Error" />
                    </center> 
                    {(this.state.time_logs_status!="")?<div className={`time-logs center text-white ${this.state.time_logs_status}`}>
                        <label>{this.state.time_logs_status_message}</label>
                    </div>:null}

                </div> */}


                <div className="log-center-data-mobile">
                    <div className="row">  
                        <div className="col-lg-6 center" id="timers">-</div>  
                        <div className="col-lg-6 center" id="timesdates" >-</div>
                    </div> 
                    <div className="row">
                    <Scanner onScan={(result) => console.log(result)} onError={(e) => alert(e)} />
                    </div>
                    {/* <div className="header_time logger-details-space">
                        {(this.state.logger_type=="student")?<div className="logger-name-small">{(this.state.idnumber!="")?`LRN : ${this.state.lrn}`:""}</div>:<div className="logger-name-small">{(this.state.idnumber!="")?`ID : ${this.state.lrn}`:""}</div> }
                        <div className="logger-name"><strong>{(this.state.fullname!="")?this.state.fullname:""}</strong></div> 
                        {(this.state.logger_type=="student")?<div className="logger-name-small">{(this.state.logger_section!="")?this.state.logger_section:""}</div>:null}                        
                    </div>  */}
                    {/* <div className="row">

                        <div className="attendance-list-mobile">
                            <ReactTable
                                key={"react-tables"}
                                className={"table table-bordered table-striped "}
                                data={this.state.attendance_data} 
                                columns={this.state.columns}
                                showHeader={true}
                                showPagenation={false}
                                defaultPageSize={5}
                            />
                        </div>

                    </div> */}
                    <div className="log-center-data-total-logs">
                        Total Logs: {this.state.attendance_data.length}
                    </div>
                </div>
            </div>
        </div></DashboardLayout>
    }
}