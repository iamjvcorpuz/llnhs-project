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

export default class EmployeeAttendance extends Component {
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
            list: []
        }
        $('body').attr('class', '');
        this.loadPDF = this.loadPDF.bind(this);
        console.log(this.props)
    }

    componentDidMount() { 
        this.loadPDF();
    }
    
    async loadPDF() {
        console.log("loading pdf")
        try {
            let self = this;
            let sgv = "";
            let temp_data = [];
            
            // Array.from({length:5}).forEach((e,x) => {
            //     temp_data.push([
            //         {
            //             content: (x+1),
            //             styles: {halign: 'center', valign: 'middle',minWidth: 5,minCellHeight: 0,cellWidth: 6.5,fontSize: 5}
            //         },
            //         {
            //             content:"",
            //             styles: {halign: 'left',minWidth: 0,minCellHeight: 0,cellWidth:60,fontSize: 7}
            //         },
            //         {
            //             content: "",
            //             styles: {halign: 'center',minWidth: 0,minCellHeight: 0,cellWidth: 5,fontSize: 4}
            //         },
            //         {
            //             content: "",
            //             styles: {halign: 'center',minWidth: 0,minCellHeight: 0,cellWidth: 5,fontSize: 4}
            //         },
            //         {
            //             content: "",
            //             styles: {halign: 'center',minWidth: 0,minCellHeight: 0,cellWidth: 5,fontSize: 4}
            //         },
            //         {
            //             content: "",
            //             styles: {halign: 'center',minWidth: 0,minCellHeight: 0,cellWidth: 5,fontSize: 4}
            //         },
            //         {
            //             content: "",
            //             styles: {halign: 'center',minWidth: 0,minCellHeight: 0,cellWidth: 5,fontSize: 4}
            //         },
            //         {
            //             content: "",
            //             styles: {halign: 'center',minWidth: 0,minCellHeight: 0,cellWidth: 5,fontSize: 4}
            //         },
            //         {
            //             content: "",
            //             styles: {halign: 'center',minWidth: 0,minCellHeight: 0,cellWidth: 5,fontSize: 4}
            //         },
            //         {
            //             content: "",
            //             styles: {halign: 'center',minWidth: 0,minCellHeight: 0,cellWidth: 5,fontSize: 4}
            //         },
            //         {
            //             content: "",
            //             styles: {halign: 'center',minWidth: 0,minCellHeight: 0,cellWidth: 5,fontSize: 4}
            //         },
            //         {
            //             content: "",
            //             styles: {halign: 'center',minWidth: 0,minCellHeight: 0,cellWidth: 5,fontSize: 4}
            //         },
            //         {
            //             content: "",
            //             styles: {halign: 'center',minWidth: 0,minCellHeight: 0,cellWidth: 5,fontSize: 4}
            //         },
            //         {
            //             content: "",
            //             styles: {halign: 'center',minWidth: 0,minCellHeight: 0,cellWidth: 5,fontSize: 4}
            //         },
            //         {
            //             content: "",
            //             styles: {halign: 'center',minWidth: 0,minCellHeight: 0,cellWidth: 5,fontSize: 4}
            //         },
            //         {
            //             content: "",
            //             styles: {halign: 'center',minWidth: 0,minCellHeight: 0,cellWidth: 5,fontSize: 4}
            //         },
            //         {
            //             content: "",
            //             styles: {halign: 'center',minWidth: 0,minCellHeight: 0,cellWidth: 5,fontSize: 4}
            //         },
            //         {
            //             content: "",
            //             styles: {halign: 'center',minWidth: 0,minCellHeight: 0,cellWidth: 5,fontSize: 4}
            //         },
            //         {
            //             content: "",
            //             styles: {halign: 'center',minWidth: 0,minCellHeight: 0,cellWidth: 5,fontSize: 4}
            //         },
            //         {
            //             content: "",
            //             styles: {halign: 'center',minWidth: 0,minCellHeight: 0,cellWidth: 5,fontSize: 4}
            //         },
            //         {
            //             content: "",
            //             styles: {halign: 'center',minWidth: 0,minCellHeight: 0,cellWidth: 5,fontSize: 4}
            //         },
            //         {
            //             content: "",
            //             styles: {halign: 'center',minWidth: 0,minCellHeight: 0,cellWidth: 5,fontSize: 4}
            //         },
            //         {
            //             content: "",
            //             styles: {halign: 'center',minWidth: 0,minCellHeight: 0,cellWidth: 5,fontSize: 4}
            //         },
            //         {
            //             content: "",
            //             styles: {halign: 'center',minWidth: 0,minCellHeight: 0,cellWidth: 5,fontSize: 4}
            //         },
            //         {
            //             content: "",
            //             styles: {halign: 'center',minWidth: 0,minCellHeight: 0,cellWidth: 5,fontSize: 4}
            //         },
            //         {
            //             content: "",
            //             styles: {halign: 'center',minWidth: 0,minCellHeight: 0,cellWidth: 5,fontSize: 4}
            //         },
            //         {
            //             content: "",
            //             styles: {halign: 'center',minWidth: 0,minCellHeight: 0,cellWidth: 5,fontSize: 4}
            //         },
            //         {
            //             content: "",
            //             styles: {halign: 'center',minWidth: 0,minCellHeight: 0,fontSize: 4}
            //         },
            //         {
            //             content: "",
            //             styles: {halign: 'center',minWidth: 0,minCellHeight: 0,fontSize: 4}
            //         },
            //         {
            //             content: "",
            //             styles: {halign: 'center',minWidth: 0,minCellHeight: 0,fontSize: 4}
            //         },
            //     ]);
            // });




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
            doc.text('Name : ', 41, 26,{align:'left'});
            doc.text('Position : ', 136, 26,{align:'left'});
            doc.text('Report for the Month of : ', 136, 31,{align:'left'});
            doc.text('Name of School : ', 28, 31,{align:'left'});
            doc.text('Section : ', 216, 31,{align:'left'});

            doc.setFontSize(8);
            autoTable(doc,{ 
                theme: 'plain',
                startY: 39,
                margin: 4,
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
                            colSpan: 2,
                            rowSpan: 2,
                            styles: { halign: 'center', valign: 'middle',fontSize: 6,lineColor: 1,lineWidth: .01,cellWidth: 150},
                        }
                ]],
                headStyles: {lineColor: 1,lineWidth: .01,minCellHeight: 0,cellPadding: 0},
                styles: { fontSize: 8, lineColor: 1,lineWidth: .01},
                body: temp_data,
                didDrawCell: function (data) {
                    if (data.column.index == 0 && data.row.index < 5 && data.row.section === 'body') { // data.row.index >= 2 && 
                        console.log(data)
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
