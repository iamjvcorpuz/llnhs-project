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

export default class LESF extends Component {
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

            const doc = new jsPDF({orientation: 'p',format: 'letter',compressPdf:true});
            doc.addFont('/fonts/arial/ARIALNB.TTF','Arial Narrow Bold', "bold");
            doc.addFont('/fonts/arial/ArialMdm.ttf','Arial Medium', "normal");
            let pageHeight = doc.internal.pageSize.height || doc.internal.pageSize.getHeight();
            let pageWidth = doc.internal.pageSize.width || doc.internal.pageSize.getWidth();
            // console.log(doc.getFontList());
            doc.addImage("/images/deped-d.png", "PNG", 30, 5, 20, 19);
            doc.setFont("Arial Medium", "normal"); 
            doc.setFontSize(15);
            doc.text('LEARNER ENROLLMENT AND SURVEY FORM', pageWidth / 2, 15,{align:'center'});
            doc.setFont("arial", "italic"); 
            doc.setFontSize(8);

            let startY_ = 25;
            doc.setFont("Arial Narrow Bold", "bold");
            doc.text('Instructions: ', 25, startY_ + 2,{align:'left'});
            doc.setFont("Helvetica",""); 
            doc.setFontSize(6);
            doc.text("1. This enrollment survey shall be answered by the parent/guardian of the learner.", 30, startY_ + 5,{align:'left'});
            doc.text("2. Please read the questions carefully and fill in all applicable spaces and write your answers legibly in CAPITAL letters. For items not applicable, write N/A.", 30, startY_ + 8,{align:'left'}); 
            doc.text("3. For questions/ clarifications, please ask for the assistance of the teacher/ person-in-charge.", 30, startY_ + 11,{align:'left'}); 
           
            
            doc.setFont("Arial Medium", "normal"); 
            doc.setFontSize(12);
            doc.text('A. GRADE LEVEL AND SCHOOL INFORMATION', 20,44,{align:'left'});
            doc.text('B. STUDENT INFORMATION', 20,74,{align:'left'});
            doc.text('C. PARENT/ GUARDIAN INFORMATION', 20,164,{align:'left'});
            doc.addPage();
            doc.text('D. HOUSEHOLD CAPACITY AND ACCESS TO DISTANCE LEARNING', 20,44,{align:'left'});


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
