import React,{ Component } from "react";
import { Head, Link } from '@inertiajs/react';
import { EachMethod } from '@/Components/EachMethod';
import swal from 'sweetalert';
import Swal from 'sweetalert2';
import axios from 'axios'; 
import ReactTable from "@/Components/ReactTable"; 

import {capitalizeWords,getWeeksInMonth,sortFullnameAZ} from "@/Components/commonFunctions";

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
import jsPDF from 'jspdf';
// import 'jspdf-autotable'; 
import { autoTable } from 'jspdf-autotable';
import QRCode from 'qrcode';

export default class SF2 extends Component {
    constructor(props) {
		super(props);
        this.state = {

            class_list: this.props.advisory,
            subjects: this.props.subjects, 
            teachers: this.props.teacher,
            advisoryList: this.props.advisory,
            sectionListTemp: this.props.sections,
            sectionList: [],
            yeargrade: this.props.schoolyeargrades,

            code: "",
            lrn: "",
            picture: "",
            fullname1: "",
            lastname: "",
            track_strand: "",
            grade: "",
            section: "",
            sy: "",
            guardianname:"",
            relationship: "",
            guardiancontact: "",
            address: "",
            list: [],
            student_list: [],
            employee_list: this.props.employee,
            data_list: [],
            monthYear: typeof(this.props.result)!="undefined"&&typeof(this.props.result.date)!="undefined"?this.props.result.date:"",
            loading: false,
            queryType: "student",
            selectedQr: typeof(this.props.result)!="undefined"&&typeof(this.props.result.qrcode)!="undefined"?this.props.result.qrcode:"",
            selectedID: "",
            student_male_list: [],
            student_female_list: []
        } 
        this.loadPDF = this.loadPDF.bind(this); 
        this.loadPDFTest = this.loadPDFTest.bind(this);
        this.fetchData = this.fetchData.bind(this);
        console.log(this.props)
    }

    componentDidMount() { 
        // this.loadPDF();
        this._isMounted = true;
        let self = this;
        let selected = $("#data-list" ).select2({
            theme: "bootstrap",
            selectionCssClass: 'form-control',
            containerCssClass: 'form-control'
        });
        $('#data-list').on('select2:select', function (e) { 
            var selectedData = e.params.data; 
            console.log(selectedData,e.params);
            self.setState({
                selectedQr: selectedData.id
            }) 
        });
        // if(this.state.queryType == "student") { 
        //     this.setState({data_list: this.state.student_list},() => {
        //         selected.val(this.state.selectedQr).trigger('change'); 
        //     });
        // }
        // getWeeksInMonth('2025-07',(getWeeksInMonth_) => {
        //     console.log(getWeeksInMonth_);
        //     this.setState({getWeeksInMonth:getWeeksInMonth_})
        //     setTimeout(() => {
        //         this.loadPDFTest();
        //         this.setState({loading: false})
        //     }, 2000);
        // });
    }
    
    async loadPDF() {
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
            doc.text('School ID : ', 36.5, 26,{align:'left'});
            doc.text('School Year : ', 96, 26,{align:'left'});
            doc.text('Report for the Month of : ', 161, 26,{align:'left'});
            doc.text('Name of School : ', 28, 31,{align:'left'});
            doc.text('Grade Level : ', 176, 31,{align:'left'});
            doc.text('Section : ', 216, 31,{align:'left'});

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
            doc.text('School ID : ', 36.5, 26,{align:'left'});
            doc.text('School Year : ', 96, 26,{align:'left'});
            doc.text('Report for the Month of : ', 161, 26,{align:'left'});
            doc.text('Name of School : ', 28, 31,{align:'left'});
            doc.text('Grade Level : ', 176, 31,{align:'left'});
            doc.text('Section : ', 216, 31,{align:'left'});

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
 
    selectedMonthYear(val) {
        // console.log("val",val);
        this.setState({selectedMonthYear: val});
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
                    console.log("aw",response.data.status,data);
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

    fetchData() {
        let self = this;
        console.log(self.state.selectedQr,self.state.selectedMonthYear) 
        getWeeksInMonth(self.state.selectedMonthYear,(c) => {
            const getWeeksInMonth_ = c;
            console.log(getWeeksInMonth_)
            this.setState({getWeeksInMonth:getWeeksInMonth_},() => {
                axios.post(`/admin/sf2/${self.state.selectedQr}`,{code:self.state.selectedQr,month: self.state.selectedMonthYear}).then(function (response) {
                    console.log(response);
                    if( typeof(response.status) != "undefined" && response.status == "200" ) {
                        let data = typeof(response.data) != "undefined" && typeof(response.data)!="undefined"?response.data:{};
                        if(Object.keys(data).length>0) {
                            self.setState({
                                student_list: data.studentsList,
                                loading: false
                            },() => {

                                self.generateData(data.sf2_data);
                            });
                        }
                    }
                }); 
            }); 
        });


    }
    generateData(data) {
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

    
    render() {
        return <DashboardLayout title="Attendance" user={this.props.auth.user} profile={this.props.auth.profile}>
            <div className="app-content-header"> 
                <div className="container-fluid"> 
                    <div className="row">
                    <div className="col-sm-6">
                        <h3 className="mb-0"><i className="nav-icon bi bi-calendar-month"></i> Daily Attendance Report of Learners</h3>
                        <small>School Form 2 (SF2) </small>
                    </div>
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

                                <div className="col-lg-9">

                                    <div className="form-group">
                                        <label >Select Class Section</label>
                                        <select id="data-list" className="form-control">
                                            <option></option> 
                                            <EachMethod of={this.state.class_list} render={(element,index) => {
                                                return <option value={element.qrcode} >{`${element.section_name} (${element.teacher_fullname}) - ${element.year_level} - ${element.school_year}`}</option>
                                            }} />
                                        </select>
                                    </div>

                                </div>

                                <div className="col-lg-2">
                                    <div className="form-group">
                                        <label >Month</label>
                                        <input type="month" className="form-control" defaultValue={this.state.monthYear} onChange={(e) => this.selectedMonthYear(e.target.value)} /> 
                                    </div> 
                                </div>

                                <div className="col-lg-1">
                                    <br />
                                    <button className="btn btn-primary" onClick={() => {
                                        this.fetchData();
                                    }}>
                                        <i className="bi bi-search"></i>
                                    </button>
                                </div>
                            </div>

                        </div>
                        <div className="card-body p-0">

                            <div className="row">
                                <div className="col-lg-12">
                                    <div className="" >
                                        <object
                                            id="obj1"
                                            type="application/pdf"
                                            width="100%"
                                            height="100">
                                            {/* <iframe
                                                id="frame1"
                                                src="#view=FitH&toolbar=0"
                                                width="100%"
                                                height="100%"
                                            ></iframe> */}
                                        </object>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>

        </DashboardLayout>}
}
