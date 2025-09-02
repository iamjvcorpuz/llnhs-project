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
            student_female_list: [],
            shcool_id: "",
            school_name: "",
            schoolRegistry: this.props.schoolRegistry,
            advisory: this.props.advisory,
            selectedMonthYear: ""
        } 
        this.loadPDF = this.loadPDF.bind(this);  
        this.fetchData = this.fetchData.bind(this);
        console.log(this.props)
    }

    componentDidMount() { 
        this.loadPDF();
        this._isMounted = true;
        let self = this;
        let selected = $("#data-list" ).select2({
            theme: "bootstrap",
            selectionCssClass: 'form-control',
            containerCssClass: 'form-control'
        });
        $('#data-list').on('select2:select', function (e) { 
            var selectedData = e.params.data; 
            // console.log(selectedData,e.params);
            let temp = self.state.class_list.find(e=>e.qrcode==selectedData.id);
            console.log(temp);
            self.setState({
                grade: temp.year_level,
                section: temp.section_name,
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
        console.log("loading pdf")
        try {
            let self = this;
            let sgv = "";
            let temp_data = [];
            if(self.state.selectedMonthYear == "") {

                Array.from({length:5}).forEach((e,x) => {
                    temp_data.push([ 
                        {
                            content:"",// grade level
                            styles: {halign: 'left',minWidth: 40,minCellHeight: 0,cellWidth:15,fontSize: 7}
                        },
                        {
                            content:"", // section
                            styles: {halign: 'left',minWidth: 40,minCellHeight: 0,cellWidth:30,fontSize: 7}
                        },
                        {
                            content:"", // name of adviser
                            styles: {halign: 'left',minWidth: 40,minCellHeight: 0,cellWidth:40,fontSize: 7}
                        },
                        {
                            content: "", // registered lerners
                            styles: {halign: 'center',minWidth: 0,minCellHeight: 0,cellWidth: 5,fontSize: 4}
                        },
                        {
                            content: "", // registered lerners
                            styles: {halign: 'center',minWidth: 0,minCellHeight: 0,cellWidth: 5,fontSize: 4}
                        },
                        {
                            content: "",// registered lerners
                            styles: {halign: 'center',minWidth: 0,minCellHeight: 0,cellWidth: 5,fontSize: 4}
                        },
                        {
                            content: "", // attendance da 
                            styles: {halign: 'center',minWidth: 5,minCellHeight: 0,cellWidth: 5,fontSize: 4}
                        },
                        {
                            content: "",// attendance da
                            styles: {halign: 'center',minWidth: 5,minCellHeight: 0,cellWidth: 5,fontSize: 4}
                        },
                        {
                            content: "",// attendance da
                            styles: {halign: 'center',minWidth: 5,minCellHeight: 0,cellWidth: 5,fontSize: 4}
                        },
                        {
                            content: "", // attendance pm
                            styles: {halign: 'center',minWidth: 0,minCellHeight: 0,cellWidth: 5,fontSize: 4}
                        },
                        {
                            content: "",// attendance pm
                            styles: {halign: 'center',minWidth: 0,minCellHeight: 0,cellWidth: 5,fontSize: 4}
                        },
                        {
                            content: "",// attendance pm
                            styles: {halign: 'center',minWidth: 0,minCellHeight: 0,cellWidth: 5,fontSize: 4}
                        },
                        {
                            content: "", // DROPPED OUT cpm
                            styles: {halign: 'center',minWidth: 0,minCellHeight: 0,cellWidth: 5,fontSize: 4}
                        },
                        {
                            content: "",// DROPPED OUT cpm
                            styles: {halign: 'center',minWidth: 0,minCellHeight: 0,cellWidth: 5,fontSize: 4}
                        },
                        {
                            content: "",// DROPPED OUT cpm
                            styles: {halign: 'center',minWidth: 0,minCellHeight: 0,cellWidth: 5,fontSize: 4}
                        },
                        {
                            content: "", // DROPPED OUT fm
                            styles: {halign: 'center',minWidth: 0,minCellHeight: 0,cellWidth: 5,fontSize: 4}
                        },
                        {
                            content: "",// DROPPED OUT fm
                            styles: {halign: 'center',minWidth: 0,minCellHeight: 0,cellWidth: 5,fontSize: 4}
                        },
                        {
                            content: "",// DROPPED OUT fm
                            styles: {halign: 'center',minWidth: 0,minCellHeight: 0,cellWidth: 5,fontSize: 4}
                        },
                        {
                            content: "", // DROPPED OUT cem
                            styles: {halign: 'center',minWidth: 0,minCellHeight: 0,cellWidth: 5,fontSize: 4}
                        },
                        {
                            content: "",// DROPPED OUT cem
                            styles: {halign: 'center',minWidth: 0,minCellHeight: 0,cellWidth: 5,fontSize: 4}
                        },
                        {
                            content: "",// DROPPED OUT cem
                            styles: {halign: 'center',minWidth: 0,minCellHeight: 0,cellWidth: 5,fontSize: 4}
                        },
                        {
                            content: "", // TRANSFERRED OUT cpm
                            styles: {halign: 'center',minWidth: 0,minCellHeight: 0,cellWidth: 5,fontSize: 4}
                        },
                        {
                            content: "",// TRANSFERRED OUT cpm
                            styles: {halign: 'center',minWidth: 0,minCellHeight: 0,cellWidth: 5,fontSize: 4}
                        },
                        {
                            content: "",// TRANSFERRED OUT cpm
                            styles: {halign: 'center',minWidth: 0,minCellHeight: 0,cellWidth: 5,fontSize: 4}
                        },
                        {
                            content: "", // TRANSFERRED OUT fm
                            styles: {halign: 'center',minWidth: 0,minCellHeight: 0,cellWidth: 5,fontSize: 4}
                        },
                        {
                            content: "",// TRANSFERRED OUT fm
                            styles: {halign: 'center',minWidth: 0,minCellHeight: 0,cellWidth: 5,fontSize: 4}
                        },
                        {
                            content: "",// TRANSFERRED OUT fm
                            styles: {halign: 'center',minWidth: 0,minCellHeight: 0,cellWidth: 5,fontSize: 4}
                        },
                        {
                            content: "", // TRANSFERRED OUT cem
                            styles: {halign: 'center',minWidth: 0,minCellHeight: 0,cellWidth: 5,fontSize: 4}
                        },
                        {
                            content: "",// TRANSFERRED OUT cem
                            styles: {halign: 'center',minWidth: 0,minCellHeight: 0,cellWidth: 5,fontSize: 4}
                        },
                        {
                            content: "",// TRANSFERRED OUT cem
                            styles: {halign: 'center',minWidth: 0,minCellHeight: 0,cellWidth: 5,fontSize: 4}
                        },
                        {
                            content: "", // TRANSFERRED IN cpm
                            styles: {halign: 'center',minWidth: 0,minCellHeight: 0,cellWidth: 5,fontSize: 4}
                        },
                        {
                            content: "",// TRANSFERRED IN cpm
                            styles: {halign: 'center',minWidth: 0,minCellHeight: 0,cellWidth: 5,fontSize: 4}
                        },
                        {
                            content: "",// TRANSFERRED IN cpm
                            styles: {halign: 'center',minWidth: 0,minCellHeight: 0,cellWidth: 5,fontSize: 4}
                        },
                        {
                            content: "", // TRANSFERRED IN fm
                            styles: {halign: 'center',minWidth: 0,minCellHeight: 0,cellWidth: 5,fontSize: 4}
                        },
                        {
                            content: "",// TRANSFERRED IN fm
                            styles: {halign: 'center',minWidth: 0,minCellHeight: 0,cellWidth: 5,fontSize: 4}
                        },
                        {
                            content: "",// TRANSFERRED IN fm
                            styles: {halign: 'center',minWidth: 0,minCellHeight: 0,cellWidth: 5,fontSize: 4}
                        },
                        {
                            content: "", // TRANSFERRED IN cem
                            styles: {halign: 'center',minWidth: 0,minCellHeight: 0,cellWidth: 5,fontSize: 4}
                        },
                        {
                            content: "",// TRANSFERRED IN cem
                            styles: {halign: 'center',minWidth: 0,minCellHeight: 0,cellWidth: 5,fontSize: 4}
                        },
                        {
                            content: "",// TRANSFERRED IN cem
                            styles: {halign: 'center',minWidth: 0,minCellHeight: 0,cellWidth: 5,fontSize: 4}
                        },
                        // {
                        //     content: "",
                        //     styles: {halign: 'center',minWidth: 0,minCellHeight: 0,cellWidth: 5,fontSize: 4}
                        // },
                        // {
                        //     content: "",
                        //     styles: {halign: 'center',minWidth: 0,minCellHeight: 0,cellWidth: 5,fontSize: 4}
                        // },
                        // {
                        //     content: "",
                        //     styles: {halign: 'center',minWidth: 0,minCellHeight: 0,cellWidth: 5,fontSize: 4}
                        // },
                        // {
                        //     content: "",
                        //     styles: {halign: 'center',minWidth: 0,minCellHeight: 0,cellWidth: 5,fontSize: 4}
                        // },
                        // {
                        //     content: "",
                        //     styles: {halign: 'center',minWidth: 0,minCellHeight: 0,cellWidth: 5,fontSize: 4}
                        // },
                        // {
                        //     content: "",
                        //     styles: {halign: 'center',minWidth: 0,minCellHeight: 0,cellWidth: 5,fontSize: 4}
                        // },
                        // {
                        //     content: "",
                        //     styles: {halign: 'center',minWidth: 0,minCellHeight: 0,cellWidth: 5,fontSize: 4}
                        // },
                        // {
                        //     content: "",
                        //     styles: {halign: 'center',minWidth: 0,minCellHeight: 0,cellWidth: 5,fontSize: 4}
                        // },
                        // {
                        //     content: "",
                        //     styles: {halign: 'center',minWidth: 0,minCellHeight: 0,cellWidth: 5,fontSize: 4}
                        // },
                        // {
                        //     content: "",
                        //     styles: {halign: 'center',minWidth: 0,minCellHeight: 0,cellWidth: 5,fontSize: 4}
                        // },
                        // {
                        //     content: "",
                        //     styles: {halign: 'center',minWidth: 0,minCellHeight: 0,cellWidth: 5,fontSize: 4}
                        // },
                        // {
                        //     content: "",
                        //     styles: {halign: 'center',minWidth: 0,minCellHeight: 0,cellWidth: 5,fontSize: 4}
                        // },
                        // {
                        //     content: "",
                        //     styles: {halign: 'center',minWidth: 0,minCellHeight: 0,cellWidth: 5,fontSize: 4}
                        // },
                        // {
                        //     content: "",
                        //     styles: {halign: 'center',minWidth: 0,minCellHeight: 0,cellWidth: 5,fontSize: 4}
                        // },
                        // {
                        //     content: "",
                        //     styles: {halign: 'center',minWidth: 0,minCellHeight: 0,cellWidth: 5,fontSize: 4}
                        // },
                        // {
                        //     content: "",
                        //     styles: {halign: 'center',minWidth: 0,minCellHeight: 0,fontSize: 4}
                        // },
                        // {
                        //     content: "",
                        //     styles: {halign: 'center',minWidth: 0,minCellHeight: 0,fontSize: 4}
                        // },
                        // {
                        //     content: "",
                        //     styles: {halign: 'center',minWidth: 0,minCellHeight: 0,fontSize: 4}
                        // },
                    ]);
                });

            }
            if(self.state.selectedMonthYear != "") {
                self.state.advisory.forEach(element => {
                    temp_data.push([ 
                        {
                            content: element.year_level,// grade level
                            styles: {halign: 'left',minWidth: 40,minCellHeight: 0,cellWidth:15,fontSize: 7}
                        },
                        {
                            content: element.section_name, // section
                            styles: {halign: 'left',minWidth: 40,minCellHeight: 0,cellWidth:30,fontSize: 7}
                        },
                        {
                            content:element.teacher_fullname, // name of adviser
                            styles: {halign: 'left',minWidth: 40,minCellHeight: 0,cellWidth:40,fontSize: 7}
                        },
                        {
                            content: "", // registered lerners
                            styles: {halign: 'center',minWidth: 0,minCellHeight: 0,cellWidth: 5,fontSize: 4}
                        },
                        {
                            content: "", // registered lerners
                            styles: {halign: 'center',minWidth: 0,minCellHeight: 0,cellWidth: 5,fontSize: 4}
                        },
                        {
                            content: "",// registered lerners
                            styles: {halign: 'center',minWidth: 0,minCellHeight: 0,cellWidth: 5,fontSize: 4}
                        },
                        {
                            content: "", // attendance da 
                            styles: {halign: 'center',minWidth: 5,minCellHeight: 0,cellWidth: 5,fontSize: 4}
                        },
                        {
                            content: "",// attendance da
                            styles: {halign: 'center',minWidth: 5,minCellHeight: 0,cellWidth: 5,fontSize: 4}
                        },
                        {
                            content: "",// attendance da
                            styles: {halign: 'center',minWidth: 5,minCellHeight: 0,cellWidth: 5,fontSize: 4}
                        },
                        {
                            content: "", // attendance pm
                            styles: {halign: 'center',minWidth: 0,minCellHeight: 0,cellWidth: 5,fontSize: 4}
                        },
                        {
                            content: "",// attendance pm
                            styles: {halign: 'center',minWidth: 0,minCellHeight: 0,cellWidth: 5,fontSize: 4}
                        },
                        {
                            content: "",// attendance pm
                            styles: {halign: 'center',minWidth: 0,minCellHeight: 0,cellWidth: 5,fontSize: 4}
                        },
                        {
                            content: "", // DROPPED OUT cpm
                            styles: {halign: 'center',minWidth: 0,minCellHeight: 0,cellWidth: 5,fontSize: 4}
                        },
                        {
                            content: "",// DROPPED OUT cpm
                            styles: {halign: 'center',minWidth: 0,minCellHeight: 0,cellWidth: 5,fontSize: 4}
                        },
                        {
                            content: "",// DROPPED OUT cpm
                            styles: {halign: 'center',minWidth: 0,minCellHeight: 0,cellWidth: 5,fontSize: 4}
                        },
                        {
                            content: "", // DROPPED OUT fm
                            styles: {halign: 'center',minWidth: 0,minCellHeight: 0,cellWidth: 5,fontSize: 4}
                        },
                        {
                            content: "",// DROPPED OUT fm
                            styles: {halign: 'center',minWidth: 0,minCellHeight: 0,cellWidth: 5,fontSize: 4}
                        },
                        {
                            content: "",// DROPPED OUT fm
                            styles: {halign: 'center',minWidth: 0,minCellHeight: 0,cellWidth: 5,fontSize: 4}
                        },
                        {
                            content: "", // DROPPED OUT cem
                            styles: {halign: 'center',minWidth: 0,minCellHeight: 0,cellWidth: 5,fontSize: 4}
                        },
                        {
                            content: "",// DROPPED OUT cem
                            styles: {halign: 'center',minWidth: 0,minCellHeight: 0,cellWidth: 5,fontSize: 4}
                        },
                        {
                            content: "",// DROPPED OUT cem
                            styles: {halign: 'center',minWidth: 0,minCellHeight: 0,cellWidth: 5,fontSize: 4}
                        },
                        {
                            content: "", // TRANSFERRED OUT cpm
                            styles: {halign: 'center',minWidth: 0,minCellHeight: 0,cellWidth: 5,fontSize: 4}
                        },
                        {
                            content: "",// TRANSFERRED OUT cpm
                            styles: {halign: 'center',minWidth: 0,minCellHeight: 0,cellWidth: 5,fontSize: 4}
                        },
                        {
                            content: "",// TRANSFERRED OUT cpm
                            styles: {halign: 'center',minWidth: 0,minCellHeight: 0,cellWidth: 5,fontSize: 4}
                        },
                        {
                            content: "", // TRANSFERRED OUT fm
                            styles: {halign: 'center',minWidth: 0,minCellHeight: 0,cellWidth: 5,fontSize: 4}
                        },
                        {
                            content: "",// TRANSFERRED OUT fm
                            styles: {halign: 'center',minWidth: 0,minCellHeight: 0,cellWidth: 5,fontSize: 4}
                        },
                        {
                            content: "",// TRANSFERRED OUT fm
                            styles: {halign: 'center',minWidth: 0,minCellHeight: 0,cellWidth: 5,fontSize: 4}
                        },
                        {
                            content: "", // TRANSFERRED OUT cem
                            styles: {halign: 'center',minWidth: 0,minCellHeight: 0,cellWidth: 5,fontSize: 4}
                        },
                        {
                            content: "",// TRANSFERRED OUT cem
                            styles: {halign: 'center',minWidth: 0,minCellHeight: 0,cellWidth: 5,fontSize: 4}
                        },
                        {
                            content: "",// TRANSFERRED OUT cem
                            styles: {halign: 'center',minWidth: 0,minCellHeight: 0,cellWidth: 5,fontSize: 4}
                        },
                        {
                            content: "", // TRANSFERRED IN cpm
                            styles: {halign: 'center',minWidth: 0,minCellHeight: 0,cellWidth: 5,fontSize: 4}
                        },
                        {
                            content: "",// TRANSFERRED IN cpm
                            styles: {halign: 'center',minWidth: 0,minCellHeight: 0,cellWidth: 5,fontSize: 4}
                        },
                        {
                            content: "",// TRANSFERRED IN cpm
                            styles: {halign: 'center',minWidth: 0,minCellHeight: 0,cellWidth: 5,fontSize: 4}
                        },
                        {
                            content: "", // TRANSFERRED IN fm
                            styles: {halign: 'center',minWidth: 0,minCellHeight: 0,cellWidth: 5,fontSize: 4}
                        },
                        {
                            content: "",// TRANSFERRED IN fm
                            styles: {halign: 'center',minWidth: 0,minCellHeight: 0,cellWidth: 5,fontSize: 4}
                        },
                        {
                            content: "",// TRANSFERRED IN fm
                            styles: {halign: 'center',minWidth: 0,minCellHeight: 0,cellWidth: 5,fontSize: 4}
                        },
                        {
                            content: "", // TRANSFERRED IN cem
                            styles: {halign: 'center',minWidth: 0,minCellHeight: 0,cellWidth: 5,fontSize: 4}
                        },
                        {
                            content: "",// TRANSFERRED IN cem
                            styles: {halign: 'center',minWidth: 0,minCellHeight: 0,cellWidth: 5,fontSize: 4}
                        },
                        {
                            content: "",// TRANSFERRED IN cem
                            styles: {halign: 'center',minWidth: 0,minCellHeight: 0,cellWidth: 5,fontSize: 4}
                        }
                    ]);
                });                   
            }
            const doc = new jsPDF({orientation: 'l',format: 'letter',compressPdf:true});
            doc.addFont('/fonts/arial/ARIALNB.TTF','Arial Narrow Bold', "bold");
            doc.addFont('/fonts/arial/ArialMdm.ttf','Arial Medium', "normal");
            let pageHeight = doc.internal.pageSize.height || doc.internal.pageSize.getHeight();
            let pageWidth = doc.internal.pageSize.width || doc.internal.pageSize.getWidth();
            // console.log(doc.getFontList());
            doc.addImage("/images/deped-d.png", "PNG", 5, 10, 24, 24);
            doc.setFont("Arial Medium", "normal"); 
            doc.setFontSize(15);
            doc.text("School Form 4 (SF4) Monthly Learner's Movement and Attendance", pageWidth / 2, 15,{align:'center'});
            doc.setFont("arial", "italic"); 
            doc.setFontSize(8);
            doc.text('(This replaces Form 3 & STS Form 4-Absenteeism and Dropout Profile)', pageWidth / 2, 20,{align:'center'});
            doc.setFont("Arial Medium", "normal"); 
            doc.setFontSize(9);
            doc.text('School ID : ' + self.state.schoolRegistry.school_id, 36.5, 26,{align:'left'});
            doc.text('Region : ' + self.state.schoolRegistry.region, 66, 26,{align:'left'});
            doc.text('Division : ' + self.state.schoolRegistry.division, 116, 26,{align:'left'});
            doc.text('District : ' + self.state.schoolRegistry.district, 176, 26,{align:'left'});

            doc.text('Name of School : ' + self.state.schoolRegistry.school_name, 28, 31,{align:'left'});
            doc.text('School Year : ' + self.props.sy, 176, 31,{align:'left'}); 
            doc.text('Report for the Month of : ' + self.state.selectedMonthYear, 221, 31,{align:'left'});

            doc.setFontSize(8);
            autoTable(doc,{ 
                theme: 'plain',
                startY: 39,
                margin: 4,
                useCss: true,
                head: [[
                    {
                        content: "GRADE/ YEAR LEVEL",
                        colSpan: 1,
                        rowSpan: 6,
                        styles: { halign: 'center', valign: 'middle',minCellHeight: 0, fontSize: 8,lineColor: 1,lineWidth: .01,cellPadding:1},
                    },
                    {
                        content: "SECTION",
                        colSpan: 1,
                        rowSpan: 6,
                        styles: { halign: 'center', valign: 'middle',minCellHeight: 0, fontSize: 8,lineColor: 1,lineWidth: .01},
                    },
                    {
                        content: "NAME OF ADVISER",
                        colSpan: 1,
                        rowSpan: 6,
                        styles: { halign: 'center', valign: 'middle',minCellHeight: 0, fontSize: 8,lineColor: 1,lineWidth: .01},
                    },
                    {
                        content: "REGISTERED LEARNERS (As of End of the Month)",
                        colSpan: 3,
                        rowSpan: 5,
                        styles: { halign: 'center',valign: 'middle',cellWidth: 6,minCellHeight: 40, fontSize: 6,lineColor: 1,lineWidth: .01,cellPadding:1},
                    },
                    {
                        content: "ATTENDANCE",
                        colSpan: 6,
                        rowSpan: 1,
                        styles: { halign: 'center', valign: 'middle',fontSize: 8,lineColor: 1,lineWidth: .01,cellWidth: 6,minCellHeight: 1,cellHeight: 2},
                    },
                    {
                        content: "DROPPED OUT",
                        colSpan: 9,
                        rowSpan: 1,
                        styles: { halign: 'center', valign: 'middle',fontSize: 8,lineColor: 1,lineWidth: .01,cellWidth: 6,minCellHeight: 1},
                    },
                    {
                        content: "TRANSFERRED OUT",
                        colSpan: 9,
                        rowSpan: 1,
                        styles: { halign: 'center', valign: 'middle',fontSize: 8,lineColor: 1,lineWidth: .01,cellWidth: 6,minCellHeight: 1},
                    },
                    {
                        content: "TRANSFERRED IN",
                        colSpan: 9,
                        rowSpan: 1,
                        styles: { halign: 'center', valign: 'middle',fontSize: 8,lineColor: 1,lineWidth: .01,cellWidth: 6,minCellHeight: 1},
                    }
                ],[
                    {
                        content: "Daily Average",
                        colSpan: 3,
                        rowSpan: 4,
                        styles: { halign: 'center', valign: 'middle',minCellHeight:53,cellWidth: 3, fontSize: 5},
                    },
                    {
                        content: "Percentage for the Month",
                        colSpan: 3,
                        rowSpan: 4,
                        styles: { halign: 'center', valign: 'middle',minCellHeight: 53,cellWidth: 3, fontSize: 5},
                    },
                    {
                        content: "(A) Cumulative as of Previous Month",
                        colSpan: 3,
                        rowSpan: 4,
                        styles: { halign: 'center', valign: 'middle',minCellHeight: 53,cellWidth: 3, fontSize: 4},
                    },
                    {
                        content: "(B) For the Month",
                        colSpan: 3,
                        rowSpan: 4,
                        styles: { halign: 'center', valign: 'middle',minCellHeight: 53,cellWidth: 3, fontSize: 4},
                    },
                    {
                        content: "(A+B) Cumulative as of End of the Month",
                        colSpan: 3,
                        rowSpan: 4,
                        styles: { halign: 'center', valign: 'middle',minCellHeight: 53,cellWidth: 3, fontSize: 4},
                    },
                    {
                        content: "(A) Cumulative as of Previous Month",
                        colSpan: 3,
                        rowSpan: 4,
                        styles: { halign: 'center', valign: 'middle',minCellHeight: 53,cellWidth: 3, fontSize: 4},
                    },
                    {
                        content: "(B) For the Month",
                        colSpan: 3,
                        rowSpan: 4,
                        styles: { halign: 'center', valign: 'middle',minCellHeight: 53,cellWidth: 3, fontSize: 4},
                    },
                    {
                        content: "(A+B) Cumulative as of End of the Month",
                        colSpan: 3,
                        rowSpan: 4,
                        styles: { halign: 'center', valign: 'middle',minCellHeight: 53,cellWidth: 3, fontSize: 4},
                    },
                    {
                        content: "(A) Cumulative as of Previous Month",
                        colSpan: 3,
                        rowSpan: 4,
                        styles: { halign: 'center', valign: 'middle',minCellHeight: 53,cellWidth: 3, fontSize: 4},
                    },
                    {
                        content: "(B) For the Month",
                        colSpan: 3,
                        rowSpan: 4,
                        styles: { halign: 'center', valign: 'middle',minCellHeight: 53,cellWidth: 3, fontSize: 4},
                    },
                    {
                        content: "(A+B) Cumulative as of End of the Month",
                        colSpan: 3,
                        rowSpan: 4,
                        styles: { halign: 'center', valign: 'middle',minCellHeight: 53,cellWidth: 3, fontSize: 4},
                    },
                ],[],[],[],[
                    {
                        content: "M",
                        styles: { halign: 'center', valign: 'middle',minCellHeight: 3, fontSize: 8},
                    },
                    {
                        content: "F",
                        styles: { halign: 'center', valign: 'middle',minCellHeight: 3, fontSize: 8},
                    },
                    {
                        content: "T",
                        styles: { halign: 'center', valign: 'middle',minCellHeight: 3, fontSize: 8},
                    },
                    {
                        content: "M",
                        styles: { halign: 'center', valign: 'middle',minCellHeight: 3, fontSize: 8},
                    },
                    {
                        content: "F",
                        styles: { halign: 'center', valign: 'middle',minCellHeight: 3, fontSize: 8},
                    },
                    {
                        content: "T",
                        styles: { halign: 'center', valign: 'middle',minCellHeight: 3, fontSize: 8},
                    },
                    {
                        content: "M",
                        styles: { halign: 'center', valign: 'middle',minCellHeight: 3, fontSize: 8},
                    },
                    {
                        content: "F",
                        styles: { halign: 'center', valign: 'middle',minCellHeight: 3, fontSize: 8},
                    },
                    {
                        content: "T",
                        styles: { halign: 'center', valign: 'middle',minCellHeight: 3, fontSize: 8},
                    },
                    {
                        content: "M",
                        styles: { halign: 'center', valign: 'middle',minCellHeight: 3, fontSize: 8},
                    },
                    {
                        content: "F",
                        styles: { halign: 'center', valign: 'middle',minCellHeight: 3, fontSize: 8},
                    },
                    {
                        content: "T",
                        styles: { halign: 'center', valign: 'middle',minCellHeight: 3, fontSize: 8},
                    },
                    {
                        content: "M",
                        styles: { halign: 'center', valign: 'middle',minCellHeight: 3, fontSize: 8},
                    },
                    {
                        content: "F",
                        styles: { halign: 'center', valign: 'middle',minCellHeight: 3, fontSize: 8},
                    },
                    {
                        content: "T",
                        styles: { halign: 'center', valign: 'middle',minCellHeight: 3, fontSize: 8},
                    },
                    {
                        content: "M",
                        styles: { halign: 'center', valign: 'middle',minCellHeight: 3, fontSize: 8},
                    },
                    {
                        content: "F",
                        styles: { halign: 'center', valign: 'middle',minCellHeight: 3, fontSize: 8},
                    },
                    {
                        content: "T",
                        styles: { halign: 'center', valign: 'middle',minCellHeight: 3, fontSize: 8},
                    },
                    {
                        content: "M",
                        styles: { halign: 'center', valign: 'middle',minCellHeight: 3, fontSize: 8},
                    },
                    {
                        content: "F",
                        styles: { halign: 'center', valign: 'middle',minCellHeight: 3, fontSize: 8},
                    },
                    {
                        content: "T",
                        styles: { halign: 'center', valign: 'middle',minCellHeight: 3, fontSize: 8},
                    },
                    {
                        content: "M",
                        styles: { halign: 'center', valign: 'middle',minCellHeight: 3, fontSize: 8},
                    },
                    {
                        content: "F",
                        styles: { halign: 'center', valign: 'middle',minCellHeight: 3, fontSize: 8},
                    },
                    {
                        content: "T",
                        styles: { halign: 'center', valign: 'middle',minCellHeight: 3, fontSize: 8},
                    },
                    {
                        content: "M",
                        styles: { halign: 'center', valign: 'middle',minCellHeight: 3, fontSize: 8},
                    },
                    {
                        content: "F",
                        styles: { halign: 'center', valign: 'middle',minCellHeight: 3, fontSize: 8},
                    },
                    {
                        content: "T",
                        styles: { halign: 'center', valign: 'middle',minCellHeight: 3, fontSize: 8},
                    },
                    {
                        content: "M",
                        styles: { halign: 'center', valign: 'middle',minCellHeight: 3, fontSize: 8},
                    },
                    {
                        content: "F",
                        styles: { halign: 'center', valign: 'middle',minCellHeight: 3, fontSize: 8},
                    },
                    {
                        content: "T",
                        styles: { halign: 'center', valign: 'middle',minCellHeight: 3, fontSize: 8},
                    },
                    {
                        content: "M",
                        styles: { halign: 'center', valign: 'middle',minCellHeight: 3, fontSize: 8},
                    },
                    {
                        content: "F",
                        styles: { halign: 'center', valign: 'middle',minCellHeight: 3, fontSize: 8},
                    },
                    {
                        content: "T",
                        styles: { halign: 'center', valign: 'middle',minCellHeight: 3, fontSize: 8},
                    },
                    {
                        content: "M",
                        styles: { halign: 'center', valign: 'middle',minCellHeight: 3, fontSize: 8},
                    },
                    {
                        content: "F",
                        styles: { halign: 'center', valign: 'middle',minCellHeight: 3, fontSize: 8},
                    },
                    {
                        content: "T",
                        styles: { halign: 'center', valign: 'middle',minCellHeight: 3, fontSize: 8},
                    }
                ]],
                headStyles: {lineColor: 1,lineWidth: .01,minCellHeight: 0,cellPadding: 0},
                styles: { fontSize: 8, lineColor: 1,lineWidth: .01},
                body: temp_data,
                didDrawCell: function (data) {
                    if (data.column.index == 0 && data.row.index < 5 && data.row.section === 'body') { // data.row.index >= 2 && 
                        // console.log(data)
                        // data.cell.styles.cellWidth = 12;
                        // data.row.raw[0].styles.width = 12;
                        // autoTable(doc,{
                        //     startY: data.cell.y + 2,
                        //     margin: { left: data.cell.x + 2 },
                        //     tableWidth: data.cell.width - 4,
                        //     styles: {
                        //       maxCellHeight: 4,
                        //     },
                        //     columns: [
                        //       { dataKey: 'id', header: 'ID' },
                        //       { dataKey: 'name', header: 'Name' },
                        //       { dataKey: 'expenses', header: 'Sum' },
                        //     ],
                        //     body: bodyRows(),
                        // })
                    }
                }
            });
            let t1y = doc.internal.getNumberOfPages();
            const startY = doc.lastAutoTable.finalY + 5;
            // const startY = 12;
            // doc.addPage({orientation: 'l',format: 'letter',compressPdf:true});


            let startY_ = doc.lastAutoTable.finalY + 5;

            const pageHeight_ = doc.internal.pageSize.height;
            const bottomMargin = 20;

            if (startY_ > pageHeight_ - bottomMargin) {
                doc.addPage();
                startY_ = doc.lastAutoTable.finalY - 25;
                // startY_ = 5;
            }

            // -------------------------------------
            doc.setFont("Arial Narrow Bold", "bold");
            doc.text('GUIDELINES: ', 5, startY_ + 2,{align:'left'});
            doc.setFont("Helvetica",""); 
            doc.setFontSize(6);
            doc.text("1. This form shall be accomplished every end of the month using the summary box of SF2 submitted by the teachers/advisers to update figures for the month.", 5, startY_ + 5,{align:'left'});
            doc.text("2. Furnish the Division Office with a copy a week after June 30, October 30 & March 31", 5, startY_ + 8,{align:'left'}); 

        

            doc.setFont("Helvetica","italic"); 
            doc.setFontSize(8);
            doc.text("Prepared and Submitted by:", 180, startY_ + 4,{align:'left'});

            doc.text(self.state.schoolRegistry.head_name, 235, startY_ + 10,{align:'center'}); 
            doc.text(self.state.schoolRegistry.head_position, 235, startY_ + 14,{align:'center'}); 

            doc.text("(Signature of School Head over Printed Name)", 205, startY_ + 19,{align:'left'}); 

            doc.line(195, startY_ + 16, 265, startY_ + 16);
 
            
            // doc.text(String(t1y), 34, startY_ + 16,{align:'left'});
            // doc.text("School Form 2 : Page ___ of ________", 4, startY_ + 17,{align:'left'});


            const totalPages = doc.internal.getNumberOfPages();
            for (let i = 1; i <= totalPages; i++) {
                doc.setPage(i);
                doc.setFontSize(10); // Set desired font size 
                const pageNumberText = `School Form 2 :  Page ${i} of ${totalPages}`;
                // Adjust x and y coordinates to position the page number (e.g., footer) 
                if(totalPages == i) {
                    doc.text(pageNumberText, 4, startY_ + 17);
                } else {
                    doc.text(pageNumberText, 4, doc.internal.pageSize.height - 2);
                }
            }

            $("#obj1").height(window.innerHeight - 8);
            $("#frame1").height(window.innerHeight - 8);
            // $('#frame1').attr('src',doc.output("datauristring") + '#view=Fit&toolbar=0'); 
        
            // $('#obj1').attr('data',doc.output("datauristring")+ '#view=Fit&toolbar=1');
            $('#obj1').attr('data',doc.output("bloburl") + '#view=Fit&toolbar=1'); 
            // $('#obj1').attr('data',doc.output("datauristring"));
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

    fetchData() {
        let self = this;
        this.loadPDF();
        // console.log(self.state.selectedQr,self.state.selectedMonthYear) 
        // getWeeksInMonth(self.state.selectedMonthYear,(c) => {
        //     const getWeeksInMonth_ = c;
        //     console.log(getWeeksInMonth_)
        //     self.setState({getWeeksInMonth:getWeeksInMonth_},() => {
        //         axios.post(`/admin/sf2/${self.state.selectedQr}`,{code:self.state.selectedQr,month: self.state.selectedMonthYear}).then(function (response) {
        //             // console.log(response);
        //             if( typeof(response.status) != "undefined" && response.status == "200" ) {
        //                 let data = typeof(response.data) != "undefined" && typeof(response.data)!="undefined"?response.data:{};
        //                 if(Object.keys(data).length>0) {
        //                     self.setState({
        //                         student_list: data.studentsList,
        //                         loading: false
        //                     },() => {

        //                         self.generateData(data.sf2_data);
        //                     });
        //                 }
        //             }
        //         }); 
        //     }); 
        // });
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
                    <div className="col-sm-9">
                        <h3 className="mb-0"><i className="nav-icon bi bi-calendar-month"></i> Monthly Learner's Movement and Attendance</h3>
                        <small>School Form 4 (SF4)</small>
                    </div>
                    <div className="col-sm-3">
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

                                {/* <div className="col-lg-9">

                                    <div className="form-group">
                                        <label >Select Class Section</label>
                                        <select id="data-list" className="form-control">
                                            <option></option> 
                                            <EachMethod of={this.state.class_list} render={(element,index) => {
                                                return <option value={element.qrcode} >{`${element.section_name} (${element.teacher_fullname}) - ${element.year_level} - ${element.school_year}`}</option>
                                            }} />
                                        </select>
                                    </div>

                                </div> */}

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
