import React,{ Component } from "react";
import { Head } from '@inertiajs/react';
import { EachMethod } from '@/Components/EachMethod';
import { Pagination , AlertSound,sortTimeDESC} from '@/Components/commonFunctions'; 
import { ReactNotificationManager,ReactNotificationContainer } from '@/Components/Notification'; 
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

export default class FinalGrade extends Component {
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
            data: this.props.students,
            columns: [
                {
                    id: "no",
                    accessor: 'no',
                    Header: 'No.', 
                    width: 100,
                    className: "center"
                }, 
                {
                    id: "fullname",
                    Header: 'Fullname', 
                    width: 200,
                    className: "text-left",
                    accessor: 'fullname'
                }, 
                {
                    id: "q1",
                    Header: 'Q1',   
                    className: "center",
                    accessor: 'id',
                    Cell: ({row}) => { 
                       return (this.state.eq1==true)?<input type="text" inputMode="numeric" pattern="[0-9]{3}" onKeyDown={(e) => { return e.target.value.length<=3||e.target.value<=100;} } className="center form-control border border-info" maxLength={3} max={100} min={0} id={`q1_${row.original.student_id}`} onBlur={() => this.submitClassStudentGradeAttendanceSilence(row.original,"q1") } defaultValue={row.original.q1} />:<input type="number" disabled className="center form-control border border-info" maxLength={3} max={3} min={0} id={`q1_${row.original.student_id}`} />  
                    }
                }, 
                {
                    id: "q2",
                    Header: 'Q2',   
                    className: "center",
                    accessor: 'id',
                    Cell: ({row}) => { 
                       return (this.state.eq2==true)?<input type="text" inputMode="numeric" pattern="[0-9]{3}" onKeyDown={(e) => { return e.target.value.length<=3||e.target.value<=100;} } className="center form-control border border-info" length={3} max={3} min={0} id={`q2_${row.original.student_id}`} onBlur={() => this.submitClassStudentGradeAttendanceSilence(row.original,"q2") }  defaultValue={row.original.q2} />:<input type="number" disabled className="center form-control border border-info" maxLength={3} max={3} min={0} id={`q1_${row.original.student_id}`} />  
                    }
                }, 
                {
                    id: "q3",
                    Header: 'Q3',   
                    className: "center",
                    accessor: 'id',
                    Cell: ({row}) => { 
                       return (this.state.eq3==true)?<input type="text" inputMode="numeric" pattern="[0-9]{3}" onKeyDown={(e) => { return e.target.value.length<=3||e.target.value<=100;} } className="center form-control border border-info" length={3} max={3} min={0} id={`q3_${row.original.student_id}`} onBlur={() => this.submitClassStudentGradeAttendanceSilence(row.original,"q3") }  defaultValue={row.original.q3} />:<input type="number"  disabled className="center form-control border border-info" maxLength={3} max={3} min={0} id={`q1_${row.original.student_id}`} />  
                    }
                }, 
                {
                    id: "q4",
                    Header: 'Q4',   
                    className: "center",
                    accessor: 'id',
                    Cell: ({row}) => { 
                       return (this.state.eq4==true)?<input type="text" inputMode="numeric" pattern="[0-9]{3}" onKeyDown={(e) => { return e.target.value.length<=3||e.target.value<=100;} } className="center form-control border border-info" length={3} max={3} min={0} id={`q4_${row.original.student_id}`} onBlur={() => this.submitClassStudentGradeAttendanceSilence(row.original,"q4") }  defaultValue={row.original.q4} />:<input type="number" disabled className="center form-control border border-info" maxLength={3} max={3} min={0} id={`q1_${row.original.student_id}`} />  
                    }
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
            schedule_time: "",
            eq1: true,
            eq2: true,
            eq3: true,
            eq4: true,
        }
        this.intervals = null;
        let loop_test = 0;
        this.handleFocusableElements = true;  
        this.insertLogs = this.insertLogs.bind(this);
        this.loadStudentClass = this.loadStudentClass.bind(this); 
        this.submitClassStudentGradeAttendanceSilence = this.submitClassStudentGradeAttendanceSilence.bind(this); 
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
        // this.getAllTodaysTimeLogs();
        let temp = this.state.class_teaching.find(ee=>ee.id==this.state.class_teaching[0].id);
        this.setState({
            subject_id: this.state.class_teaching[0].id,
            subject_name: `${temp.section_name} (${temp.subject_name})`,
            start_scanning: false,
            loading_subject_fetch: true
        },() => {
            this.loadStudentClass(this.state.class_teaching[0].id);
        });
        // setTimeout(() => {
            
        // ReactNotificationManager.success("Sorry","You selected position is alread added to your list");
        // }, 2000);
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
            // console.log(response)
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
                }
            });
        }

    }
 
    submitClassAttendance() {
        let self = this;
        if(self.state.student_attendance.length == self.state.seats.length) {

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

    submitClassStudentGradeAttendanceSilence(val,q) {
        let self = this;

        let text_value = $(`#${q}_${val.id}`).val();

        if(text_value != "") { 
            // console.log("has value",text_value,val,q);
            let datas =  { 
                id: self.state.teaching_class[0].id,
                teacher_id: Number(self.state.teaching_class[0].teacher_id),
                teacher_name: (self.state.class_teaching.length>0)?self.state.class_teaching[0].teacher_name:"",
                class_id: self.state.teaching_class[0].class_id,
                class_subject: (self.state.teaching_class.length>0)?self.state.teaching_class[0].subject_name:"",
                class_subject_id: (self.state.teaching_class.length>0)?self.state.teaching_class[0].subject_id:"",
                student_id: val.student_id,
                grade: (self.state.class_teaching.length>0)?self.state.class_teaching[0].grade:"",
                sy: (self.state.class_teaching.length>0)?self.state.class_teaching[0].school_year:"",
                q,
                final_grade: text_value
            };

            // console.log(datas,val);
            axios.post('/class/subject/ginal/grade/update',datas).then( async function (response) { 
                // console.log(response);
                if( typeof(response.status) != "undefined" && response.status == "201" ) {
                    let data = typeof(response.data) != "undefined" && typeof(response.data)!="undefined"?response.data:{};
                    // console.log(data)
                    if(data.status == "success") {
                        ReactNotificationManager.success('Save','Successfuly Update!')
                    } else {
                        ReactNotificationManager.error('Save','Something wrong!. Unable to save.')                        
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
        } else {
            console.log("no value",text_value,val,q);
            return
        } 
    }

    render() {
        return <DashboardLayout title="Student" user={this.props.auth.user} profile={this.props.auth.profile}><div className="noselect"> 
            <Head title="Attendance" /> 
            <div className="mx-auto"> 
                {(this.state.start_scanning==true)?<div className="">

                </div>:<div className="log-center-data-mobile"> 
                <div className="row">
                    {(this.state.loading_subject_fetch==true)?<div className="col-lg-12 center mt-5">
                        <div className="spinner-border text-primary" role="status">
                      <span className="visually-hidden">Loading...</span>
                    </div>
                    </div>:null}
                </div>
                </div>}
            </div>
            
            <div className="app-content">
                <div className="container-fluid">
                    {this.state.loaded_data==true?<div className="mx-auto mt-5">
                    <div className="row">
                        <div className="col-sm-6"><h3 className="mb-0"><i className="nav-icon bi bi-bookmark"></i> Subject: <strong className="badge bg bg-primary">{(this.state.teaching_class.length>0)?this.state.teaching_class[0].subject_name:""}</strong></h3></div>
                        <div className="col-sm-6">
                            <ol className="breadcrumb float-sm-end">
                                <li className="breadcrumb-item active">Schedule: <div className="badge bg-primary"> 
                                    {this.state.schedule_day}
                                </div> 
                                <div className="badge bg-primary">{(this.state.teaching_class.length>0)?this.state.teaching_class[0].time_start + " - " + this.state.teaching_class[0].time_end:""}</div>
                                </li> 
                            </ol>
                        </div>
                    </div> 
                        <div className="container text-center">
                            <ReactTable
                                key={"react-tables"}
                                className={"table table-bordered table-striped "}
                                data={this.state.data} 
                                columns={this.state.columns}
                                showHeader={true}
                                showPagenation={true}
                                defaultPageSize={20}
                            />
                        </div>
                    </div>:<></>}
                              
                </div>
            </div>
 
        </div></DashboardLayout>
    }
}