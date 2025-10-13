import React,{ Component } from "react";
import { Link } from '@inertiajs/react';
import { EachMethod } from '@/Components/EachMethod'
import moment from 'moment';
import swal from 'sweetalert';
import Swal from 'sweetalert2';

// import QRCode from "react-qr-code";
import ReactTable from "@/Components/ReactTable"; 

import DashboardLayout from '@/Layouts/DashboardLayout';
import jsPDF from 'jspdf';
// import 'jspdf-autotable'; 
import { autoTable } from 'jspdf-autotable';
import QRCode from 'qrcode';
import {sortFullnameAZ,getWeeksInMonth} from "@/Components/commonFunctions"; 

export default class SF2 extends Component {
    constructor(props) {
		super(props);
        this.state = {
            code: "",
            lrn: "",
            picture: "",
            fullname1: "",
            lastname: "",
            track_strand: "",
            grade: typeof(this.props.advisory)!="undefined"&&this.props.advisory.length>0?this.props.advisory[0].year_level:"",
            section: typeof(this.props.advisory)!="undefined"&&this.props.advisory.length>0?this.props.advisory[0].section_name:"",
            sy: "",
            guardianname:"",
            relationship: "",
            guardiancontact: "",
            address: "",
            list: [],
            data: this.props.advisory,
            subjects: this.props.subjects, 
            teachers: this.props.teacher,
            advisoryList: this.props.advisory,
            sectionListTemp: this.props.sections,
            sectionList: [],
            student_list: this.props.students,
            student_male_list: (this.props.students.length>0)?this.props.students.filter(e => e.sex=="Male"):[],
            student_female_list: (this.props.students.length>0)?this.props.students.filter(e => e.sex=="Female"):[],
            yeargrade: this.props.schoolyeargrades,
            student_attendance: [],
            loading: true,
            month: "",
            getWeeksInMonth: [],
            shcool_id: "",
            school_name: "",
            schoolRegistry: this.props.schoolRegistry,
            student_male_total_daily: [],
            student_female_total_daily: [],
            totalDaysAttendance: 0,
            totalDropOutM: 0,
            totalDropOutF: 0,
            totalTransferOutM: 0,
            totalTransferOutF: 0,
            totalTransferInM: 0,
            totalTransferInF: 0,
            enrolmentASofM: 0,
            enrolmentASofF: 0,
            lateEnrolementM:0,
            lateEnrolementF:0,
            RegisteredLearnersM: 0,
            RegisteredLearnersF: 0,
            PEM: 0,
            PEF: 0,
            ADAM: 0,
            PAMM: 0,
            NSAM: 0,
            ADAF: 0,
            ADATOTAL: 0,
            PAMF: 0,
            PAMTOTAL: 0,
            NSAF: 0
        }
        // $('body').attr('class', '');
        this.loadPDF = this.loadPDF.bind(this);
        this.loadPDFTest = this.loadPDFTest.bind(this);
        this.fetchData = this.fetchData.bind(this);
        this.getCheckHasAttendance = this.getCheckHasAttendance.bind(this);
        // console.log(this.props)
    }

    componentDidMount() {  
        getWeeksInMonth('2025-07',(getWeeksInMonth_) => {
            console.log(getWeeksInMonth_);
            this.setState({getWeeksInMonth:getWeeksInMonth_})
            setTimeout(() => {
                // this.loadPDFTest();
                this.setState({loading: false})
            }, 2000);
        });   

    }
    
    fetchData() {
        let self = this; 
        getWeeksInMonth(self.state.month,(c) => {
            let total_days = 0;
            c.forEach(element => {
                if(Object.keys(element).length>0) {
                    Object.keys(element).forEach(element_ => { 
                        if(element[element_] != null && typeof(element[element_].fulldate) !="undefined") {
                            total_days++;
                        }
                    });
                }
            });
            const getWeeksInMonth_ = c;
            // console.log(getWeeksInMonth_)
            this.setState({getWeeksInMonth:getWeeksInMonth_,totalDaysAttendance: total_days},() => {
                axios.post(`/teacher/advisory/sf2/${self.props.code}`,{code:self.props.code,month: self.state.month}).then(function (response) {
                    // console.log(response);
                    if( typeof(response.status) != "undefined" && response.status == "200" ) {
                        let data = typeof(response.data) != "undefined" && typeof(response.data)!="undefined"?response.data:{};
                        if(Object.keys(data).length>0) {
                            let RegisteredLearnersM = data.studentsList.filter(e=>e.sex=="Male");
                            let RegisteredLearnersF = data.studentsList.filter(e=>e.sex=="Female");
                            self.setState({
                                totalDropOutM: data.dropout.male,
                                totalDropOutF: data.dropout.female,
                                totalTransferInM: data.transfer.male.in,
                                totalTransferOutM: data.transfer.male.out,
                                totalTransferInF: data.transfer.female.in,
                                totalTransferOutF: data.transfer.female.out,
                                student_list: data.studentsList,
                                sf2_data: data.sf2_data,
                                RegisteredLearnersM: RegisteredLearnersM.length,
                                RegisteredLearnersF: RegisteredLearnersF.length,
                                enrolmentASofM: RegisteredLearnersM.length,
                                enrolmentASofF: RegisteredLearnersF.length,
                                PEM: (RegisteredLearnersM.length / RegisteredLearnersM.length) * 100,
                                PEF: (RegisteredLearnersF.length / RegisteredLearnersF.length) * 100,
                            },() => {
                                self.generateData(data.sf2_data);
                            });
                        }
                    }
                }); 
            }); 
        });


    }
    
    getCheckHasAttendance(data,date) {
        if(data.some(e=>e.date==date) == true) {
            return true;
        } else {
            return false;
        }
    }

    attendanceChecking(data,e) {
        // console.log(data);
        let status  = "full";
        let has_absent = false;
        let has_late = false;
        let absent = 0;
        let late = 0;
        data.forEach(element => {
            if(element.mode == 'absent') {
                // absent++;
                has_absent = true;
            } else if(element.mode == 'late') { 
                // late++;
                has_late = true;
            }
        });
        if(has_absent == false && has_late == true) {
            late++;
            status = 'late';
        } else if(has_absent == true && has_late == false) {
            status = 'absent';
            absent++;
        } else if(has_absent == true && has_late == true) {
            status = 'cuting';
            absent++;
        }
        
        e({
            status: status,
            absent: absent,
            late: late
        });
    }

    generateData(data) {
        // console.log(data)
        // console.log(this.state.getWeeksInMonth);
        let self = this;
        const student = self.state.student_list;
        let WeeksInMonth_ = JSON.stringify(this.state.getWeeksInMonth);
        let student_list = []; 
        // console.log("student",student);
        let student_total_daily = {WeeksInMonth: JSON.parse(WeeksInMonth_),absent: 0,tardy:0};
        let student_male_total_daily = {WeeksInMonth: JSON.parse(WeeksInMonth_),absent: 0,tardy:0};
        let student_female_total_daily = {WeeksInMonth: JSON.parse(WeeksInMonth_),absent: 0,tardy:0}; 
        let student_male_total_daily_absent = 0;
        let student_male_total_daily_present = 0;
        let student_female_total_daily_absent = 0;
        let student_female_total_daily_present = 0;
        let student_male_total_daily_tardy = 0;
        let student_female_total_daily_tardy = 0;
        let total_days = 0;
        let total_male_5_absent = 0;
        let total_female_5_absent = 0;

        for (let i = 0; i < student_total_daily.WeeksInMonth.length; i++) {
            let week = student_total_daily.WeeksInMonth[i];
            if(week.mon != null && data.length > 0 && data.some(e=>e.date==week.mon.fulldate) == true) { 
                total_days++;
            }
            if(week.tue != null && data.length > 0 && data.some(e=>e.date==week.tue.fulldate) == true) { 
                total_days++;
            }
            if(week.wed != null && data.length > 0 && data.some(e=>e.date==week.wed.fulldate) == true) { 
                total_days++;
            }
            if(week.thu != null && data.length > 0 && data.some(e=>e.date==week.thu.fulldate) == true) { 
                total_days++;
            }
            if(week.fri != null && data.length > 0 && data.some(e=>e.date==week.fri.fulldate) == true) { 
                total_days++;
            }
        }

        
        student.forEach((val,i_,arr) => {
            const temp_student_list = {...val,WeeksInMonth: JSON.parse(WeeksInMonth_)};
            // console.log(temp_student_list);
            // let getWeeksInMonth = this.state.getWeeksInMonth;
            let getWeeksInMonth_temp = [];
            let getWeeksInMonth_student_male_total_daily_temp = [];
            let getWeeksInMonth_student_female_total_daily_temp = [];
            let totalAbsent = 0;
            let totalTardy = 0;
            for (let i = 0; i < temp_student_list.WeeksInMonth.length; i++) {

                let week = temp_student_list.WeeksInMonth[i]; 

                let week2 = student_male_total_daily.WeeksInMonth[i];
                let weekfemale = student_female_total_daily.WeeksInMonth[i];
                let total_male_5_absent_ = 0;
                let total_female_5_absent_ = 0;
                
                if(week.mon != null && data.length > 0 && data.some(e=>e.date==week.mon.fulldate&&e.qr_code===val.qr_code) == true) { 
                    let data_ = data.filter(e=>e.date==week.mon.fulldate&&e.qr_code===val.qr_code); 
                    let status  = "full";
                    let absent = 0;
                    let late = 0 ;
                    self.attendanceChecking(data_,(retruns_) => {
                        status = retruns_.status;
                        absent = retruns_.absent;
                        late = retruns_.late;
                        if(absent>0) {
                            totalAbsent++; 
                            if(val.sex == "Male") { 
                                student_male_total_daily_absent++;
                                total_male_5_absent_++; 
                            } else if(val.sex == "Female") { 
                                student_female_total_daily_absent++; 
                                total_female_5_absent_++;                                
                            }
                        } else {
                            if(val.sex == "Male") { 
                                student_male_total_daily_present++;
                            } else if(val.sex == "Female") { 
                                student_female_total_daily_present++;
                            }
                        }
                        if(late>0) {
                            totalTardy++;
                        }
                    });
                    week.mon.logs = { status: status, morning: '',afternoon:''}; 
                    if(val.sex == "Male") {
                        let temp_male_count_present = week2.mon.count;
                        temp_male_count_present++;
                        week2.mon.count = temp_male_count_present - absent;
                    } else if(val.sex == "Female") { 
                        let temp_male_count_present = weekfemale.mon.count;
                        temp_male_count_present++;
                        weekfemale.mon.count = temp_male_count_present - absent;
                    }
                } else if(week.mon != null && data.length > 0 && data.some(e=>e.date==week.mon.fulldate&&e.qr_code===val.qr_code) == false && self.getCheckHasAttendance(data,week.mon.fulldate) == true) { 
                    week.mon.logs = { status: 'absent',morning: '',afternoon:''};
                    totalAbsent++; 
                    if(val.sex == "Male") { 
                        student_male_total_daily_absent++;
                                total_male_5_absent_++;
                    } else if(val.sex == "Female") { 
                        student_female_total_daily_absent++; 
                                total_female_5_absent_++;
                    }
                } 
                if(week.tue != null && data.length > 0 && data.some(e=>e.date==week.tue.fulldate&&e.qr_code===val.qr_code) == true) {
                    let data_ = data.filter(e=>e.date==week.tue.fulldate&&e.qr_code===val.qr_code); 
                    let status  = "full";
                    let absent = 0;
                    let late = 0 ;
                    self.attendanceChecking(data_,(retruns_) => {
                        status = retruns_.status;
                        absent = retruns_.absent;
                        late = retruns_.late;
                        if(absent>0) {
                            totalAbsent++; 
                            if(val.sex == "Male") { 
                                student_male_total_daily_absent++;
                                total_male_5_absent_++;
                            } else if(val.sex == "Female") { 
                                student_female_total_daily_absent++; 
                                total_female_5_absent_++;
                            }
                        } else {
                            if(val.sex == "Male") { 
                                student_male_total_daily_present++;
                            } else if(val.sex == "Female") { 
                                student_female_total_daily_present++;
                            }
                        }
                        if(late>0) {
                            totalTardy++;
                        }
                    });
                    week.tue.logs = { status: status,morning: '',afternoon:'',absent: 0,tardy: 0};  
                    if(val.sex == "Male") { 
                        let temp_male_count_present = week2.tue.count;
                        temp_male_count_present++;
                        week2.tue.count = temp_male_count_present - absent;
                    } else if(val.sex == "Female") { 
                        let temp_male_count_present = weekfemale.tue.count;
                        temp_male_count_present++;
                        weekfemale.tue.count = temp_male_count_present - absent;
                    }
                } else if(week.tue != null && data.length > 0 && data.some(e=>e.date==week.tue.fulldate&&e.qr_code===val.qr_code) == false && self.getCheckHasAttendance(data,week.tue.fulldate) == true) { 
                    week.tue.logs = { status: 'absent',morning: '',afternoon:''};
                    totalAbsent++; 
                    if(val.sex == "Male") { 
                        student_male_total_daily_absent++;
                                total_male_5_absent_++;
                    } else  if(val.sex == "Female") { 
                        student_female_total_daily_absent++; 
                                total_female_5_absent_++;
                    }
                }
                if(week.wed != null && data.length > 0 && data.some(e=>e.date==week.wed.fulldate&&e.qr_code===val.qr_code) == true) {
                    let data_ = data.filter(e=>e.date==week.wed.fulldate&&e.qr_code===val.qr_code); 
                    let status  = "full";
                    let absent = 0;
                    let late = 0 ;
                    self.attendanceChecking(data_,(retruns_) => {
                        status = retruns_.status;
                        absent = retruns_.absent;
                        late = retruns_.late;
                        if(absent>0) {
                            totalAbsent++; 
                            if(val.sex == "Male") { 
                                student_male_total_daily_absent++;
                                total_male_5_absent_++;
                            } else if(val.sex == "Female") { 
                                student_female_total_daily_absent++; 
                                total_female_5_absent_++;
                            }
                        } else {
                            if(val.sex == "Male") { 
                                student_male_total_daily_present++;
                            } else if(val.sex == "Female") { 
                                student_female_total_daily_present++;
                            }
                        }
                        if(late>0) {
                            totalTardy++;
                        }
                    });
                    week.wed.logs = { status: status,morning: '',afternoon:'',absent: 0,tardy: 0};  
                    if(val.sex == "Male") { 
                        let temp_male_count_present = week2.wed.count;
                        temp_male_count_present++;
                        week2.wed.count = temp_male_count_present - absent;
                    } else if(val.sex == "Female") { 
                        let temp_male_count_present = weekfemale.wed.count;
                        temp_male_count_present++;
                        weekfemale.wed.count = temp_male_count_present - absent;
                    }
                } else if(week.wed != null && data.length > 0 && data.some(e=>e.date==week.wed.fulldate&&e.qr_code===val.qr_code) == false && self.getCheckHasAttendance(data,week.wed.fulldate) == true) { 
                    week.wed.logs = { status: 'absent',morning: '',afternoon:''};
                    totalAbsent++; 
                    if(val.sex == "Male") { 
                        student_male_total_daily_absent++;
                                total_male_5_absent_++;
                    } else  if(val.sex == "Female") { 
                        student_female_total_daily_absent++; 
                                total_female_5_absent_++;
                    }
                }
                if(week.thu != null && data.length > 0 && data.some(e=>e.date==week.thu.fulldate&&e.qr_code===val.qr_code) == true) {
                    let data_ = data.filter(e=>e.date==week.thu.fulldate&&e.qr_code===val.qr_code); 
                    let status  = "full";
                    let absent = 0;
                    let late = 0 ;
                    self.attendanceChecking(data_,(retruns_) => {
                        status = retruns_.status;
                        absent = retruns_.absent;
                        late = retruns_.late;
                        if(absent>0) {
                            totalAbsent++; 
                            if(val.sex == "Male") { 
                                student_male_total_daily_absent++;
                                total_male_5_absent_++;
                            } else if(val.sex == "Female") { 
                                student_female_total_daily_absent++; 
                                total_female_5_absent_++;
                            }
                        } else {
                            if(val.sex == "Male") { 
                                student_male_total_daily_present++;
                            } else if(val.sex == "Female") { 
                                student_female_total_daily_present++;
                            }
                        }
                        if(late>0) {
                            totalTardy++;
                        }
                    });
                    week.thu.logs = { status: status, morning: '',afternoon:'',absent: absent,tardy: late};  
                    if(val.sex == "Male") { 
                        let temp_male_count_present = week2.thu.count;
                        temp_male_count_present++;
                        week2.thu.count = temp_male_count_present - absent;
                    } else if(val.sex == "Female") { 
                        let temp_male_count_present = weekfemale.thu.count;
                        temp_male_count_present++;
                        weekfemale.thu.count = temp_male_count_present - absent;
                    }
                } else if(week.thu != null && data.length > 0 && data.some(e=>e.date==week.thu.fulldate&&e.qr_code===val.qr_code) == false && self.getCheckHasAttendance(data,week.thu.fulldate) == true) { 
                    week.thu.logs = { status: 'absent',morning: '',afternoon:''};
                    totalAbsent++; 
                    if(val.sex == "Male") { 
                        student_male_total_daily_absent++;
                                total_male_5_absent_++;
                    } else  if(val.sex == "Female") { 
                        student_female_total_daily_absent++; 
                                total_female_5_absent_++;
                    }
                }
                if(week.fri != null && data.length > 0 && data.some(e=>e.date==week.fri.fulldate&&e.qr_code===val.qr_code) == true) {
                    let data_ = data.filter(e=>e.date==week.fri.fulldate&&e.qr_code===val.qr_code); 
                    let status  = "full";
                    let absent = 0;
                    let late = 0 ;
                    self.attendanceChecking(data_,(retruns_) => {
                        status = retruns_.status;
                        absent = retruns_.absent;
                        late = retruns_.late;
                        if(absent>0) {
                            totalAbsent++; 
                            if(val.sex == "Male") { 
                                student_male_total_daily_absent++;
                                total_male_5_absent_++;
                            } else if(val.sex == "Female") { 
                                student_female_total_daily_absent++; 
                                total_female_5_absent_++;
                            }
                        } else {
                            if(val.sex == "Male") { 
                                student_male_total_daily_present++;
                            } else if(val.sex == "Female") { 
                                student_female_total_daily_present++;
                            }
                        }
                        if(late>0) {
                            totalTardy++;
                        }
                    });
                    week.fri.logs = { status: status,morning: '',afternoon:'',absent: absent,tardy: late};  
                    if(val.sex == "Male") { 
                        let temp_male_count_present = week2.fri.count;
                        temp_male_count_present++;
                        week2.fri.count = temp_male_count_present - absent;
                    } else if(val.sex == "Female") { 
                        let temp_male_count_present = weekfemale.fri.count;
                        temp_male_count_present++;
                        weekfemale.fri.count = temp_male_count_present - absent;
                    }
                } else if(week.fri != null && data.length > 0 && data.some(e=>e.date==week.fri.fulldate&&e.qr_code===val.qr_code) == false && self.getCheckHasAttendance(data,week.fri.fulldate) == true) { 
                    week.fri.logs = { status: 'absent',morning: '',afternoon:''};
                    totalAbsent++; 
                    if(val.sex == "Male") { 
                        student_male_total_daily_absent++;
                                total_male_5_absent_++;
                    } else  if(val.sex == "Female") { 
                        student_female_total_daily_absent++; 
                                total_female_5_absent_++;
                    }
                } 

                // student_male_total_daily_absent_ = student_male_total_daily_absent_ + student_male_total_daily_absent;
                // student_female_total_daily_absent_= student_female_total_daily_absent_ + student_female_total_daily_absent; 
                getWeeksInMonth_temp.push(week)

                getWeeksInMonth_student_male_total_daily_temp.push(week2);
                getWeeksInMonth_student_female_total_daily_temp.push(weekfemale);
                if(total_male_5_absent_>=1) {
                    total_male_5_absent++;
                }
                if(total_female_5_absent_>=1) {
                    total_female_5_absent++;
                }
            } 
            // console.log(getWeeksInMonth_temp);
            student_male_total_daily = { WeeksInMonth: getWeeksInMonth_student_male_total_daily_temp,absent: student_male_total_daily_absent,tardy: student_male_total_daily_tardy};
            student_female_total_daily = { WeeksInMonth: getWeeksInMonth_student_female_total_daily_temp,absent: student_female_total_daily_absent,tardy: student_female_total_daily_tardy};
            student_list.push({...val,WeeksInMonth: getWeeksInMonth_temp,absent: totalAbsent,tardy: totalTardy});
            // console.log(student_list);

        });
        
        // console.log("Total Male Absent of the month: ",student_male_total_daily_absent);
        // console.log("Total Female Absent of the month: ",student_female_total_daily_absent);
        // console.log("Total Male Present of the month: ",student_male_total_daily_present);
        // console.log("Total Female Present of the month: ",student_female_total_daily_present);
        // console.log("Total Absent of the month: ",student_male_total_daily_absent + student_female_total_daily_absent);
        // console.log("Total Days of the month: ",self.state.totalDaysAttendance);
        // console.log("Total Attendance of the month: ",total_days);
        // console.log("Number of students absent for 5 consecutive days MALE: ",total_male_5_absent);
        // console.log("Number of students absent for 5 consecutive days FEMALE: ",total_female_5_absent);
        

        let PAMM = (((student_male_total_daily_present / total_days) / self.state.RegisteredLearnersM ) * 100);
        let PAMF = (((student_female_total_daily_present / total_days) / self.state.RegisteredLearnersF ) * 100);
        let ADAM = (student_male_total_daily_present / self.state.totalDaysAttendance) ;
        let ADAF = (student_female_total_daily_present / self.state.totalDaysAttendance);
        let PAMTOTAL = ((PAMM + PAMF) / 2);
        if(ADAM=="NaN") {
            ADAM = 0;
        }
        if(ADAF=="NaN") {
            ADAF = 0;
        }
        // console.log("Percentage of Attendance for the month (male): ",((student_male_total_daily_present / total_days) / self.state.RegisteredLearnersM ) * 100);
        // console.log("Percentage of Attendance for the month (female): ",((student_female_total_daily_present / total_days) / self.state.RegisteredLearnersF) * 100);
        // console.log("Percentage of Attendance for the month: ", ((PAMM + PAMF) / 2));

        // console.log("Average Daily Attendance MALE: ", (student_male_total_daily_present / self.state.totalDaysAttendance) * 100);
        // console.log("Average Daily Attendance FEMALE: ", (student_female_total_daily_present / self.state.totalDaysAttendance) * 100);
        // console.log("Average Daily Attendance: ", (ADAM / ADAF));
        
        this.setState({
            student_list: student_list,
            student_male_list: student_list.filter(e => e.sex=="Male"),
            student_female_list: student_list.filter(e => e.sex=="Female"),
            student_male_total_daily: student_male_total_daily,
            student_female_total_daily: student_female_total_daily,
            PAMM: (PAMM.toFixed(2) != "NaN")?PAMM.toFixed(2):0,
            PAMF: (PAMF.toFixed(2) != "NaN")?PAMF.toFixed(2):0,
            PAMTOTAL: (PAMTOTAL.toFixed(2) != "NaN")?PAMTOTAL:0,
            ADAM: (ADAM != "NaN")?ADAM.toFixed(2):0,
            ADAF: (ADAF != "NaN")?ADAF.toFixed(2):0,
            ADATOTAL: ((ADAM / ADAF).toFixed(2)!="NaN")?(ADAM / ADAF).toFixed(2):0,
            NSAM: total_male_5_absent,
            NSAF: total_female_5_absent,
            loading:false
        },() => {
            this.loadPDF();
        })
    }


    generateDataold(data) {
        // console.log(data)
        // console.log(this.state.getWeeksInMonth)
        let self = this;
        const student = self.state.student_list;
        let student_list = []; 
        // console.log("student",student);
        student.forEach((val,i_,arr) => {
            const temp_student_list = {...val,WeeksInMonth: JSON.parse(JSON.stringify(this.state.getWeeksInMonth))}
            // let getWeeksInMonth = this.state.getWeeksInMonth;
            let getWeeksInMonth_temp = [];
            for (let i = 0; i < temp_student_list.WeeksInMonth.length; i++) {
                let week = temp_student_list.WeeksInMonth[i]; 
                if(week.mon != null && data.length > 0 && data.some(e=>e.date==week.mon.fulldate&&e.qr_code===val.qr_code) == true) { 
                    week.mon.logs = { status: 'full',morning: '',afternoon:''}; 
                } else if(week.tue != null && data.length > 0 && data.some(e=>e.date==week.tue.fulldate&&e.qr_code===val.qr_code) == true) {
                    week.tue.logs = { status: 'full',morning: '',afternoon:''};  
                } else if(week.wed != null && data.length > 0 && data.some(e=>e.date==week.wed.fulldate&&e.qr_code===val.qr_code) == true) {
                    week.wed.logs = { status: 'full',morning: '',afternoon:''};  
                } else if(week.thu != null && data.length > 0 && data.some(e=>e.date==week.thu.fulldate&&e.qr_code===val.qr_code) == true) {
                    week.thu.logs = { status: 'full',morning: '',afternoon:''};  
                } else if(week.fri != null && data.length > 0 && data.some(e=>e.date==week.fri.fulldate&&e.qr_code===val.qr_code) == true) {
                    week.fri.logs = { status: 'full',morning: '',afternoon:''};  
                } 
                getWeeksInMonth_temp.push(week)
            } 
            student_list.push({...val,WeeksInMonth: getWeeksInMonth_temp});
        });

        this.setState({
            student_list: student_list,
            student_male_list: student_list.filter(e => e.sex=="Male"),
            student_female_list: student_list.filter(e => e.sex=="Female"),
        },() => {
            this.loadPDF();
        })
        // console.log(student_list);
    }

