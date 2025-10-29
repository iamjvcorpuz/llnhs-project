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
            scan_type: "class_attendance",
            subject_id:"",
            subject_name:"",
            classStudentList: [],
            assign_students: [],
            student_list: [],
            student_attendance: [],
            teaching_class: [],
            seats: [],
            table_row: 4,
            table_column: 8,
            loaded_data: false,
            schedule_day: "",
            schedule_time: ""
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
        this.submitClassAttendance = this.submitClassAttendance.bind(this);
        this.setAttendance = this.setAttendance.bind(this);
        this.AlertSound = AlertSound;
        this.timeoutScan = null;

        console.log(this.props);
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
        let date = moment(new Date()).format("YYYY-MM-DD");
        if(self.state.teaching_class.length > 0) {
            axios.post('/attendance/time/today/class/timelogs',{
                date:date,
                terminal_id: `class_id_${self.state.teaching_class[0].class_id}_teacher_id_${self.state.teaching_class[0].teacher_id}`,
                id: self.state.teaching_class[0].id,
                teacher_id: self.state.teaching_class[0].teacher_id,
                class_id: self.state.teaching_class[0].class_id,
            }).then(function (response) {
                // console.log(response)
                if( typeof(response.status) != "undefined" && response.status == "200" ) {
                    let data = typeof(response.data) != "undefined" && typeof(response.data.data)!="undefined"?response.data.data:[];
                    if(typeof(response.data)!="undefined"&&response.data.status == "success") {


                        self.setState({attendance_data: data},() => { });

                        if(data.length > 0) {
                            data.forEach(val => {
                                let student_attendance = self.state.seats;
                                let updatedstudent_list = [];
                                if(student_attendance.length > 0 && student_attendance.some(e=>e.lrn==val.lrn)) {
                                    updatedstudent_list = student_attendance.map(obj => {
                                        if (obj.lrn === val.lrn) {
                                            if(val.mode == "present") {
                                                $(`.seat_${obj.seat_number}`).addClass('student_chair_present');
                                            } else if(val.mode == "late") {
                                                $(`.seat_${obj.seat_number}`).addClass('student_chair_absent');
                                            } else {
                                                $(`.seat_${obj.seat_number}`).addClass('student_chair_absent');
                                            }
                                            return {...obj,status: val.mode};
                                        } else {
                                            return {...obj,status: 'absent'};
                                        }                                        
                                    }); 
                                    self.setState({student_attendance: updatedstudent_list});
                                }
                            });
                        }
                    }
                }
            });            
        }

    }

    queryAccounts(code) {
        let self = this;
        // console.log("queryAccounts code",code)
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
            // console.log(response);
            if( typeof(response.status) != "undefined" && response.status == "200" ) {
                let data = typeof(response.data) != "undefined" && typeof(response.data.data)!="undefined"?response.data.data:{};
                // console.log("aw---",response.data.status,data);
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
        // console.log(logsdata,userdata);
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
        let date = moment(new Date()).format("YYYY-MM-DD");
        // console.log({id:id})
        axios.post('/attendance/class/students',{id:id}).then(function (response) {
            console.log(response)
            if( typeof(response.status) != "undefined" && response.status == "201" ) {
                let data = typeof(response.data) != "undefined" && typeof(response.data.data)!="undefined"?response.data.data:{};
                // console.log("loadStudentClass",response.data.status,data);
                if(typeof(response.data)!="undefined"&&response.data.status == "success") {
                    let schedule_day = [];
                    if(data.class_teaching.length>0) {                        
                        if(data.class_teaching[0].monday=="1"){
                            schedule_day.push("Mon");
                        } 
                        if(data.class_teaching[0].tuesday=="1"){
                            schedule_day.push("Tue");
                        } 
                        if(data.class_teaching[0].wednesday=="1"){
                            schedule_day.push("Wed");
                        } 
                        if(data.class_teaching[0].thursday=="1"){
                            schedule_day.push("Thu");
                        } 
                        if(data.class_teaching[0].friday=="1"){
                            schedule_day.push("Fri");
                        } 
                        if(data.class_teaching[0].saturday=="1"){
                            schedule_day.push("Sat");
                        }
                    }
                    if(data.classrooms_seats.length > 0 && data.classrooms_seats_assign.length > 0  && data.student.length > 0 ) {
                        self.setState({
                            schedule_day: (schedule_day.length>0)?schedule_day.toString().replaceAll(',',' - '):"",
                            teaching_class: data.class_teaching,
                            table_row: Number(data.classrooms_seats[0].number_rows),
                            table_column: Number(data.classrooms_seats[0].number_columns),
                            classStudentList: data.student,
                            seats:  data.classrooms_seats_assign,
                            assign_students:  data.classrooms_seats_assign,
                            start_scanning: true,
                            loading_subject_fetch:false
                        },() => {
                            self.assignedStudentList();
                        });
                    } else {
                        let listmessage = "";
                        if(data.student.length == 0) [
                            listmessage+=`<li class="list-group-item">Has no student added to class.</li>`
                        ]
                        if(data.classrooms_seats.length == 0) [
                            listmessage+=`<li class="list-group-item">Has no seats.</li>`
                        ]
                        if(data.classrooms_seats_assign.length == 0) [
                            listmessage+=`<li class="list-group-item">Has no seats assign.</li>`
                        ]
                        Swal.fire({  
                            title: "Required to this options" ,
                            html:`<ul class="list-group" >${listmessage}</ul>`, 
                            showCancelButton: true,
                            showConfirmButton: false,
                            allowOutsideClick: false,
                            allowEscapeKey: false,
                            cancelButtonText: "Ok",
                            confirmButtonText: "Continue",
                            confirmButtonColor: "#DD6B55",
                            icon: "error",
                            showLoaderOnConfirm: true, 
                            closeOnClickOutside: false,  
                            dangerMode: true,
                        });
                        self.setState({
                            schedule_day: (schedule_day.length>0)?schedule_day.toString().replaceAll(',',' - '):"",
                            teaching_class: data.class_teaching,
                            table_row: 0,
                            table_column: 0,
                            classStudentList: [],
                            seats:  [],
                            assign_students:  [],
                            start_scanning: true,
                            loading_subject_fetch:false
                        },() => { 
                        });
                    }

                }
            }
        });
    }

    assignedStudentList() {

        let self = this;
        let remapStudentList = [];
        if(this.state.assign_students.length>0) {
            this.state.assign_students.forEach((element,i,arr) => {
                if(self.state.classStudentList.some(e=>e.student_id===Number(element.student_id)) === true) {
                    let temp = self.state.classStudentList.find(e=>e.student_id==element.student_id) ;
                    remapStudentList.push({
                        ...element,
                        ...temp,
                        seat_number: Number(element.seat_number)
                    });
                }
                if((i + 1) == arr.length) {
                    self.setState({seats: remapStudentList,loaded_data: true}); 
                    self.getAllTodaysTimeLogs();
                }
            });
        }

    }
    

    speak(text) {
        // Create a SpeechSynthesisUtterance
        const utterance = new SpeechSynthesisUtterance(text);
        const voices = speechSynthesis.getVoices();
        utterance.voice = voices[1];
        speechSynthesis.speak(utterance);
    }

    submitClassAttendance() {
        let self = this;
        if(self.state.student_attendance.length > 0) { // self.state.student_attendance.length == self.state.seats.length

            let date = moment(new Date()).format("YYYY-MM-DD")
            Swal.fire({
                title: "If all fields are correct and please click to continue to save", 
                showCancelButton: true,
                allowOutsideClick: false,
                allowEscapeKey: false,
                confirmButtonText: "Continue", 
                icon: "warning",
                showLoaderOnConfirm: true, 
                closeOnClickOutside: false,  
                dangerMode: true,
            }).then( async (result) => {
                if(result.isConfirmed) {

                    Swal.fire({  
                        title: 'Saving Records.\nPlease wait.', 
                        html:'<i class="fa fa-times-circle-o"></i>&nbsp;&nbsp;Close',
                        showCancelButton: true,
                        showConfirmButton: false,
                        allowOutsideClick: false,
                        didOpen: () => {
                          Swal.showLoading();
                        }
                    });

                    let datas =  { 
                        id: self.state.teaching_class[0].id,
                        teacher_id: self.state.teaching_class[0].teacher_id,
                        class_id: self.state.teaching_class[0].class_id,
                        class_subject: (self.state.teaching_class.length>0)?self.state.teaching_class[0].subject_name:"",
                        date: date,
                        time: moment(new Date()).format('hh:mm A'),
                        mode: "IN",
                        type: "student",
                        student_attendance: self.state.student_attendance
                    };

                    // console.log(datas,self.state);
                    axios.post('/attendance/time/new/entry/by/class',datas).then( async function (response) { 
                        console.log(response);
                        if( typeof(response.status) != "undefined" && response.status == "200" ) {
                            let data = typeof(response.data) != "undefined" && typeof(response.data)!="undefined"?response.data:{};
                            if(data.status == "success") {
                                Swal.fire({  
                                    title: "Successfuly save!", 
                                    showCancelButton: true,
                                    allowOutsideClick: false,
                                    allowEscapeKey: false,
                                    confirmButtonText: "Continue", 
                                    icon: "success",
                                    showLoaderOnConfirm: true, 
                                    closeOnClickOutside: false,  
                                    dangerMode: true,
                                }).then(function (result2) {
                                    if(result2.isConfirmed) { 
                                        Swal.close();                                             
                                        $("#teacher").val('');
                                        $("#time_start").val('');
                                    }
                                });
                            } else {
                                Swal.fire({  
                                    title: "Fail to save", 
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
                        } else if( typeof(response.status) != "undefined" && response.status == "200" ) {
                            let data = typeof(response.data) != "undefined" && typeof(response.data)!="undefined"?response.data:{};
                            if(data.status == "data_exist") { 
                                Swal.fire({  
                                    title: "Data Exist", 
                                    cancelButtonText: "Ok",
                                    showCancelButton: true,
                                    showConfirmButton: false,
                                    allowOutsideClick: false,
                                    allowEscapeKey: false, 
                                    confirmButtonColor: "#DD6B55",
                                    icon: "error",
                                    showLoaderOnConfirm: true, 
                                    closeOnClickOutside: false,  
                                    dangerMode: true,
                                });
                            }
                        } else if( typeof(response.status) != "undefined" && response.status == "422" ) {

                        }
                    }).catch(function (error) {
                        // handle error 
                        Swal.fire({  
                            title: "Server Error", 
                            showCancelButton: true,
                            showConfirmButton: false,
                            allowOutsideClick: false,
                            allowEscapeKey: false,
                            cancelButtonText: "Ok",
                            confirmButtonText: "Continue",
                            confirmButtonColor: "#DD6B55",
                            icon: "error",
                            showLoaderOnConfirm: true, 
                            closeOnClickOutside: false,  
                            dangerMode: true,
                        });
                    });
                } else if(result.isDismissed) {

                }
                return false
            }); 
        } else {
            Swal.fire({  
                title: "Please complete to check all student", 
                cancelButtonText: "Ok",
                showCancelButton: true,
                showConfirmButton: false,
                allowOutsideClick: false,
                allowEscapeKey: false, 
                confirmButtonColor: "#DD6B55",
                icon: "error",
                showLoaderOnConfirm: true, 
                closeOnClickOutside: false,  
                dangerMode: true,
            });
        }
    }

    setAttendance(status,val) {
        // console.log(status,val);
        let self = this;
        let student_attendance = this.state.student_attendance;
        let updatedstudent_list = [];
        if(student_attendance.length > 0 && student_attendance.some(e=>e.student_id==val.student_id)) {
            let existing = true;
            let existing_id =  "";
            updatedstudent_list = student_attendance.map(obj => {
                if (obj.student_id === val.student_id) {
                  return { ...obj,status: status, val }; // Create a new object with updated age
                }
                return obj; // Return original object for others
            });
            // console.log(updatedstudent_list);
            self.setState({student_attendance: updatedstudent_list});
        } else {
            student_attendance.push({...val,status:status});
            // console.log(student_attendance);
            self.setState({student_attendance: student_attendance});
        }

    }

    render() {
        return <DashboardLayout title="Student" user={this.props.auth.user} profile={this.props.auth.profile}><div className="noselect"> 
            <Head title="Attendance" /> 
            <div className="mx-auto">
                {/* {(this.state.start_scanning==true)?<div className="log-center-data-mobile">

                </div>: */}
                <div className="log-center-data-mobile">
                <div className="row">
                    <div className="form-group hide d-none">
                        <label>Select Option</label>
                        <select name="data" disabled className="form-control" id="data" onChange={(e) => { 
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
                            let temp = this.state.class_teaching.find(ee=>ee.id==e.target.value);
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
                                let schedule_day = [];                      
                                if(element.monday=="1"){
                                    schedule_day.push("Mon");
                                } 
                                if(element.tuesday=="1"){
                                    schedule_day.push("Tue");
                                } 
                                if(element.wednesday=="1"){
                                    schedule_day.push("Wed");
                                } 
                                if(element.thursday=="1"){
                                    schedule_day.push("Thu");
                                } 
                                if(element.friday=="1"){
                                    schedule_day.push("Fri");
                                } 
                                if(element.saturday=="1"){
                                    schedule_day.push("Sat");
                                } 
                                return <option value={element.id} >{`${element.section_name} (${element.subject_name}) Time: ${element.time_start} - ${element.time_end}`}  {(element.monday==1)?"Mon-":""}
                                {(schedule_day.length>0)?schedule_day.toString().replaceAll(',',' - '):""}</option>
                            }} />
                        </select>
                    </div>:null}

                    {(this.state.scan_type=="event_attendance")?<div className="form-group">
                        <label>Event Option</label>
                        <select name="subject" className="form-control" id="subject" onChange={(e) => { 
                            this.setState({
                                subject_id: e.target.value,
                                subject_name: e.target.value,
                                start_scanning: false
                            })
                        }}>
                            <option value="">-- Select --</option>  
                            <EachMethod of={this.state.events} render={(element,index) => { 
                                return <option value={element.id} >{`${element.event_name} (${element.date} Time: ${element.time_start} - ${element.time_end})`}</option>
                            }} />
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
                </div>
                {/* } */}
            </div>
            
            <div className="app-content">
                <div className="container-fluid">
                    {this.state.loaded_data==true?<div className="mx-auto mt-5">
                    <div className="row">
                        <div className="col-sm-6"><h3 className="mb-0"><i className="nav-icon bi bi-bookmark"></i> Subject: <strong className="badge bg bg-primary">{(this.state.teaching_class.length>0)?this.state.teaching_class[0].subject_name:""}</strong></h3></div>
                        <div className="col-sm-6">
                            <ol className="breadcrumb float-sm-end">
                                <li className="breadcrumb-item active">Schedule: <div className="badge bg-primary">
                                    {/* {(this.state.teaching_class.length>0&&this.state.teaching_class[0].monday==1)?"Mon-":""}
                                    {(this.state.teaching_class.length>0&&this.state.teaching_class[0].tuesday==1)?"Tue-":""}
                                    {(this.state.teaching_class.length>0&&this.state.teaching_class[0].wednesday==1)?"Wed-":""}
                                    {(this.state.teaching_class.length>0&&this.state.teaching_class[0].thursday==1)?"Thu-":""}
                                    {(this.state.teaching_class.length>0&&this.state.teaching_class[0].friday==1)?"Fri-":""}
                                    {(this.state.teaching_class.length>0&&this.state.teaching_class[0].saturday==1)?"Sat-":""}
                                    {(this.state.teaching_class.length>0&&this.state.teaching_class[0].sunday==1)?"Sun-":""} */}
                                    {this.state.schedule_day}
                                </div> 
                                <div className="badge bg-primary">{(this.state.teaching_class.length>0)?this.state.teaching_class[0].time_start + " - " + this.state.teaching_class[0].time_end:""}</div>
                                </li> 
                            </ol>
                        </div>
                    </div> 
                        <div className="container text-center">
                            {Array.from({length: this.state.table_row}).map((v,a) => {
                                let count = a*this.state.table_column;
                                return  <div key={`seat_${a}`} className="row align-items-center">
                                    {Array.from({length: this.state.table_column}).map((v,b) => {
                                        count++;
                                        let count_=this.state.table_row*this.state.table_column-count;
                                        let student_data = this.state.seats.find(e=>e.seat_number==(count_+1));
                                        let selected_data = typeof(student_data)!="undefined"?this.state.student_attendance.find(e=>e.student_id==student_data.student_id):undefined; 
                                        if(typeof(student_data)=="undefined") {
                                            $(`#seat_${a}_${b}`).css('opacity', '0.5');
                                        }
                                        return  <div key={`seat_${a}_${b}`} id={`seat_${a}_${b}`} className="col mt-3 mb-3">
                                                    <center>
                                                        <div className="attendance_icons">
                                                            <img src="/images/student_chair.png" id={`col_${b}_row_${a}_chair`} className={`student_chair seat_${count_+1}`} alt="" />
                                                            {(this.state.seats.length>0&&this.state.seats.find(e=>e.seat_number==(count_+1))!=undefined)?<img id={`picture_col_${b}_row_${a}_count`} src={`/profile/photo/student/${this.state.seats.find(e=>e.seat_number==(count_+1)).lrn}`} onError={e=>{return e.target.src = '/adminlte/dist/assets/img/avatar.png'}} className="attendance_prof_img rounded-circle auto-margin-lr" alt=""  />:null}
                                                        </div>
                                                        {(this.state.seats.length>0&&this.state.seats.find(e=>e.seat_number==(count_+1))!=undefined)?<><label id={`col_${b}_row_${a}_name`} className="badge text-bg-success" >{this.state.seats.find(e=>e.seat_number==(count_+1)).last_name}</label><br /></>:<></>}
                                                        <label id={`col_${b}_row_${a}_count`} className="badge text-bg-primary" ># {count_+1}</label>
                                                        
                                                        {(typeof(student_data)!="undefined")?<div>
                                                        <button className={`btn btn-xs btn-success ${(typeof(student_data)!="undefined"&&typeof(selected_data)!="undefined"&&selected_data.status=="present")?'d-none':''} `} title="Present" onClick={() => {
                                                            $(`#col_${b}_row_${a}_chair`).removeClass('student_chair_absent');  
                                                            $(`#col_${b}_row_${a}_chair`).addClass('student_chair_present');
                                                            $(`#picture_col_${b}_row_${a}_count`).removeClass('absent_profile_picture');  
                                                            $(`#picture_col_${b}_row_${a}_count`).addClass('present_profile_picture');
                                                            this.setAttendance("present",this.state.seats.find(e=>e.seat_number==(count_+1)));
                                                        }}><i className="bi bi-check"></i></button>
                                                        <button className={`btn btn-xs btn-warning ${(typeof(student_data)!="undefined"&&typeof(selected_data)!="undefined"&&selected_data.status=="late")?'d-none':''}`} title="Late" onClick={() => {
                                                            $(`#col_${b}_row_${a}_chair`).removeClass('student_chair_present');
                                                            $(`#col_${b}_row_${a}_chair`).addClass('student_chair_absent');
                                                            $(`#picture_col_${b}_row_${a}_count`).removeClass('present_profile_picture');
                                                            $(`#picture_col_${b}_row_${a}_count`).addClass('absent_profile_picture');
                                                            this.setAttendance("late",this.state.seats.find(e=>e.seat_number==(count_+1)));
                                                        }}><i className="bi bi-x"></i></button>
                                                        <button className={`btn btn-xs btn-danger ${(typeof(student_data)!="undefined"&&typeof(selected_data)!="undefined"&&selected_data.status=="absent")?'d-none':''}`} title="Absent" onClick={() => {
                                                            $(`#col_${b}_row_${a}_chair`).removeClass('student_chair_present');
                                                            $(`#col_${b}_row_${a}_chair`).addClass('student_chair_absent');
                                                            $(`#picture_col_${b}_row_${a}_count`).removeClass('present_profile_picture');
                                                            $(`#picture_col_${b}_row_${a}_count`).addClass('absent_profile_picture');
                                                            this.setAttendance("absent",this.state.seats.find(e=>e.seat_number==(count_+1)));
                                                        }}><i className="bi bi-x"></i></button>
                                                        </div>:null }
                                                        
                                                    </center>
                                                </div>
                                    })}
                                </div>
                            })}
                        </div>
                    </div>:<></>}
                    {this.state.loaded_data==true?<div className="container text-center mt-5">
                        <div className="row align-items-center">
                            <div className="col align-self-center">
                                <center>
                                    {/* <img src="/images/teacher_chair.png" className="teacher_chair mx-atuo" /> */}
                                    <button className="btn btn-lg btn-primary col-lg-1 col-md-6 col-sm-6" onClick={() => {
                                        this.submitClassAttendance();
                                    }}> Submit</button> <br />
                                    <button className="btn btn-lg btn-danger mt-1 col-lg-1 col-md-6 col-sm-6" onClick={() => {
                                        this.setState({
                                            teaching_class: [],
                                            table_row: 0,
                                            table_column: 0,
                                            classStudentList: [],
                                            seats:  [],
                                            assign_students:  [],
                                            start_scanning: false,
                                            loading_subject_fetch:false,
                                            loaded_data: false,
                                            scan_type: "class_attendance"
                                        })
                                    }}> Back</button>
                                </center>
                            </div>
                        </div>
                    </div>:<></>}                    
                </div>
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