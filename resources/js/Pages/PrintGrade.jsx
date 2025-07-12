import React,{ Component } from "react";
import { Link } from '@inertiajs/react';
import { EachMethod } from '@/Components/EachMethod'
import swal from 'sweetalert';
import Swal from 'sweetalert2';

// import QRCode from "react-qr-code";
import ReactTable from "@/Components/ReactTable"; 
import {getAge} from "@/Components/commonFunctions"; 

import DashboardLayout from '@/Layouts/DashboardLayout';
import jsPDF from 'jspdf';
import 'jspdf-autotable'; 
import QRCode from 'qrcode';
import { autoTable } from 'jspdf-autotable';

export default class PrintGrade extends Component {
    constructor(props) {
		super(props);
        this.state = {
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
            list: this.props.grades,
            getSchoolStats: typeof(this.props.data.getSchoolStats)!="undefined"&&this.props.data.getSchoolStats.length>0?this.props.data.getSchoolStats[0]:{},
            studentDetails: this.props.data.student,
            school: this.props.data.school
        }
        $('body').attr('class', '');
        this.generate = this.generate.bind(this);
        console.log(this.props)
    }

    componentDidMount() {
        $("#frame1").height(0);
        Swal.fire({
            title: "Generating Grade. Please wait.", 
            showCancelButton: false,
            showConfirmButton: false,
            allowOutsideClick: false,
            allowEscapeKey: false,
            confirmButtonText: "Download", 
            cancelButtonText: "Close",
            icon: "info",
            showLoaderOnConfirm: false, 
            closeOnClickOutside: false,  
            dangerMode: true,
            didOpen: () => {
                Swal.showLoading();
            }
        });
        
        try {
            setTimeout(() => {
                this.generate();
            }, 2000);
        } catch (error) {
            console.log(error); 
        }

    }
    