    async loadPDFold() {
        // console.log("loading pdf",this.state.student_male_list,this.state.student_female_list)

        let green = {fillColor:[0,128,0]};
        let red = {fillColor:[216,78,75]};
        let img_none = '/images/sf2/1.png';
        let img_full = '/images/sf2/2.png';
        let img_absent = '/images/sf2/3.png';
        let img_absent_afternoon = '/images/sf2/4.png';
        let img_absent_morning = '/images/sf2/5.png';

        try {
            let self = this;
            let sgv = "";
            let temp_data = [];
            let student_male_list = self.state.student_male_list.sort(sortFullnameAZ);
            let student_female_list = self.state.student_female_list.sort(sortFullnameAZ);
            // Array.from({length:self.state.student_male_list.length})
            student_male_list.forEach((e,x) => { 
                temp_data.push([
                    {
                        content: (x+1),
                        styles: {halign: 'center', valign: 'middle',minWidth: 5,minCellHeight: 0,cellWidth: 6.5,fontSize: 5}
                    },
                    {
                        content: e.fullname,
                        styles: {halign: 'left',minWidth: 0,minCellHeight: 0,cellWidth:60,fontSize: 7}
                    },
                    {
                        content: (typeof(e.WeeksInMonth)!="undefined"&&e.WeeksInMonth.length>0&&e.WeeksInMonth[0].mon!=null&&typeof(e.WeeksInMonth[0].mon.logs)!="undefined")?e.WeeksInMonth[0].mon.logs.status:"",
                        styles: {halign: 'center',minWidth: 0,minCellHeight: 0,cellWidth: 5,fontSize: 4,}
                    },
                    {
                        content: (typeof(e.WeeksInMonth)!="undefined"&&e.WeeksInMonth.length>0&&e.WeeksInMonth[0].tue!=null&&typeof(e.WeeksInMonth[0].tue.logs)!="undefined")?e.WeeksInMonth[0].tue.logs.status:"",
                        styles: {halign: 'center',minWidth: 0,minCellHeight: 0,cellWidth: 5,fontSize: 4}
                    },
                    {
                        content: (typeof(e.WeeksInMonth)!="undefined"&&e.WeeksInMonth.length>0&&e.WeeksInMonth[0].wed!=null&&typeof(e.WeeksInMonth[0].wed.logs)!="undefined")?e.WeeksInMonth[0].wed.logs.status:"",
                        styles: {halign: 'center',minWidth: 0,minCellHeight: 0,cellWidth: 5,fontSize: 4}
                    },
                    {
                        content: (typeof(e.WeeksInMonth)!="undefined"&&e.WeeksInMonth.length>0&&e.WeeksInMonth[0].thu!=null&&typeof(e.WeeksInMonth[0].thu.logs)!="undefined")?e.WeeksInMonth[0].thu.logs.status:"",
                        styles: {halign: 'center',minWidth: 0,minCellHeight: 0,cellWidth: 5,fontSize: 4}
                    },
                    {
                        content: (typeof(e.WeeksInMonth)!="undefined"&&e.WeeksInMonth.length>0&&e.WeeksInMonth[0].fri!=null&&typeof(e.WeeksInMonth[0].fri.logs)!="undefined")?e.WeeksInMonth[0].fri.logs.status:"",
                        styles: {halign: 'center',minWidth: 0,minCellHeight: 0,cellWidth: 5,fontSize: 4}
                    },
                    {
                        content: (typeof(e.WeeksInMonth)!="undefined"&&e.WeeksInMonth.length>0&&e.WeeksInMonth[1].mon!=null&&typeof(e.WeeksInMonth[1].mon.logs)!="undefined")?e.WeeksInMonth[1].mon.logs.status:"",
                        styles: {halign: 'center',minWidth: 0,minCellHeight: 0,cellWidth: 5,fontSize: 4}
                    },
                    {
                        content: (typeof(e.WeeksInMonth)!="undefined"&&e.WeeksInMonth.length>0&&e.WeeksInMonth[1].tue!=null&&typeof(e.WeeksInMonth[1].tue.logs)!="undefined")?e.WeeksInMonth[1].tue.logs.status:"",
                        styles: {halign: 'center',minWidth: 0,minCellHeight: 0,cellWidth: 5,fontSize: 4}
                    },
                    {
                        content: (typeof(e.WeeksInMonth)!="undefined"&&e.WeeksInMonth.length>0&&e.WeeksInMonth[1].wed!=null&&typeof(e.WeeksInMonth[1].wed.logs)!="undefined")?e.WeeksInMonth[1].wed.logs.status:"",
                        styles: {halign: 'center',minWidth: 0,minCellHeight: 0,cellWidth: 5,fontSize: 4}
                    },
                    {
                        content: (typeof(e.WeeksInMonth)!="undefined"&&e.WeeksInMonth.length>0&&e.WeeksInMonth[1].thu!=null&&typeof(e.WeeksInMonth[1].thu.logs)!="undefined")?e.WeeksInMonth[1].thu.logs.status:"",
                        styles: {halign: 'center',minWidth: 0,minCellHeight: 0,cellWidth: 5,fontSize: 4}
                    },
                    {
                        content: (typeof(e.WeeksInMonth)!="undefined"&&e.WeeksInMonth.length>0&&e.WeeksInMonth[1].fri!=null&&typeof(e.WeeksInMonth[1].fri.logs)!="undefined")?e.WeeksInMonth[1].fri.logs.status:"",
                        styles: {halign: 'center',minWidth: 0,minCellHeight: 0,cellWidth: 5,fontSize: 4}
                    },
                    {
                        content: (typeof(e.WeeksInMonth)!="undefined"&&e.WeeksInMonth.length>0&&e.WeeksInMonth[2].mon!=null&&typeof(e.WeeksInMonth[2].mon.logs)!="undefined")?e.WeeksInMonth[2].mon.logs.status:"",
                        styles: {halign: 'center',minWidth: 0,minCellHeight: 0,cellWidth: 5,fontSize: 4}
                    },
                    {
                        content: (typeof(e.WeeksInMonth)!="undefined"&&e.WeeksInMonth.length>0&&e.WeeksInMonth[2].tue!=null&&typeof(e.WeeksInMonth[2].tue.logs)!="undefined")?e.WeeksInMonth[2].tue.logs.status:"",
                        styles: {halign: 'center',minWidth: 0,minCellHeight: 0,cellWidth: 5,fontSize: 4}
                    },
                    {
                        content: (typeof(e.WeeksInMonth)!="undefined"&&e.WeeksInMonth.length>0&&e.WeeksInMonth[2].wed!=null&&typeof(e.WeeksInMonth[2].wed.logs)!="undefined")?e.WeeksInMonth[2].wed.logs.status:"",
                        styles: {halign: 'center',minWidth: 0,minCellHeight: 0,cellWidth: 5,fontSize: 4}
                    },
                    {
                        content: (typeof(e.WeeksInMonth)!="undefined"&&e.WeeksInMonth.length>0&&e.WeeksInMonth[2].thu!=null&&typeof(e.WeeksInMonth[2].thu.logs)!="undefined")?e.WeeksInMonth[2].thu.logs.status:"",
                        styles: {halign: 'center',minWidth: 0,minCellHeight: 0,cellWidth: 5,fontSize: 4}
                    },
                    {
                        content: (typeof(e.WeeksInMonth)!="undefined"&&e.WeeksInMonth.length>0&&e.WeeksInMonth[2].fri!=null&&typeof(e.WeeksInMonth[2].fri.logs)!="undefined")?e.WeeksInMonth[2].fri.logs.status:"",
                        styles: {halign: 'center',minWidth: 0,minCellHeight: 0,cellWidth: 5,fontSize: 4}
                    },
                    {
                        content: (typeof(e.WeeksInMonth)!="undefined"&&e.WeeksInMonth.length>0&&e.WeeksInMonth[3].mon!=null&&typeof(e.WeeksInMonth[3].mon.logs)!="undefined")?e.WeeksInMonth[3].mon.logs.status:"",
                        styles: {halign: 'center',minWidth: 0,minCellHeight: 0,cellWidth: 5,fontSize: 4}
                    },
                    {
                        content: (typeof(e.WeeksInMonth)!="undefined"&&e.WeeksInMonth.length>0&&e.WeeksInMonth[3].tue!=null&&typeof(e.WeeksInMonth[3].tue.logs)!="undefined")?e.WeeksInMonth[3].tue.logs.status:"",
                        styles: {halign: 'center',minWidth: 0,minCellHeight: 0,cellWidth: 5,fontSize: 4}
                    },
                    {
                        content: (typeof(e.WeeksInMonth)!="undefined"&&e.WeeksInMonth.length>0&&e.WeeksInMonth[3].wed!=null&&typeof(e.WeeksInMonth[3].wed.logs)!="undefined")?e.WeeksInMonth[3].wed.logs.status:"",
                        styles: {halign: 'center',minWidth: 0,minCellHeight: 0,cellWidth: 5,fontSize: 4}
                    },
                    {
                        content: (typeof(e.WeeksInMonth)!="undefined"&&e.WeeksInMonth.length>0&&e.WeeksInMonth[3].thu!=null&&typeof(e.WeeksInMonth[3].thu.logs)!="undefined")?e.WeeksInMonth[3].thu.logs.status:"",
                        styles: {halign: 'center',minWidth: 0,minCellHeight: 0,cellWidth: 5,fontSize: 4}
                    },
                    {
                        content: (typeof(e.WeeksInMonth)!="undefined"&&e.WeeksInMonth.length>0&&e.WeeksInMonth[3].fri!=null&&typeof(e.WeeksInMonth[3].fri.logs)!="undefined")?e.WeeksInMonth[3].fri.logs.status:"",
                        styles: {halign: 'center',minWidth: 0,minCellHeight: 0,cellWidth: 5,fontSize: 4}
                    },
                    {
                        content: (typeof(e.WeeksInMonth)!="undefined"&&e.WeeksInMonth.length>0&&e.WeeksInMonth[4].mon!=null&&typeof(e.WeeksInMonth[4].mon.logs)!="undefined")?e.WeeksInMonth[4].mon.logs.status:"",
                        styles: {halign: 'center',minWidth: 0,minCellHeight: 0,cellWidth: 5,fontSize: 4}
                    },
                    {
                        content: (typeof(e.WeeksInMonth)!="undefined"&&e.WeeksInMonth.length>0&&e.WeeksInMonth[4].tue!=null&&typeof(e.WeeksInMonth[4].tue.logs)!="undefined")?e.WeeksInMonth[4].tue.logs.status:"",
                        styles: {halign: 'center',minWidth: 0,minCellHeight: 0,cellWidth: 5,fontSize: 4}
                    },
                    {
                        content: (typeof(e.WeeksInMonth)!="undefined"&&e.WeeksInMonth.length>0&&e.WeeksInMonth[4].wed!=null&&typeof(e.WeeksInMonth[4].wed.logs)!="undefined")?e.WeeksInMonth[4].wed.logs.status:"",
                        styles: {halign: 'center',minWidth: 0,minCellHeight: 0,cellWidth: 5,fontSize: 4}
                    },
                    {
                        content: (typeof(e.WeeksInMonth)!="undefined"&&e.WeeksInMonth.length>0&&e.WeeksInMonth[4].thu!=null&&typeof(e.WeeksInMonth[4].thu.logs)!="undefined")?e.WeeksInMonth[4].thu.logs.status:"",
                        styles: {halign: 'center',minWidth: 0,minCellHeight: 0,cellWidth: 5,fontSize: 4}
                    },
                    {
                        content: (typeof(e.WeeksInMonth)!="undefined"&&e.WeeksInMonth.length>0&&e.WeeksInMonth[4].fri!=null&&typeof(e.WeeksInMonth[4].fri.logs)!="undefined")?e.WeeksInMonth[4].fri.logs.status:"",
                        styles: {halign: 'center',minWidth: 0,minCellHeight: 0,cellWidth: 5,fontSize: 4}
                    },
                    {
                        content: "",
                        styles: {halign: 'center',minWidth: 0,minCellHeight: 0,fontSize: 4}
                    },
                    {
                        content: "",
                        styles: {halign: 'center',minWidth: 0,minCellHeight: 0,fontSize: 4}
                    },
                    {
                        content: "",
                        styles: {halign: 'center',minWidth: 0,minCellHeight: 0,fontSize: 4}
                    },
                ]);
            });
            // total male
            temp_data.push([
                {
                    content: "",
                    styles: {halign: 'center', valign: 'middle',minWidth: 5,minCellHeight: 0,cellWidth: 6.5,fontSize: 5}
                },
                {
                    content:"MALE | TOTAL  Per Day",
                    styles: {halign: 'left',minWidth: 0,minCellHeight: 0,cellWidth:60,fontSize: 7}
                },
                {
                    content: "",
                    styles: {halign: 'center',minWidth: 0,minCellHeight: 0,cellWidth: 5,fontSize: 4}
                },
                {
                    content: "",
                    styles: {halign: 'center',minWidth: 0,minCellHeight: 0,cellWidth: 5,fontSize: 4}
                },
                {
                    content: "",
                    styles: {halign: 'center',minWidth: 0,minCellHeight: 0,cellWidth: 5,fontSize: 4}
                },
                {
                    content: "",
                    styles: {halign: 'center',minWidth: 0,minCellHeight: 0,cellWidth: 5,fontSize: 4}
                },
                {
                    content: "",
                    styles: {halign: 'center',minWidth: 0,minCellHeight: 0,cellWidth: 5,fontSize: 4}
                },
                {
                    content: "",
                    styles: {halign: 'center',minWidth: 0,minCellHeight: 0,cellWidth: 5,fontSize: 4}
                },
                {
                    content: "",
                    styles: {halign: 'center',minWidth: 0,minCellHeight: 0,cellWidth: 5,fontSize: 4}
                },
                {
                    content: "",
                    styles: {halign: 'center',minWidth: 0,minCellHeight: 0,cellWidth: 5,fontSize: 4}
                },
                {
                    content: "",
                    styles: {halign: 'center',minWidth: 0,minCellHeight: 0,cellWidth: 5,fontSize: 4}
                },
                {
                    content: "",
                    styles: {halign: 'center',minWidth: 0,minCellHeight: 0,cellWidth: 5,fontSize: 4}
                },
                {
                    content: "",
                    styles: {halign: 'center',minWidth: 0,minCellHeight: 0,cellWidth: 5,fontSize: 4}
                },
                {
                    content: "",
                    styles: {halign: 'center',minWidth: 0,minCellHeight: 0,cellWidth: 5,fontSize: 4}
                },
                {
                    content: "",
                    styles: {halign: 'center',minWidth: 0,minCellHeight: 0,cellWidth: 5,fontSize: 4}
                },
                {
                    content: "",
                    styles: {halign: 'center',minWidth: 0,minCellHeight: 0,cellWidth: 5,fontSize: 4}
                },
                {
                    content: "",
                    styles: {halign: 'center',minWidth: 0,minCellHeight: 0,cellWidth: 5,fontSize: 4}
                },
                {
                    content: "",
                    styles: {halign: 'center',minWidth: 0,minCellHeight: 0,cellWidth: 5,fontSize: 4}
                },
                {
                    content: "",
                    styles: {halign: 'center',minWidth: 0,minCellHeight: 0,cellWidth: 5,fontSize: 4}
                },
                {
                    content: "",
                    styles: {halign: 'center',minWidth: 0,minCellHeight: 0,cellWidth: 5,fontSize: 4}
                },
                {
                    content: "",
                    styles: {halign: 'center',minWidth: 0,minCellHeight: 0,cellWidth: 5,fontSize: 4}
                },
                {
                    content: "",
                    styles: {halign: 'center',minWidth: 0,minCellHeight: 0,cellWidth: 5,fontSize: 4}
                },
                {
                    content: "",
                    styles: {halign: 'center',minWidth: 0,minCellHeight: 0,cellWidth: 5,fontSize: 4}
                },
                {
                    content: "",
                    styles: {halign: 'center',minWidth: 0,minCellHeight: 0,cellWidth: 5,fontSize: 4}
                },
                {
                    content: "",
                    styles: {halign: 'center',minWidth: 0,minCellHeight: 0,cellWidth: 5,fontSize: 4}
                },
                {
                    content: "",
                    styles: {halign: 'center',minWidth: 0,minCellHeight: 0,cellWidth: 5,fontSize: 4}
                },
                {
                    content: "",
                    styles: {halign: 'center',minWidth: 0,minCellHeight: 0,cellWidth: 5,fontSize: 4}
                },
                {
                    content: "",
                    styles: {halign: 'center',minWidth: 0,minCellHeight: 0,fontSize: 4}
                },
                {
                    content: "",
                    styles: {halign: 'center',minWidth: 0,minCellHeight: 0,fontSize: 4}
                },
                {
                    content: "",
                    styles: {halign: 'center',minWidth: 0,minCellHeight: 0,fontSize: 4}
                },
            ]);
            // Array.from({length:self.state.student_female_list.length}).
            student_female_list.forEach((e,x) => {
                temp_data.push([
                    {
                        content: (x+1),
                        styles: {halign: 'center', valign: 'middle',minWidth: 5,minCellHeight: 0,cellWidth: 6.5,fontSize: 5}
                    },
                    {
                        content: e.fullname,
                        styles: {halign: 'left',minWidth: 0,minCellHeight: 0,cellWidth:60,fontSize: 7}
                    },
                    {
                        content: (typeof(e.WeeksInMonth)!="undefined"&&e.WeeksInMonth.length>0&&e.WeeksInMonth[0].mon!=null&&typeof(e.WeeksInMonth[0].mon.logs)!="undefined")?e.WeeksInMonth[0].mon.logs.status:"",
                        styles: {halign: 'center',minWidth: 0,minCellHeight: 0,cellWidth: 5,fontSize: 4,}
                    },
                    {
                        content: (typeof(e.WeeksInMonth)!="undefined"&&e.WeeksInMonth.length>0&&e.WeeksInMonth[0].tue!=null&&typeof(e.WeeksInMonth[0].tue.logs)!="undefined")?e.WeeksInMonth[0].tue.logs.status:"",
                        styles: {halign: 'center',minWidth: 0,minCellHeight: 0,cellWidth: 5,fontSize: 4}
                    },
                    {
                        content: (typeof(e.WeeksInMonth)!="undefined"&&e.WeeksInMonth.length>0&&e.WeeksInMonth[0].wed!=null&&typeof(e.WeeksInMonth[0].wed.logs)!="undefined")?e.WeeksInMonth[0].wed.logs.status:"",
                        styles: {halign: 'center',minWidth: 0,minCellHeight: 0,cellWidth: 5,fontSize: 4}
                    },
                    {
                        content: (typeof(e.WeeksInMonth)!="undefined"&&e.WeeksInMonth.length>0&&e.WeeksInMonth[0].thu!=null&&typeof(e.WeeksInMonth[0].thu.logs)!="undefined")?e.WeeksInMonth[0].thu.logs.status:"",
                        styles: {halign: 'center',minWidth: 0,minCellHeight: 0,cellWidth: 5,fontSize: 4}
                    },
                    {
                        content: (typeof(e.WeeksInMonth)!="undefined"&&e.WeeksInMonth.length>0&&e.WeeksInMonth[0].fri!=null&&typeof(e.WeeksInMonth[0].fri.logs)!="undefined")?e.WeeksInMonth[0].fri.logs.status:"",
                        styles: {halign: 'center',minWidth: 0,minCellHeight: 0,cellWidth: 5,fontSize: 4}
                    },
                    {
                        content: (typeof(e.WeeksInMonth)!="undefined"&&e.WeeksInMonth.length>0&&e.WeeksInMonth[1].mon!=null&&typeof(e.WeeksInMonth[1].mon.logs)!="undefined")?e.WeeksInMonth[1].mon.logs.status:"",
                        styles: {halign: 'center',minWidth: 0,minCellHeight: 0,cellWidth: 5,fontSize: 4}
                    },
                    {
                        content: (typeof(e.WeeksInMonth)!="undefined"&&e.WeeksInMonth.length>0&&e.WeeksInMonth[1].tue!=null&&typeof(e.WeeksInMonth[1].tue.logs)!="undefined")?e.WeeksInMonth[1].tue.logs.status:"",
                        styles: {halign: 'center',minWidth: 0,minCellHeight: 0,cellWidth: 5,fontSize: 4}
                    },
                    {
                        content: (typeof(e.WeeksInMonth)!="undefined"&&e.WeeksInMonth.length>0&&e.WeeksInMonth[1].wed!=null&&typeof(e.WeeksInMonth[1].wed.logs)!="undefined")?e.WeeksInMonth[1].wed.logs.status:"",
                        styles: {halign: 'center',minWidth: 0,minCellHeight: 0,cellWidth: 5,fontSize: 4}
                    },
                    {
                        content: (typeof(e.WeeksInMonth)!="undefined"&&e.WeeksInMonth.length>0&&e.WeeksInMonth[1].thu!=null&&typeof(e.WeeksInMonth[1].thu.logs)!="undefined")?e.WeeksInMonth[1].thu.logs.status:"",
                        styles: {halign: 'center',minWidth: 0,minCellHeight: 0,cellWidth: 5,fontSize: 4}
                    },
                    {
                        content: (typeof(e.WeeksInMonth)!="undefined"&&e.WeeksInMonth.length>0&&e.WeeksInMonth[1].fri!=null&&typeof(e.WeeksInMonth[1].fri.logs)!="undefined")?e.WeeksInMonth[1].fri.logs.status:"",
                        styles: {halign: 'center',minWidth: 0,minCellHeight: 0,cellWidth: 5,fontSize: 4}
                    },
                    {
                        content: (typeof(e.WeeksInMonth)!="undefined"&&e.WeeksInMonth.length>0&&e.WeeksInMonth[2].mon!=null&&typeof(e.WeeksInMonth[2].mon.logs)!="undefined")?e.WeeksInMonth[2].mon.logs.status:"",
                        styles: {halign: 'center',minWidth: 0,minCellHeight: 0,cellWidth: 5,fontSize: 4}
                    },
                    {
                        content: (typeof(e.WeeksInMonth)!="undefined"&&e.WeeksInMonth.length>0&&e.WeeksInMonth[2].tue!=null&&typeof(e.WeeksInMonth[2].tue.logs)!="undefined")?e.WeeksInMonth[2].tue.logs.status:"",
                        styles: {halign: 'center',minWidth: 0,minCellHeight: 0,cellWidth: 5,fontSize: 4}
                    },
                    {
                        content: (typeof(e.WeeksInMonth)!="undefined"&&e.WeeksInMonth.length>0&&e.WeeksInMonth[2].wed!=null&&typeof(e.WeeksInMonth[2].wed.logs)!="undefined")?e.WeeksInMonth[2].wed.logs.status:"",
                        styles: {halign: 'center',minWidth: 0,minCellHeight: 0,cellWidth: 5,fontSize: 4}
                    },
                    {
                        content: (typeof(e.WeeksInMonth)!="undefined"&&e.WeeksInMonth.length>0&&e.WeeksInMonth[2].thu!=null&&typeof(e.WeeksInMonth[2].thu.logs)!="undefined")?e.WeeksInMonth[2].thu.logs.status:"",
                        styles: {halign: 'center',minWidth: 0,minCellHeight: 0,cellWidth: 5,fontSize: 4}
                    },
                    {
                        content: (typeof(e.WeeksInMonth)!="undefined"&&e.WeeksInMonth.length>0&&e.WeeksInMonth[2].fri!=null&&typeof(e.WeeksInMonth[2].fri.logs)!="undefined")?e.WeeksInMonth[2].fri.logs.status:"",
                        styles: {halign: 'center',minWidth: 0,minCellHeight: 0,cellWidth: 5,fontSize: 4}
                    },
                    {
                        content: (typeof(e.WeeksInMonth)!="undefined"&&e.WeeksInMonth.length>0&&e.WeeksInMonth[3].mon!=null&&typeof(e.WeeksInMonth[3].mon.logs)!="undefined")?e.WeeksInMonth[3].mon.logs.status:"",
                        styles: {halign: 'center',minWidth: 0,minCellHeight: 0,cellWidth: 5,fontSize: 4}
                    },
                    {
                        content: (typeof(e.WeeksInMonth)!="undefined"&&e.WeeksInMonth.length>0&&e.WeeksInMonth[3].tue!=null&&typeof(e.WeeksInMonth[3].tue.logs)!="undefined")?e.WeeksInMonth[3].tue.logs.status:"",
                        styles: {halign: 'center',minWidth: 0,minCellHeight: 0,cellWidth: 5,fontSize: 4}
                    },
                    {
                        content: (typeof(e.WeeksInMonth)!="undefined"&&e.WeeksInMonth.length>0&&e.WeeksInMonth[3].wed!=null&&typeof(e.WeeksInMonth[3].wed.logs)!="undefined")?e.WeeksInMonth[3].wed.logs.status:"",
                        styles: {halign: 'center',minWidth: 0,minCellHeight: 0,cellWidth: 5,fontSize: 4}
                    },
                    {
                        content: (typeof(e.WeeksInMonth)!="undefined"&&e.WeeksInMonth.length>0&&e.WeeksInMonth[3].thu!=null&&typeof(e.WeeksInMonth[3].thu.logs)!="undefined")?e.WeeksInMonth[3].thu.logs.status:"",
                        styles: {halign: 'center',minWidth: 0,minCellHeight: 0,cellWidth: 5,fontSize: 4}
                    },
                    {
                        content: (typeof(e.WeeksInMonth)!="undefined"&&e.WeeksInMonth.length>0&&e.WeeksInMonth[3].fri!=null&&typeof(e.WeeksInMonth[3].fri.logs)!="undefined")?e.WeeksInMonth[3].fri.logs.status:"",
                        styles: {halign: 'center',minWidth: 0,minCellHeight: 0,cellWidth: 5,fontSize: 4}
                    },
                    {
                        content: (typeof(e.WeeksInMonth)!="undefined"&&e.WeeksInMonth.length>0&&e.WeeksInMonth[4].mon!=null&&typeof(e.WeeksInMonth[4].mon.logs)!="undefined")?e.WeeksInMonth[4].mon.logs.status:"",
                        styles: {halign: 'center',minWidth: 0,minCellHeight: 0,cellWidth: 5,fontSize: 4}
                    },
                    {
                        content: (typeof(e.WeeksInMonth)!="undefined"&&e.WeeksInMonth.length>0&&e.WeeksInMonth[4].tue!=null&&typeof(e.WeeksInMonth[4].tue.logs)!="undefined")?e.WeeksInMonth[4].tue.logs.status:"",
                        styles: {halign: 'center',minWidth: 0,minCellHeight: 0,cellWidth: 5,fontSize: 4}
                    },
                    {
                        content: (typeof(e.WeeksInMonth)!="undefined"&&e.WeeksInMonth.length>0&&e.WeeksInMonth[4].wed!=null&&typeof(e.WeeksInMonth[4].wed.logs)!="undefined")?e.WeeksInMonth[4].wed.logs.status:"",
                        styles: {halign: 'center',minWidth: 0,minCellHeight: 0,cellWidth: 5,fontSize: 4}
                    },
                    {
                        content: (typeof(e.WeeksInMonth)!="undefined"&&e.WeeksInMonth.length>0&&e.WeeksInMonth[4].thu!=null&&typeof(e.WeeksInMonth[4].thu.logs)!="undefined")?e.WeeksInMonth[4].thu.logs.status:"",
                        styles: {halign: 'center',minWidth: 0,minCellHeight: 0,cellWidth: 5,fontSize: 4}
                    },
                    {
                        content: (typeof(e.WeeksInMonth)!="undefined"&&e.WeeksInMonth.length>0&&e.WeeksInMonth[4].fri!=null&&typeof(e.WeeksInMonth[4].fri.logs)!="undefined")?e.WeeksInMonth[4].fri.logs.status:"",
                        styles: {halign: 'center',minWidth: 0,minCellHeight: 0,cellWidth: 5,fontSize: 4}
                    },
                    {
                        content: "",
                        styles: {halign: 'center',minWidth: 0,minCellHeight: 0,fontSize: 4}
                    },
                    {
                        content: "",
                        styles: {halign: 'center',minWidth: 0,minCellHeight: 0,fontSize: 4}
                    },
                    {
                        content: "",
                        styles: {halign: 'center',minWidth: 0,minCellHeight: 0,fontSize: 4}
                    },
                ]);
            });
            // total Female
            temp_data.push([
                {
                    content: "",
                    styles: {halign: 'center', valign: 'middle',minWidth: 5,minCellHeight: 0,cellWidth: 6.5,fontSize: 5}
                },
                {
                    content:"FEMALE | TOTAL  Per Day",
                    styles: {halign: 'left',minWidth: 0,minCellHeight: 0,cellWidth:60,fontSize: 7}
                },
                {
                    content: "",
                    styles: {halign: 'center',minWidth: 0,minCellHeight: 0,cellWidth: 5,fontSize: 4}
                },
                {
                    content: "",
                    styles: {halign: 'center',minWidth: 0,minCellHeight: 0,cellWidth: 5,fontSize: 4}
                },
                {
                    content: "",
                    styles: {halign: 'center',minWidth: 0,minCellHeight: 0,cellWidth: 5,fontSize: 4}
                },
                {
                    content: "",
                    styles: {halign: 'center',minWidth: 0,minCellHeight: 0,cellWidth: 5,fontSize: 4}
                },
                {
                    content: "",
                    styles: {halign: 'center',minWidth: 0,minCellHeight: 0,cellWidth: 5,fontSize: 4}
                },
                {
                    content: "",
                    styles: {halign: 'center',minWidth: 0,minCellHeight: 0,cellWidth: 5,fontSize: 4}
                },
                {
                    content: "",
                    styles: {halign: 'center',minWidth: 0,minCellHeight: 0,cellWidth: 5,fontSize: 4}
                },
                {
                    content: "",
                    styles: {halign: 'center',minWidth: 0,minCellHeight: 0,cellWidth: 5,fontSize: 4}
                },
                {
                    content: "",
                    styles: {halign: 'center',minWidth: 0,minCellHeight: 0,cellWidth: 5,fontSize: 4}
                },
                {
                    content: "",
                    styles: {halign: 'center',minWidth: 0,minCellHeight: 0,cellWidth: 5,fontSize: 4}
                },
                {
                    content: "",
                    styles: {halign: 'center',minWidth: 0,minCellHeight: 0,cellWidth: 5,fontSize: 4}
                },
                {
                    content: "",
                    styles: {halign: 'center',minWidth: 0,minCellHeight: 0,cellWidth: 5,fontSize: 4}
                },
                {
                    content: "",
                    styles: {halign: 'center',minWidth: 0,minCellHeight: 0,cellWidth: 5,fontSize: 4}
                },
                {
                    content: "",
                    styles: {halign: 'center',minWidth: 0,minCellHeight: 0,cellWidth: 5,fontSize: 4}
                },
                {
                    content: "",
                    styles: {halign: 'center',minWidth: 0,minCellHeight: 0,cellWidth: 5,fontSize: 4}
                },
                {
                    content: "",
                    styles: {halign: 'center',minWidth: 0,minCellHeight: 0,cellWidth: 5,fontSize: 4}
                },
                {
                    content: "",
                    styles: {halign: 'center',minWidth: 0,minCellHeight: 0,cellWidth: 5,fontSize: 4}
                },
                {
                    content: "",
                    styles: {halign: 'center',minWidth: 0,minCellHeight: 0,cellWidth: 5,fontSize: 4}
                },
                {
                    content: "",
                    styles: {halign: 'center',minWidth: 0,minCellHeight: 0,cellWidth: 5,fontSize: 4}
                },
                {
                    content: "",
                    styles: {halign: 'center',minWidth: 0,minCellHeight: 0,cellWidth: 5,fontSize: 4}
                },
                {
                    content: "",
                    styles: {halign: 'center',minWidth: 0,minCellHeight: 0,cellWidth: 5,fontSize: 4}
                },
                {
                    content: "",
                    styles: {halign: 'center',minWidth: 0,minCellHeight: 0,cellWidth: 5,fontSize: 4}
                },
                {
                    content: "",
                    styles: {halign: 'center',minWidth: 0,minCellHeight: 0,cellWidth: 5,fontSize: 4}
                },
                {
                    content: "",
                    styles: {halign: 'center',minWidth: 0,minCellHeight: 0,cellWidth: 5,fontSize: 4}
                },
                {
                    content: "",
                    styles: {halign: 'center',minWidth: 0,minCellHeight: 0,cellWidth: 5,fontSize: 4}
                },
                {
                    content: "",
                    styles: {halign: 'center',minWidth: 0,minCellHeight: 0,fontSize: 4}
                },
                {
                    content: "",
                    styles: {halign: 'center',minWidth: 0,minCellHeight: 0,fontSize: 4}
                },
                {
                    content: "",
                    styles: {halign: 'center',minWidth: 0,minCellHeight: 0,fontSize: 4}
                },
            ]);
            // total overall
            temp_data.push([
                {
                    content: "",
                    styles: {halign: 'center', valign: 'middle',minWidth: 5,minCellHeight: 0,cellWidth: 6.5,fontSize: 5}
                },
                {
                    content:"Combined TOTAL PER DAY",
                    styles: {halign: 'left',minWidth: 0,minCellHeight: 0,cellWidth:60,fontSize: 7}
                },
                {
                    content: "",
                    styles: {halign: 'center',minWidth: 0,minCellHeight: 0,cellWidth: 5,fontSize: 4}
                },
                {
                    content: "",
                    styles: {halign: 'center',minWidth: 0,minCellHeight: 0,cellWidth: 5,fontSize: 4}
                },
                {
                    content: "",
                    styles: {halign: 'center',minWidth: 0,minCellHeight: 0,cellWidth: 5,fontSize: 4}
                },
                {
                    content: "",
                    styles: {halign: 'center',minWidth: 0,minCellHeight: 0,cellWidth: 5,fontSize: 4}
                },
                {
                    content: "",
                    styles: {halign: 'center',minWidth: 0,minCellHeight: 0,cellWidth: 5,fontSize: 4}
                },
                {
                    content: "",
                    styles: {halign: 'center',minWidth: 0,minCellHeight: 0,cellWidth: 5,fontSize: 4}
                },
                {
                    content: "",
                    styles: {halign: 'center',minWidth: 0,minCellHeight: 0,cellWidth: 5,fontSize: 4}
                },
                {
                    content: "",
                    styles: {halign: 'center',minWidth: 0,minCellHeight: 0,cellWidth: 5,fontSize: 4}
                },
                {
                    content: "",
                    styles: {halign: 'center',minWidth: 0,minCellHeight: 0,cellWidth: 5,fontSize: 4}
                },
                {
                    content: "",
                    styles: {halign: 'center',minWidth: 0,minCellHeight: 0,cellWidth: 5,fontSize: 4}
                },
                {
                    content: "",
                    styles: {halign: 'center',minWidth: 0,minCellHeight: 0,cellWidth: 5,fontSize: 4}
                },
                {
                    content: "",
                    styles: {halign: 'center',minWidth: 0,minCellHeight: 0,cellWidth: 5,fontSize: 4}
                },
                {
                    content: "",
                    styles: {halign: 'center',minWidth: 0,minCellHeight: 0,cellWidth: 5,fontSize: 4}
                },
                {
                    content: "",
                    styles: {halign: 'center',minWidth: 0,minCellHeight: 0,cellWidth: 5,fontSize: 4}
                },
                {
                    content: "",
                    styles: {halign: 'center',minWidth: 0,minCellHeight: 0,cellWidth: 5,fontSize: 4}
                },
                {
                    content: "",
                    styles: {halign: 'center',minWidth: 0,minCellHeight: 0,cellWidth: 5,fontSize: 4}
                },
                {
                    content: "",
                    styles: {halign: 'center',minWidth: 0,minCellHeight: 0,cellWidth: 5,fontSize: 4}
                },
                {
                    content: "",
                    styles: {halign: 'center',minWidth: 0,minCellHeight: 0,cellWidth: 5,fontSize: 4}
                },
                {
                    content: "",
                    styles: {halign: 'center',minWidth: 0,minCellHeight: 0,cellWidth: 5,fontSize: 4}
                },
                {
                    content: "",
                    styles: {halign: 'center',minWidth: 0,minCellHeight: 0,cellWidth: 5,fontSize: 4}
                },
                {
                    content: "",
                    styles: {halign: 'center',minWidth: 0,minCellHeight: 0,cellWidth: 5,fontSize: 4}
                },
                {
                    content: "",
                    styles: {halign: 'center',minWidth: 0,minCellHeight: 0,cellWidth: 5,fontSize: 4}
                },
                {
                    content: "",
                    styles: {halign: 'center',minWidth: 0,minCellHeight: 0,cellWidth: 5,fontSize: 4}
                },
                {
                    content: "",
                    styles: {halign: 'center',minWidth: 0,minCellHeight: 0,cellWidth: 5,fontSize: 4}
                },
                {
                    content: "",
                    styles: {halign: 'center',minWidth: 0,minCellHeight: 0,cellWidth: 5,fontSize: 4}
                },
                {
                    content: "",
                    styles: {halign: 'center',minWidth: 0,minCellHeight: 0,fontSize: 4}
                },
                {
                    content: "",
                    styles: {halign: 'center',minWidth: 0,minCellHeight: 0,fontSize: 4}
                },
                {
                    content: "",
                    styles: {halign: 'center',minWidth: 0,minCellHeight: 0,fontSize: 4}
                },
            ]);

            let header_dates = [
                {
                    content: (self.state.getWeeksInMonth.length>0&&self.state.getWeeksInMonth[0].mon != null)?self.state.getWeeksInMonth[0].mon.date:"",
                    styles: { halign: 'center', valign: 'middle',minCellHeight: 0, fontSize: 8},
                },
                {
                    content: (self.state.getWeeksInMonth.length>0&&self.state.getWeeksInMonth[0].tue != null)?self.state.getWeeksInMonth[0].tue.date:"",
                    styles: { halign: 'center', valign: 'middle',minCellHeight: 0, fontSize: 8},
                },
                {
                    content: (self.state.getWeeksInMonth.length>0&&self.state.getWeeksInMonth[0].wed != null)?self.state.getWeeksInMonth[0].wed.date:"",
                    styles: { halign: 'center', valign: 'middle',minCellHeight: 0, fontSize: 8},
                },
                {
                    content: (self.state.getWeeksInMonth.length>0&&self.state.getWeeksInMonth[0].thu != null)?self.state.getWeeksInMonth[0].thu.date:"",
                    styles: { halign: 'center', valign: 'middle',minCellHeight: 0, fontSize: 8},
                },
                {
                    content: (self.state.getWeeksInMonth.length>0&&self.state.getWeeksInMonth[0].fri != null)?self.state.getWeeksInMonth[0].fri.date:"",
                    styles: { halign: 'center', valign: 'middle',minCellHeight: 0, fontSize: 8},
                },
                {
                    content: (self.state.getWeeksInMonth.length>0&&self.state.getWeeksInMonth[1].mon != null)?self.state.getWeeksInMonth[1].mon.date:"",
                    styles: { halign: 'center', valign: 'middle',minCellHeight: 0, fontSize: 8},
                },
                {
                    content: (self.state.getWeeksInMonth.length>0&&self.state.getWeeksInMonth[1].tue != null)?self.state.getWeeksInMonth[1].tue.date:"",
                    styles: { halign: 'center', valign: 'middle',minCellHeight: 0, fontSize: 8},
                },
                {
                    content: (self.state.getWeeksInMonth.length>0&&self.state.getWeeksInMonth[1].wed != null)?self.state.getWeeksInMonth[1].wed.date:"",
                    styles: { halign: 'center', valign: 'middle',minCellHeight: 0, fontSize: 8},
                },
                {
                    content: (self.state.getWeeksInMonth.length>0&&self.state.getWeeksInMonth[1].thu != null)?self.state.getWeeksInMonth[1].thu.date:"",
                    styles: { halign: 'center', valign: 'middle',minCellHeight: 0, fontSize: 8},
                },
                {
                    content: (self.state.getWeeksInMonth.length>0&&self.state.getWeeksInMonth[1].fri != null)?self.state.getWeeksInMonth[1].fri.date:"",
                    styles: { halign: 'center', valign: 'middle',minCellHeight: 0, fontSize: 8},
                },
                {
                    content: (self.state.getWeeksInMonth.length>0&&self.state.getWeeksInMonth[2].mon != null)?self.state.getWeeksInMonth[2].mon.date:"",
                    styles: { halign: 'center', valign: 'middle',minCellHeight: 0, fontSize: 8},
                },
                {
                    content: (self.state.getWeeksInMonth.length>0&&self.state.getWeeksInMonth[2].tue != null)?self.state.getWeeksInMonth[2].tue.date:"",
                    styles: { halign: 'center', valign: 'middle',minCellHeight: 0, fontSize: 8},
                },
                {
                    content: (self.state.getWeeksInMonth.length>0&&self.state.getWeeksInMonth[2].wed != null)?self.state.getWeeksInMonth[2].wed.date:"",
                    styles: { halign: 'center', valign: 'middle',minCellHeight: 0, fontSize: 8},
                },
                {
                    content: (self.state.getWeeksInMonth.length>0&&self.state.getWeeksInMonth[2].thu != null)?self.state.getWeeksInMonth[2].thu.date:"",
                    styles: { halign: 'center', valign: 'middle',minCellHeight: 0, fontSize: 8},
                },
                {
                    content: (self.state.getWeeksInMonth.length>0&&self.state.getWeeksInMonth[2].fri != null)?self.state.getWeeksInMonth[2].fri.date:"",
                    styles: { halign: 'center', valign: 'middle',minCellHeight: 0, fontSize: 8},
                },
                {
                    content: (self.state.getWeeksInMonth.length>0&&self.state.getWeeksInMonth[3].mon != null)?self.state.getWeeksInMonth[3].mon.date:"",
                    styles: { halign: 'center', valign: 'middle',minCellHeight: 0, fontSize: 8},
                },
                {
                    content: (self.state.getWeeksInMonth.length>0&&self.state.getWeeksInMonth[3].thu != null)?self.state.getWeeksInMonth[3].thu.date:"",
                    styles: { halign: 'center', valign: 'middle',minCellHeight: 0, fontSize: 8},
                },
                {
                    content: (self.state.getWeeksInMonth.length>0&&self.state.getWeeksInMonth[3].wed != null)?self.state.getWeeksInMonth[3].wed.date:"",
                    styles: { halign: 'center', valign: 'middle',minCellHeight: 0, fontSize: 8},
                },
                {
                    content: (self.state.getWeeksInMonth.length>0&&self.state.getWeeksInMonth[3].thu != null)?self.state.getWeeksInMonth[3].thu.date:"",
                    styles: { halign: 'center', valign: 'middle',minCellHeight: 0, fontSize: 8},
                },
                {
                    content: (self.state.getWeeksInMonth.length>0&&self.state.getWeeksInMonth[3].fri != null)?self.state.getWeeksInMonth[3].fri.date:"",
                    styles: { halign: 'center', valign: 'middle',minCellHeight: 0, fontSize: 8},
                },
                {
                    content: (self.state.getWeeksInMonth.length>0&&self.state.getWeeksInMonth[4].mon != null)?self.state.getWeeksInMonth[4].mon.date:"",
                    styles: { halign: 'center', valign: 'middle',minCellHeight: 0, fontSize: 8},
                },
                {
                    content: (self.state.getWeeksInMonth.length>0&&self.state.getWeeksInMonth[4].tue != null)?self.state.getWeeksInMonth[4].tue.date:"",
                    styles: { halign: 'center', valign: 'middle',minCellHeight: 0, fontSize: 8},
                },
                {
                    content: (self.state.getWeeksInMonth.length>0&&self.state.getWeeksInMonth[4].wed != null)?self.state.getWeeksInMonth[4].wed.date:"",
                    styles: { halign: 'center', valign: 'middle',minCellHeight: 0, fontSize: 8},
                },
                {
                    content: (self.state.getWeeksInMonth.length>0&&self.state.getWeeksInMonth[4].thu != null)?self.state.getWeeksInMonth[4].thu.date:"",
                    styles: { halign: 'center', valign: 'middle',minCellHeight: 0, fontSize: 8},
                },
                {
                    content: (self.state.getWeeksInMonth.length>0&&self.state.getWeeksInMonth[4].fri != null)?self.state.getWeeksInMonth[4].fri.date:"",
                    styles: { halign: 'center', valign: 'middle',minCellHeight: 0, fontSize: 8},
                }
            ];

            const doc = new jsPDF({orientation: 'l',format: 'letter',compressPdf:true});
            doc.addFont('/fonts/arial/ARIALNB.TTF','Arial Narrow Bold', "bold");
            doc.addFont('/fonts/arial/ArialMdm.ttf','Arial Medium', "normal");
            let pageHeight = doc.internal.pageSize.height || doc.internal.pageSize.getHeight();
            let pageWidth = doc.internal.pageSize.width || doc.internal.pageSize.getWidth();
            console.log(doc.getFontList());
            doc.addImage("/images/deped-d.png", "PNG", 5, 10, 24, 24);
            doc.setFont("Arial Medium", "normal"); 
            doc.setFontSize(15);
            doc.text('School Form 2 (SF2) Daily Attendance Report of Learners', pageWidth / 2, 15,{align:'center'});
            doc.setFont("arial", "italic"); 
            doc.setFontSize(8);
            doc.text('(This replaces Form 1, Form 2 & STS Form 4 - Absenteeism and Dropout Profile)', pageWidth / 2, 20,{align:'center'});
            doc.setFont("Arial Medium", "normal"); 
            doc.setFontSize(9);
            doc.text('School ID : ' + self.state.schoolRegistry.school_id, 36.5, 26,{align:'left'});
            doc.text('School Year : ' + self.props.sy, 96, 26,{align:'left'});
            doc.text('Report for the Month of : ' + self.state.month, 161, 26,{align:'left'});
            doc.text('Name of School : '  + self.state.schoolRegistry.school_name, 28, 31,{align:'left'});
            doc.text('Grade Level : ' + self.state.grade, 176, 31,{align:'left'});
            doc.text('Section : ' + self.state.section, 216, 31,{align:'left'});

            doc.setFontSize(8);
            autoTable(doc,{ 
                theme: 'plain',
                startY: 39,
                margin: 4,
                useCss: true,
                head: [[
                        {
                            content: "LEARNER'S Name\n(Last Name, First Name, Middle Name)",
                            colSpan: 2,
                            rowSpan: 3,
                            styles: { halign: 'center', valign: 'middle',minCellHeight: 0, fontSize: 8,lineColor: 1,lineWidth: .01},
                        },
                        {
                            content: "(1st row for date)",
                            colSpan: 25,
                            rowSpan: 1,
                            styles: { halign: 'center', fontSize: 8,lineColor: 1,lineWidth: .01,cellPadding:2},
                        },
                        {
                            content: "Total for the\nMonth",
                            colSpan: 2,
                            rowSpan: 2,
                            styles: { halign: 'center', valign: 'middle',fontSize: 6,lineColor: 1,lineWidth: .01,cellWidth: 10},
                        },
                        {
                            content: "REMARKS (If DROPPED OUT, state reason, please refer to\nlegend number 2\nIf TRANSFERRED IN/OUT, write the name of School.)",
                            colSpan: 1,
                            rowSpan: 3,
                            styles: {  halign: 'center',valign: 'middle', fontSize: 6,lineColor: 1,lineWidth: .01,cellWidth: 60},
                        },
                ],header_dates,[
                    {
                        content: "M",
                        styles: { halign: 'center', valign: 'middle',minCellHeight: 0, fontSize: 8},
                    },
                    {
                        content: "T",
                        styles: { halign: 'center', valign: 'middle',minCellHeight: 0, fontSize: 8},
                    },
                    {
                        content: "W",
                        styles: { halign: 'center', valign: 'middle',minCellHeight: 0, fontSize: 8},
                    },
                    {
                        content: "TH",
                        styles: { halign: 'center', valign: 'middle',minCellHeight: 0, fontSize: 8},
                    },
                    {
                        content: "F",
                        styles: { halign: 'center', valign: 'middle',minCellHeight: 0, fontSize: 8},
                    },
                    {
                        content: "M",
                        styles: { halign: 'center', valign: 'middle',minCellHeight: 0, fontSize: 8},
                    },
                    {
                        content: "T",
                        styles: { halign: 'center', valign: 'middle',minCellHeight: 0, fontSize: 8},
                    },
                    {
                        content: "W",
                        styles: { halign: 'center', valign: 'middle',minCellHeight: 0, fontSize: 8},
                    },
                    {
                        content: "TH",
                        styles: { halign: 'center', valign: 'middle',minCellHeight: 0, fontSize: 8},
                    },
                    {
                        content: "F",
                        styles: { halign: 'center', valign: 'middle',minCellHeight: 0, fontSize: 8},
                    },
                    {
                        content: "M",
                        styles: { halign: 'center', valign: 'middle',minCellHeight: 0, fontSize: 8},
                    },
                    {
                        content: "T",
                        styles: { halign: 'center', valign: 'middle',minCellHeight: 0, fontSize: 8},
                    },
                    {
                        content: "W",
                        styles: { halign: 'center', valign: 'middle',minCellHeight: 0, fontSize: 8},
                    },
                    {
                        content: "TH",
                        styles: { halign: 'center', valign: 'middle',minCellHeight: 0, fontSize: 8},
                    },
                    {
                        content: "F",
                        styles: { halign: 'center', valign: 'middle',minCellHeight: 0, fontSize: 8},
                    },{
                        content: "M",
                        styles: { halign: 'center', valign: 'middle',minCellHeight: 0, fontSize: 8},
                    },
                    {
                        content: "T",
                        styles: { halign: 'center', valign: 'middle',minCellHeight: 0, fontSize: 8},
                    },
                    {
                        content: "W",
                        styles: { halign: 'center', valign: 'middle',minCellHeight: 0, fontSize: 8},
                    },
                    {
                        content: "TH",
                        styles: { halign: 'center', valign: 'middle',minCellHeight: 0, fontSize: 8},
                    },
                    {
                        content: "F",
                        styles: { halign: 'center', valign: 'middle',minCellHeight: 0, fontSize: 8},
                    },{
                        content: "M",
                        styles: { halign: 'center', valign: 'middle',minCellHeight: 0, fontSize: 8},
                    },
                    {
                        content: "T",
                        styles: { halign: 'center', valign: 'middle',minCellHeight: 0, fontSize: 8},
                    },
                    {
                        content: "W",
                        styles: { halign: 'center', valign: 'middle',minCellHeight: 0, fontSize: 8},
                    },
                    {
                        content: "TH",
                        styles: { halign: 'center', valign: 'middle',minCellHeight: 0, fontSize: 8},
                    },
                    {
                        content: "F",
                        styles: { halign: 'center', valign: 'middle',minCellHeight: 0, fontSize: 8},
                    },
                    {
                        content: "ABSENT",
                        styles: { halign: 'center', valign: 'middle',fontSize: 4,minCellHeight: 0,fontStyle: 'normal',cellWidth:10},
                    },
                    {
                        content: "TARDY",
                        styles: { halign: 'center', valign: 'middle',fontSize: 4,minCellHeight: 0,fontStyle: 'normal',cellWidth:10},
                    }
                ]],
                headStyles: {lineColor: 1,lineWidth: .01,minCellHeight: 0,cellPadding: 0},
                styles: { fontSize: 8, lineColor: 1,lineWidth: .01},
                body: temp_data,
                didDrawCell: function (data) {
                    if (data.column.index >= 2 && data.column.index <= 26 && data.row.section === 'body') { 
                        let textPos = data.cell.getTextPos(); 
                        if(data.cell.raw.content == "full") {
                            doc.addImage(img_full, 'JPEG', textPos.x - 1.5, textPos.y - 1, 3.5 , 5);
                        } else if(data.cell.raw.content == "absent") {
                            doc.addImage(img_absent, 'JPEG', textPos.x - 1.5, textPos.y - 1, 3.5 , 5);
                        } else if(data.cell.raw.content == "absent_morning") {
                            doc.addImage(img_absent_morning, 'JPEG', textPos.x - 1.5, textPos.y - 1, 3.5 , 5);
                        } else if(data.cell.raw.content == "img_absent_afternoon") {
                            doc.addImage(img_absent_morning, 'JPEG', textPos.x - 1.5, textPos.y - 1, 3.5 , 5);
                        }
                    } 
                }
            });
            let t1y = doc.internal.getNumberOfPages();
            // const startY = doc.lastAutoTable.finalY + 2;
            const startY = 12;
            doc.addPage({orientation: 'l',format: 'letter',compressPdf:true});
            // -------------------------------------
            doc.setFont("Arial Narrow Bold", "bold");
            doc.text('GUIDELINES: ', 5, startY + 2,{align:'left'});
            doc.setFont("Helvetica",""); 
            doc.setFontSize(6);
            doc.text("1. The attendance shall be accomplished daily. Refer to the codes for checking learners' attendance.", 5, startY + 5,{align:'left'});
            doc.text("2. Dates shall be written in the columns after Learner's Name.", 5, startY + 8,{align:'left'});
            doc.text("3. To compute the following:", 5, startY + 11,{align:'left'});
            doc.text("a. Percentage of Enrolment =", 8, startY + 16,{align:'left'});
            doc.text("b. Average Daily Attendance =", 8, startY + 20,{align:'left'});
            doc.text("c. Percentage of Attendance for the month =", 8, startY + 25,{align:'left'});
            doc.text("4. Every end of the month, the class adviser will submit this form to the office of the principal for recording of summary table into\nSchool Form 4. Once signed by the principal, this form should be returned to the adviser.", 5, startY + 32,{align:'left'});
            doc.text("5. The adviser will provide neccessary interventions including but not limited to home visitation to learner/s who were absent for 5\nconsecutive days and/or those at risk of dropping out.", 5, startY + 37,{align:'left'});
            doc.text("6. Attendance performance of learners will be reflected in Form 137 and Form 138 every grading period.\n   * Beginning of School Year cut-off report is every 1st Friday of the School Year", 5, startY + 42,{align:'left'});
            
            
            doc.text("Registered Learners as of end of the month", 70, startY + 13,{align:'left'});
            doc.text("Enrolment as of 1st Friday of the school year", 70, startY + 16,{align:'left'});
            doc.line(69, startY + 14, 114, startY + 14);

            doc.text("Total Daily Attendance", 80, startY + 18.5,{align:'left'});
            doc.text("Number of School Days in reporting month", 70, startY + 21,{align:'left'});
            doc.line(69, startY + 19, 114, startY + 19);


            doc.text("Average daily attendance", 78.5, startY + 24,{align:'left'});
            doc.text("Number of School Days in reporting month", 70, startY + 27,{align:'left'});
            doc.line(69, startY + 24.5, 114, startY + 24.5);


            doc.text("X 100", 116, startY + 15,{align:'left'});
            doc.text("X 100", 116, startY + 25,{align:'left'});
            
            doc.rect(130, startY , 55, 70);
            console.log("startY",startY,t1y);
            autoTable(doc,{ 
                theme: 'plain',
                startY: startY,
                margin: {
                    left: 189.5,
                }, 
                // styles: {halign:"right"},
                head: [[
                        {
                            content: "Month: ", 
                            rowSpan: 2,
                            styles: { halign: 'left',minCellHeight: 0, fontSize: 6,lineColor: 1,lineWidth: .01,cellWidth: 22}
                        },
                        {
                            content: "No. of Days of\nClasses:", 
                            rowSpan: 2,
                            styles: { halign: 'left',minCellHeight: 0, fontSize: 6,lineColor: 1,lineWidth: .01,cellWidth: 22}
                        },
                        {
                            content: "Summary",
                            colSpan: 3,
                            rowSpan: 1,
                            styles: { halign: 'center', valign: 'middle',fontSize: 6,lineColor: 1,lineWidth: .01,cellWidth: 8}
                        }
                ],[
                    {
                        content: "M",   
                        styles: {halign: 'center',cellWidth: 10}
                    },
                    {
                        content: "F",   
                        styles: {halign: 'center',cellWidth: 10}
                    },
                    {
                        content: "Total",   
                        styles: {halign: 'center',cellWidth: 20}
                    }
                ]],
                headStyles: {lineColor: 1,lineWidth: .01,minCellHeight: 0},
                styles: { fontSize: 8, lineColor: 1,lineWidth: .01},
                body: [
                    [
                        {
                            content: "* Enrolment as of (1st Friday of June)",
                            colSpan: 2,
                            styles: {halign: 'center', valign: 'middle',minWidth: 5,minCellHeight: 0,cellWidth: 6.5,fontSize: 5}
                        },
                        {
                            content: "0", 
                            styles: {halign: 'center', valign: 'middle',minWidth: 5,minCellHeight: 0,cellWidth: 6.5,fontSize: 5}
                        },
                        {
                            content: "0", 
                            styles: {halign: 'center', valign: 'middle',minWidth: 5,minCellHeight: 0,cellWidth: 6.5,fontSize: 5}
                        },
                        {
                            content: "0", 
                            styles: {halign: 'center', valign: 'middle',minWidth: 5,minCellHeight: 0,cellWidth: 6.5,fontSize: 5}
                        }
                    ],
                    [
                        {
                            content: "Late Enrollment during the month\n(beyond cut-off)",
                            colSpan: 2,
                            styles: {halign: 'center', valign: 'middle',minWidth: 5,minCellHeight: 0,cellWidth: 6.5,fontSize: 5}
                        },
                        {
                            content: "0", 
                            styles: {halign: 'center', valign: 'middle',minWidth: 5,minCellHeight: 0,cellWidth: 6.5,fontSize: 5}
                        },
                        {
                            content: "0", 
                            styles: {halign: 'center', valign: 'middle',minWidth: 5,minCellHeight: 0,cellWidth: 6.5,fontSize: 5}
                        },
                        {
                            content: "0", 
                            styles: {halign: 'center', valign: 'middle',minWidth: 5,minCellHeight: 0,cellWidth: 6.5,fontSize: 5}
                        }   
                    ],
                    [
                        {
                            content: "Registered Learners as of end of the month",
                            colSpan: 2,
                            styles: {halign: 'center', valign: 'middle',minWidth: 5,minCellHeight: 0,cellWidth: 6.5,fontSize: 5}
                        },
                        {
                            content: "0", 
                            styles: {halign: 'center', valign: 'middle',minWidth: 5,minCellHeight: 0,cellWidth: 6.5,fontSize: 5}
                        },
                        {
                            content: "0", 
                            styles: {halign: 'center', valign: 'middle',minWidth: 5,minCellHeight: 0,cellWidth: 6.5,fontSize: 5}
                        },
                        {
                            content: "0", 
                            styles: {halign: 'center', valign: 'middle',minWidth: 5,minCellHeight: 0,cellWidth: 6.5,fontSize: 5}
                        }   
                    ],
                    [
                        {
                            content: "Percentage of Enrolment as of end of the month",
                            colSpan: 2,
                            styles: {halign: 'center', valign: 'middle',minWidth: 5,minCellHeight: 0,cellWidth: 6.5,fontSize: 5}
                        },
                        {
                            content: "0", 
                            styles: {halign: 'center', valign: 'middle',minWidth: 5,minCellHeight: 0,cellWidth: 6.5,fontSize: 5}
                        },
                        {
                            content: "0", 
                            styles: {halign: 'center', valign: 'middle',minWidth: 5,minCellHeight: 0,cellWidth: 6.5,fontSize: 5}
                        },
                        {
                            content: "0", 
                            styles: {halign: 'center', valign: 'middle',minWidth: 5,minCellHeight: 0,cellWidth: 6.5,fontSize: 5}
                        }   
                    ],
                    [
                        {
                            content: "Average Daily Attendance",
                            colSpan: 2,
                            styles: {halign: 'center', valign: 'middle',minWidth: 5,minCellHeight: 0,cellWidth: 6.5,fontSize: 5}
                        },
                        {
                            content: "0", 
                            styles: {halign: 'center', valign: 'middle',minWidth: 5,minCellHeight: 0,cellWidth: 6.5,fontSize: 5}
                        },
                        {
                            content: "0", 
                            styles: {halign: 'center', valign: 'middle',minWidth: 5,minCellHeight: 0,cellWidth: 6.5,fontSize: 5}
                        },
                        {
                            content: "0", 
                            styles: {halign: 'center', valign: 'middle',minWidth: 5,minCellHeight: 0,cellWidth: 6.5,fontSize: 5}
                        }   
                    ],
                    [
                        {
                            content: "Percentage of Attendance for the month",
                            colSpan: 2,
                            styles: {halign: 'center', valign: 'middle',minWidth: 5,minCellHeight: 0,cellWidth: 6.5,fontSize: 5}
                        },
                        {
                            content: "0", 
                            styles: {halign: 'center', valign: 'middle',minWidth: 5,minCellHeight: 0,cellWidth: 6.5,fontSize: 5}
                        },
                        {
                            content: "0", 
                            styles: {halign: 'center', valign: 'middle',minWidth: 5,minCellHeight: 0,cellWidth: 6.5,fontSize: 5}
                        },
                        {
                            content: "0", 
                            styles: {halign: 'center', valign: 'middle',minWidth: 5,minCellHeight: 0,cellWidth: 6.5,fontSize: 5}
                        }   
                    ],
                    [
                        {
                            content: "Number of students absent for 5 consecutive days:",
                            colSpan: 2,
                            styles: {halign: 'center', valign: 'middle',minWidth: 5,minCellHeight: 0,cellWidth: 6.5,fontSize: 5}
                        },
                        {
                            content: "0", 
                            styles: {halign: 'center', valign: 'middle',minWidth: 5,minCellHeight: 0,cellWidth: 6.5,fontSize: 5}
                        },
                        {
                            content: "0", 
                            styles: {halign: 'center', valign: 'middle',minWidth: 5,minCellHeight: 0,cellWidth: 6.5,fontSize: 5}
                        },
                        {
                            content: "0", 
                            styles: {halign: 'center', valign: 'middle',minWidth: 5,minCellHeight: 0,cellWidth: 6.5,fontSize: 5}
                        }   
                    ],
                    [
                        {
                            content: "Drop out",
                            colSpan: 2,
                            styles: {halign: 'center', valign: 'middle',minWidth: 5,minCellHeight: 0,cellWidth: 6.5,fontSize: 5}
                        },
                        {
                            content: "0", 
                            styles: {halign: 'center', valign: 'middle',minWidth: 5,minCellHeight: 0,cellWidth: 6.5,fontSize: 5}
                        },
                        {
                            content: "0", 
                            styles: {halign: 'center', valign: 'middle',minWidth: 5,minCellHeight: 0,cellWidth: 6.5,fontSize: 5}
                        },
                        {
                            content: "0", 
                            styles: {halign: 'center', valign: 'middle',minWidth: 5,minCellHeight: 0,cellWidth: 6.5,fontSize: 5}
                        }   
                    ],
                    [
                        {
                            content: "Transferred out",
                            colSpan: 2,
                            styles: {halign: 'center', valign: 'middle',minWidth: 5,minCellHeight: 0,cellWidth: 6.5,fontSize: 5}
                        },
                        {
                            content: "0", 
                            styles: {halign: 'center', valign: 'middle',minWidth: 5,minCellHeight: 0,cellWidth: 6.5,fontSize: 5}
                        },
                        {
                            content: "0", 
                            styles: {halign: 'center', valign: 'middle',minWidth: 5,minCellHeight: 0,cellWidth: 6.5,fontSize: 5}
                        },
                        {
                            content: "0", 
                            styles: {halign: 'center', valign: 'middle',minWidth: 5,minCellHeight: 0,cellWidth: 6.5,fontSize: 5}
                        }   
                    ],
                    [
                        {
                            content: "Transferred in",
                            colSpan: 2,
                            styles: {halign: 'center', valign: 'middle',minWidth: 5,minCellHeight: 0,cellWidth: 6.5,fontSize: 5}
                        },
                        {
                            content: "0", 
                            styles: {halign: 'center', valign: 'middle',minWidth: 5,minCellHeight: 0,cellWidth: 6.5,fontSize: 5}
                        },
                        {
                            content: "0", 
                            styles: {halign: 'center', valign: 'middle',minWidth: 5,minCellHeight: 0,cellWidth: 6.5,fontSize: 5}
                        },
                        {
                            content: "0", 
                            styles: {halign: 'center', valign: 'middle',minWidth: 5,minCellHeight: 0,cellWidth: 6.5,fontSize: 5}
                        }   
                    ]
                ]
            });

            doc.setFontSize(6);
            doc.text("1. CODES FOR CHECKING ATTENDANCE", 130.5, startY + 3,{align:'left'});
            doc.text("(blank) - Present; (x)- Absent; Tardy (half shaded=\nUpper for LateCommer, Lower for Cutting Classes)", 130.5, startY + 7,{align:'left'});
            doc.text("2. REASONS/CAUSES FOR DROPPING OUT", 130.5, startY + 13,{align:'left'});
            doc.text("a. Domestic-Related Factors\na.1. Had to take care of siblings\na.2. Early marriage/pregnancy\na.3. Parents' attitude toward schooling\na.4. Family problemsb. Individual-Related Factors\nb.1. Illness\nb.2. Overage\nb.3. Death\nb.4. Drug Abuse\nb.5. Poor academic performance\nb.6. Lack of interest/Distractions\nb.7. Hunger/Malnutrition\nc. School-Related Factors\nc.1. Teacher Factor\nc.2. Physical condition of classroom\nc.3. Peer influence\nd. Geographic/Environmental\nd.1. Distance between home and school\nd.2. Armed conflict (incl. Tribal wars & clanfeuds)\nd.3. Calamities/Disasters\ne. Financial-Related\me.1. Child labor, work\nf. Others (Specify)", 130.5, startY + 15,{align:'left'});

            let startY_ = doc.lastAutoTable.finalY + 2;

            doc.setFont("Helvetica","italic"); 
            doc.setFontSize(8);
            doc.text("I certify that this is a true and correct report.", 180, startY_ + 4,{align:'left'});
            doc.text("(Signature of Teacher over Printed Name)", 205, startY_ + 19,{align:'left'});
            doc.text("(Signature of School Head over Printed Name)", 202.5, startY_ + 39,{align:'left'});
            doc.setFont("Helvetica","normal"); 
            doc.text("Attested by:", 180, startY_ + 30,{align:'left'});

            doc.line(195, startY_ + 16, 265, startY_ + 16);

            doc.line(195, startY_ + 36, 265, startY_ + 36);
            
            doc.text("School Form 2 : Page ___ of ________", 4, startY_ + 39,{align:'left'});


            $("#obj1").height(window.innerHeight - 8);
            $("#frame1").height(window.innerHeight - 8);
            // $('#frame1').attr('src',doc.output("datauristring") + '#view=Fit&toolbar=0'); 
        
            $('#obj1').attr('data',doc.output("datauristring")+ '#view=Fit&toolbar=1');
            // $('#frame1').attr('src',doc.output("datauristring"));  
                
        } catch (error) {
            console.log(error)
        }
    }

