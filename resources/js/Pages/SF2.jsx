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
                theme: 'grid',
                startY: 39,
                head: [['Name', 'Email', 'Country']],
                body: [ 
                ]
            });

            // const width = doc.getPageWidth();        
            // doc.addImage("/images/id/front.png", "PNG", 5, 5, 81, 130);
            // doc.addImage("/images/id/back.png", "PNG", 87, 5, 81, 130); 
            // doc.setFont("helvetica", "bold");
            // doc.setTextColor(255, 255, 255);
            // doc.text(this.state.lrn.toLocaleUpperCase(), 22, 72,{align:'left',color: "white"});
            // doc.setFont("helvetica", "normal");
            // doc.setFontSize(12);
            // doc.text(this.state.fullname1.toLocaleUpperCase(), 39, 78,{align:'left',maxWidth: 50});
            // doc.setFont("helvetica", "bold"); 
            // doc.setFontSize(15);

            // let fname_y = 83;// 89 nextline 83 ang defaul
            // if(this.state.fullname1.length >= 18) {
            //     fname_y = 89;
            // }
            // // max 14 for the size of 15
            // if(this.state.lastname.length < 14) {
            //     doc.setFontSize(20);
            //     fname_y = 85;
            // }
            // doc.text(this.state.lastname.toLocaleUpperCase() , 39, fname_y,{align:'left',maxWidth: 50});
            // doc.setFont("helvetica", "normal");
            // doc.setFontSize(15);
            // doc.text(this.state.track_strand.toLocaleUpperCase(), 39, 96,{align:'left',maxWidth: 50});

            // doc.setFont("helvetica", "bold");
            // doc.setFontSize(12);
            // doc.text(this.state.grade.toLocaleUpperCase() + "-" + this.state.section.toLocaleUpperCase(), 109, 34,{align:'center',maxWidth: 45});
            // doc.text(this.state.sy.toLocaleUpperCase(), 139, 34,{align:'left',maxWidth: 50});

            // doc.setFont("helvetica", "normal");
            // doc.setFontSize(10);
            // doc.text(this.state.guardianname.toLocaleUpperCase(), 90, 56,{align:'left',maxWidth: 80});
            // doc.text(this.state.relationship.toLocaleUpperCase(), 90, 60,{align:'left',maxWidth: 50});
            // doc.text(this.state.guardiancontact.toLocaleUpperCase(), 90, 64,{align:'left',maxWidth: 70});
            // doc.text(this.state.address.toLocaleUpperCase(), 90, 68,{align:'left',maxWidth: 79});

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
