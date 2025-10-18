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
                            content: (typeof(element.student_male_list)!="undefined")?element.student_male_list.length:0, // registered lerners
                            styles: {halign: 'center',minWidth: 0,minCellHeight: 0,cellWidth: 5,fontSize: 6,cellPadding:0,valign: "middle"}
                        },
                        {
                            content: (typeof(element.student_female_list)!="undefined")?element.student_female_list.length:0, // registered lerners
                            styles: {halign: 'center',minWidth: 0,minCellHeight: 0,cellWidth: 5,fontSize: 6,cellPadding:0,valign: "middle"}
                        },
                        {
                            content: (typeof(element.student_female_list)!="undefined")?element.student_female_list.length+element.student_male_list.length:0,// registered lerners
                            styles: {halign: 'center',minWidth: 0,minCellHeight: 0,cellWidth: 5,fontSize: 6,cellPadding:0,valign: "middle"}
                        },
                        {
                            content: (typeof(element.ADAM)!="undefined")?element.ADAM:0, // attendance da 
                            styles: {halign: 'center',minWidth: 5,minCellHeight: 0,cellWidth: 5,fontSize: 4,cellPadding:0,valign: "middle"}
                        },
                        {
                            content: (typeof(element.ADAM)!="undefined")?element.ADAF:0,// attendance da
                            styles: {halign: 'center',minWidth: 5,minCellHeight: 0,cellWidth: 5,fontSize: 4,cellPadding:0,valign: "middle"}
                        },
                        {
                            content: (typeof(element.ADATOTAL)!="undefined")?element.ADATOTAL:0,// attendance da
                            styles: {halign: 'center',minWidth: 5,minCellHeight: 0,cellWidth: 5,fontSize: 4,cellPadding:0,valign: "middle"}
                        },
                        {
                            content: (typeof(element.PAMM)!="undefined")?element.PAMM:0, // attendance pm
                            styles: {halign: 'center',minWidth: 0,minCellHeight: 0,cellWidth: 5,fontSize: 6,cellPadding:0,valign: "middle"}
                        },
                        {
                            content: (typeof(element.PAMF)!="undefined")?element.PAMF:0,// attendance pm
                            styles: {halign: 'center',minWidth: 0,minCellHeight: 0,cellWidth: 5,fontSize: 6,cellPadding:0,valign: "middle"}
                        },
                        {
                            content: (typeof(element.PAMTOTAL)!="undefined")?element.PAMTOTAL:0,// attendance pm
                            styles: {halign: 'center',minWidth: 0,minCellHeight: 0,cellWidth: 5,fontSize: 6,cellPadding:0,valign: "middle"}
                        },
                        {
                            content: (typeof(element.dropMOutA)!="undefined")?element.dropMOutA:0, // DROPPED OUT cpm
                            styles: {halign: 'center',minWidth: 0,minCellHeight: 0,cellWidth: 5,fontSize: 4,cellPadding:0,valign: "middle"}
                        },
                        {
                            content: (typeof(element.dropFOutA)!="undefined")?element.dropFOutA:0,// DROPPED OUT cpm
                            styles: {halign: 'center',minWidth: 0,minCellHeight: 0,cellWidth: 5,fontSize: 4,cellPadding:0,valign: "middle"}
                        },
                        {
                            content: (typeof(element.dropMOutA)!="undefined")?element.dropMOutA+element.dropFOutA:0,// DROPPED OUT cpm
                            styles: {halign: 'center',minWidth: 0,minCellHeight: 0,cellWidth: 5,fontSize: 4,cellPadding:0,valign: "middle"}
                        },
                        {
                            content: (typeof(element.dropMOutB)!="undefined")?element.dropMOutB:0, // DROPPED OUT fm
                            styles: {halign: 'center',minWidth: 0,minCellHeight: 0,cellWidth: 5,fontSize: 4,cellPadding:0,valign: "middle"}
                        },
                        {
                            content: (typeof(element.dropFOutB)!="undefined")?element.dropFOutB:0,// DROPPED OUT fm
                            styles: {halign: 'center',minWidth: 0,minCellHeight: 0,cellWidth: 5,fontSize: 4,cellPadding:0,valign: "middle"}
                        },
                        {
                            content: (typeof(element.dropFOutB)!="undefined")?element.dropFOutB+element.dropMOutB:0,// DROPPED OUT fm
                            styles: {halign: 'center',minWidth: 0,minCellHeight: 0,cellWidth: 5,fontSize: 4,cellPadding:0,valign: "middle"}
                        },
                        {
                            content: (typeof(element.dropMOutAB)!="undefined")?element.dropMOutAB:0, // DROPPED OUT cem
                            styles: {halign: 'center',minWidth: 0,minCellHeight: 0,cellWidth: 5,fontSize: 4,cellPadding:0,valign: "middle"}
                        },
                        {
                            content: (typeof(element.dropFOutAB)!="undefined")?element.dropFOutAB:0,// DROPPED OUT cem
                            styles: {halign: 'center',minWidth: 0,minCellHeight: 0,cellWidth: 5,fontSize: 4,cellPadding:0,valign: "middle"}
                        },
                        {
                            content: (typeof(element.dropMOutAB)!="undefined")?element.dropMOutAB+element.dropFOutAB:0,// DROPPED OUT cem
                            styles: {halign: 'center',minWidth: 0,minCellHeight: 0,cellWidth: 5,fontSize: 4,cellPadding:0,valign: "middle"}
                        },
                        {
                            content: (typeof(element.transferMOutA)!="undefined")?element.transferMOutA:0, // TRANSFERRED OUT cpm
                            styles: {halign: 'center',minWidth: 0,minCellHeight: 0,cellWidth: 5,fontSize: 4,cellPadding:0,valign: "middle"}
                        },
                        {
                            content: (typeof(element.transferFOutA)!="undefined")?element.transferFOutA:0,// TRANSFERRED OUT cpm
                            styles: {halign: 'center',minWidth: 0,minCellHeight: 0,cellWidth: 5,fontSize: 4,cellPadding:0,valign: "middle"}
                        },
                        {
                            content: (typeof(element.transferMOutA)!="undefined")?element.transferMOutA+element.transferFOutA:0,// TRANSFERRED OUT cpm
                            styles: {halign: 'center',minWidth: 0,minCellHeight: 0,cellWidth: 5,fontSize: 4,cellPadding:0,valign: "middle"}
                        },
                        {
                            content: (typeof(element.transferMOutB)!="undefined")?element.transferMOutB:0, // TRANSFERRED OUT fm
                            styles: {halign: 'center',minWidth: 0,minCellHeight: 0,cellWidth: 5,fontSize: 4,cellPadding:0,valign: "middle"}
                        },
                        {
                            content: (typeof(element.transferFOutB)!="undefined")?element.transferMOutB:0,// TRANSFERRED OUT fm
                            styles: {halign: 'center',minWidth: 0,minCellHeight: 0,cellWidth: 5,fontSize: 4,cellPadding:0,valign: "middle"}
                        },
                        {
                            content: (typeof(element.transferFOutB)!="undefined")?element.transferMOutB+element.transferFOutB:0,// TRANSFERRED OUT fm
                            styles: {halign: 'center',minWidth: 0,minCellHeight: 0,cellWidth: 5,fontSize: 4,cellPadding:0,valign: "middle"}
                        },
                        {
                            content: (typeof(element.transferFOutAB)!="undefined")?element.transferMOutAB:0, // TRANSFERRED OUT cem
                            styles: {halign: 'center',minWidth: 0,minCellHeight: 0,cellWidth: 5,fontSize: 4,cellPadding:0,valign: "middle"}
                        },
                        {
                            content: (typeof(element.transferFOutAB)!="undefined")?element.transferFOutAB:0,// TRANSFERRED OUT cem
                            styles: {halign: 'center',minWidth: 0,minCellHeight: 0,cellWidth: 5,fontSize: 4,cellPadding:0,valign: "middle"}
                        },
                        {
                            content: (typeof(element.transferFOutAB)!="undefined")?element.transferMOutAB+element.transferFOutAB:0,// TRANSFERRED OUT cem
                            styles: {halign: 'center',minWidth: 0,minCellHeight: 0,cellWidth: 5,fontSize: 4,cellPadding:0,valign: "middle"}
                        },
                        {
                            content: (typeof(element.transferMInA)!="undefined")?element.transferMInA:0, // TRANSFERRED IN cpm
                            styles: {halign: 'center',minWidth: 0,minCellHeight: 0,cellWidth: 5,fontSize: 4,cellPadding:0,valign: "middle"}
                        },
                        {
                            content: (typeof(element.transferFInA)!="undefined")?element.transferFInA:0,// TRANSFERRED IN cpm
                            styles: {halign: 'center',minWidth: 0,minCellHeight: 0,cellWidth: 5,fontSize: 4,cellPadding:0,valign: "middle"}
                        },
                        {
                            content: (typeof(element.transferMInA)!="undefined")?element.transferMInA+element.transferFInA:0,// TRANSFERRED IN cpm
                            styles: {halign: 'center',minWidth: 0,minCellHeight: 0,cellWidth: 5,fontSize: 4,cellPadding:0,valign: "middle"}
                        },
                        {
                            content: (typeof(element.transferMInB)!="undefined")?element.transferMInB:0, // TRANSFERRED IN fm
                            styles: {halign: 'center',minWidth: 0,minCellHeight: 0,cellWidth: 5,fontSize: 4,cellPadding:0,valign: "middle"}
                        },
                        {
                            content: (typeof(element.transferFInB)!="undefined")?element.transferFInB:0,// TRANSFERRED IN fm
                            styles: {halign: 'center',minWidth: 0,minCellHeight: 0,cellWidth: 5,fontSize: 4,cellPadding:0,valign: "middle"}
                        },
                        {
                            content: (typeof(element.transferMInB)!="undefined")?element.transferMInB+element.transferFInB:0,// TRANSFERRED IN fm
                            styles: {halign: 'center',minWidth: 0,minCellHeight: 0,cellWidth: 5,fontSize: 4,cellPadding:0,valign: "middle"}
                        },
                        {
                            content: (typeof(element.transferMInAB)!="undefined")?element.transferMInAB:0, // TRANSFERRED IN cem
                            styles: {halign: 'center',minWidth: 0,minCellHeight: 0,cellWidth: 5,fontSize: 4,cellPadding:0,valign: "middle"}
                        },
                        {
                            content: (typeof(element.transferFInAB)!="undefined")?element.transferFInAB:0,// TRANSFERRED IN cem
                            styles: {halign: 'center',minWidth: 0,minCellHeight: 0,cellWidth: 5,fontSize: 4,cellPadding:0,valign: "middle"}
                        },
                        {
                            content: (typeof(element.transferMInAB)!="undefined")?element.transferMInAB+element.transferFInAB:0,// TRANSFERRED IN cem
                            styles: {halign: 'center',minWidth: 0,minCellHeight: 0,cellWidth: 5,fontSize: 4,cellPadding:0,valign: "middle"}
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
            doc.text('Report for the Month of : ' + ((self.state.selectedMonthYear!="")?moment(self.state.selectedMonthYear,'YYYY-MM').format('MMMM YYYY'):""), 221, 31,{align:'left'});

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

    fetchData() {
        let self = this;
        // this.loadPDF();
        // console.log(self.state.selectedQr,self.state.selectedMonthYear) 
        getWeeksInMonth(self.state.selectedMonthYear,(c) => {
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
            self.setState({getWeeksInMonth:getWeeksInMonth_,totalDaysAttendance: total_days},() => {
                axios.post(`/admin/sf4/`,{code:self.state.selectedQr,month: self.state.selectedMonthYear}).then(function (response) {
                    // console.log(response);
                    if( typeof(response.status) != "undefined" && response.status == "200" ) {
                        let data = typeof(response.data) != "undefined" && typeof(response.data)!="undefined"?response.data:{};
                        if(Object.keys(data).length>0) {
                            self.setState({
                                loading: false
                            },() => {
                                self.generateData(data.data);
                            });
                        }
                    }
                }); 
            }); 
        });
    }

    generateData(data_) {
        // console.log(data)
        // console.log(this.state.getWeeksInMonth);
        let self = this;
        let advisory_list = [];

        data_.forEach((main_val,main_i,main_arr) => {
            let data = main_val.logs;
            const student = main_val.student;
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
           
    
            let PAMM = (((student_male_total_daily_present / total_days) / self.state.RegisteredLearnersM ) * 100);
            let PAMF = (((student_female_total_daily_present / total_days) / self.state.RegisteredLearnersF ) * 100);
            let ADAM = (student_male_total_daily_present / self.state.totalDaysAttendance);
            let ADAF = (student_female_total_daily_present / self.state.totalDaysAttendance);
            let PAMTOTAL = ((PAMM + PAMF) / 2);

            if(ADAM=="NaN") {
                ADAM = 0;
            }
            if(ADAF=="NaN") {
                ADAF = 0;
            }
            
            advisory_list.push({
                ...main_val.advisory,
                student_list: student_list,
                student_male_list: student_list.filter(e => e.sex=="Male"),
                student_female_list: student_list.filter(e => e.sex=="Female"),
                student_male_total_daily: student_male_total_daily,
                student_female_total_daily: student_female_total_daily,
                PAMM: (PAMM.toFixed(2) != "NaN")?PAMM.toFixed(2):0,
                PAMF: (PAMF.toFixed(2) != "NaN")?PAMF.toFixed(2):0,
                PAMTOTAL: (PAMTOTAL.toFixed(2) != "NaN")?PAMTOTAL:0,
                ADAM: (ADAM != "NaN")?ADAM.toFixed(0):0,
                ADAF: (ADAF != "NaN")?ADAF.toFixed(0):0,
                ADATOTAL: ((ADAM + ADAF).toFixed(2)!="NaN")?(ADAM + ADAF).toFixed(0):0,
                NSAM: total_male_5_absent,
                NSAF: total_female_5_absent,
                dropMOutA: 0,
                dropFOutA: 0,
                dropMOutB: 0,
                dropFOutB: 0,
                dropMOutAB: 0,
                dropFOutAB: 0,
                transferMOutA: 0,
                transferFOutA: 0,
                transferMOutB: 0,
                transferFOutB: 0,
                transferMOutAB: 0,
                transferFInAB: 0,
                transferMInA: 0,
                transferFInA: 0,
                transferMInB: 0,
                transferFInB: 0,
                transferMInAB: 0, 
            });
    
            if((main_i + 1) == main_arr.length) { 
                self.setState({
                    advisory:advisory_list
                },() => {
                    self.loadPDF();
                });
            }

        });



        



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