    async loadPDF() {
        // console.log("loading pdf",this.state.student_male_list,this.state.student_female_list)
        let self = this;
        let green = {fillColor:[0,128,0]};
        let red = {fillColor:[216,78,75]};
        let img_none = '/images/sf2/1.png';
        let img_full = '/images/sf2/1.png';
        let img_absent = '/images/sf2/2.png';
        let img_tardy = '/images/sf2/3.png';
        let img_late = '/images/sf2/3.png';
        let img_cutting = '/images/sf2/4.png';
        let student_male_total_daily = self.state.student_male_total_daily;
        let student_female_total_daily = self.state.student_female_total_daily;
        // console.log(student_male_total_daily)
        console.log(self.state.student_male_list)
        try {
            let self = this;
            let sgv = "";
            let temp_data = [];
            let student_male_list = self.state.student_male_list.sort(sortFullnameAZ);
            let student_female_list = self.state.student_female_list.sort(sortFullnameAZ);
            // Array.from({length:self.state.student_male_list.length})
            student_male_list.forEach((e,x) => { 
                temp_data.push([
                    {
                        content: (x+1),
                        styles: {halign: 'center', valign: 'middle',minWidth: 5,minCellHeight: 0,cellWidth: 6.5,fontSize: 5}
                    },
                    {
                        content: e.fullname,
                        styles: {halign: 'left',minWidth: 0,minCellHeight: 0,cellWidth:60,fontSize: 7}
                    },
                    {
                        content: (typeof(e.WeeksInMonth)!="undefined"&&e.WeeksInMonth.length>0&&e.WeeksInMonth[0].mon!=null&&typeof(e.WeeksInMonth[0].mon.logs)!="undefined")?e.WeeksInMonth[0].mon.logs.status:"",
                        styles: {halign: 'center',minWidth: 0,minCellHeight: 0,cellWidth: 5,fontSize: 4,}
                    },
                    {
                        content: (typeof(e.WeeksInMonth)!="undefined"&&e.WeeksInMonth.length>0&&e.WeeksInMonth[0].tue!=null&&typeof(e.WeeksInMonth[0].tue.logs)!="undefined")?e.WeeksInMonth[0].tue.logs.status:"",
                        styles: {halign: 'center',minWidth: 0,minCellHeight: 0,cellWidth: 5,fontSize: 4}
                    },
                    {
                        content: (typeof(e.WeeksInMonth)!="undefined"&&e.WeeksInMonth.length>0&&e.WeeksInMonth[0].wed!=null&&typeof(e.WeeksInMonth[0].wed.logs)!="undefined")?e.WeeksInMonth[0].wed.logs.status:"",
                        styles: {halign: 'center',minWidth: 0,minCellHeight: 0,cellWidth: 5,fontSize: 4}
                    },
                    {
                        content: (typeof(e.WeeksInMonth)!="undefined"&&e.WeeksInMonth.length>0&&e.WeeksInMonth[0].thu!=null&&typeof(e.WeeksInMonth[0].thu.logs)!="undefined")?e.WeeksInMonth[0].thu.logs.status:"",
                        styles: {halign: 'center',minWidth: 0,minCellHeight: 0,cellWidth: 5,fontSize: 4}
                    },
                    {
                        content: (typeof(e.WeeksInMonth)!="undefined"&&e.WeeksInMonth.length>0&&e.WeeksInMonth[0].fri!=null&&typeof(e.WeeksInMonth[0].fri.logs)!="undefined")?e.WeeksInMonth[0].fri.logs.status:"",
                        styles: {halign: 'center',minWidth: 0,minCellHeight: 0,cellWidth: 5,fontSize: 4}
                    },
                    {
                        content: (typeof(e.WeeksInMonth)!="undefined"&&e.WeeksInMonth.length>0&&e.WeeksInMonth[1].mon!=null&&typeof(e.WeeksInMonth[1].mon.logs)!="undefined")?e.WeeksInMonth[1].mon.logs.status:"",
                        styles: {halign: 'center',minWidth: 0,minCellHeight: 0,cellWidth: 5,fontSize: 4}
                    },
                    {
                        content: (typeof(e.WeeksInMonth)!="undefined"&&e.WeeksInMonth.length>0&&e.WeeksInMonth[1].tue!=null&&typeof(e.WeeksInMonth[1].tue.logs)!="undefined")?e.WeeksInMonth[1].tue.logs.status:"",
                        styles: {halign: 'center',minWidth: 0,minCellHeight: 0,cellWidth: 5,fontSize: 4}
                    },
                    {
                        content: (typeof(e.WeeksInMonth)!="undefined"&&e.WeeksInMonth.length>0&&e.WeeksInMonth[1].wed!=null&&typeof(e.WeeksInMonth[1].wed.logs)!="undefined")?e.WeeksInMonth[1].wed.logs.status:"",
                        styles: {halign: 'center',minWidth: 0,minCellHeight: 0,cellWidth: 5,fontSize: 4}
                    },
                    {
                        content: (typeof(e.WeeksInMonth)!="undefined"&&e.WeeksInMonth.length>0&&e.WeeksInMonth[1].thu!=null&&typeof(e.WeeksInMonth[1].thu.logs)!="undefined")?e.WeeksInMonth[1].thu.logs.status:"",
                        styles: {halign: 'center',minWidth: 0,minCellHeight: 0,cellWidth: 5,fontSize: 4}
                    },
                    {
                        content: (typeof(e.WeeksInMonth)!="undefined"&&e.WeeksInMonth.length>0&&e.WeeksInMonth[1].fri!=null&&typeof(e.WeeksInMonth[1].fri.logs)!="undefined")?e.WeeksInMonth[1].fri.logs.status:"",
                        styles: {halign: 'center',minWidth: 0,minCellHeight: 0,cellWidth: 5,fontSize: 4}
                    },
                    {
                        content: (typeof(e.WeeksInMonth)!="undefined"&&e.WeeksInMonth.length>0&&e.WeeksInMonth[2].mon!=null&&typeof(e.WeeksInMonth[2].mon.logs)!="undefined")?e.WeeksInMonth[2].mon.logs.status:"",
                        styles: {halign: 'center',minWidth: 0,minCellHeight: 0,cellWidth: 5,fontSize: 4}
                    },
                    {
                        content: (typeof(e.WeeksInMonth)!="undefined"&&e.WeeksInMonth.length>0&&e.WeeksInMonth[2].tue!=null&&typeof(e.WeeksInMonth[2].tue.logs)!="undefined")?e.WeeksInMonth[2].tue.logs.status:"",
                        styles: {halign: 'center',minWidth: 0,minCellHeight: 0,cellWidth: 5,fontSize: 4}
                    },
                    {
                        content: (typeof(e.WeeksInMonth)!="undefined"&&e.WeeksInMonth.length>0&&e.WeeksInMonth[2].wed!=null&&typeof(e.WeeksInMonth[2].wed.logs)!="undefined")?e.WeeksInMonth[2].wed.logs.status:"",
                        styles: {halign: 'center',minWidth: 0,minCellHeight: 0,cellWidth: 5,fontSize: 4}
                    },
                    {
                        content: (typeof(e.WeeksInMonth)!="undefined"&&e.WeeksInMonth.length>0&&e.WeeksInMonth[2].thu!=null&&typeof(e.WeeksInMonth[2].thu.logs)!="undefined")?e.WeeksInMonth[2].thu.logs.status:"",
                        styles: {halign: 'center',minWidth: 0,minCellHeight: 0,cellWidth: 5,fontSize: 4}
                    },
                    {
                        content: (typeof(e.WeeksInMonth)!="undefined"&&e.WeeksInMonth.length>0&&e.WeeksInMonth[2].fri!=null&&typeof(e.WeeksInMonth[2].fri.logs)!="undefined")?e.WeeksInMonth[2].fri.logs.status:"",
                        styles: {halign: 'center',minWidth: 0,minCellHeight: 0,cellWidth: 5,fontSize: 4}
                    },
                    {
                        content: (typeof(e.WeeksInMonth)!="undefined"&&e.WeeksInMonth.length>0&&e.WeeksInMonth[3].mon!=null&&typeof(e.WeeksInMonth[3].mon.logs)!="undefined")?e.WeeksInMonth[3].mon.logs.status:"",
                        styles: {halign: 'center',minWidth: 0,minCellHeight: 0,cellWidth: 5,fontSize: 4}
                    },
                    {
                        content: (typeof(e.WeeksInMonth)!="undefined"&&e.WeeksInMonth.length>0&&e.WeeksInMonth[3].tue!=null&&typeof(e.WeeksInMonth[3].tue.logs)!="undefined")?e.WeeksInMonth[3].tue.logs.status:"",
                        styles: {halign: 'center',minWidth: 0,minCellHeight: 0,cellWidth: 5,fontSize: 4}
                    },
                    {
                        content: (typeof(e.WeeksInMonth)!="undefined"&&e.WeeksInMonth.length>0&&e.WeeksInMonth[3].wed!=null&&typeof(e.WeeksInMonth[3].wed.logs)!="undefined")?e.WeeksInMonth[3].wed.logs.status:"",
                        styles: {halign: 'center',minWidth: 0,minCellHeight: 0,cellWidth: 5,fontSize: 4}
                    },
                    {
                        content: (typeof(e.WeeksInMonth)!="undefined"&&e.WeeksInMonth.length>0&&e.WeeksInMonth[3].thu!=null&&typeof(e.WeeksInMonth[3].thu.logs)!="undefined")?e.WeeksInMonth[3].thu.logs.status:"",
                        styles: {halign: 'center',minWidth: 0,minCellHeight: 0,cellWidth: 5,fontSize: 4}
                    },
                    {
                        content: (typeof(e.WeeksInMonth)!="undefined"&&e.WeeksInMonth.length>0&&e.WeeksInMonth[3].fri!=null&&typeof(e.WeeksInMonth[3].fri.logs)!="undefined")?e.WeeksInMonth[3].fri.logs.status:"",
                        styles: {halign: 'center',minWidth: 0,minCellHeight: 0,cellWidth: 5,fontSize: 4}
                    },
                    {
                        content: (typeof(e.WeeksInMonth)!="undefined"&&e.WeeksInMonth.length>0&&e.WeeksInMonth[4].mon!=null&&typeof(e.WeeksInMonth[4].mon.logs)!="undefined")?e.WeeksInMonth[4].mon.logs.status:"",
                        styles: {halign: 'center',minWidth: 0,minCellHeight: 0,cellWidth: 5,fontSize: 4}
                    },
                    {
                        content: (typeof(e.WeeksInMonth)!="undefined"&&e.WeeksInMonth.length>0&&e.WeeksInMonth[4].tue!=null&&typeof(e.WeeksInMonth[4].tue.logs)!="undefined")?e.WeeksInMonth[4].tue.logs.status:"",
                        styles: {halign: 'center',minWidth: 0,minCellHeight: 0,cellWidth: 5,fontSize: 4}
                    },
                    {
                        content: (typeof(e.WeeksInMonth)!="undefined"&&e.WeeksInMonth.length>0&&e.WeeksInMonth[4].wed!=null&&typeof(e.WeeksInMonth[4].wed.logs)!="undefined")?e.WeeksInMonth[4].wed.logs.status:"",
                        styles: {halign: 'center',minWidth: 0,minCellHeight: 0,cellWidth: 5,fontSize: 4}
                    },
                    {
                        content: (typeof(e.WeeksInMonth)!="undefined"&&e.WeeksInMonth.length>0&&e.WeeksInMonth[4].thu!=null&&typeof(e.WeeksInMonth[4].thu.logs)!="undefined")?e.WeeksInMonth[4].thu.logs.status:"",
                        styles: {halign: 'center',minWidth: 0,minCellHeight: 0,cellWidth: 5,fontSize: 4}
                    },
                    {
                        content: (typeof(e.WeeksInMonth)!="undefined"&&e.WeeksInMonth.length>0&&e.WeeksInMonth[4].fri!=null&&typeof(e.WeeksInMonth[4].fri.logs)!="undefined")?e.WeeksInMonth[4].fri.logs.status:"",
                        styles: {halign: 'center',minWidth: 0,minCellHeight: 0,cellWidth: 5,fontSize: 4}
                    },
                    {
                        content: e.absent,
                        styles: {halign: 'center',minWidth: 0,minCellHeight: 0,fontSize: 8}
                    },
                    {
                        content: e.tardy,
                        styles: {halign: 'center',minWidth: 0,minCellHeight: 0,fontSize: 8}
                    },
                    {
                        content: "",
                        styles: {halign: 'center',minWidth: 0,minCellHeight: 0,fontSize: 4}
                    },
                ]);
            });
            // total male
            temp_data.push([
                {
                    content: "",
                    styles: {halign: 'center', valign: 'middle',minWidth: 5,minCellHeight: 0,cellWidth: 6.5,fontSize: 5}
                },
                {
                    content:"MALE | TOTAL  Per Day",
                    styles: {halign: 'left',minWidth: 0,minCellHeight: 0,cellWidth:60,fontSize: 7}
                },
                {
                    content: (typeof(student_male_total_daily.WeeksInMonth)!="undefined"&&student_male_total_daily.WeeksInMonth.length>0&&student_male_total_daily.WeeksInMonth[0].mon!=null&&typeof(student_male_total_daily.WeeksInMonth[0].mon.logs)!="undefined")?student_male_total_daily.WeeksInMonth[0].mon.count:"",
                    styles: {halign: 'center',minWidth: 0,minCellHeight: 0,cellWidth: 5,fontSize: 8,cellPadding:0,valign: "middle"}
                },
                {
                    content: (typeof(student_male_total_daily.WeeksInMonth)!="undefined"&&student_male_total_daily.WeeksInMonth.length>0&&student_male_total_daily.WeeksInMonth[0].tue!=null&&typeof(student_male_total_daily.WeeksInMonth[0].tue.logs)!="undefined")?student_male_total_daily.WeeksInMonth[0].tue.count:"",
                    styles: {halign: 'center',minWidth: 0,minCellHeight: 0,cellWidth: 5,fontSize: 8,cellPadding:0,valign: "middle"}
                },
                {
                    content: (typeof(student_male_total_daily.WeeksInMonth)!="undefined"&&student_male_total_daily.WeeksInMonth.length>0&&student_male_total_daily.WeeksInMonth[0].wed!=null&&typeof(student_male_total_daily.WeeksInMonth[0].wed.logs)!="undefined")?student_male_total_daily.WeeksInMonth[0].wed.count:"",
                    styles: {halign: 'center',minWidth: 0,minCellHeight: 0,cellWidth: 5,fontSize: 8,cellPadding:0,valign: "middle"}
                },
                {
                    content: (typeof(student_male_total_daily.WeeksInMonth)!="undefined"&&student_male_total_daily.WeeksInMonth.length>0&&student_male_total_daily.WeeksInMonth[0].thu!=null&&typeof(student_male_total_daily.WeeksInMonth[0].thu.logs)!="undefined")?student_male_total_daily.WeeksInMonth[0].thu.count:"",
                    styles: {halign: 'center',minWidth: 0,minCellHeight: 0,cellWidth: 5,fontSize: 8,cellPadding:0,valign: "middle"}
                },
                {
                    content: (typeof(student_male_total_daily.WeeksInMonth)!="undefined"&&student_male_total_daily.WeeksInMonth.length>0&&student_male_total_daily.WeeksInMonth[0].fri!=null&&typeof(student_male_total_daily.WeeksInMonth[0].fri.logs)!="undefined")?student_male_total_daily.WeeksInMonth[0].fri.count:"",
                    styles: {halign: 'center',minWidth: 0,minCellHeight: 0,cellWidth: 5,fontSize: 8,cellPadding:0,valign: "middle"}
                },
                {
                    content: (typeof(student_male_total_daily.WeeksInMonth)!="undefined"&&student_male_total_daily.WeeksInMonth.length>0&&student_male_total_daily.WeeksInMonth[1].mon!=null&&typeof(student_male_total_daily.WeeksInMonth[1].mon.logs)!="undefined")?student_male_total_daily.WeeksInMonth[1].mon.count:"",
                    styles: {halign: 'center',minWidth: 0,minCellHeight: 0,cellWidth: 5,fontSize: 8,cellPadding:0,valign: "middle"}
                },
                {
                    content: (typeof(student_male_total_daily.WeeksInMonth)!="undefined"&&student_male_total_daily.WeeksInMonth.length>0&&student_male_total_daily.WeeksInMonth[1].tue!=null&&typeof(student_male_total_daily.WeeksInMonth[1].tue.logs)!="undefined")?student_male_total_daily.WeeksInMonth[1].tue.count:"",
                    styles: {halign: 'center',minWidth: 0,minCellHeight: 0,cellWidth: 5,fontSize: 8,cellPadding:0,valign: "middle"}
                },
                {
                    content: (typeof(student_male_total_daily.WeeksInMonth)!="undefined"&&student_male_total_daily.WeeksInMonth.length>0&&student_male_total_daily.WeeksInMonth[1].wed!=null&&typeof(student_male_total_daily.WeeksInMonth[1].wed.logs)!="undefined")?student_male_total_daily.WeeksInMonth[1].wed.count:"",
                    styles: {halign: 'center',minWidth: 0,minCellHeight: 0,cellWidth: 5,fontSize: 8,cellPadding:0,valign: "middle"}
                },
                {
                    content: (typeof(student_male_total_daily.WeeksInMonth)!="undefined"&&student_male_total_daily.WeeksInMonth.length>0&&student_male_total_daily.WeeksInMonth[1].thu!=null&&typeof(student_male_total_daily.WeeksInMonth[1].thu.logs)!="undefined")?student_male_total_daily.WeeksInMonth[1].thu.count:"",
                    styles: {halign: 'center',minWidth: 0,minCellHeight: 0,cellWidth: 5,fontSize: 8,cellPadding:0,valign: "middle"}
                },
                {
                    content: (typeof(student_male_total_daily.WeeksInMonth)!="undefined"&&student_male_total_daily.WeeksInMonth.length>0&&student_male_total_daily.WeeksInMonth[1].fri!=null&&typeof(student_male_total_daily.WeeksInMonth[1].fri.logs)!="undefined")?student_male_total_daily.WeeksInMonth[1].fri.count:"",
                    styles: {halign: 'center',minWidth: 0,minCellHeight: 0,cellWidth: 5,fontSize: 8,cellPadding:0,valign: "middle"}
                },
                {
                    content: (typeof(student_male_total_daily.WeeksInMonth)!="undefined"&&student_male_total_daily.WeeksInMonth.length>0&&student_male_total_daily.WeeksInMonth[2].mon!=null&&typeof(student_male_total_daily.WeeksInMonth[2].mon.logs)!="undefined")?student_male_total_daily.WeeksInMonth[2].mon.count:"",
                    styles: {halign: 'center',minWidth: 0,minCellHeight: 0,cellWidth: 5,fontSize: 8,cellPadding:0,valign: "middle"}
                },
                {
                    content: (typeof(student_male_total_daily.WeeksInMonth)!="undefined"&&student_male_total_daily.WeeksInMonth.length>0&&student_male_total_daily.WeeksInMonth[2].tue!=null&&typeof(student_male_total_daily.WeeksInMonth[2].tue.logs)!="undefined")?student_male_total_daily.WeeksInMonth[2].tue.count:"",
                    styles: {halign: 'center',minWidth: 0,minCellHeight: 0,cellWidth: 5,fontSize: 8,cellPadding:0,valign: "middle"}
                },
                {
                    content: (typeof(student_male_total_daily.WeeksInMonth)!="undefined"&&student_male_total_daily.WeeksInMonth.length>0&&student_male_total_daily.WeeksInMonth[2].wed!=null&&typeof(student_male_total_daily.WeeksInMonth[2].wed.logs)!="undefined")?student_male_total_daily.WeeksInMonth[2].wed.count:"",
                    styles: {halign: 'center',minWidth: 0,minCellHeight: 0,cellWidth: 5,fontSize: 8,cellPadding:0,valign: "middle"}
                },
                {
                    content: (typeof(student_male_total_daily.WeeksInMonth)!="undefined"&&student_male_total_daily.WeeksInMonth.length>0&&student_male_total_daily.WeeksInMonth[2].thu!=null&&typeof(student_male_total_daily.WeeksInMonth[2].thu.logs)!="undefined")?student_male_total_daily.WeeksInMonth[2].thu.count:"",
                    styles: {halign: 'center',minWidth: 0,minCellHeight: 0,cellWidth: 5,fontSize: 8,cellPadding:0,valign: "middle"}
                },
                {
                    content: (typeof(student_male_total_daily.WeeksInMonth)!="undefined"&&student_male_total_daily.WeeksInMonth.length>0&&student_male_total_daily.WeeksInMonth[2].fri!=null&&typeof(student_male_total_daily.WeeksInMonth[2].fri.logs)!="undefined")?student_male_total_daily.WeeksInMonth[2].fri.count:"",
                    styles: {halign: 'center',minWidth: 0,minCellHeight: 0,cellWidth: 5,fontSize: 8,cellPadding:0,valign: "middle"}
                },
                {
                    content: (typeof(student_male_total_daily.WeeksInMonth)!="undefined"&&student_male_total_daily.WeeksInMonth.length>0&&student_male_total_daily.WeeksInMonth[3].mon!=null&&typeof(student_male_total_daily.WeeksInMonth[3].mon.logs)!="undefined")?student_male_total_daily.WeeksInMonth[3].mon.count:"",
                    styles: {halign: 'center',minWidth: 0,minCellHeight: 0,cellWidth: 5,fontSize: 8,cellPadding:0,valign: "middle"}
                },
                {
                    content: (typeof(student_male_total_daily.WeeksInMonth)!="undefined"&&student_male_total_daily.WeeksInMonth.length>0&&student_male_total_daily.WeeksInMonth[3].tue!=null&&typeof(student_male_total_daily.WeeksInMonth[3].tue.logs)!="undefined")?student_male_total_daily.WeeksInMonth[3].tue.count:"",
                    styles: {halign: 'center',minWidth: 0,minCellHeight: 0,cellWidth: 5,fontSize: 8,cellPadding:0,valign: "middle"}
                },
                {
                    content: (typeof(student_male_total_daily.WeeksInMonth)!="undefined"&&student_male_total_daily.WeeksInMonth.length>0&&student_male_total_daily.WeeksInMonth[3].wed!=null&&typeof(student_male_total_daily.WeeksInMonth[3].wed.logs)!="undefined")?student_male_total_daily.WeeksInMonth[3].wed.count:"",
                    styles: {halign: 'center',minWidth: 0,minCellHeight: 0,cellWidth: 5,fontSize: 8,cellPadding:0,valign: "middle"}
                },
                {
                    content: (typeof(student_male_total_daily.WeeksInMonth)!="undefined"&&student_male_total_daily.WeeksInMonth.length>0&&student_male_total_daily.WeeksInMonth[3].thu!=null&&typeof(student_male_total_daily.WeeksInMonth[3].thu.logs)!="undefined")?student_male_total_daily.WeeksInMonth[3].thu.count:"",
                    styles: {halign: 'center',minWidth: 0,minCellHeight: 0,cellWidth: 5,fontSize: 8,cellPadding:0,valign: "middle"}
                },
                {
                    content: (typeof(student_male_total_daily.WeeksInMonth)!="undefined"&&student_male_total_daily.WeeksInMonth.length>0&&student_male_total_daily.WeeksInMonth[3].fri!=null&&typeof(student_male_total_daily.WeeksInMonth[3].fri.logs)!="undefined")?student_male_total_daily.WeeksInMonth[3].fri.count:"",
                    styles: {halign: 'center',minWidth: 0,minCellHeight: 0,cellWidth: 5,fontSize: 8,cellPadding:0,valign: "middle"}
                },
                {
                    content: (typeof(student_male_total_daily.WeeksInMonth)!="undefined"&&student_male_total_daily.WeeksInMonth.length>0&&student_male_total_daily.WeeksInMonth[4].mon!=null&&typeof(student_male_total_daily.WeeksInMonth[4].mon.logs)!="undefined")?student_male_total_daily.WeeksInMonth[4].mon.count:"",
                    styles: {halign: 'center',minWidth: 0,minCellHeight: 0,cellWidth: 5,fontSize: 8,cellPadding:0,valign: "middle"}
                },
                {
                    content: (typeof(student_male_total_daily.WeeksInMonth)!="undefined"&&student_male_total_daily.WeeksInMonth.length>0&&student_male_total_daily.WeeksInMonth[4].tue!=null&&typeof(student_male_total_daily.WeeksInMonth[4].tue.logs)!="undefined")?student_male_total_daily.WeeksInMonth[4].tue.count:"",
                    styles: {halign: 'center',minWidth: 0,minCellHeight: 0,cellWidth: 5,fontSize: 8,cellPadding:0,valign: "middle"}
                },
                {
                    content: (typeof(student_male_total_daily.WeeksInMonth)!="undefined"&&student_male_total_daily.WeeksInMonth.length>0&&student_male_total_daily.WeeksInMonth[4].wed!=null&&typeof(student_male_total_daily.WeeksInMonth[4].wed.logs)!="undefined")?student_male_total_daily.WeeksInMonth[4].wed.count:"",
                    styles: {halign: 'center',minWidth: 0,minCellHeight: 0,cellWidth: 5,fontSize: 8,cellPadding:0,valign: "middle"}
                },
                {
                    content: (typeof(student_male_total_daily.WeeksInMonth)!="undefined"&&student_male_total_daily.WeeksInMonth.length>0&&student_male_total_daily.WeeksInMonth[4].thu!=null&&typeof(student_male_total_daily.WeeksInMonth[4].thu.logs)!="undefined")?student_male_total_daily.WeeksInMonth[4].thu.count:"",
                    styles: {halign: 'center',minWidth: 0,minCellHeight: 0,cellWidth: 5,fontSize: 8,cellPadding:0,valign: "middle"}
                },
                {
                    content: (typeof(student_male_total_daily.WeeksInMonth)!="undefined"&&student_male_total_daily.WeeksInMonth.length>0&&student_male_total_daily.WeeksInMonth[4].fri!=null&&typeof(student_male_total_daily.WeeksInMonth[4].fri.logs)!="undefined")?student_male_total_daily.WeeksInMonth[4].fri.count:"",
                    styles: {halign: 'center',minWidth: 0,minCellHeight: 0,cellWidth: 5,fontSize: 8,cellPadding:0 ,valign: "middle"}
                },
                {
                    content: student_male_total_daily.absent,
                    styles: {halign: 'center',minWidth: 0,minCellHeight: 0,fontSize: 8}
                },
                {
                    content: student_male_total_daily.tardy,
                    styles: {halign: 'center',minWidth: 0,minCellHeight: 0,fontSize: 8}
                },
                {
                    content: "",
                    styles: {halign: 'center',minWidth: 0,minCellHeight: 0,fontSize: 4}
                },
            ]);
            // Array.from({length:self.state.student_female_list.length}).
            student_female_list.forEach((e,x) => {
                temp_data.push([
                    {
                        content: (x+1),
                        styles: {halign: 'center', valign: 'middle',minWidth: 5,minCellHeight: 0,cellWidth: 6.5,fontSize: 5}
                    },
                    {
                        content: e.fullname,
                        styles: {halign: 'left',minWidth: 0,minCellHeight: 0,cellWidth:60,fontSize: 7}
                    },
                    {
                        content: (typeof(e.WeeksInMonth)!="undefined"&&e.WeeksInMonth.length>0&&e.WeeksInMonth[0].mon!=null&&typeof(e.WeeksInMonth[0].mon.logs)!="undefined")?e.WeeksInMonth[0].mon.logs.status:"",
                        styles: {halign: 'center',minWidth: 0,minCellHeight: 0,cellWidth: 5,fontSize: 4,}
                    },
                    {
                        content: (typeof(e.WeeksInMonth)!="undefined"&&e.WeeksInMonth.length>0&&e.WeeksInMonth[0].tue!=null&&typeof(e.WeeksInMonth[0].tue.logs)!="undefined")?e.WeeksInMonth[0].tue.logs.status:"",
                        styles: {halign: 'center',minWidth: 0,minCellHeight: 0,cellWidth: 5,fontSize: 4}
                    },
                    {
                        content: (typeof(e.WeeksInMonth)!="undefined"&&e.WeeksInMonth.length>0&&e.WeeksInMonth[0].wed!=null&&typeof(e.WeeksInMonth[0].wed.logs)!="undefined")?e.WeeksInMonth[0].wed.logs.status:"",
                        styles: {halign: 'center',minWidth: 0,minCellHeight: 0,cellWidth: 5,fontSize: 4}
                    },
                    {
                        content: (typeof(e.WeeksInMonth)!="undefined"&&e.WeeksInMonth.length>0&&e.WeeksInMonth[0].thu!=null&&typeof(e.WeeksInMonth[0].thu.logs)!="undefined")?e.WeeksInMonth[0].thu.logs.status:"",
                        styles: {halign: 'center',minWidth: 0,minCellHeight: 0,cellWidth: 5,fontSize: 4}
                    },
                    {
                        content: (typeof(e.WeeksInMonth)!="undefined"&&e.WeeksInMonth.length>0&&e.WeeksInMonth[0].fri!=null&&typeof(e.WeeksInMonth[0].fri.logs)!="undefined")?e.WeeksInMonth[0].fri.logs.status:"",
                        styles: {halign: 'center',minWidth: 0,minCellHeight: 0,cellWidth: 5,fontSize: 4}
                    },
                    {
                        content: (typeof(e.WeeksInMonth)!="undefined"&&e.WeeksInMonth.length>0&&e.WeeksInMonth[1].mon!=null&&typeof(e.WeeksInMonth[1].mon.logs)!="undefined")?e.WeeksInMonth[1].mon.logs.status:"",
                        styles: {halign: 'center',minWidth: 0,minCellHeight: 0,cellWidth: 5,fontSize: 4}
                    },
                    {
                        content: (typeof(e.WeeksInMonth)!="undefined"&&e.WeeksInMonth.length>0&&e.WeeksInMonth[1].tue!=null&&typeof(e.WeeksInMonth[1].tue.logs)!="undefined")?e.WeeksInMonth[1].tue.logs.status:"",
                        styles: {halign: 'center',minWidth: 0,minCellHeight: 0,cellWidth: 5,fontSize: 4}
                    },
                    {
                        content: (typeof(e.WeeksInMonth)!="undefined"&&e.WeeksInMonth.length>0&&e.WeeksInMonth[1].wed!=null&&typeof(e.WeeksInMonth[1].wed.logs)!="undefined")?e.WeeksInMonth[1].wed.logs.status:"",
                        styles: {halign: 'center',minWidth: 0,minCellHeight: 0,cellWidth: 5,fontSize: 4}
                    },
                    {
                        content: (typeof(e.WeeksInMonth)!="undefined"&&e.WeeksInMonth.length>0&&e.WeeksInMonth[1].thu!=null&&typeof(e.WeeksInMonth[1].thu.logs)!="undefined")?e.WeeksInMonth[1].thu.logs.status:"",
                        styles: {halign: 'center',minWidth: 0,minCellHeight: 0,cellWidth: 5,fontSize: 4}
                    },
                    {
                        content: (typeof(e.WeeksInMonth)!="undefined"&&e.WeeksInMonth.length>0&&e.WeeksInMonth[1].fri!=null&&typeof(e.WeeksInMonth[1].fri.logs)!="undefined")?e.WeeksInMonth[1].fri.logs.status:"",
                        styles: {halign: 'center',minWidth: 0,minCellHeight: 0,cellWidth: 5,fontSize: 4}
                    },
                    {
                        content: (typeof(e.WeeksInMonth)!="undefined"&&e.WeeksInMonth.length>0&&e.WeeksInMonth[2].mon!=null&&typeof(e.WeeksInMonth[2].mon.logs)!="undefined")?e.WeeksInMonth[2].mon.logs.status:"",
                        styles: {halign: 'center',minWidth: 0,minCellHeight: 0,cellWidth: 5,fontSize: 4}
                    },
                    {
                        content: (typeof(e.WeeksInMonth)!="undefined"&&e.WeeksInMonth.length>0&&e.WeeksInMonth[2].tue!=null&&typeof(e.WeeksInMonth[2].tue.logs)!="undefined")?e.WeeksInMonth[2].tue.logs.status:"",
                        styles: {halign: 'center',minWidth: 0,minCellHeight: 0,cellWidth: 5,fontSize: 4}
                    },
                    {
                        content: (typeof(e.WeeksInMonth)!="undefined"&&e.WeeksInMonth.length>0&&e.WeeksInMonth[2].wed!=null&&typeof(e.WeeksInMonth[2].wed.logs)!="undefined")?e.WeeksInMonth[2].wed.logs.status:"",
                        styles: {halign: 'center',minWidth: 0,minCellHeight: 0,cellWidth: 5,fontSize: 4}
                    },
                    {
                        content: (typeof(e.WeeksInMonth)!="undefined"&&e.WeeksInMonth.length>0&&e.WeeksInMonth[2].thu!=null&&typeof(e.WeeksInMonth[2].thu.logs)!="undefined")?e.WeeksInMonth[2].thu.logs.status:"",
                        styles: {halign: 'center',minWidth: 0,minCellHeight: 0,cellWidth: 5,fontSize: 4}
                    },
                    {
                        content: (typeof(e.WeeksInMonth)!="undefined"&&e.WeeksInMonth.length>0&&e.WeeksInMonth[2].fri!=null&&typeof(e.WeeksInMonth[2].fri.logs)!="undefined")?e.WeeksInMonth[2].fri.logs.status:"",
                        styles: {halign: 'center',minWidth: 0,minCellHeight: 0,cellWidth: 5,fontSize: 4}
                    },
                    {
                        content: (typeof(e.WeeksInMonth)!="undefined"&&e.WeeksInMonth.length>0&&e.WeeksInMonth[3].mon!=null&&typeof(e.WeeksInMonth[3].mon.logs)!="undefined")?e.WeeksInMonth[3].mon.logs.status:"",
                        styles: {halign: 'center',minWidth: 0,minCellHeight: 0,cellWidth: 5,fontSize: 4}
                    },
                    {
                        content: (typeof(e.WeeksInMonth)!="undefined"&&e.WeeksInMonth.length>0&&e.WeeksInMonth[3].tue!=null&&typeof(e.WeeksInMonth[3].tue.logs)!="undefined")?e.WeeksInMonth[3].tue.logs.status:"",
                        styles: {halign: 'center',minWidth: 0,minCellHeight: 0,cellWidth: 5,fontSize: 4}
                    },
                    {
                        content: (typeof(e.WeeksInMonth)!="undefined"&&e.WeeksInMonth.length>0&&e.WeeksInMonth[3].wed!=null&&typeof(e.WeeksInMonth[3].wed.logs)!="undefined")?e.WeeksInMonth[3].wed.logs.status:"",
                        styles: {halign: 'center',minWidth: 0,minCellHeight: 0,cellWidth: 5,fontSize: 4}
                    },
                    {
                        content: (typeof(e.WeeksInMonth)!="undefined"&&e.WeeksInMonth.length>0&&e.WeeksInMonth[3].thu!=null&&typeof(e.WeeksInMonth[3].thu.logs)!="undefined")?e.WeeksInMonth[3].thu.logs.status:"",
                        styles: {halign: 'center',minWidth: 0,minCellHeight: 0,cellWidth: 5,fontSize: 4}
                    },
                    {
                        content: (typeof(e.WeeksInMonth)!="undefined"&&e.WeeksInMonth.length>0&&e.WeeksInMonth[3].fri!=null&&typeof(e.WeeksInMonth[3].fri.logs)!="undefined")?e.WeeksInMonth[3].fri.logs.status:"",
                        styles: {halign: 'center',minWidth: 0,minCellHeight: 0,cellWidth: 5,fontSize: 4}
                    },
                    {
                        content: (typeof(e.WeeksInMonth)!="undefined"&&e.WeeksInMonth.length>0&&e.WeeksInMonth[4].mon!=null&&typeof(e.WeeksInMonth[4].mon.logs)!="undefined")?e.WeeksInMonth[4].mon.logs.status:"",
                        styles: {halign: 'center',minWidth: 0,minCellHeight: 0,cellWidth: 5,fontSize: 4}
                    },
                    {
                        content: (typeof(e.WeeksInMonth)!="undefined"&&e.WeeksInMonth.length>0&&e.WeeksInMonth[4].tue!=null&&typeof(e.WeeksInMonth[4].tue.logs)!="undefined")?e.WeeksInMonth[4].tue.logs.status:"",
                        styles: {halign: 'center',minWidth: 0,minCellHeight: 0,cellWidth: 5,fontSize: 4}
                    },
                    {
                        content: (typeof(e.WeeksInMonth)!="undefined"&&e.WeeksInMonth.length>0&&e.WeeksInMonth[4].wed!=null&&typeof(e.WeeksInMonth[4].wed.logs)!="undefined")?e.WeeksInMonth[4].wed.logs.status:"",
                        styles: {halign: 'center',minWidth: 0,minCellHeight: 0,cellWidth: 5,fontSize: 4}
                    },
                    {
                        content: (typeof(e.WeeksInMonth)!="undefined"&&e.WeeksInMonth.length>0&&e.WeeksInMonth[4].thu!=null&&typeof(e.WeeksInMonth[4].thu.logs)!="undefined")?e.WeeksInMonth[4].thu.logs.status:"",
                        styles: {halign: 'center',minWidth: 0,minCellHeight: 0,cellWidth: 5,fontSize: 4}
                    },
                    {
                        content: (typeof(e.WeeksInMonth)!="undefined"&&e.WeeksInMonth.length>0&&e.WeeksInMonth[4].fri!=null&&typeof(e.WeeksInMonth[4].fri.logs)!="undefined")?e.WeeksInMonth[4].fri.logs.status:"",
                        styles: {halign: 'center',minWidth: 0,minCellHeight: 0,cellWidth: 5,fontSize: 4}
                    },
                    {
                        content: e.absent,
                        styles: {halign: 'center',minWidth: 0,minCellHeight: 0,fontSize: 8}
                    },
                    {
                        content: e.tardy,
                        styles: {halign: 'center',minWidth: 0,minCellHeight: 0,fontSize: 8}
                    },
                    {
                        content: "",
                        styles: {halign: 'center',minWidth: 0,minCellHeight: 0,fontSize: 4}
                    },
                ]);
            });
            // total Female
            temp_data.push([
                {
                    content: "",
                    styles: {halign: 'center', valign: 'middle',minWidth: 5,minCellHeight: 0,cellWidth: 6.5,fontSize: 5}
                },
                {
                    content:"FEMALE | TOTAL  Per Day",
                    styles: {halign: 'left',minWidth: 0,minCellHeight: 0,cellWidth:60,fontSize: 7}
                },
                {
                    content: (typeof(student_female_total_daily.WeeksInMonth)!="undefined"&&student_female_total_daily.WeeksInMonth.length>0&&student_female_total_daily.WeeksInMonth[0].mon!=null&&typeof(student_female_total_daily.WeeksInMonth[0].mon.logs)!="undefined")?student_female_total_daily.WeeksInMonth[0].mon.count:"",
                    styles: {halign: 'center',minWidth: 0,minCellHeight: 0,cellWidth: 5,fontSize: 8,cellPadding:0 ,valign: "middle"}
                },
                {
                    content: (typeof(student_female_total_daily.WeeksInMonth)!="undefined"&&student_female_total_daily.WeeksInMonth.length>0&&student_female_total_daily.WeeksInMonth[0].tue!=null&&typeof(student_female_total_daily.WeeksInMonth[0].tue.logs)!="undefined")?student_female_total_daily.WeeksInMonth[0].tue.count:"",
                    styles: {halign: 'center',minWidth: 0,minCellHeight: 0,cellWidth: 5,fontSize: 8,cellPadding:0 ,valign: "middle"}
                },
                {
                    content: (typeof(student_female_total_daily.WeeksInMonth)!="undefined"&&student_female_total_daily.WeeksInMonth.length>0&&student_female_total_daily.WeeksInMonth[0].wed!=null&&typeof(student_female_total_daily.WeeksInMonth[0].wed.logs)!="undefined")?student_female_total_daily.WeeksInMonth[0].wed.count:"",
                    styles: {halign: 'center',minWidth: 0,minCellHeight: 0,cellWidth: 5,fontSize: 8,cellPadding:0 ,valign: "middle"}
                },
                {
                    content: (typeof(student_female_total_daily.WeeksInMonth)!="undefined"&&student_female_total_daily.WeeksInMonth.length>0&&student_female_total_daily.WeeksInMonth[0].thu!=null&&typeof(student_female_total_daily.WeeksInMonth[0].thu.logs)!="undefined")?student_female_total_daily.WeeksInMonth[0].thu.count:"",
                    styles: {halign: 'center',minWidth: 0,minCellHeight: 0,cellWidth: 5,fontSize: 8,cellPadding:0 ,valign: "middle"}
                },
                {
                    content: (typeof(student_female_total_daily.WeeksInMonth)!="undefined"&&student_female_total_daily.WeeksInMonth.length>0&&student_female_total_daily.WeeksInMonth[0].fri!=null&&typeof(student_female_total_daily.WeeksInMonth[0].fri.logs)!="undefined")?student_female_total_daily.WeeksInMonth[0].fri.count:"",
                    styles: {halign: 'center',minWidth: 0,minCellHeight: 0,cellWidth: 5,fontSize: 8,cellPadding:0 ,valign: "middle"}
                },
                {
                    content: (typeof(student_female_total_daily.WeeksInMonth)!="undefined"&&student_female_total_daily.WeeksInMonth.length>0&&student_female_total_daily.WeeksInMonth[1].mon!=null&&typeof(student_female_total_daily.WeeksInMonth[1].mon.logs)!="undefined")?student_female_total_daily.WeeksInMonth[1].mon.count:"",
                    styles: {halign: 'center',minWidth: 0,minCellHeight: 0,cellWidth: 5,fontSize: 8,cellPadding:0 ,valign: "middle"}
                },
                {
                    content: (typeof(student_female_total_daily.WeeksInMonth)!="undefined"&&student_female_total_daily.WeeksInMonth.length>0&&student_female_total_daily.WeeksInMonth[1].tue!=null&&typeof(student_female_total_daily.WeeksInMonth[1].tue.logs)!="undefined")?student_female_total_daily.WeeksInMonth[1].tue.count:"",
                    styles: {halign: 'center',minWidth: 0,minCellHeight: 0,cellWidth: 5,fontSize: 8,cellPadding:0 ,valign: "middle"}
                },
                {
                    content: (typeof(student_female_total_daily.WeeksInMonth)!="undefined"&&student_female_total_daily.WeeksInMonth.length>0&&student_female_total_daily.WeeksInMonth[1].wed!=null&&typeof(student_female_total_daily.WeeksInMonth[1].wed.logs)!="undefined")?student_female_total_daily.WeeksInMonth[1].wed.count:"",
                    styles: {halign: 'center',minWidth: 0,minCellHeight: 0,cellWidth: 5,fontSize: 8,cellPadding:0 ,valign: "middle"}
                },
                {
                    content: (typeof(student_female_total_daily.WeeksInMonth)!="undefined"&&student_female_total_daily.WeeksInMonth.length>0&&student_female_total_daily.WeeksInMonth[1].thu!=null&&typeof(student_female_total_daily.WeeksInMonth[1].thu.logs)!="undefined")?student_female_total_daily.WeeksInMonth[1].thu.count:"",
                    styles: {halign: 'center',minWidth: 0,minCellHeight: 0,cellWidth: 5,fontSize: 8,cellPadding:0 ,valign: "middle"}
                },
                {
                    content: (typeof(student_female_total_daily.WeeksInMonth)!="undefined"&&student_female_total_daily.WeeksInMonth.length>0&&student_female_total_daily.WeeksInMonth[1].fri!=null&&typeof(student_female_total_daily.WeeksInMonth[1].fri.logs)!="undefined")?student_female_total_daily.WeeksInMonth[1].fri.count:"",
                    styles: {halign: 'center',minWidth: 0,minCellHeight: 0,cellWidth: 5,fontSize: 8,cellPadding:0 ,valign: "middle"}
                },
                {
                    content: (typeof(student_female_total_daily.WeeksInMonth)!="undefined"&&student_female_total_daily.WeeksInMonth.length>0&&student_female_total_daily.WeeksInMonth[2].mon!=null&&typeof(student_female_total_daily.WeeksInMonth[2].mon.logs)!="undefined")?student_female_total_daily.WeeksInMonth[2].mon.count:"",
                    styles: {halign: 'center',minWidth: 0,minCellHeight: 0,cellWidth: 5,fontSize: 8,cellPadding:0 ,valign: "middle"}
                },
                {
                    content: (typeof(student_female_total_daily.WeeksInMonth)!="undefined"&&student_female_total_daily.WeeksInMonth.length>0&&student_female_total_daily.WeeksInMonth[2].tue!=null&&typeof(student_female_total_daily.WeeksInMonth[2].tue.logs)!="undefined")?student_female_total_daily.WeeksInMonth[2].tue.count:"",
                    styles: {halign: 'center',minWidth: 0,minCellHeight: 0,cellWidth: 5,fontSize: 8,cellPadding:0 ,valign: "middle"}
                },
                {
                    content: (typeof(student_female_total_daily.WeeksInMonth)!="undefined"&&student_female_total_daily.WeeksInMonth.length>0&&student_female_total_daily.WeeksInMonth[2].wed!=null&&typeof(student_female_total_daily.WeeksInMonth[2].wed.logs)!="undefined")?student_female_total_daily.WeeksInMonth[2].wed.count:"",
                    styles: {halign: 'center',minWidth: 0,minCellHeight: 0,cellWidth: 5,fontSize: 8,cellPadding:0 ,valign: "middle"}
                },
                {
                    content: (typeof(student_female_total_daily.WeeksInMonth)!="undefined"&&student_female_total_daily.WeeksInMonth.length>0&&student_female_total_daily.WeeksInMonth[2].thu!=null&&typeof(student_female_total_daily.WeeksInMonth[2].thu.logs)!="undefined")?student_female_total_daily.WeeksInMonth[2].thu.count:"",
                    styles: {halign: 'center',minWidth: 0,minCellHeight: 0,cellWidth: 5,fontSize: 8,cellPadding:0 ,valign: "middle"}
                },
                {
                    content: (typeof(student_female_total_daily.WeeksInMonth)!="undefined"&&student_female_total_daily.WeeksInMonth.length>0&&student_female_total_daily.WeeksInMonth[2].fri!=null&&typeof(student_female_total_daily.WeeksInMonth[2].fri.logs)!="undefined")?student_female_total_daily.WeeksInMonth[2].fri.count:"",
                    styles: {halign: 'center',minWidth: 0,minCellHeight: 0,cellWidth: 5,fontSize: 8,cellPadding:0 ,valign: "middle"}
                },
                {
                    content: (typeof(student_female_total_daily.WeeksInMonth)!="undefined"&&student_female_total_daily.WeeksInMonth.length>0&&student_female_total_daily.WeeksInMonth[3].mon!=null&&typeof(student_female_total_daily.WeeksInMonth[3].mon.logs)!="undefined")?student_female_total_daily.WeeksInMonth[3].mon.count:"",
                    styles: {halign: 'center',minWidth: 0,minCellHeight: 0,cellWidth: 5,fontSize: 8,cellPadding:0 ,valign: "middle"}
                },
                {
                    content: (typeof(student_female_total_daily.WeeksInMonth)!="undefined"&&student_female_total_daily.WeeksInMonth.length>0&&student_female_total_daily.WeeksInMonth[3].tue!=null&&typeof(student_female_total_daily.WeeksInMonth[3].tue.logs)!="undefined")?student_female_total_daily.WeeksInMonth[3].tue.count:"",
                    styles: {halign: 'center',minWidth: 0,minCellHeight: 0,cellWidth: 5,fontSize: 8,cellPadding:0 ,valign: "middle"}
                },
                {
                    content: (typeof(student_female_total_daily.WeeksInMonth)!="undefined"&&student_female_total_daily.WeeksInMonth.length>0&&student_female_total_daily.WeeksInMonth[3].wed!=null&&typeof(student_female_total_daily.WeeksInMonth[3].wed.logs)!="undefined")?student_female_total_daily.WeeksInMonth[3].wed.count:"",
                    styles: {halign: 'center',minWidth: 0,minCellHeight: 0,cellWidth: 5,fontSize: 8,cellPadding:0 ,valign: "middle"}
                },
                {
                    content: (typeof(student_female_total_daily.WeeksInMonth)!="undefined"&&student_female_total_daily.WeeksInMonth.length>0&&student_female_total_daily.WeeksInMonth[3].thu!=null&&typeof(student_female_total_daily.WeeksInMonth[3].thu.logs)!="undefined")?student_female_total_daily.WeeksInMonth[3].thu.count:"",
                    styles: {halign: 'center',minWidth: 0,minCellHeight: 0,cellWidth: 5,fontSize: 8,cellPadding:0 ,valign: "middle"}
                },
                {
                    content: (typeof(student_female_total_daily.WeeksInMonth)!="undefined"&&student_female_total_daily.WeeksInMonth.length>0&&student_female_total_daily.WeeksInMonth[3].fri!=null&&typeof(student_female_total_daily.WeeksInMonth[3].fri.logs)!="undefined")?student_female_total_daily.WeeksInMonth[3].fri.count:"",
                    styles: {halign: 'center',minWidth: 0,minCellHeight: 0,cellWidth: 5,fontSize: 8,cellPadding:0 ,valign: "middle"}
                },
                {
                    content: (typeof(student_female_total_daily.WeeksInMonth)!="undefined"&&student_female_total_daily.WeeksInMonth.length>0&&student_female_total_daily.WeeksInMonth[4].mon!=null&&typeof(student_female_total_daily.WeeksInMonth[4].mon.logs)!="undefined")?student_female_total_daily.WeeksInMonth[4].mon.count:"",
                    styles: {halign: 'center',minWidth: 0,minCellHeight: 0,cellWidth: 5,fontSize: 8,cellPadding:0 ,valign: "middle"}
                },
                {
                    content: (typeof(student_female_total_daily.WeeksInMonth)!="undefined"&&student_female_total_daily.WeeksInMonth.length>0&&student_female_total_daily.WeeksInMonth[4].tue!=null&&typeof(student_female_total_daily.WeeksInMonth[4].tue.logs)!="undefined")?student_female_total_daily.WeeksInMonth[4].tue.count:"",
                    styles: {halign: 'center',minWidth: 0,minCellHeight: 0,cellWidth: 5,fontSize: 8,cellPadding:0 ,valign: "middle"}
                },
                {
                    content: (typeof(student_female_total_daily.WeeksInMonth)!="undefined"&&student_female_total_daily.WeeksInMonth.length>0&&student_female_total_daily.WeeksInMonth[4].wed!=null&&typeof(student_female_total_daily.WeeksInMonth[4].wed.logs)!="undefined")?student_female_total_daily.WeeksInMonth[4].wed.count:"",
                    styles: {halign: 'center',minWidth: 0,minCellHeight: 0,cellWidth: 5,fontSize: 8,cellPadding:0 ,valign: "middle"}
                },
                {
                    content: (typeof(student_female_total_daily.WeeksInMonth)!="undefined"&&student_female_total_daily.WeeksInMonth.length>0&&student_female_total_daily.WeeksInMonth[4].thu!=null&&typeof(student_female_total_daily.WeeksInMonth[4].thu.logs)!="undefined")?student_female_total_daily.WeeksInMonth[4].thu.count:"",
                    styles: {halign: 'center',minWidth: 0,minCellHeight: 0,cellWidth: 5,fontSize: 8,cellPadding:0 ,valign: "middle"}
                },
                {
                    content: (typeof(student_female_total_daily.WeeksInMonth)!="undefined"&&student_female_total_daily.WeeksInMonth.length>0&&student_female_total_daily.WeeksInMonth[4].fri!=null&&typeof(student_female_total_daily.WeeksInMonth[4].fri.logs)!="undefined")?student_female_total_daily.WeeksInMonth[4].fri.count:"",
                    styles: {halign: 'center',minWidth: 0,minCellHeight: 0,cellWidth: 5,fontSize: 8,cellPadding:0 ,valign: "middle"}
                },
                {
                    content: student_female_total_daily.absent,
                    styles: {halign: 'center',minWidth: 0,minCellHeight: 0,fontSize: 8}
                },
                {
                    content: student_female_total_daily.tardy,
                    styles: {halign: 'center',minWidth: 0,minCellHeight: 0,fontSize: 8}
                },
                {
                    content: "",
                    styles: {halign: 'center',minWidth: 0,minCellHeight: 0,fontSize: 4}
                },
            ]);
            // total overall
            temp_data.push([
                {
                    content: "",
                    styles: {halign: 'center', valign: 'middle',minWidth: 5,minCellHeight: 0,cellWidth: 6.5,fontSize: 5}
                },
                {
                    content:"Combined TOTAL PER DAY",
                    styles: {halign: 'left',minWidth: 0,minCellHeight: 0,cellWidth:60,fontSize: 7}
                },
                {
                    content: "",
                    styles: {halign: 'center',minWidth: 0,minCellHeight: 0,cellWidth: 5,fontSize: 4}
                },
                {
                    content: "",
                    styles: {halign: 'center',minWidth: 0,minCellHeight: 0,cellWidth: 5,fontSize: 4}
                },
                {
                    content: "",
                    styles: {halign: 'center',minWidth: 0,minCellHeight: 0,cellWidth: 5,fontSize: 4}
                },
                {
                    content: "",
                    styles: {halign: 'center',minWidth: 0,minCellHeight: 0,cellWidth: 5,fontSize: 4}
                },
                {
                    content: "",
                    styles: {halign: 'center',minWidth: 0,minCellHeight: 0,cellWidth: 5,fontSize: 4}
                },
                {
                    content: "",
                    styles: {halign: 'center',minWidth: 0,minCellHeight: 0,cellWidth: 5,fontSize: 4}
                },
                {
                    content: "",
                    styles: {halign: 'center',minWidth: 0,minCellHeight: 0,cellWidth: 5,fontSize: 4}
                },
                {
                    content: "",
                    styles: {halign: 'center',minWidth: 0,minCellHeight: 0,cellWidth: 5,fontSize: 4}
                },
                {
                    content: "",
                    styles: {halign: 'center',minWidth: 0,minCellHeight: 0,cellWidth: 5,fontSize: 4}
                },
                {
                    content: "",
                    styles: {halign: 'center',minWidth: 0,minCellHeight: 0,cellWidth: 5,fontSize: 4}
                },
                {
                    content: "",
                    styles: {halign: 'center',minWidth: 0,minCellHeight: 0,cellWidth: 5,fontSize: 4}
                },
                {
                    content: "",
                    styles: {halign: 'center',minWidth: 0,minCellHeight: 0,cellWidth: 5,fontSize: 4}
                },
                {
                    content: "",
                    styles: {halign: 'center',minWidth: 0,minCellHeight: 0,cellWidth: 5,fontSize: 4}
                },
                {
                    content: "",
                    styles: {halign: 'center',minWidth: 0,minCellHeight: 0,cellWidth: 5,fontSize: 4}
                },
                {
                    content: "",
                    styles: {halign: 'center',minWidth: 0,minCellHeight: 0,cellWidth: 5,fontSize: 4}
                },
                {
                    content: "",
                    styles: {halign: 'center',minWidth: 0,minCellHeight: 0,cellWidth: 5,fontSize: 4}
                },
                {
                    content: "",
                    styles: {halign: 'center',minWidth: 0,minCellHeight: 0,cellWidth: 5,fontSize: 4}
                },
                {
                    content: "",
                    styles: {halign: 'center',minWidth: 0,minCellHeight: 0,cellWidth: 5,fontSize: 4}
                },
                {
                    content: "",
                    styles: {halign: 'center',minWidth: 0,minCellHeight: 0,cellWidth: 5,fontSize: 4}
                },
                {
                    content: "",
                    styles: {halign: 'center',minWidth: 0,minCellHeight: 0,cellWidth: 5,fontSize: 4}
                },
                {
                    content: "",
                    styles: {halign: 'center',minWidth: 0,minCellHeight: 0,cellWidth: 5,fontSize: 4}
                },
                {
                    content: "",
                    styles: {halign: 'center',minWidth: 0,minCellHeight: 0,cellWidth: 5,fontSize: 4}
                },
                {
                    content: "",
                    styles: {halign: 'center',minWidth: 0,minCellHeight: 0,cellWidth: 5,fontSize: 4}
                },
                {
                    content: "",
                    styles: {halign: 'center',minWidth: 0,minCellHeight: 0,cellWidth: 5,fontSize: 4}
                },
                {
                    content: "",
                    styles: {halign: 'center',minWidth: 0,minCellHeight: 0,cellWidth: 5,fontSize: 4}
                },
                {
                    content: "",
                    styles: {halign: 'center',minWidth: 0,minCellHeight: 0,fontSize: 4}
                },
                {
                    content: "",
                    styles: {halign: 'center',minWidth: 0,minCellHeight: 0,fontSize: 4}
                },
                {
                    content: "",
                    styles: {halign: 'center',minWidth: 0,minCellHeight: 0,fontSize: 4}
                },
            ]);

            let header_dates = [
                {
                    content: (self.state.getWeeksInMonth.length>0&&self.state.getWeeksInMonth[0].mon != null)?self.state.getWeeksInMonth[0].mon.date:"",
                    styles: { halign: 'center', valign: 'middle',minCellHeight: 0, fontSize: 8},
                },
                {
                    content: (self.state.getWeeksInMonth.length>0&&self.state.getWeeksInMonth[0].tue != null)?self.state.getWeeksInMonth[0].tue.date:"",
                    styles: { halign: 'center', valign: 'middle',minCellHeight: 0, fontSize: 8},
                },
                {
                    content: (self.state.getWeeksInMonth.length>0&&self.state.getWeeksInMonth[0].wed != null)?self.state.getWeeksInMonth[0].wed.date:"",
                    styles: { halign: 'center', valign: 'middle',minCellHeight: 0, fontSize: 8},
                },
                {
                    content: (self.state.getWeeksInMonth.length>0&&self.state.getWeeksInMonth[0].thu != null)?self.state.getWeeksInMonth[0].thu.date:"",
                    styles: { halign: 'center', valign: 'middle',minCellHeight: 0, fontSize: 8},
                },
                {
                    content: (self.state.getWeeksInMonth.length>0&&self.state.getWeeksInMonth[0].fri != null)?self.state.getWeeksInMonth[0].fri.date:"",
                    styles: { halign: 'center', valign: 'middle',minCellHeight: 0, fontSize: 8},
                },
                {
                    content: (self.state.getWeeksInMonth.length>0&&self.state.getWeeksInMonth[1].mon != null)?self.state.getWeeksInMonth[1].mon.date:"",
                    styles: { halign: 'center', valign: 'middle',minCellHeight: 0, fontSize: 8},
                },
                {
                    content: (self.state.getWeeksInMonth.length>0&&self.state.getWeeksInMonth[1].tue != null)?self.state.getWeeksInMonth[1].tue.date:"",
                    styles: { halign: 'center', valign: 'middle',minCellHeight: 0, fontSize: 8},
                },
                {
                    content: (self.state.getWeeksInMonth.length>0&&self.state.getWeeksInMonth[1].wed != null)?self.state.getWeeksInMonth[1].wed.date:"",
                    styles: { halign: 'center', valign: 'middle',minCellHeight: 0, fontSize: 8},
                },
                {
                    content: (self.state.getWeeksInMonth.length>0&&self.state.getWeeksInMonth[1].thu != null)?self.state.getWeeksInMonth[1].thu.date:"",
                    styles: { halign: 'center', valign: 'middle',minCellHeight: 0, fontSize: 8},
                },
                {
                    content: (self.state.getWeeksInMonth.length>0&&self.state.getWeeksInMonth[1].fri != null)?self.state.getWeeksInMonth[1].fri.date:"",
                    styles: { halign: 'center', valign: 'middle',minCellHeight: 0, fontSize: 8},
                },
                {
                    content: (self.state.getWeeksInMonth.length>0&&self.state.getWeeksInMonth[2].mon != null)?self.state.getWeeksInMonth[2].mon.date:"",
                    styles: { halign: 'center', valign: 'middle',minCellHeight: 0, fontSize: 8},
                },
                {
                    content: (self.state.getWeeksInMonth.length>0&&self.state.getWeeksInMonth[2].tue != null)?self.state.getWeeksInMonth[2].tue.date:"",
                    styles: { halign: 'center', valign: 'middle',minCellHeight: 0, fontSize: 8},
                },
                {
                    content: (self.state.getWeeksInMonth.length>0&&self.state.getWeeksInMonth[2].wed != null)?self.state.getWeeksInMonth[2].wed.date:"",
                    styles: { halign: 'center', valign: 'middle',minCellHeight: 0, fontSize: 8},
                },
                {
                    content: (self.state.getWeeksInMonth.length>0&&self.state.getWeeksInMonth[2].thu != null)?self.state.getWeeksInMonth[2].thu.date:"",
                    styles: { halign: 'center', valign: 'middle',minCellHeight: 0, fontSize: 8},
                },
                {
                    content: (self.state.getWeeksInMonth.length>0&&self.state.getWeeksInMonth[2].fri != null)?self.state.getWeeksInMonth[2].fri.date:"",
                    styles: { halign: 'center', valign: 'middle',minCellHeight: 0, fontSize: 8},
                },
                {
                    content: (self.state.getWeeksInMonth.length>0&&self.state.getWeeksInMonth[3].mon != null)?self.state.getWeeksInMonth[3].mon.date:"",
                    styles: { halign: 'center', valign: 'middle',minCellHeight: 0, fontSize: 8},
                },
                {
                    content: (self.state.getWeeksInMonth.length>0&&self.state.getWeeksInMonth[3].thu != null)?self.state.getWeeksInMonth[3].thu.date:"",
                    styles: { halign: 'center', valign: 'middle',minCellHeight: 0, fontSize: 8},
                },
                {
                    content: (self.state.getWeeksInMonth.length>0&&self.state.getWeeksInMonth[3].wed != null)?self.state.getWeeksInMonth[3].wed.date:"",
                    styles: { halign: 'center', valign: 'middle',minCellHeight: 0, fontSize: 8},
                },
                {
                    content: (self.state.getWeeksInMonth.length>0&&self.state.getWeeksInMonth[3].thu != null)?self.state.getWeeksInMonth[3].thu.date:"",
                    styles: { halign: 'center', valign: 'middle',minCellHeight: 0, fontSize: 8},
                },
                {
                    content: (self.state.getWeeksInMonth.length>0&&self.state.getWeeksInMonth[3].fri != null)?self.state.getWeeksInMonth[3].fri.date:"",
                    styles: { halign: 'center', valign: 'middle',minCellHeight: 0, fontSize: 8},
                },
                {
                    content: (self.state.getWeeksInMonth.length>0&&self.state.getWeeksInMonth[4].mon != null)?self.state.getWeeksInMonth[4].mon.date:"",
                    styles: { halign: 'center', valign: 'middle',minCellHeight: 0, fontSize: 8},
                },
                {
                    content: (self.state.getWeeksInMonth.length>0&&self.state.getWeeksInMonth[4].tue != null)?self.state.getWeeksInMonth[4].tue.date:"",
                    styles: { halign: 'center', valign: 'middle',minCellHeight: 0, fontSize: 8},
                },
                {
                    content: (self.state.getWeeksInMonth.length>0&&self.state.getWeeksInMonth[4].wed != null)?self.state.getWeeksInMonth[4].wed.date:"",
                    styles: { halign: 'center', valign: 'middle',minCellHeight: 0, fontSize: 8},
                },
                {
                    content: (self.state.getWeeksInMonth.length>0&&self.state.getWeeksInMonth[4].thu != null)?self.state.getWeeksInMonth[4].thu.date:"",
                    styles: { halign: 'center', valign: 'middle',minCellHeight: 0, fontSize: 8},
                },
                {
                    content: (self.state.getWeeksInMonth.length>0&&self.state.getWeeksInMonth[4].fri != null)?self.state.getWeeksInMonth[4].fri.date:"",
                    styles: { halign: 'center', valign: 'middle',minCellHeight: 0, fontSize: 8},
                }
            ];

            const doc = new jsPDF({orientation: 'l',format: 'letter',compressPdf:true});
            doc.addFont('/fonts/arial/ARIALNB.TTF','Arial Narrow Bold', "bold");
            doc.addFont('/fonts/arial/ArialMdm.ttf','Arial Medium', "normal");
            let pageHeight = doc.internal.pageSize.height || doc.internal.pageSize.getHeight();
            let pageWidth = doc.internal.pageSize.width || doc.internal.pageSize.getWidth();
            // console.log(doc.getFontList());
            doc.addImage("/images/deped-d.png", "PNG", 5, 10, 24, 24);
            doc.setFont("Arial Medium", "normal"); 
            doc.setFontSize(15);
            doc.text('School Form 2 (SF2) Daily Attendance Report of Learners', pageWidth / 2, 15,{align:'center'});
            doc.setFont("arial", "italic"); 
            doc.setFontSize(8);
            doc.text('(This replaces Form 1, Form 2 & STS Form 4 - Absenteeism and Dropout Profile)', pageWidth / 2, 20,{align:'center'});
            doc.setFont("Arial Medium", "normal"); 
            doc.setFontSize(9);
            doc.text('School ID : ' + self.state.schoolRegistry.school_id, 36.5, 26,{align:'left'});
            doc.text('School Year : ' + self.props.sy, 96, 26,{align:'left'});
            doc.text('Report for the Month of : ' + self.state.selectedMonthYear, 161, 26,{align:'left'});
            doc.text('Name of School : ' + self.state.schoolRegistry.school_name, 28, 31,{align:'left'});
            doc.text('Grade Level : ' + self.state.grade, 176, 31,{align:'left'});
            doc.text('Section : ' + self.state.section, 216, 31,{align:'left'});

            doc.setFontSize(8);
            autoTable(doc,{ 
                theme: 'plain',
                startY: 39,
                margin: 4,
                useCss: true,
                head: [[
                        {
                            content: "LEARNER'S Name\n(Last Name, First Name, Middle Name)",
                            colSpan: 2,
                            rowSpan: 3,
                            styles: { halign: 'center', valign: 'middle',minCellHeight: 0, fontSize: 8,lineColor: 1,lineWidth: .01},
                        },
                        {
                            content: "(1st row for date)",
                            colSpan: 25,
                            rowSpan: 1,
                            styles: { halign: 'center', fontSize: 8,lineColor: 1,lineWidth: .01,cellPadding:2},
                        },
                        {
                            content: "Total for the\nMonth",
                            colSpan: 2,
                            rowSpan: 2,
                            styles: { halign: 'center', valign: 'middle',fontSize: 6,lineColor: 1,lineWidth: .01,cellWidth: 10},
                        },
                        {
                            content: "REMARKS (If DROPPED OUT, state reason, please refer to\nlegend number 2\nIf TRANSFERRED IN/OUT, write the name of School.)",
                            colSpan: 1,
                            rowSpan: 3,
                            styles: {  halign: 'center',valign: 'middle', fontSize: 6,lineColor: 1,lineWidth: .01,cellWidth: 60},
                        },
                ],header_dates,[
                    {
                        content: "M",
                        styles: { halign: 'center', valign: 'middle',minCellHeight: 0, fontSize: 8},
                    },
                    {
                        content: "T",
                        styles: { halign: 'center', valign: 'middle',minCellHeight: 0, fontSize: 8},
                    },
                    {
                        content: "W",
                        styles: { halign: 'center', valign: 'middle',minCellHeight: 0, fontSize: 8},
                    },
                    {
                        content: "TH",
                        styles: { halign: 'center', valign: 'middle',minCellHeight: 0, fontSize: 8},
                    },
                    {
                        content: "F",
                        styles: { halign: 'center', valign: 'middle',minCellHeight: 0, fontSize: 8},
                    },
                    {
                        content: "M",
                        styles: { halign: 'center', valign: 'middle',minCellHeight: 0, fontSize: 8},
                    },
                    {
                        content: "T",
                        styles: { halign: 'center', valign: 'middle',minCellHeight: 0, fontSize: 8},
                    },
                    {
                        content: "W",
                        styles: { halign: 'center', valign: 'middle',minCellHeight: 0, fontSize: 8},
                    },
                    {
                        content: "TH",
                        styles: { halign: 'center', valign: 'middle',minCellHeight: 0, fontSize: 8},
                    },
                    {
                        content: "F",
                        styles: { halign: 'center', valign: 'middle',minCellHeight: 0, fontSize: 8},
                    },
                    {
                        content: "M",
                        styles: { halign: 'center', valign: 'middle',minCellHeight: 0, fontSize: 8},
                    },
                    {
                        content: "T",
                        styles: { halign: 'center', valign: 'middle',minCellHeight: 0, fontSize: 8},
                    },
                    {
                        content: "W",
                        styles: { halign: 'center', valign: 'middle',minCellHeight: 0, fontSize: 8},
                    },
                    {
                        content: "TH",
                        styles: { halign: 'center', valign: 'middle',minCellHeight: 0, fontSize: 8},
                    },
                    {
                        content: "F",
                        styles: { halign: 'center', valign: 'middle',minCellHeight: 0, fontSize: 8},
                    },
                    {
                        content: "M",
                        styles: { halign: 'center', valign: 'middle',minCellHeight: 0, fontSize: 8},
                    },
                    {
                        content: "T",
                        styles: { halign: 'center', valign: 'middle',minCellHeight: 0, fontSize: 8},
                    },
                    {
                        content: "W",
                        styles: { halign: 'center', valign: 'middle',minCellHeight: 0, fontSize: 8},
                    },
                    {
                        content: "TH",
                        styles: { halign: 'center', valign: 'middle',minCellHeight: 0, fontSize: 8},
                    },
                    {
                        content: "F",
                        styles: { halign: 'center', valign: 'middle',minCellHeight: 0, fontSize: 8},
                    },
                    {
                        content: "M",
                        styles: { halign: 'center', valign: 'middle',minCellHeight: 0, fontSize: 8},
                    },
                    {
                        content: "T",
                        styles: { halign: 'center', valign: 'middle',minCellHeight: 0, fontSize: 8},
                    },
                    {
                        content: "W",
                        styles: { halign: 'center', valign: 'middle',minCellHeight: 0, fontSize: 8},
                    },
                    {
                        content: "TH",
                        styles: { halign: 'center', valign: 'middle',minCellHeight: 0, fontSize: 8},
                    },
                    {
                        content: "F",
                        styles: { halign: 'center', valign: 'middle',minCellHeight: 0, fontSize: 8},
                    },
                    {
                        content: "ABSENT",
                        styles: { halign: 'center', valign: 'middle',fontSize: 4,minCellHeight: 0,fontStyle: 'normal',cellWidth:10},
                    },
                    {
                        content: "TARDY",
                        styles: { halign: 'center', valign: 'middle',fontSize: 4,minCellHeight: 0,fontStyle: 'normal',cellWidth:10},
                    }
                ]],
                headStyles: {lineColor: 1,lineWidth: .01,minCellHeight: 0,cellPadding: 0},
                styles: { fontSize: 8, lineColor: 1,lineWidth: .01},
                body: temp_data,
                didDrawCell: function (data) {
                    if (data.column.index >= 2 && data.column.index <= 26 && data.row.section === 'body') { 
                        let textPos = data.cell.getTextPos(); 
                        if(data.cell.raw.content == "full") {
                            doc.addImage(img_full, 'JPEG', textPos.x - 1.5, textPos.y - 0.5, 3.5 , 5);
                        } else if(data.cell.raw.content == "absent") {
                            doc.addImage(img_absent, 'JPEG', textPos.x - 1.5, textPos.y - 0.5, 3.5 , 5);
                        } else if(data.cell.raw.content == "tardy") {
                            doc.addImage(img_tardy, 'JPEG', textPos.x - 1.5, textPos.y - 0.5, 3.5 , 5);
                        } else if(data.cell.raw.content == "late") {
                            doc.addImage(img_late, 'JPEG', textPos.x - 1.5, textPos.y - 0.5, 3.5 , 5);
                        } else if(data.cell.raw.content == "cutting") {
                            doc.addImage(img_cutting, 'JPEG', textPos.x - 1.5, textPos.y - 0.5, 3.5 , 5);
                        }
                    } 
                }
            });
            let t1y = doc.internal.getNumberOfPages();
            // const startY = doc.lastAutoTable.finalY + 2;
            const startY = 12;
            doc.addPage({orientation: 'l',format: 'letter',compressPdf:true});
            // -------------------------------------
            doc.setFont("Arial Narrow Bold", "bold");
            doc.text('GUIDELINES: ', 5, startY + 2,{align:'left'});
            doc.setFont("Helvetica",""); 
            doc.setFontSize(6);
            doc.text("1. The attendance shall be accomplished daily. Refer to the codes for checking learners' attendance.", 5, startY + 5,{align:'left'});
            doc.text("2. Dates shall be written in the columns after Learner's Name.", 5, startY + 8,{align:'left'});
            doc.text("3. To compute the following:", 5, startY + 11,{align:'left'});
            doc.text("a. Percentage of Enrolment =", 8, startY + 16,{align:'left'});
            doc.text("b. Average Daily Attendance =", 8, startY + 20,{align:'left'});
            doc.text("c. Percentage of Attendance for the month =", 8, startY + 25,{align:'left'});
            doc.text("4. Every end of the month, the class adviser will submit this form to the office of the principal for recording of summary table into\nSchool Form 4. Once signed by the principal, this form should be returned to the adviser.", 5, startY + 32,{align:'left'});
            doc.text("5. The adviser will provide neccessary interventions including but not limited to home visitation to learner/s who were absent for 5\nconsecutive days and/or those at risk of dropping out.", 5, startY + 37,{align:'left'});
            doc.text("6. Attendance performance of learners will be reflected in Form 137 and Form 138 every grading period.\n   * Beginning of School Year cut-off report is every 1st Friday of the School Year", 5, startY + 42,{align:'left'});
            
            
            doc.text("Registered Learners as of end of the month", 70, startY + 13,{align:'left'});
            doc.text("Enrolment as of 1st Friday of the school year", 70, startY + 16,{align:'left'});
            doc.line(69, startY + 14, 114, startY + 14);

            doc.text("Total Daily Attendance", 80, startY + 18.5,{align:'left'});
            doc.text("Number of School Days in reporting month", 70, startY + 21,{align:'left'});
            doc.line(69, startY + 19, 114, startY + 19);


            doc.text("Average daily attendance", 78.5, startY + 24,{align:'left'});
            doc.text("Number of School Days in reporting month", 70, startY + 27,{align:'left'});
            doc.line(69, startY + 24.5, 114, startY + 24.5);


            doc.text("X 100", 116, startY + 15,{align:'left'});
            doc.text("X 100", 116, startY + 25,{align:'left'});
            
            doc.rect(130, startY , 55, 70);
            // console.log("startY",startY,t1y);
            autoTable(doc,{ 
                theme: 'plain',
                startY: startY,
                margin: {
                    left: 189.5,
                }, 
                // styles: {halign:"right"},
                head: [[
                        {
                            content: "Month: \n\n     " + moment(self.state.selectedMonthYear,'YYYY-MM').format('MMMM YYYY'), 
                            rowSpan: 2,
                            styles: { halign: 'left',minCellHeight: 0, fontSize: 6,lineColor: 1,lineWidth: .01,cellWidth: 22}
                        },
                        {
                            content: "No. of Days of\nClasses: \n            " + self.state.totalDaysAttendance, 
                            rowSpan: 2,
                            styles: { halign: 'left',minCellHeight: 0, fontSize: 6,lineColor: 1,lineWidth: .01,cellWidth: 22}
                        },
                        {
                            content: "Summary",
                            colSpan: 3,
                            rowSpan: 1,
                            styles: { halign: 'center', valign: 'middle',fontSize: 6,lineColor: 1,lineWidth: .01,cellWidth: 8}
                        }
                ],[
                    {
                        content: "M",   
                        styles: {halign: 'center',cellWidth: 10}
                    },
                    {
                        content: "F",   
                        styles: {halign: 'center',cellWidth: 10}
                    },
                    {
                        content: "Total",   
                        styles: {halign: 'center',cellWidth: 20}
                    }
                ]],
                headStyles: {lineColor: 1,lineWidth: .01,minCellHeight: 0},
                styles: { fontSize: 8, lineColor: 1,lineWidth: .01},
                body: [
                    [
                        {
                            content: "* Enrolment as of (1st Friday of June)",
                            colSpan: 2,
                            styles: {halign: 'center', valign: 'middle',minWidth: 5,minCellHeight: 0,cellWidth: 6.5,fontSize: 5}
                        },
                        {
                            content: self.state.enrolmentASofM, 
                            styles: {halign: 'center', valign: 'middle',minWidth: 5,minCellHeight: 0,cellWidth: 6.5,fontSize: 5}
                        },
                        {
                            content: self.state.enrolmentASofF, 
                            styles: {halign: 'center', valign: 'middle',minWidth: 5,minCellHeight: 0,cellWidth: 6.5,fontSize: 5}
                        },
                        {
                            content: Number(self.state.enrolmentASofM) + Number(self.state.enrolmentASofF), 
                            styles: {halign: 'center', valign: 'middle',minWidth: 5,minCellHeight: 0,cellWidth: 6.5,fontSize: 5}
                        }
                    ],
                    [
                        {
                            content: "Late Enrollment during the month\n(beyond cut-off)",
                            colSpan: 2,
                            styles: {halign: 'center', valign: 'middle',minWidth: 5,minCellHeight: 0,cellWidth: 6.5,fontSize: 5}
                        },
                        {
                            content: self.state.lateEnrolementM, 
                            styles: {halign: 'center', valign: 'middle',minWidth: 5,minCellHeight: 0,cellWidth: 6.5,fontSize: 5}
                        },
                        {
                            content: self.state.lateEnrolementF, 
                            styles: {halign: 'center', valign: 'middle',minWidth: 5,minCellHeight: 0,cellWidth: 6.5,fontSize: 5}
                        },
                        {
                            content: Number(self.state.lateEnrolementM) + Number(self.state.lateEnrolementF), 
                            styles: {halign: 'center', valign: 'middle',minWidth: 5,minCellHeight: 0,cellWidth: 6.5,fontSize: 5}
                        }   
                    ],
                    [
                        {
                            content: "Registered Learners as of end of the month",
                            colSpan: 2,
                            styles: {halign: 'center', valign: 'middle',minWidth: 5,minCellHeight: 0,cellWidth: 6.5,fontSize: 5}
                        },
                        {
                            content: self.state.RegisteredLearnersM, 
                            styles: {halign: 'center', valign: 'middle',minWidth: 5,minCellHeight: 0,cellWidth: 6.5,fontSize: 5}
                        },
                        {
                            content: self.state.RegisteredLearnersF, 
                            styles: {halign: 'center', valign: 'middle',minWidth: 5,minCellHeight: 0,cellWidth: 6.5,fontSize: 5}
                        },
                        {
                            content: Number(self.state.RegisteredLearnersM) + Number(self.state.RegisteredLearnersF), 
                            styles: {halign: 'center', valign: 'middle',minWidth: 5,minCellHeight: 0,cellWidth: 6.5,fontSize: 5}
                        }   
                    ],
                    [
                        {
                            content: "Percentage of Enrolment as of end of the month",
                            colSpan: 2,
                            styles: {halign: 'center', valign: 'middle',minWidth: 5,minCellHeight: 0,cellWidth: 6.5,fontSize: 5}
                        },
                        {
                            content: self.state.PEM, 
                            styles: {halign: 'center', valign: 'middle',minWidth: 5,minCellHeight: 0,cellWidth: 6.5,fontSize: 5}
                        },
                        {
                            content: self.state.PEF, 
                            styles: {halign: 'center', valign: 'middle',minWidth: 5,minCellHeight: 0,cellWidth: 6.5,fontSize: 5}
                        },
                        {
                            content: ((Number(self.state.PEM) / Number(self.state.PEF)) * 100), 
                            styles: {halign: 'center', valign: 'middle',minWidth: 5,minCellHeight: 0,cellWidth: 6.5,fontSize: 5}
                        }   
                    ],
                    [
                        {
                            content: "Average Daily Attendance",
                            colSpan: 2,
                            styles: {halign: 'center', valign: 'middle',minWidth: 5,minCellHeight: 0,cellWidth: 6.5,fontSize: 5}
                        },
                        {
                            content: self.state.ADAM, 
                            styles: {halign: 'center', valign: 'middle',minWidth: 5,minCellHeight: 0,cellWidth: 6.5,fontSize: 5}
                        },
                        {
                            content: self.state.ADAF, 
                            styles: {halign: 'center', valign: 'middle',minWidth: 5,minCellHeight: 0,cellWidth: 6.5,fontSize: 5}
                        },
                        {
                            content: self.state.ADATOTAL, 
                            styles: {halign: 'center', valign: 'middle',minWidth: 5,minCellHeight: 0,cellWidth: 6.5,fontSize: 5}
                        }   
                    ],
                    [
                        {
                            content: "Percentage of Attendance for the month",
                            colSpan: 2,
                            styles: {halign: 'center', valign: 'middle',minWidth: 5,minCellHeight: 0,cellWidth: 6.5,fontSize: 5}
                        },
                        {
                            content: self.state.PAMM, 
                            styles: {halign: 'center', valign: 'middle',minWidth: 5,minCellHeight: 0,cellWidth: 6.5,fontSize: 5}
                        },
                        {
                            content: self.state.PAMF, 
                            styles: {halign: 'center', valign: 'middle',minWidth: 5,minCellHeight: 0,cellWidth: 6.5,fontSize: 5}
                        },
                        {
                            content: self.state.PAMTOTAL, 
                            styles: {halign: 'center', valign: 'middle',minWidth: 5,minCellHeight: 0,cellWidth: 6.5,fontSize: 5}
                        }   
                    ],
                    [
                        {
                            content: "Number of students absent for 5 consecutive days:",
                            colSpan: 2,
                            styles: {halign: 'center', valign: 'middle',minWidth: 5,minCellHeight: 0,cellWidth: 6.5,fontSize: 5}
                        },
                        {
                            content: self.state.NSAM, 
                            styles: {halign: 'center', valign: 'middle',minWidth: 5,minCellHeight: 0,cellWidth: 6.5,fontSize: 5}
                        },
                        {
                            content: self.state.NSAF, 
                            styles: {halign: 'center', valign: 'middle',minWidth: 5,minCellHeight: 0,cellWidth: 6.5,fontSize: 5}
                        },
                        {
                            content: Number(self.state.NSAM) + Number(self.state.NSAF), 
                            styles: {halign: 'center', valign: 'middle',minWidth: 5,minCellHeight: 0,cellWidth: 6.5,fontSize: 5}
                        }   
                    ],
                    [
                        {
                            content: "Drop out",
                            colSpan: 2,
                            styles: {halign: 'center', valign: 'middle',minWidth: 5,minCellHeight: 0,cellWidth: 6.5,fontSize: 5}
                        },
                        {
                            content: self.state.totalDropOutM, 
                            styles: {halign: 'center', valign: 'middle',minWidth: 5,minCellHeight: 0,cellWidth: 6.5,fontSize: 5}
                        },
                        {
                            content: self.state.totalDropOutF, 
                            styles: {halign: 'center', valign: 'middle',minWidth: 5,minCellHeight: 0,cellWidth: 6.5,fontSize: 5}
                        },
                        {
                            content: Number(self.state.totalDropOutM) + Number(self.state.totalDropOutF), 
                            styles: {halign: 'center', valign: 'middle',minWidth: 5,minCellHeight: 0,cellWidth: 6.5,fontSize: 5}
                        }   
                    ],
                    [
                        {
                            content: "Transferred out",
                            colSpan: 2,
                            styles: {halign: 'center', valign: 'middle',minWidth: 5,minCellHeight: 0,cellWidth: 6.5,fontSize: 5}
                        },
                        {
                            content: self.state.totalTransferOutM, 
                            styles: {halign: 'center', valign: 'middle',minWidth: 5,minCellHeight: 0,cellWidth: 6.5,fontSize: 5}
                        },
                        {
                            content: self.state.totalTransferOutF, 
                            styles: {halign: 'center', valign: 'middle',minWidth: 5,minCellHeight: 0,cellWidth: 6.5,fontSize: 5}
                        },
                        {
                            content: Number(self.state.totalTransferOutM) + Number(self.state.totalTransferOutF), 
                            styles: {halign: 'center', valign: 'middle',minWidth: 5,minCellHeight: 0,cellWidth: 6.5,fontSize: 5}
                        }   
                    ],
                    [
                        {
                            content: "Transferred in",
                            colSpan: 2,
                            styles: {halign: 'center', valign: 'middle',minWidth: 5,minCellHeight: 0,cellWidth: 6.5,fontSize: 5}
                        },
                        {
                            content: self.state.totalTransferInM, 
                            styles: {halign: 'center', valign: 'middle',minWidth: 5,minCellHeight: 0,cellWidth: 6.5,fontSize: 5}
                        },
                        {
                            content: self.state.totalTransferInF, 
                            styles: {halign: 'center', valign: 'middle',minWidth: 5,minCellHeight: 0,cellWidth: 6.5,fontSize: 5}
                        },
                        {
                            content: Number(self.state.totalTransferInM) + Number(self.state.totalTransferInF), 
                            styles: {halign: 'center', valign: 'middle',minWidth: 5,minCellHeight: 0,cellWidth: 6.5,fontSize: 5}
                        }   
                    ]
                ]
            });

            doc.setFontSize(6);
            doc.text("1. CODES FOR CHECKING ATTENDANCE", 130.5, startY + 3,{align:'left'});
            doc.text("(blank) - Present; (x)- Absent; Tardy (half shaded=\nUpper for LateCommer, Lower for Cutting Classes)", 130.5, startY + 7,{align:'left'});
            doc.text("2. REASONS/CAUSES FOR DROPPING OUT", 130.5, startY + 13,{align:'left'});
            doc.text("a. Domestic-Related Factors\na.1. Had to take care of siblings\na.2. Early marriage/pregnancy\na.3. Parents' attitude toward schooling\na.4. Family problemsb. Individual-Related Factors\nb.1. Illness\nb.2. Overage\nb.3. Death\nb.4. Drug Abuse\nb.5. Poor academic performance\nb.6. Lack of interest/Distractions\nb.7. Hunger/Malnutrition\nc. School-Related Factors\nc.1. Teacher Factor\nc.2. Physical condition of classroom\nc.3. Peer influence\nd. Geographic/Environmental\nd.1. Distance between home and school\nd.2. Armed conflict (incl. Tribal wars & clanfeuds)\nd.3. Calamities/Disasters\ne. Financial-Related\me.1. Child labor, work\nf. Others (Specify)", 130.5, startY + 15,{align:'left'});

            let startY_ = doc.lastAutoTable.finalY + 2;

            doc.setFont("Helvetica","italic"); 
            doc.setFontSize(8);
            doc.text("I certify that this is a true and correct report.", 180, startY_ + 4,{align:'left'});
            doc.text("(Signature of Teacher over Printed Name)", 205, startY_ + 19,{align:'left'});
            doc.text("(Signature of School Head over Printed Name)", 202.5, startY_ + 39,{align:'left'});
            doc.setFont("Helvetica","normal"); 
            doc.text("Attested by:", 180, startY_ + 30,{align:'left'});

            doc.line(195, startY_ + 16, 265, startY_ + 16);

            doc.line(195, startY_ + 36, 265, startY_ + 36);
            
            doc.text("School Form 2 : Page ___ of ________", 4, startY_ + 39,{align:'left'});


            $("#obj1").height(window.innerHeight - 8);
            $("#frame1").height(window.innerHeight - 8);
            // $('#frame1').attr('src',doc.output("datauristring") + '#view=Fit&toolbar=0'); 
        
            $('#obj1').attr('data',doc.output("datauristring")+ '#view=Fit&toolbar=1');
            // $('#frame1').attr('src',doc.output("datauristring"));  
                
        } catch (error) {
            console.log(error)
        }
    }