    async generate() {
        Swal.close();
        try {
            let self = this;
            let sgv = ""; 
            const width = 210.1;
            let lrn = self.state.getSchoolStats.lrn;
            let fullname = self.state.getSchoolStats.last_name + ", " + self.state.getSchoolStats.first_name + ((self.state.getSchoolStats.extension_name!=null)?" " + self.state.getSchoolStats.extension_name:" ") + self.state.getSchoolStats.middle_name;
            let age = await getAge(self.state.studentDetails.bdate);
            let sex = self.state.getSchoolStats.sex;
            let sy  = self.state.getSchoolStats.sy;
            let gs = self.state.getSchoolStats.grade + " " + self.state.getSchoolStats.section;

            const doc = new jsPDF({compressPdf:true});
            doc.addFont('/fonts/arial/ARIALNB.TTF','Arial Narrow Bold', "bold");
            doc.addFont('/fonts/arial/ArialMdm.ttf','Arial Medium', "normal");
            let pageHeight = doc.internal.pageSize.height || doc.internal.pageSize.getHeight();
            let pageWidth = doc.internal.pageSize.width || doc.internal.pageSize.getWidth(); 

            doc.addImage("/images/ic_launcher.png", "PNG", 169, 10, 24, 24);
            doc.addImage("/images/deped-d.png", "PNG", 15, 10, 24, 24);

            doc.setFont("Arial Medium", "normal"); 
            doc.setFontSize(15);
            doc.text('Republic of the Philippines', pageWidth / 2, 15,{align:'center'});
            doc.setFont("arial", "normal"); 
            doc.setFontSize(18);
            doc.text('DEPARTMENT OF EDUCATION', pageWidth / 2, 23,{align:'center'});
            doc.setFontSize(15);
            doc.text(self.state.school.division , pageWidth / 2, 28,{align:'center'});
            doc.text(self.state.school.region, pageWidth / 2, 33,{align:'center'});
            doc.setFontSize(18);
            doc.text(self.state.school.school_name, pageWidth / 2, 42,{align:'center'});
            doc.setFont("Arial Medium", "normal"); 
            doc.setFontSize(9);
            doc.text('School ID : ' + self.state.school.school_id, pageWidth / 2, 47,{align:'center'});
            doc.setFontSize(18);
            doc.text("LEARNER'S PROGRESS REPORT CARD", pageWidth / 2, 54,{align:'center'});

            doc.setFontSize(12);
            doc.text('LRN : ' + lrn, 15, 73 - 3,{align:'left'});
            doc.text('Name : ' + fullname, 15, 78 - 3,{align:'left'});
            doc.text('Age : ' + age, 15, 83 - 3,{align:'left'});

            doc.text('Sex : ' + sex, 116, 73 - 3,{align:'left'});
            doc.text('School Year : ' + sy, 116, 78 - 3,{align:'left'});
            doc.text('Grade & Section : ' + gs, 116, 83 - 3,{align:'left'});

            let temp_data = []; 
            let ga = "";
            let count_complete = 0;

            self.state.list.forEach((val,i,arr) => { 
                let overall_total = "";
                if(val.q1!=null&&val.q2!=null&&val.q2!=null&&val.q2!=null) {
                    overall_total = Math.trunc((Number(val.q1) + Number(val.q2) + Number(val.q3) + Number(val.q4)) / 4);
                    ga=ga+(Number(val.q1) + Number(val.q2) + Number(val.q3) + Number(val.q4)) / 4;
                    count_complete++;
                }

                temp_data.push([ 
                    {
                        content: val.subject_name,
                        styles: {halign: 'left',minWidth: 0,minCellHeight: 0,cellWidth:80,fontSize: 7}
                    },
                    {
                        content: val.q1!=null?val.q1:"",
                        styles: {halign: 'center',minWidth: 0,minCellHeight: 0,cellWidth: 15,fontSize: 7}
                    },
                    {
                        content: val.q2!=null?val.q2:"",
                        styles: {halign: 'center',minWidth: 0,minCellHeight: 0,cellWidth: 15,fontSize: 7}
                    },
                    {
                        content: val.q3!=null?val.q3:"",
                        styles: {halign: 'center',minWidth: 0,minCellHeight: 0,cellWidth: 15,fontSize: 7}
                    },
                    {
                        content: val.q4!=null?val.q4:"",
                        styles: {halign: 'center',minWidth: 0,minCellHeight: 0,cellWidth: 15,fontSize: 7}
                    },
                    {
                        content: overall_total,
                        styles: {halign: 'center',minWidth: 0,minCellHeight: 0,cellWidth: 15,fontSize: 7}
                    },
                    {
                        content: "",
                        styles: {halign: 'center',minWidth: 0,minCellHeight: 0,fontSize: 4}
                    }
                ]);

                if(count_complete != arr.length) {
                    ga = "";
                }

            });

            autoTable(doc,{ 
                theme: 'plain',
                startY: 90,
                margin: 10,
                useCss: true,
                head: [[
                        {
                            content: "LEARNING AREAS",
                            colSpan: 1,
                            rowSpan: 3,
                            styles: { halign: 'center', valign: 'middle',minCellHeight: 0, fontSize: 8,lineColor: 1,lineWidth: .01},
                        },
                        {
                            content: "QUARTERS",
                            colSpan: 4,
                            rowSpan: 2,
                            styles: { halign: 'center', fontSize: 8,lineColor: 1,lineWidth: .01,minCellHeight: 12,cellPadding:2},
                        },
                        {
                            content: "FINAL GRADE",
                            colSpan: 1,
                            rowSpan: 3,
                            styles: { halign: 'center', valign: 'middle',fontSize: 6,lineColor: 1,lineWidth: .01,cellWidth: 20},
                        },
                        {
                            content: "REMARKS",
                            colSpan: 1,
                            rowSpan: 3,
                            styles: {  halign: 'center',valign: 'middle', fontSize: 6,lineColor: 1,lineWidth: .01,cellWidth: 30},
                        },
                ],[],[
                    {
                        content: "1",
                        styles: { halign: 'center', valign: 'middle',minCellHeight: 0, fontSize: 8},
                    },
                    {
                        content: "2",
                        styles: { halign: 'center', valign: 'middle',minCellHeight: 0, fontSize: 8},
                    },
                    {
                        content: "3",
                        styles: { halign: 'center', valign: 'middle',minCellHeight: 0, fontSize: 8},
                    },
                    {
                        content: "4",
                        styles: { halign: 'center', valign: 'middle',minCellHeight: 0, fontSize: 8},
                    }
                ]],
                headStyles: {lineColor: 1,lineWidth: .01,minCellHeight: 0,cellPadding: 0},
                styles: { fontSize: 8, lineColor: 1,lineWidth: .01},
                body: temp_data,
                foot: [[ 
                    {
                        content: "General Average",
                        colSpan: 5,
                        rowSpan: 2,
                        styles: { halign: 'right', fontSize: 8,lineColor: 1,lineWidth: .01,minCellHeight: 12,cellPadding:2},
                    },
                    {
                        content: ga,
                        colSpan: 1,
                        rowSpan: 3,
                        styles: { halign: 'center', valign: 'middle',fontSize: 6,lineColor: 1,lineWidth: .01,cellWidth: 20},
                    },
                    {
                        content: "",
                        colSpan: 1,
                        rowSpan: 3,
                        styles: {  halign: 'center',valign: 'middle', fontSize: 6,lineColor: 1,lineWidth: .01,cellWidth: 30},
                    },
                ]],
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
            let startY_ = doc.lastAutoTable.finalY + 2;
            doc.text(self.state.school.head_name, 50, startY_ + 18,{align:'center'});
            doc.text(self.state.school.head_position, 50, startY_ + 24,{align:'center'});
            doc.text('School Head', 50, startY_ + 28,{align:'center'});
            doc.line(15, startY_ + 20, 85, startY_ + 20);

 
            doc.text(self.state.getSchoolStats.teacher_name, 160, startY_ + 18,{align:'center'});
            doc.text('Adviser', 160, startY_ + 24,{align:'center'}); 
            doc.line(120 , startY_ + 20, 195, startY_ + 20);

            $("#frame1").height(window.innerHeight - 8); 
            setTimeout(() => {
                Swal.close(); 
                $('#frame1').attr('src',doc.output("bloburl"));
            }, 1000);

                
        } catch (error) {
            console.log(error);
            Swal.fire({
                title: "Cannot continue because info is not completed", 
                showCancelButton: true,
                showConfirmButton: false,
                allowOutsideClick: false,
                allowEscapeKey: false,
                confirmButtonText: "Download", 
                cancelButtonText: "Close",
                icon: "error",
                showLoaderOnConfirm: false, 
                closeOnClickOutside: false,  
                dangerMode: true,
            }).then((result) => { 
                // console.log(result)
                // if(result.isConfirmed) {
                    
                // }
                window.close();
            });
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
        return <div className="" >
            <iframe
                id="frame1"
                src="#view=FitH&toolbar=0"
                width="100%"
                height="100%"
            ></iframe>
    </div>}
}
