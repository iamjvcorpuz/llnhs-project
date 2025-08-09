import React,{ Component } from "react";
import { Link } from '@inertiajs/react';
import { EachMethod } from '@/Components/EachMethod'
import swal from 'sweetalert';
import Swal from 'sweetalert2';

// import QRCode from "react-qr-code";
import ReactTable from "@/Components/ReactTable"; 

import DashboardLayout from '@/Layouts/DashboardLayout';
import jsPDF from 'jspdf';
// import 'jspdf-autotable'; 
import { autoTable } from 'jspdf-autotable';
import QRCode from 'qrcode';

import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
export default class EmployeeAttendancePrint extends Component {
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
            list: [],
            selectedQr: this.props.id,
            queryType: this.props.type,
            selectedMonthYear: this.props.month,
            loading: true
        }
        $('body').attr('class', '');
        this.loadPDF = this.loadPDF.bind(this);
        this.loadAttendanceList = this.loadAttendanceList.bind(this);
        console.log(this.props)
    }

    componentDidMount() { 
        // this.loadPDF();
        this.loadAttendanceList();
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
                        self.setState({data: data,loading: false},() => {
                            self.loadPDF();
                        });
                       
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


    async loadPDF() {
        // console.log("loading pdf")
        try {
            let self = this;
            let sgv = "";
            let temp_data = [];
            
            self.state.data.forEach((e,i) => {
                let timelogs = "wait";
                let key = e.id;
                timelogs = e.logs.map((element,i) => {
                    if(element.mode != "absent") {
                        return `   TIME ${element.mode}: ${element.time}`;
                    }                            
                }); 
                temp_data.push([
                    {
                        content: (i+1),
                        styles: {halign: 'center', valign: 'middle',minWidth: 5,minCellHeight: 0,cellWidth: 6.5,fontSize: 5}
                    },
                    {
                        content: e.date,
                        styles: {halign: 'center',minWidth: 0,minCellHeight: 0,cellWidth:30,fontSize: 8}
                    },
                    {
                        content: timelogs,
                        styles: {halign: 'left',minWidth: 0,minCellHeight: 0,cellWidth: 150,fontSize: 5}
                    }
                ]);
            });




            const doc = new jsPDF({orientation: 'p',format: 'letter',compressPdf:true});
            doc.addFont('/fonts/arial/ARIALNB.TTF','Arial Narrow Bold', "bold");
            doc.addFont('/fonts/arial/ArialMdm.ttf','Arial Medium', "normal");
            let pageHeight = doc.internal.pageSize.height || doc.internal.pageSize.getHeight();
            let pageWidth = doc.internal.pageSize.width || doc.internal.pageSize.getWidth();
            // console.log(doc.getFontList());
            // doc.addImage("/images/deped-d.png", "PNG", 5, 10, 24, 24);
            doc.setFont("Arial Medium", "normal"); 
            doc.setFontSize(15);
            doc.text('Attendance Report', pageWidth / 2, 15,{align:'center'});
            doc.setFont("arial", "italic"); 
            doc.setFontSize(8);
            doc.setFont("Arial Medium", "normal"); 
            doc.setFontSize(9);
            doc.text('Name : ' + self.props.user[0].first_name + " " + self.props.user[0].middle_name + " " + self.props.user[0].last_name + " " + self.props.user[0].extension_name, 41, 26,{align:'left'});
            if(this.props.type == "employee") {
                doc.text('Position : ' + self.props.user[0].employee_type, 136, 26,{align:'left'});
            } else {
                doc.text('Position : Student', 136, 26,{align:'left'});
            }
            doc.text('Report for the Month of : ' + self.state.selectedMonthYear, 136, 31,{align:'left'});
            doc.text('Name of School : ' + self.props.schoolRegistry.school_name, 28, 31,{align:'left'}); 

            doc.setFontSize(8);
            autoTable(doc,{ 
                theme: 'plain',
                startY: 39,
                margin: 10,
                useCss: true,
                head: [[
                        {
                            content: "#",
                            colSpan: 1,
                            rowSpan: 1,
                            styles: { halign: 'center', valign: 'middle',minCellHeight: 0, fontSize: 8,lineColor: 1,lineWidth: .01},
                        },
                        {
                            content: "Date",
                            colSpan: 1,
                            rowSpan: 1,
                            styles: { halign: 'center', fontSize: 8,lineColor: 1,lineWidth: .01,cellPadding:2},
                        },
                        {
                            content: "Time Logs",
                            colSpan: 1,
                            rowSpan: 1,
                            styles: { halign: 'center', valign: 'middle',fontSize: 6,lineColor: 1,lineWidth: .01,cellWidth: 160},
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
            // -------------------------------------

            $("#obj1").height(window.innerHeight - 8);
            $("#frame1").height(window.innerHeight - 8);
            // $('#frame1').attr('src',doc.output("datauristring") + '#view=Fit&toolbar=0'); 
        
            $('#obj1').attr('data',doc.output("datauristring"));
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
        return <div className="" >
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
    </div>}
}