    async loadPDFTest() {
        // console.log("loading pdf",this.state.student_male_list,this.state.student_female_list)
        let green = {fillColor:[0,128,0]};
        let red = {fillColor:[216,78,75]};
        let img_none = '/images/sf2/1.png';
        let img_full = '/images/sf2/2.png';
        let img_absent = '/images/sf2/3.png';
        let img_absent_afternoon = '/images/sf2/4.png';
        let img_absent_morning = '/images/sf2/5.png';
        try {
            let self = this;
            let sgv = "";
            let temp_data = [];
            let student_male_list = self.state.student_male_list.sort(sortFullnameAZ);
            let student_female_list = self.state.student_female_list.sort(sortFullnameAZ);
            // Array.from({length:self.state.student_male_list.length})
            student_male_list.forEach((e,x) => {
                temp_data.push([
                    {
                        content: (x+1),
                        styles: {halign: 'center', valign: 'middle',minWidth: 5,minCellHeight: 0,cellWidth: 6.5,fontSize: 5}
                    },
                    {
                        content: e.fullname,
                        styles: {halign: 'left',minWidth: 0,minCellHeight: 0,cellWidth:60,fontSize: 7}
                    },
                    {
                        content: "",
                        styles: {halign: 'center',minWidth: 0,minCellHeight: 0,cellWidth: 5,fontSize: 4}
                    },
                    {
                        content: "",
                        styles: {halign: 'center',minWidth: 0,minCellHeight: 0,cellWidth: 5,fontSize: 4}
                    },
                    {
                        content: "",
                        styles: {halign: 'center',minWidth: 0,minCellHeight: 0,cellWidth: 5,fontSize: 4}
                    },
                    {
                        content: "",
                        styles: {halign: 'center',minWidth: 0,minCellHeight: 0,cellWidth: 5,fontSize: 4}
                    },
                    {
                        content: "",
                        styles: {halign: 'center',minWidth: 0,minCellHeight: 0,cellWidth: 5,fontSize: 4}
                    },
                    {
                        content: "",
                        styles: {halign: 'center',minWidth: 0,minCellHeight: 0,cellWidth: 5,fontSize: 4}
                    },
                    {
                        content: "",
                        styles: {halign: 'center',minWidth: 0,minCellHeight: 0,cellWidth: 5,fontSize: 4}
                    },
                    {
                        content: "",
                        styles: {halign: 'center',minWidth: 0,minCellHeight: 0,cellWidth: 5,fontSize: 4}
                    },
                    {
                        content: "",
                        styles: {halign: 'center',minWidth: 0,minCellHeight: 0,cellWidth: 5,fontSize: 4}
                    },
                    {
                        content: "",
                        styles: {halign: 'center',minWidth: 0,minCellHeight: 0,cellWidth: 5,fontSize: 4}
                    },
                    {
                        content: "",
                        styles: {halign: 'center',minWidth: 0,minCellHeight: 0,cellWidth: 5,fontSize: 4}
                    },
                    {
                        content: "",
                        styles: {halign: 'center',minWidth: 0,minCellHeight: 0,cellWidth: 5,fontSize: 4}
                    },
                    {
                        content: "",
                        styles: {halign: 'center',minWidth: 0,minCellHeight: 0,cellWidth: 5,fontSize: 4}
                    },
                    {
                        content: "",
                        styles: {halign: 'center',minWidth: 0,minCellHeight: 0,cellWidth: 5,fontSize: 4}
                    },
                    {
                        content: "",
                        styles: {halign: 'center',minWidth: 0,minCellHeight: 0,cellWidth: 5,fontSize: 4}
                    },
                    {
                        content: "",
                        styles: {halign: 'center',minWidth: 0,minCellHeight: 0,cellWidth: 5,fontSize: 4}
                    },
                    {
                        content: "",
                        styles: {halign: 'center',minWidth: 0,minCellHeight: 0,cellWidth: 5,fontSize: 4}
                    },
                    {
                        content: "",
                        styles: {halign: 'center',minWidth: 0,minCellHeight: 0,cellWidth: 5,fontSize: 4}
                    },
                    {
                        content: "",
                        styles: {halign: 'center',minWidth: 0,minCellHeight: 0,cellWidth: 5,fontSize: 4}
                    },
                    {
                        content: "",
                        styles: {halign: 'center',minWidth: 0,minCellHeight: 0,cellWidth: 5,fontSize: 4}
                    },
                    {
                        content: "",
                        styles: {halign: 'center',minWidth: 0,minCellHeight: 0,cellWidth: 5,fontSize: 4}
                    },
                    {
                        content: "",
                        styles: {halign: 'center',minWidth: 0,minCellHeight: 0,cellWidth: 5,fontSize: 4}
                    },
                    {
                        content: "",
                        styles: {halign: 'center',minWidth: 0,minCellHeight: 0,cellWidth: 5,fontSize: 4}
                    },
                    {
                        content: "",
                        styles: {halign: 'center',minWidth: 0,minCellHeight: 0,cellWidth: 5,fontSize: 4}
                    },
                    {
                        content: "",
                        styles: {halign: 'center',minWidth: 0,minCellHeight: 0,cellWidth: 5,fontSize: 4}
                    },
                    {
                        content: "",
                        styles: {halign: 'center',minWidth: 0,minCellHeight: 0,fontSize: 4}
                    },
                    {
                        content: "",
                        styles: {halign: 'center',minWidth: 0,minCellHeight: 0,fontSize: 4}
                    },
                    {
                        content: "",
                        styles: {halign: 'center',minWidth: 0,minCellHeight: 0,fontSize: 4}
                    },
                ]);
            });
            // total male
            temp_data.push([
                {
                    content: "",
                    styles: {halign: 'center', valign: 'middle',minWidth: 5,minCellHeight: 0,cellWidth: 6.5,fontSize: 5}
                },
                {
                    content:"MALE | TOTAL  Per Day",
                    styles: {halign: 'left',minWidth: 0,minCellHeight: 0,cellWidth:60,fontSize: 7}
                },
                {
                    content: "",
                    styles: {halign: 'center',minWidth: 0,minCellHeight: 0,cellWidth: 5,fontSize: 4}
                },
                {
                    content: "",
                    styles: {halign: 'center',minWidth: 0,minCellHeight: 0,cellWidth: 5,fontSize: 4}
                },
                {
                    content: "",
                    styles: {halign: 'center',minWidth: 0,minCellHeight: 0,cellWidth: 5,fontSize: 4}
                },
                {
                    content: "",
                    styles: {halign: 'center',minWidth: 0,minCellHeight: 0,cellWidth: 5,fontSize: 4}
                },
                {
                    content: "",
                    styles: {halign: 'center',minWidth: 0,minCellHeight: 0,cellWidth: 5,fontSize: 4}
                },
                {
                    content: "",
                    styles: {halign: 'center',minWidth: 0,minCellHeight: 0,cellWidth: 5,fontSize: 4}
                },
                {
                    content: "",
                    styles: {halign: 'center',minWidth: 0,minCellHeight: 0,cellWidth: 5,fontSize: 4}
                },
                {
                    content: "",
                    styles: {halign: 'center',minWidth: 0,minCellHeight: 0,cellWidth: 5,fontSize: 4}
                },
                {
                    content: "",
                    styles: {halign: 'center',minWidth: 0,minCellHeight: 0,cellWidth: 5,fontSize: 4}
                },
                {
                    content: "",
                    styles: {halign: 'center',minWidth: 0,minCellHeight: 0,cellWidth: 5,fontSize: 4}
                },
                {
                    content: "",
                    styles: {halign: 'center',minWidth: 0,minCellHeight: 0,cellWidth: 5,fontSize: 4}
                },
                {
                    content: "",
                    styles: {halign: 'center',minWidth: 0,minCellHeight: 0,cellWidth: 5,fontSize: 4}
                },
                {
                    content: "",
                    styles: {halign: 'center',minWidth: 0,minCellHeight: 0,cellWidth: 5,fontSize: 4}
                },
                {
                    content: "",
                    styles: {halign: 'center',minWidth: 0,minCellHeight: 0,cellWidth: 5,fontSize: 4}
                },
                {
                    content: "",
                    styles: {halign: 'center',minWidth: 0,minCellHeight: 0,cellWidth: 5,fontSize: 4}
                },
                {
                    content: "",
                    styles: {halign: 'center',minWidth: 0,minCellHeight: 0,cellWidth: 5,fontSize: 4}
                },
                {
                    content: "",
                    styles: {halign: 'center',minWidth: 0,minCellHeight: 0,cellWidth: 5,fontSize: 4}
                },
                {
                    content: "",
                    styles: {halign: 'center',minWidth: 0,minCellHeight: 0,cellWidth: 5,fontSize: 4}
                },
                {
                    content: "",
                    styles: {halign: 'center',minWidth: 0,minCellHeight: 0,cellWidth: 5,fontSize: 4}
                },
                {
                    content: "",
                    styles: {halign: 'center',minWidth: 0,minCellHeight: 0,cellWidth: 5,fontSize: 4}
                },
                {
                    content: "",
                    styles: {halign: 'center',minWidth: 0,minCellHeight: 0,cellWidth: 5,fontSize: 4}
                },
                {
                    content: "",
                    styles: {halign: 'center',minWidth: 0,minCellHeight: 0,cellWidth: 5,fontSize: 4}
                },
                {
                    content: "",
                    styles: {halign: 'center',minWidth: 0,minCellHeight: 0,cellWidth: 5,fontSize: 4}
                },
                {
                    content: "",
                    styles: {halign: 'center',minWidth: 0,minCellHeight: 0,cellWidth: 5,fontSize: 4}
                },
                {
                    content: "",
                    styles: {halign: 'center',minWidth: 0,minCellHeight: 0,cellWidth: 5,fontSize: 4}
                },
                {
                    content: "",
                    styles: {halign: 'center',minWidth: 0,minCellHeight: 0,fontSize: 4}
                },
                {
                    content: "",
                    styles: {halign: 'center',minWidth: 0,minCellHeight: 0,fontSize: 4}
                },
                {
                    content: "",
                    styles: {halign: 'center',minWidth: 0,minCellHeight: 0,fontSize: 4}
                },
            ]);
            // Array.from({length:self.state.student_female_list.length}).
            student_female_list.forEach((e,x) => {
                temp_data.push([
                    {
                        content: (x+1),
                        styles: {halign: 'center', valign: 'middle',minWidth: 5,minCellHeight: 0,cellWidth: 6.5,fontSize: 5}
                    },
                    {
                        content: e.fullname,
                        styles: {halign: 'left',minWidth: 0,minCellHeight: 0,cellWidth:60,fontSize: 7}
                    },
                    {
                        content: "",
                        styles: {halign: 'center',minWidth: 0,minCellHeight: 0,cellWidth: 5,fontSize: 4}
                    },
                    {
                        content: "",
                        styles: {halign: 'center',minWidth: 0,minCellHeight: 0,cellWidth: 5,fontSize: 4}
                    },
                    {
                        content: "",
                        styles: {halign: 'center',minWidth: 0,minCellHeight: 0,cellWidth: 5,fontSize: 4}
                    },
                    {
                        content: "",
                        styles: {halign: 'center',minWidth: 0,minCellHeight: 0,cellWidth: 5,fontSize: 4}
                    },
                    {
                        content: "",
                        styles: {halign: 'center',minWidth: 0,minCellHeight: 0,cellWidth: 5,fontSize: 4}
                    },
                    {
                        content: "",
                        styles: {halign: 'center',minWidth: 0,minCellHeight: 0,cellWidth: 5,fontSize: 4}
                    },
                    {
                        content: "",
                        styles: {halign: 'center',minWidth: 0,minCellHeight: 0,cellWidth: 5,fontSize: 4}
                    },
                    {
                        content: "",
                        styles: {halign: 'center',minWidth: 0,minCellHeight: 0,cellWidth: 5,fontSize: 4}
                    },
                    {
                        content: "",
                        styles: {halign: 'center',minWidth: 0,minCellHeight: 0,cellWidth: 5,fontSize: 4}
                    },
                    {
                        content: "",
                        styles: {halign: 'center',minWidth: 0,minCellHeight: 0,cellWidth: 5,fontSize: 4}
                    },
                    {
                        content: "",
                        styles: {halign: 'center',minWidth: 0,minCellHeight: 0,cellWidth: 5,fontSize: 4}
                    },
                    {
                        content: "",
                        styles: {halign: 'center',minWidth: 0,minCellHeight: 0,cellWidth: 5,fontSize: 4}
                    },
                    {
                        content: "",
                        styles: {halign: 'center',minWidth: 0,minCellHeight: 0,cellWidth: 5,fontSize: 4}
                    },
                    {
                        content: "",
                        styles: {halign: 'center',minWidth: 0,minCellHeight: 0,cellWidth: 5,fontSize: 4}
                    },
                    {
                        content: "",
                        styles: {halign: 'center',minWidth: 0,minCellHeight: 0,cellWidth: 5,fontSize: 4}
                    },
                    {
                        content: "",
                        styles: {halign: 'center',minWidth: 0,minCellHeight: 0,cellWidth: 5,fontSize: 4}
                    },
                    {
                        content: "",
                        styles: {halign: 'center',minWidth: 0,minCellHeight: 0,cellWidth: 5,fontSize: 4}
                    },
                    {
                        content: "",
                        styles: {halign: 'center',minWidth: 0,minCellHeight: 0,cellWidth: 5,fontSize: 4}
                    },
                    {
                        content: "",
                        styles: {halign: 'center',minWidth: 0,minCellHeight: 0,cellWidth: 5,fontSize: 4}
                    },
                    {
                        content: "",
                        styles: {halign: 'center',minWidth: 0,minCellHeight: 0,cellWidth: 5,fontSize: 4}
                    },
                    {
                        content: "",
                        styles: {halign: 'center',minWidth: 0,minCellHeight: 0,cellWidth: 5,fontSize: 4}
                    },
                    {
                        content: "",
                        styles: {halign: 'center',minWidth: 0,minCellHeight: 0,cellWidth: 5,fontSize: 4}
                    },
                    {
                        content: "",
                        styles: {halign: 'center',minWidth: 0,minCellHeight: 0,cellWidth: 5,fontSize: 4}
                    },
                    {
                        content: "",
                        styles: {halign: 'center',minWidth: 0,minCellHeight: 0,cellWidth: 5,fontSize: 4}
                    },
                    {
                        content: "",
                        styles: {halign: 'center',minWidth: 0,minCellHeight: 0,cellWidth: 5,fontSize: 4}
                    },
                    {
                        content: "",
                        styles: {halign: 'center',minWidth: 0,minCellHeight: 0,fontSize: 4}
                    },
                    {
                        content: "",
                        styles: {halign: 'center',minWidth: 0,minCellHeight: 0,fontSize: 4}
                    },
                    {
                        content: "",
                        styles: {halign: 'center',minWidth: 0,minCellHeight: 0,fontSize: 4}
                    },
                ]);
            });
            // total Female
            temp_data.push([
                {
                    content: "",
                    styles: {halign: 'center', valign: 'middle',minWidth: 5,minCellHeight: 0,cellWidth: 6.5,fontSize: 5}
                },
                {
                    content:"FEMALE | TOTAL  Per Day",
                    styles: {halign: 'left',minWidth: 0,minCellHeight: 0,cellWidth:60,fontSize: 7}
                },
                {
                    content: "",
                    styles: {halign: 'center',minWidth: 0,minCellHeight: 0,cellWidth: 5,fontSize: 4}
                },
                {
                    content: "",
                    styles: {halign: 'center',minWidth: 0,minCellHeight: 0,cellWidth: 5,fontSize: 4}
                },
                {
                    content: "",
                    styles: {halign: 'center',minWidth: 0,minCellHeight: 0,cellWidth: 5,fontSize: 4}
                },
                {
                    content: "",
                    styles: {halign: 'center',minWidth: 0,minCellHeight: 0,cellWidth: 5,fontSize: 4}
                },
                {
                    content: "",
                    styles: {halign: 'center',minWidth: 0,minCellHeight: 0,cellWidth: 5,fontSize: 4}
                },
                {
                    content: "",
                    styles: {halign: 'center',minWidth: 0,minCellHeight: 0,cellWidth: 5,fontSize: 4}
                },
                {
                    content: "",
                    styles: {halign: 'center',minWidth: 0,minCellHeight: 0,cellWidth: 5,fontSize: 4}
                },
                {
                    content: "",
                    styles: {halign: 'center',minWidth: 0,minCellHeight: 0,cellWidth: 5,fontSize: 4}
                },
                {
                    content: "",
                    styles: {halign: 'center',minWidth: 0,minCellHeight: 0,cellWidth: 5,fontSize: 4}
                },
                {
                    content: "",
                    styles: {halign: 'center',minWidth: 0,minCellHeight: 0,cellWidth: 5,fontSize: 4}
                },
                {
                    content: "",
                    styles: {halign: 'center',minWidth: 0,minCellHeight: 0,cellWidth: 5,fontSize: 4}
                },
                {
                    content: "",
                    styles: {halign: 'center',minWidth: 0,minCellHeight: 0,cellWidth: 5,fontSize: 4}
                },
                {
                    content: "",
                    styles: {halign: 'center',minWidth: 0,minCellHeight: 0,cellWidth: 5,fontSize: 4}
                },
                {
                    content: "",
                    styles: {halign: 'center',minWidth: 0,minCellHeight: 0,cellWidth: 5,fontSize: 4}
                },
                {
                    content: "",
                    styles: {halign: 'center',minWidth: 0,minCellHeight: 0,cellWidth: 5,fontSize: 4}
                },
                {
                    content: "",
                    styles: {halign: 'center',minWidth: 0,minCellHeight: 0,cellWidth: 5,fontSize: 4}
                },
                {
                    content: "",
                    styles: {halign: 'center',minWidth: 0,minCellHeight: 0,cellWidth: 5,fontSize: 4}
                },
                {
                    content: "",
                    styles: {halign: 'center',minWidth: 0,minCellHeight: 0,cellWidth: 5,fontSize: 4}
                },
                {
                    content: "",
                    styles: {halign: 'center',minWidth: 0,minCellHeight: 0,cellWidth: 5,fontSize: 4}
                },
                {
                    content: "",
                    styles: {halign: 'center',minWidth: 0,minCellHeight: 0,cellWidth: 5,fontSize: 4}
                },
                {
                    content: "",
                    styles: {halign: 'center',minWidth: 0,minCellHeight: 0,cellWidth: 5,fontSize: 4}
                },
                {
                    content: "",
                    styles: {halign: 'center',minWidth: 0,minCellHeight: 0,cellWidth: 5,fontSize: 4}
                },
                {
                    content: "",
                    styles: {halign: 'center',minWidth: 0,minCellHeight: 0,cellWidth: 5,fontSize: 4}
                },
                {
                    content: "",
                    styles: {halign: 'center',minWidth: 0,minCellHeight: 0,cellWidth: 5,fontSize: 4}
                },
                {
                    content: "",
                    styles: {halign: 'center',minWidth: 0,minCellHeight: 0,cellWidth: 5,fontSize: 4}
                },
                {
                    content: "",
                    styles: {halign: 'center',minWidth: 0,minCellHeight: 0,fontSize: 4}
                },
                {
                    content: "",
                    styles: {halign: 'center',minWidth: 0,minCellHeight: 0,fontSize: 4}
                },
                {
                    content: "",
                    styles: {halign: 'center',minWidth: 0,minCellHeight: 0,fontSize: 4}
                },
            ]);
            // total overall
            temp_data.push([
                {
                    content: "",
                    styles: {halign: 'center', valign: 'middle',minWidth: 5,minCellHeight: 0,cellWidth: 6.5,fontSize: 5}
                },
                {
                    content:"Combined TOTAL PER DAY",
                    styles: {halign: 'left',minWidth: 0,minCellHeight: 0,cellWidth:60,fontSize: 7}
                },
                {
                    content: "",
                    styles: {halign: 'center',minWidth: 0,minCellHeight: 0,cellWidth: 5,fontSize: 4}
                },
                {
                    content: "",
                    styles: {halign: 'center',minWidth: 0,minCellHeight: 0,cellWidth: 5,fontSize: 4}
                },
                {
                    content: "",
                    styles: {halign: 'center',minWidth: 0,minCellHeight: 0,cellWidth: 5,fontSize: 4}
                },
                {
                    content: "",
                    styles: {halign: 'center',minWidth: 0,minCellHeight: 0,cellWidth: 5,fontSize: 4}
                },
                {
                    content: "",
                    styles: {halign: 'center',minWidth: 0,minCellHeight: 0,cellWidth: 5,fontSize: 4}
                },
                {
                    content: "",
                    styles: {halign: 'center',minWidth: 0,minCellHeight: 0,cellWidth: 5,fontSize: 4}
                },
                {
                    content: "",
                    styles: {halign: 'center',minWidth: 0,minCellHeight: 0,cellWidth: 5,fontSize: 4}
                },
                {
                    content: "",
                    styles: {halign: 'center',minWidth: 0,minCellHeight: 0,cellWidth: 5,fontSize: 4}
                },
                {
                    content: "",
                    styles: {halign: 'center',minWidth: 0,minCellHeight: 0,cellWidth: 5,fontSize: 4}
                },
                {
                    content: "",
                    styles: {halign: 'center',minWidth: 0,minCellHeight: 0,cellWidth: 5,fontSize: 4}
                },
                {
                    content: "",
                    styles: {halign: 'center',minWidth: 0,minCellHeight: 0,cellWidth: 5,fontSize: 4}
                },
                {
                    content: "",
                    styles: {halign: 'center',minWidth: 0,minCellHeight: 0,cellWidth: 5,fontSize: 4}
                },
                {
                    content: "",
                    styles: {halign: 'center',minWidth: 0,minCellHeight: 0,cellWidth: 5,fontSize: 4}
                },
                {
                    content: "",
                    styles: {halign: 'center',minWidth: 0,minCellHeight: 0,cellWidth: 5,fontSize: 4}
                },
                {
                    content: "",
                    styles: {halign: 'center',minWidth: 0,minCellHeight: 0,cellWidth: 5,fontSize: 4}
                },
                {
                    content: "",
                    styles: {halign: 'center',minWidth: 0,minCellHeight: 0,cellWidth: 5,fontSize: 4}
                },
                {
                    content: "",
                    styles: {halign: 'center',minWidth: 0,minCellHeight: 0,cellWidth: 5,fontSize: 4}
                },
                {
                    content: "",
                    styles: {halign: 'center',minWidth: 0,minCellHeight: 0,cellWidth: 5,fontSize: 4}
                },
                {
                    content: "",
                    styles: {halign: 'center',minWidth: 0,minCellHeight: 0,cellWidth: 5,fontSize: 4}
                },
                {
                    content: "",
                    styles: {halign: 'center',minWidth: 0,minCellHeight: 0,cellWidth: 5,fontSize: 4}
                },
                {
                    content: "",
                    styles: {halign: 'center',minWidth: 0,minCellHeight: 0,cellWidth: 5,fontSize: 4}
                },
                {
                    content: "",
                    styles: {halign: 'center',minWidth: 0,minCellHeight: 0,cellWidth: 5,fontSize: 4}
                },
                {
                    content: "",
                    styles: {halign: 'center',minWidth: 0,minCellHeight: 0,cellWidth: 5,fontSize: 4}
                },
                {
                    content: "",
                    styles: {halign: 'center',minWidth: 0,minCellHeight: 0,cellWidth: 5,fontSize: 4}
                },
                {
                    content: "",
                    styles: {halign: 'center',minWidth: 0,minCellHeight: 0,cellWidth: 5,fontSize: 4}
                },
                {
                    content: "",
                    styles: {halign: 'center',minWidth: 0,minCellHeight: 0,fontSize: 4}
                },
                {
                    content: "",
                    styles: {halign: 'center',minWidth: 0,minCellHeight: 0,fontSize: 4}
                },
                {
                    content: "",
                    styles: {halign: 'center',minWidth: 0,minCellHeight: 0,fontSize: 4}
                },
            ]);

            let header_dates = [
                {
                    content: (self.state.getWeeksInMonth.length>0&&self.state.getWeeksInMonth[0].mon != null)?self.state.getWeeksInMonth[0].mon.date:"",
                    styles: { halign: 'center', valign: 'middle',minCellHeight: 0, fontSize: 8},
                },
                {
                    content: (self.state.getWeeksInMonth.length>0&&self.state.getWeeksInMonth[0].tue != null)?self.state.getWeeksInMonth[0].tue.date:"",
                    styles: { halign: 'center', valign: 'middle',minCellHeight: 0, fontSize: 8},
                },
                {
                    content: (self.state.getWeeksInMonth.length>0&&self.state.getWeeksInMonth[0].wed != null)?self.state.getWeeksInMonth[0].wed.date:"",
                    styles: { halign: 'center', valign: 'middle',minCellHeight: 0, fontSize: 8},
                },
                {
                    content: (self.state.getWeeksInMonth.length>0&&self.state.getWeeksInMonth[0].thu != null)?self.state.getWeeksInMonth[0].thu.date:"",
                    styles: { halign: 'center', valign: 'middle',minCellHeight: 0, fontSize: 8},
                },
                {
                    content: (self.state.getWeeksInMonth.length>0&&self.state.getWeeksInMonth[0].fri != null)?self.state.getWeeksInMonth[0].fri.date:"",
                    styles: { halign: 'center', valign: 'middle',minCellHeight: 0, fontSize: 8},
                },
                {
                    content: (self.state.getWeeksInMonth.length>0&&self.state.getWeeksInMonth[1].mon != null)?self.state.getWeeksInMonth[1].mon.date:"",
                    styles: { halign: 'center', valign: 'middle',minCellHeight: 0, fontSize: 8},
                },
                {
                    content: (self.state.getWeeksInMonth.length>0&&self.state.getWeeksInMonth[1].tue != null)?self.state.getWeeksInMonth[1].tue.date:"",
                    styles: { halign: 'center', valign: 'middle',minCellHeight: 0, fontSize: 8},
                },
                {
                    content: (self.state.getWeeksInMonth.length>0&&self.state.getWeeksInMonth[1].wed != null)?self.state.getWeeksInMonth[1].wed.date:"",
                    styles: { halign: 'center', valign: 'middle',minCellHeight: 0, fontSize: 8},
                },
                {
                    content: (self.state.getWeeksInMonth.length>0&&self.state.getWeeksInMonth[1].thu != null)?self.state.getWeeksInMonth[1].thu.date:"",
                    styles: { halign: 'center', valign: 'middle',minCellHeight: 0, fontSize: 8},
                },
                {
                    content: (self.state.getWeeksInMonth.length>0&&self.state.getWeeksInMonth[1].fri != null)?self.state.getWeeksInMonth[1].fri.date:"",
                    styles: { halign: 'center', valign: 'middle',minCellHeight: 0, fontSize: 8},
                },
                {
                    content: (self.state.getWeeksInMonth.length>0&&self.state.getWeeksInMonth[2].mon != null)?self.state.getWeeksInMonth[2].mon.date:"",
                    styles: { halign: 'center', valign: 'middle',minCellHeight: 0, fontSize: 8},
                },
                {
                    content: (self.state.getWeeksInMonth.length>0&&self.state.getWeeksInMonth[2].tue != null)?self.state.getWeeksInMonth[2].tue.date:"",
                    styles: { halign: 'center', valign: 'middle',minCellHeight: 0, fontSize: 8},
                },
                {
                    content: (self.state.getWeeksInMonth.length>0&&self.state.getWeeksInMonth[2].wed != null)?self.state.getWeeksInMonth[2].wed.date:"",
                    styles: { halign: 'center', valign: 'middle',minCellHeight: 0, fontSize: 8},
                },
                {
                    content: (self.state.getWeeksInMonth.length>0&&self.state.getWeeksInMonth[2].thu != null)?self.state.getWeeksInMonth[2].thu.date:"",
                    styles: { halign: 'center', valign: 'middle',minCellHeight: 0, fontSize: 8},
                },
                {
                    content: (self.state.getWeeksInMonth.length>0&&self.state.getWeeksInMonth[2].fri != null)?self.state.getWeeksInMonth[2].fri.date:"",
                    styles: { halign: 'center', valign: 'middle',minCellHeight: 0, fontSize: 8},
                },
                {
                    content: (self.state.getWeeksInMonth.length>0&&self.state.getWeeksInMonth[3].mon != null)?self.state.getWeeksInMonth[3].mon.date:"",
                    styles: { halign: 'center', valign: 'middle',minCellHeight: 0, fontSize: 8},
                },
                {
                    content: (self.state.getWeeksInMonth.length>0&&self.state.getWeeksInMonth[3].thu != null)?self.state.getWeeksInMonth[3].thu.date:"",
                    styles: { halign: 'center', valign: 'middle',minCellHeight: 0, fontSize: 8},
                },
                {
                    content: (self.state.getWeeksInMonth.length>0&&self.state.getWeeksInMonth[3].wed != null)?self.state.getWeeksInMonth[3].wed.date:"",
                    styles: { halign: 'center', valign: 'middle',minCellHeight: 0, fontSize: 8},
                },
                {
                    content: (self.state.getWeeksInMonth.length>0&&self.state.getWeeksInMonth[3].thu != null)?self.state.getWeeksInMonth[3].thu.date:"",
                    styles: { halign: 'center', valign: 'middle',minCellHeight: 0, fontSize: 8},
                },
                {
                    content: (self.state.getWeeksInMonth.length>0&&self.state.getWeeksInMonth[3].fri != null)?self.state.getWeeksInMonth[3].fri.date:"",
                    styles: { halign: 'center', valign: 'middle',minCellHeight: 0, fontSize: 8},
                },
                {
                    content: (self.state.getWeeksInMonth.length>0&&self.state.getWeeksInMonth[4].mon != null)?self.state.getWeeksInMonth[4].mon.date:"",
                    styles: { halign: 'center', valign: 'middle',minCellHeight: 0, fontSize: 8},
                },
                {
                    content: (self.state.getWeeksInMonth.length>0&&self.state.getWeeksInMonth[4].tue != null)?self.state.getWeeksInMonth[4].tue.date:"",
                    styles: { halign: 'center', valign: 'middle',minCellHeight: 0, fontSize: 8},
                },
                {
                    content: (self.state.getWeeksInMonth.length>0&&self.state.getWeeksInMonth[4].wed != null)?self.state.getWeeksInMonth[4].wed.date:"",
                    styles: { halign: 'center', valign: 'middle',minCellHeight: 0, fontSize: 8},
                },
                {
                    content: (self.state.getWeeksInMonth.length>0&&self.state.getWeeksInMonth[4].thu != null)?self.state.getWeeksInMonth[4].thu.date:"",
                    styles: { halign: 'center', valign: 'middle',minCellHeight: 0, fontSize: 8},
                },
                {
                    content: (self.state.getWeeksInMonth.length>0&&self.state.getWeeksInMonth[4].fri != null)?self.state.getWeeksInMonth[4].fri.date:"",
                    styles: { halign: 'center', valign: 'middle',minCellHeight: 0, fontSize: 8},
                }
            ];

            const doc = new jsPDF({orientation: 'l',format: 'letter',compressPdf:true});
            doc.addFont('/fonts/arial/ARIALNB.TTF','Arial Narrow Bold', "bold");
            doc.addFont('/fonts/arial/ArialMdm.ttf','Arial Medium', "normal");
            let pageHeight = doc.internal.pageSize.height || doc.internal.pageSize.getHeight();
            let pageWidth = doc.internal.pageSize.width || doc.internal.pageSize.getWidth();
            console.log(doc.getFontList());
            doc.addImage("/images/deped-d.png", "PNG", 5, 10, 24, 24);
            doc.setFont("Arial Medium", "normal"); 
            doc.setFontSize(15);
            doc.text('School Form 2 (SF2) Daily Attendance Report of Learners', pageWidth / 2, 15,{align:'center'});
            doc.setFont("arial", "italic"); 
            doc.setFontSize(8);
            doc.text('(This replaces Form 1, Form 2 & STS Form 4 - Absenteeism and Dropout Profile)', pageWidth / 2, 20,{align:'center'});
            doc.setFont("Arial Medium", "normal"); 
            doc.setFontSize(9);
            doc.text('School ID : ' + self.state.schoolRegistry.school_id, 36.5, 26,{align:'left'});
            doc.text('School Year : ' + self.props.sy, 96, 26,{align:'left'});
            doc.text('Report for the Month of : ' + self.state.month, 161, 26,{align:'left'});
            doc.text('Name of School : '  + self.state.schoolRegistry.school_name, 28, 31,{align:'left'});
            doc.text('Grade Level : ' + self.state.grade, 176, 31,{align:'left'});
            doc.text('Section : ' + self.state.section, 216, 31,{align:'left'});

            doc.setFontSize(8);
            autoTable(doc,{ 
                theme: 'plain',
                startY: 39,
                margin: 4,
                useCss: true,
                head: [[
                        {
                            content: "LEARNER'S Name\n(Last Name, First Name, Middle Name)",
                            colSpan: 2,
                            rowSpan: 3,
                            styles: { halign: 'center', valign: 'middle',minCellHeight: 0, fontSize: 8,lineColor: 1,lineWidth: .01},
                        },
                        {
                            content: "(1st row for date)",
                            colSpan: 25,
                            rowSpan: 1,
                            styles: { halign: 'center', fontSize: 8,lineColor: 1,lineWidth: .01,cellPadding:2},
                        },
                        {
                            content: "Total for the\nMonth",
                            colSpan: 2,
                            rowSpan: 2,
                            styles: { halign: 'center', valign: 'middle',fontSize: 6,lineColor: 1,lineWidth: .01,cellWidth: 10},
                        },
                        {
                            content: "REMARKS (If DROPPED OUT, state reason, please refer to\nlegend number 2\nIf TRANSFERRED IN/OUT, write the name of School.)",
                            colSpan: 1,
                            rowSpan: 3,
                            styles: {  halign: 'center',valign: 'middle', fontSize: 6,lineColor: 1,lineWidth: .01,cellWidth: 60},
                        },
                ],header_dates,[
                    {
                        content: "M",
                        styles: { halign: 'center', valign: 'middle',minCellHeight: 0, fontSize: 8},
                    },
                    {
                        content: "T",
                        styles: { halign: 'center', valign: 'middle',minCellHeight: 0, fontSize: 8},
                    },
                    {
                        content: "W",
                        styles: { halign: 'center', valign: 'middle',minCellHeight: 0, fontSize: 8},
                    },
                    {
                        content: "TH",
                        styles: { halign: 'center', valign: 'middle',minCellHeight: 0, fontSize: 8},
                    },
                    {
                        content: "F",
                        styles: { halign: 'center', valign: 'middle',minCellHeight: 0, fontSize: 8},
                    },
                    {
                        content: "M",
                        styles: { halign: 'center', valign: 'middle',minCellHeight: 0, fontSize: 8},
                    },
                    {
                        content: "T",
                        styles: { halign: 'center', valign: 'middle',minCellHeight: 0, fontSize: 8},
                    },
                    {
                        content: "W",
                        styles: { halign: 'center', valign: 'middle',minCellHeight: 0, fontSize: 8},
                    },
                    {
                        content: "TH",
                        styles: { halign: 'center', valign: 'middle',minCellHeight: 0, fontSize: 8},
                    },
                    {
                        content: "F",
                        styles: { halign: 'center', valign: 'middle',minCellHeight: 0, fontSize: 8},
                    },
                    {
                        content: "M",
                        styles: { halign: 'center', valign: 'middle',minCellHeight: 0, fontSize: 8},
                    },
                    {
                        content: "T",
                        styles: { halign: 'center', valign: 'middle',minCellHeight: 0, fontSize: 8},
                    },
                    {
                        content: "W",
                        styles: { halign: 'center', valign: 'middle',minCellHeight: 0, fontSize: 8},
                    },
                    {
                        content: "TH",
                        styles: { halign: 'center', valign: 'middle',minCellHeight: 0, fontSize: 8},
                    },
                    {
                        content: "F",
                        styles: { halign: 'center', valign: 'middle',minCellHeight: 0, fontSize: 8},
                    },{
                        content: "M",
                        styles: { halign: 'center', valign: 'middle',minCellHeight: 0, fontSize: 8},
                    },
                    {
                        content: "T",
                        styles: { halign: 'center', valign: 'middle',minCellHeight: 0, fontSize: 8},
                    },
                    {
                        content: "W",
                        styles: { halign: 'center', valign: 'middle',minCellHeight: 0, fontSize: 8},
                    },
                    {
                        content: "TH",
                        styles: { halign: 'center', valign: 'middle',minCellHeight: 0, fontSize: 8},
                    },
                    {
                        content: "F",
                        styles: { halign: 'center', valign: 'middle',minCellHeight: 0, fontSize: 8},
                    },{
                        content: "M",
                        styles: { halign: 'center', valign: 'middle',minCellHeight: 0, fontSize: 8},
                    },
                    {
                        content: "T",
                        styles: { halign: 'center', valign: 'middle',minCellHeight: 0, fontSize: 8},
                    },
                    {
                        content: "W",
                        styles: { halign: 'center', valign: 'middle',minCellHeight: 0, fontSize: 8},
                    },
                    {
                        content: "TH",
                        styles: { halign: 'center', valign: 'middle',minCellHeight: 0, fontSize: 8},
                    },
                    {
                        content: "F",
                        styles: { halign: 'center', valign: 'middle',minCellHeight: 0, fontSize: 8},
                    },
                    {
                        content: "ABSENT",
                        styles: { halign: 'center', valign: 'middle',fontSize: 4,minCellHeight: 0,fontStyle: 'normal',cellWidth:10},
                    },
                    {
                        content: "TARDY",
                        styles: { halign: 'center', valign: 'middle',fontSize: 4,minCellHeight: 0,fontStyle: 'normal',cellWidth:10},
                    }
                ]],
                headStyles: {lineColor: 1,lineWidth: .01,minCellHeight: 0,cellPadding: 0},
                styles: { fontSize: 8, lineColor: 1,lineWidth: .01},
                body: temp_data,
                didDrawCell: function (data) {
                    if (data.column.index == 2 && data.row.section === 'body') { 
                        let textPos = data.cell.getTextPos(); 
                        if(data.cell.raw.content == "full") {
                            doc.addImage(img_full, 'JPEG', textPos.x - 1.5, textPos.y - 1, 3.5 , 5);
                        }
                    }
                }
            });
            let t1y = doc.internal.getNumberOfPages();
            // const startY = doc.lastAutoTable.finalY + 2;
            const startY = 12;
            doc.addPage({orientation: 'l',format: 'letter',compressPdf:true});            doc.text('School ID : ' + self.state.shcool_id, 36.5, 26,{align:'left'});
            doc.text('School Year : ', 96, 26,{align:'left'});
            doc.text('Report for the Month of : ' + self.state.month, 161, 26,{align:'left'});
            doc.text('Name of School : '  + self.state.schoolRegistry.school_name, 28, 31,{align:'left'});
            doc.text('Grade Level : ' + self.state.grade, 176, 31,{align:'left'});
            doc.text('Section : ' + self.state.section, 216, 31,{align:'left'});
            doc.text('GUIDELINES: ', 5, startY + 2,{align:'left'});
            doc.setFont("Helvetica",""); 
            doc.setFontSize(6);
            doc.text("1. The attendance shall be accomplished daily. Refer to the codes for checking learners' attendance.", 5, startY + 5,{align:'left'});
            doc.text("2. Dates shall be written in the columns after Learner's Name.", 5, startY + 8,{align:'left'});
            doc.text("3. To compute the following:", 5, startY + 11,{align:'left'});
            doc.text("a. Percentage of Enrolment =", 8, startY + 16,{align:'left'});
            doc.text("b. Average Daily Attendance =", 8, startY + 20,{align:'left'});
            doc.text("c. Percentage of Attendance for the month =", 8, startY + 25,{align:'left'});
            doc.text("4. Every end of the month, the class adviser will submit this form to the office of the principal for recording of summary table into\nSchool Form 4. Once signed by the principal, this form should be returned to the adviser.", 5, startY + 32,{align:'left'});
            doc.text("5. The adviser will provide neccessary interventions including but not limited to home visitation to learner/s who were absent for 5\nconsecutive days and/or those at risk of dropping out.", 5, startY + 37,{align:'left'});
            doc.text("6. Attendance performance of learners will be reflected in Form 137 and Form 138 every grading period.\n   * Beginning of School Year cut-off report is every 1st Friday of the School Year", 5, startY + 42,{align:'left'});
            
            
            doc.text("Registered Learners as of end of the month", 70, startY + 13,{align:'left'});
            doc.text("Enrolment as of 1st Friday of the school year", 70, startY + 16,{align:'left'});
            doc.line(69, startY + 14, 114, startY + 14);

            doc.text("Total Daily Attendance", 80, startY + 18.5,{align:'left'});
            doc.text("Number of School Days in reporting month", 70, startY + 21,{align:'left'});
            doc.line(69, startY + 19, 114, startY + 19);


            doc.text("Average daily attendance", 78.5, startY + 24,{align:'left'});
            doc.text("Number of School Days in reporting month", 70, startY + 27,{align:'left'});
            doc.line(69, startY + 24.5, 114, startY + 24.5);


            doc.text("X 100", 116, startY + 15,{align:'left'});
            doc.text("X 100", 116, startY + 25,{align:'left'});
            
            doc.rect(130, startY , 55, 70);
            console.log("startY",startY,t1y);
            autoTable(doc,{ 
                theme: 'plain',
                startY: startY,
                margin: {
                    left: 189.5,
                }, 
                // styles: {halign:"right"},
                head: [[
                        {
                            content: "Month: ", 
                            rowSpan: 2,
                            styles: { halign: 'left',minCellHeight: 0, fontSize: 6,lineColor: 1,lineWidth: .01,cellWidth: 22}
                        },
                        {
                            content: "No. of Days of\nClasses:", 
                            rowSpan: 2,
                            styles: { halign: 'left',minCellHeight: 0, fontSize: 6,lineColor: 1,lineWidth: .01,cellWidth: 22}
                        },
                        {
                            content: "Summary",
                            colSpan: 3,
                            rowSpan: 1,
                            styles: { halign: 'center', valign: 'middle',fontSize: 6,lineColor: 1,lineWidth: .01,cellWidth: 8}
                        }
                ],[
                    {
                        content: "M",   
                        styles: {halign: 'center',cellWidth: 10}
                    },
                    {
                        content: "F",   
                        styles: {halign: 'center',cellWidth: 10}
                    },
                    {
                        content: "Total",   
                        styles: {halign: 'center',cellWidth: 20}
                    }
                ]],
                headStyles: {lineColor: 1,lineWidth: .01,minCellHeight: 0},
                styles: { fontSize: 8, lineColor: 1,lineWidth: .01},
                body: [
                    [
                        {
                            content: "* Enrolment as of (1st Friday of June)",
                            colSpan: 2,
                            styles: {halign: 'center', valign: 'middle',minWidth: 5,minCellHeight: 0,cellWidth: 6.5,fontSize: 5}
                        },
                        {
                            content: "0", 
                            styles: {halign: 'center', valign: 'middle',minWidth: 5,minCellHeight: 0,cellWidth: 6.5,fontSize: 5}
                        },
                        {
                            content: "0", 
                            styles: {halign: 'center', valign: 'middle',minWidth: 5,minCellHeight: 0,cellWidth: 6.5,fontSize: 5}
                        },
                        {
                            content: "0", 
                            styles: {halign: 'center', valign: 'middle',minWidth: 5,minCellHeight: 0,cellWidth: 6.5,fontSize: 5}
                        }
                    ],
                    [
                        {
                            content: "Late Enrollment during the month\n(beyond cut-off)",
                            colSpan: 2,
                            styles: {halign: 'center', valign: 'middle',minWidth: 5,minCellHeight: 0,cellWidth: 6.5,fontSize: 5}
                        },
                        {
                            content: "0", 
                            styles: {halign: 'center', valign: 'middle',minWidth: 5,minCellHeight: 0,cellWidth: 6.5,fontSize: 5}
                        },
                        {
                            content: "0", 
                            styles: {halign: 'center', valign: 'middle',minWidth: 5,minCellHeight: 0,cellWidth: 6.5,fontSize: 5}
                        },
                        {
                            content: "0", 
                            styles: {halign: 'center', valign: 'middle',minWidth: 5,minCellHeight: 0,cellWidth: 6.5,fontSize: 5}
                        }   
                    ],
                    [
                        {
                            content: "Registered Learners as of end of the month",
                            colSpan: 2,
                            styles: {halign: 'center', valign: 'middle',minWidth: 5,minCellHeight: 0,cellWidth: 6.5,fontSize: 5}
                        },
                        {
                            content: "0", 
                            styles: {halign: 'center', valign: 'middle',minWidth: 5,minCellHeight: 0,cellWidth: 6.5,fontSize: 5}
                        },
                        {
                            content: "0", 
                            styles: {halign: 'center', valign: 'middle',minWidth: 5,minCellHeight: 0,cellWidth: 6.5,fontSize: 5}
                        },
                        {
                            content: "0", 
                            styles: {halign: 'center', valign: 'middle',minWidth: 5,minCellHeight: 0,cellWidth: 6.5,fontSize: 5}
                        }   
                    ],
                    [
                        {
                            content: "Percentage of Enrolment as of end of the month",
                            colSpan: 2,
                            styles: {halign: 'center', valign: 'middle',minWidth: 5,minCellHeight: 0,cellWidth: 6.5,fontSize: 5}
                        },
                        {
                            content: "0", 
                            styles: {halign: 'center', valign: 'middle',minWidth: 5,minCellHeight: 0,cellWidth: 6.5,fontSize: 5}
                        },
                        {
                            content: "0", 
                            styles: {halign: 'center', valign: 'middle',minWidth: 5,minCellHeight: 0,cellWidth: 6.5,fontSize: 5}
                        },
                        {
                            content: "0", 
                            styles: {halign: 'center', valign: 'middle',minWidth: 5,minCellHeight: 0,cellWidth: 6.5,fontSize: 5}
                        }   
                    ],
                    [
                        {
                            content: "Average Daily Attendance",
                            colSpan: 2,
                            styles: {halign: 'center', valign: 'middle',minWidth: 5,minCellHeight: 0,cellWidth: 6.5,fontSize: 5}
                        },
                        {
                            content: "0", 
                            styles: {halign: 'center', valign: 'middle',minWidth: 5,minCellHeight: 0,cellWidth: 6.5,fontSize: 5}
                        },
                        {
                            content: "0", 
                            styles: {halign: 'center', valign: 'middle',minWidth: 5,minCellHeight: 0,cellWidth: 6.5,fontSize: 5}
                        },
                        {
                            content: "0", 
                            styles: {halign: 'center', valign: 'middle',minWidth: 5,minCellHeight: 0,cellWidth: 6.5,fontSize: 5}
                        }   
                    ],
                    [
                        {
                            content: "Percentage of Attendance for the month",
                            colSpan: 2,
                            styles: {halign: 'center', valign: 'middle',minWidth: 5,minCellHeight: 0,cellWidth: 6.5,fontSize: 5}
                        },
                        {
                            content: "0", 
                            styles: {halign: 'center', valign: 'middle',minWidth: 5,minCellHeight: 0,cellWidth: 6.5,fontSize: 5}
                        },
                        {
                            content: "0", 
                            styles: {halign: 'center', valign: 'middle',minWidth: 5,minCellHeight: 0,cellWidth: 6.5,fontSize: 5}
                        },
                        {
                            content: "0", 
                            styles: {halign: 'center', valign: 'middle',minWidth: 5,minCellHeight: 0,cellWidth: 6.5,fontSize: 5}
                        }   
                    ],
                    [
                        {
                            content: "Number of students absent for 5 consecutive days:",
                            colSpan: 2,
                            styles: {halign: 'center', valign: 'middle',minWidth: 5,minCellHeight: 0,cellWidth: 6.5,fontSize: 5}
                        },
                        {
                            content: "0", 
                            styles: {halign: 'center', valign: 'middle',minWidth: 5,minCellHeight: 0,cellWidth: 6.5,fontSize: 5}
                        },
                        {
                            content: "0", 
                            styles: {halign: 'center', valign: 'middle',minWidth: 5,minCellHeight: 0,cellWidth: 6.5,fontSize: 5}
                        },
                        {
                            content: "0", 
                            styles: {halign: 'center', valign: 'middle',minWidth: 5,minCellHeight: 0,cellWidth: 6.5,fontSize: 5}
                        }   
                    ],
                    [
                        {
                            content: "Drop out",
                            colSpan: 2,
                            styles: {halign: 'center', valign: 'middle',minWidth: 5,minCellHeight: 0,cellWidth: 6.5,fontSize: 5}
                        },
                        {
                            content: "0", 
                            styles: {halign: 'center', valign: 'middle',minWidth: 5,minCellHeight: 0,cellWidth: 6.5,fontSize: 5}
                        },
                        {
                            content: "0", 
                            styles: {halign: 'center', valign: 'middle',minWidth: 5,minCellHeight: 0,cellWidth: 6.5,fontSize: 5}
                        },
                        {
                            content: "0", 
                            styles: {halign: 'center', valign: 'middle',minWidth: 5,minCellHeight: 0,cellWidth: 6.5,fontSize: 5}
                        }   
                    ],
                    [
                        {
                            content: "Transferred out",
                            colSpan: 2,
                            styles: {halign: 'center', valign: 'middle',minWidth: 5,minCellHeight: 0,cellWidth: 6.5,fontSize: 5}
                        },
                        {
                            content: "0", 
                            styles: {halign: 'center', valign: 'middle',minWidth: 5,minCellHeight: 0,cellWidth: 6.5,fontSize: 5}
                        },
                        {
                            content: "0", 
                            styles: {halign: 'center', valign: 'middle',minWidth: 5,minCellHeight: 0,cellWidth: 6.5,fontSize: 5}
                        },
                        {
                            content: "0", 
                            styles: {halign: 'center', valign: 'middle',minWidth: 5,minCellHeight: 0,cellWidth: 6.5,fontSize: 5}
                        }   
                    ],
                    [
                        {
                            content: "Transferred in",
                            colSpan: 2,
                            styles: {halign: 'center', valign: 'middle',minWidth: 5,minCellHeight: 0,cellWidth: 6.5,fontSize: 5}
                        },
                        {
                            content: "0", 
                            styles: {halign: 'center', valign: 'middle',minWidth: 5,minCellHeight: 0,cellWidth: 6.5,fontSize: 5}
                        },
                        {
                            content: "0", 
                            styles: {halign: 'center', valign: 'middle',minWidth: 5,minCellHeight: 0,cellWidth: 6.5,fontSize: 5}
                        },
                        {
                            content: "0", 
                            styles: {halign: 'center', valign: 'middle',minWidth: 5,minCellHeight: 0,cellWidth: 6.5,fontSize: 5}
                        }   
                    ]
                ]
            });

            doc.setFontSize(6);
            doc.text("1. CODES FOR CHECKING ATTENDANCE", 130.5, startY + 3,{align:'left'});
            doc.text("(blank) - Present; (x)- Absent; Tardy (half shaded=\nUpper for LateCommer, Lower for Cutting Classes)", 130.5, startY + 7,{align:'left'});
            doc.text("2. REASONS/CAUSES FOR DROPPING OUT", 130.5, startY + 13,{align:'left'});
            doc.text("a. Domestic-Related Factors\na.1. Had to take care of siblings\na.2. Early marriage/pregnancy\na.3. Parents' attitude toward schooling\na.4. Family problemsb. Individual-Related Factors\nb.1. Illness\nb.2. Overage\nb.3. Death\nb.4. Drug Abuse\nb.5. Poor academic performance\nb.6. Lack of interest/Distractions\nb.7. Hunger/Malnutrition\nc. School-Related Factors\nc.1. Teacher Factor\nc.2. Physical condition of classroom\nc.3. Peer influence\nd. Geographic/Environmental\nd.1. Distance between home and school\nd.2. Armed conflict (incl. Tribal wars & clanfeuds)\nd.3. Calamities/Disasters\ne. Financial-Related\me.1. Child labor, work\nf. Others (Specify)", 130.5, startY + 15,{align:'left'});

            let startY_ = doc.lastAutoTable.finalY + 2;

            doc.setFont("Helvetica","italic"); 
            doc.setFontSize(8);
            doc.text("I certify that this is a true and correct report.", 180, startY_ + 4,{align:'left'});
            doc.text("(Signature of Teacher over Printed Name)", 205, startY_ + 19,{align:'left'});
            doc.text("(Signature of School Head over Printed Name)", 202.5, startY_ + 39,{align:'left'});
            doc.setFont("Helvetica","normal"); 
            doc.text("Attested by:", 180, startY_ + 30,{align:'left'});

            doc.line(195, startY_ + 16, 265, startY_ + 16);

            doc.line(195, startY_ + 36, 265, startY_ + 36);
            
            doc.text("School Form 2 : Page ___ of ________", 4, startY_ + 39,{align:'left'});


            $("#obj1").height(window.innerHeight - 8);
            $("#frame1").height(window.innerHeight - 8);
            // $('#frame1').attr('src',doc.output("datauristring") + '#view=Fit&toolbar=0'); 
        
            $('#obj1').attr('data',doc.output("datauristring")+ '#view=Fit&toolbar=1');
            // $('#frame1').attr('src',doc.output("datauristring"));  
                
        } catch (error) {
            console.log(error)
        }
    }

    browser_check_preview(){ // check para disable ang preview
		let isOpera = (!!window.opr && !!opr.addons) || !!window.opera || navigator.userAgent.indexOf(' OPR/') >= 0;

		// Firefox 1.0+
		let isFirefox = typeof InstallTrigger !== 'undefined';

		// Safari 3.0+ "[object HTMLElementConstructor]" 
		let isSafari = /constructor/i.test(window.HTMLElement) || (function (p) { return p.toString() === "[object SafariRemoteNotification]"; })(!window['safari'] || (typeof safari !== 'undefined' && safari.pushNotification));

		// Internet Explorer 6-11
		let isIE = /*@cc_on!@*/false || !!document.documentMode;

		// Edge 20+
		let isEdge = !isIE && !!window.StyleMedia;

		// Chrome 1 - 71
		let isChrome = !!window.chrome && (!!window.chrome.webstore || !!window.chrome.runtime);

		// Blink engine detection
		let isBlink = (isChrome || isOpera) && !!window.CSS;
		if(isOpera){
			return 0;
		} else if(isFirefox){			
			return 1;
		} else if(isSafari){			
			return 1;
		} else if(isIE){			
			return 0;
		} else if(isEdge){			
			return 0;
		} else if(isChrome){			
			return 0;
		} else if(isBlink){			
			return 0;
		} else {
			return 0;
		}
	}
 
    
    render() {
        return <DashboardLayout title="School Form 2" user={this.props.auth.user} profile={this.props.auth.profile}>
            <div className="app-content-header"> 
                <div className="container-fluid"> 
                    <div className="row">
                    <div className="col-sm-6"><h3 className="mb-0"><i className="nav-icon bi bi-card-list"></i> Student Form 2 </h3><small><i>Daily Attendance Report of Learners</i></small></div>
                    <div className="col-sm-6">
                        <ol className="breadcrumb float-sm-end">
                            <li className="breadcrumb-item"> <i className="bi bi-speedometer mr-2"></i><Link href="/admin/dashboard">Dashboard</Link></li>
                            <li className="breadcrumb-item"> <i className="bi bi-card-list mr-2"></i><Link href="/admin/dashboard/advisory">Advisory</Link></li>
                            <li className="breadcrumb-item active" aria-current="page"><i className="bi bi-file-earmark-spreadsheet mr-2"></i>Student Form 2</li>
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
                                            <h3 className="card-title  mt-2"> <i className="bi bi-file-earmark-pdf"></i></h3> 
                                            {this.state.loading===true?<div className="spinner-grow text-primary" role="status">
                                                <span className="sr-only">Loading...</span>
                                            </div>:<></>}
                                        </div>
                                        <div className="col-lg-4">
                                            <div className="input-group">
                                                <span  className="input-group-text">Month</span>
                                                <input className="form-control" type="month" onChange={(e) => {
                                                    console.log(e.target.value);
                                                    this.setState({month: e.target.value,loading: true},() => {
                                                        this.fetchData();
                                                    });
                                                }} /> 
                                            </div> 
                                        </div>                                        
                                    </div>
                                </div>
                                <div className="card-body p-0"> 
                                    <object
                                        id="obj1"
                                        type="application/pdf"
                                        width="100%"
                                        height="100">
                                    </object>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
            
            <datalist id="selectedTeacher">
                <EachMethod of={this.state.teachers} render={(element,index) => {
                    return <option >{`${element.last_name}, ${element.first_name}`}</option>
                }} />
            </datalist>

            <datalist id="selectedYearLevel">
                <EachMethod of={this.state.yeargrade} render={(element,index) => {
                    return <option >{`${element.year_grade}`}</option>
                }} />
            </datalist>

            <datalist id="selectedSection"> 
                <EachMethod of={this.state.sectionList} render={(element,index) => {
                    return <option >{`${element.section_name}`}</option>
                }} />
            </datalist>

            <datalist id="selectedSY">
                <option >2025 - 2026</option>
            </datalist>

            <datalist id="selectedSubject"> 
                <EachMethod of={this.state.teachers} render={(element,index) => {
                    return <option >{`${element.last_name}, ${element.first_name}`}</option>
                }} />
            </datalist>

            <div className="modal fade" tabIndex="-1" role="dialog" id="newAdvisory" aria-hidden="true" data-bs-backdrop="static">
                <div className="modal-dialog" role="document">
                    <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title fs-5">New Advisory</h5>
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"> 
                        </button>
                    </div>
                    <div className="modal-body">
                        
                        <div className="card-body"> 
                            <div className="row g-3"> 
                                
                                <div className="col-md-12">
                                    <label htmlFor="teacher" className="form-label">Teacher</label>
                                    <input type="text" className="form-control" list="selectedTeacher" id="teacher" defaultValue="" required="" onChange={(e) => {  $("#teacher-alert").removeAttr('class').addClass('invalid-feedback'); this.setState({selectedTeacher: e.target.value})}}  />
                                    <div id="teacher-alert" className="invalid-feedback">Please select a valid state.</div>
                                </div>
                                <div className="col-md-12">
                                    <label htmlFor="yearlevel" className="form-label">Year Level</label>                                            
                                    {/* <input type="text" className="form-control" list="selectedYearLevel" id="yearlevel" defaultValue="" required=""   /> */}

                                    <select name="yearlevel" id="yearlevel" className="form-control" onChange={(e) => { 
                                         $("#teacher-alert").removeAttr('class').addClass('invalid-feedback'); 
                                         $('#section').val("");
                                         console.log(e.target.value)
                                         if(e.target.value != "") {
                                            this.setState({selectedYearLevel: e.target.value,sectionList: this.state.sectionListTemp.filter(ee => ee.year_grade_id==e.target.value)})  
                                         }
                                         }}>
                                        <EachMethod of={this.state.yeargrade} render={(element,index) => {
                                            return <option value={`${element.id}`} >{`${element.year_grade}`}</option>
                                        }} />
                                    </select>
                                    <div id="yearlevel-alert" className="invalid-feedback">Please select a valid state.</div>
                                </div>
                                <div className="col-md-12">
                                    <label htmlFor="section" className="form-label">Section</label>
                                    <input type="text" className="form-control" list="selectedSection" id="section" defaultValue="" required="" onChange={(e) => {  $("#teacher-alert").removeAttr('class').addClass('invalid-feedback'); this.setState({selectedSection: e.target.value})}}  />
                                    <div id="section-alert" className="invalid-feedback">Please select a valid state.</div>
                                </div>
                                <div className="col-md-12">
                                    <label htmlFor="schoolyear" className="form-label">School Year</label>
                                    <input type="text" className="form-control" list="selectedSY" id="schoolyear" defaultValue="" required="" onChange={(e) => {  $("#teacher-alert").removeAttr('class').addClass('invalid-feedback'); this.setState({selectedSY: e.target.value})}}  />
                                    <div id="schoolyear-alert" className="invalid-feedback">Please select a valid state.</div>
                                </div>
                                <div className="col-md-12">
                                    <label htmlFor="subject" className="form-label">Subject</label>
                                    <select className="form-select" id="subject" required="" onChange={(e) => {  $("#extension-name-alert").removeAttr('class').addClass('invalid-feedback'); this.setState({selectedSubject: e.target.value})}}  >
                                        <option disabled >Choose...</option>
                                        <option></option>
                                        <EachMethod of={this.state.subjects} render={(element,index) => {
                                            return <option value={element.id}>{element.subject_name}</option>
                                        }} />
                                    </select>
                                    <div id="extension-name-alert" className="invalid-feedback">Please select a valid state.</div>
                                </div>

                            </div> 
                        </div>

                    </div>
                    <div className="modal-footer"> 
                        <button className="btn btn-success float-right mr-1" onClick={() =>{ this.saveData() }}> <i className="bi bi-save"></i> Save</button>   
                        <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                    </div>
                    </div>
                </div>
            </div>

        </DashboardLayout>
    }
}