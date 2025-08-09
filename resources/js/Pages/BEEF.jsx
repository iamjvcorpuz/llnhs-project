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

export default class BEEF extends Component {
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
            // doc.addImage("/images/deped-d.png", "PNG", 30, 5, 20, 19);
            doc.setFont("Arial Medium", "normal"); 
            doc.setFontSize(15);
            doc.text('LEARNER INFORMATION', pageWidth / 2, 15,{align:'center'});
            doc.setFontSize(8);

            doc.text('School Year : ', 15, 27,{align:'left'}); 
            doc.text('Grade level to Enroll : ', 15, 31,{align:'left'}); 

            let startY_ = 25;
            doc.setFont("Arial Narrow Bold", "bold");
            doc.text('Instructions: ', 15, 37,{align:'left'});
            doc.setFont("Helvetica",""); 
            doc.setFontSize(6);

            doc.setFont("arial", "italic"); 
            doc.text("Print legibly all information required in CAPITAL letters. Submit accomplished form to the Person-in-Charge/Registrar/Class Adviser. Use black or blue pen only.", 20, 40,{align:'left'});
           
            doc.setFont("Arial Medium", "normal"); 
            doc.setFontSize(11);
            doc.setFillColor(233, 233, 233);
            doc.rect(15, 43 , 187, 5, 'F');
            doc.text('LEARNER INFORMATION', 107,47,{align:'center'});
            // ----------- LEARNER INFORMATION --------------------
            doc.setFontSize(8);
            doc.text('PSA Birth Certificate No. (if available upon registration) : ', 20, 53,{align:'left'});
            doc.text('Learner Reference No. : ', 140, 53,{align:'left'});

            doc.text('Last Name : ', 20, 58,{align:'left'});
            doc.text('Dela Cruz', 22, 62,{align:'left'});
            doc.line(22,  63, 78, 63);

            doc.text('First Name : ', 20, 68,{align:'left'});
            doc.text('Juan', 22, 72,{align:'left'});
            doc.line(22,  73, 78, 73);

            doc.text('Middle Name : ', 20, 77,{align:'left'});
            doc.text('Dela', 22, 81,{align:'left'});
            doc.line(22,  82, 78, 82);

            doc.text('Extension Name : ', 20, 87,{align:'left'});
            doc.text('Dela', 22, 91,{align:'left'});
            doc.line(22,  92, 78, 92);


            doc.text('Birthdate : ', 85, 58,{align:'left'});
            doc.text('12-15-1991', 105, 62,{align:'center'});
            doc.line(87,  63, 120, 63);
            
            doc.text('Sex : ', 85, 68,{align:'left'});
            doc.text('Female', 97, 72,{align:'center'});
            doc.line(87,  73, 108, 73);

            doc.text('Age : ', 110, 68,{align:'left'});
            doc.text('33', 115, 72,{align:'center'});
            doc.line(112,  73, 119, 73);

            doc.text('Place of Birth (Municipality/City) : ', 130, 58,{align:'left'});
            doc.text('BLOCK 10, LOT 16 SOUTHVILLA HEIGHTS II CATALUNAN GRANDE, DAVAO CITY 8000', 133, 62,{align:'left',maxWidth:"71"});
            doc.rect(131, 59 , 70, 14);

            doc.text('Mother Tongue: ', 130, 77,{align:'left'});
            doc.text('Mother Tongue', 164, 81,{align:'center'});
            doc.line(132,  82, 200, 82);

            doc.text('Belonging to any Indigenous Peoples (IP) Community/Indigenous Cultural Community?', 85, 86,{align:'left'});
            doc.text('Yes', 90, 91,{align:'left'});
            doc.rect(85, 88 , 4, 4);
            doc.text('No', 105, 91,{align:'left'});
            doc.rect(100, 88 , 4, 4);

            doc.text('If Yes, please specify: ', 113, 91,{align:'left'});
            doc.line(140,  92, 200, 92);

            doc.text('Is your family a beneficiary of 4Ps? ', 85, 96,{align:'left'});
            doc.text('Yes', 133, 96,{align:'left'});
            doc.rect(128, 93 , 4, 4);
            doc.text('No', 143, 96,{align:'left'});
            doc.rect(138, 93 , 4, 4);

            doc.setFont("Arial Medium", "italic"); 
            doc.text('If Yes, write the 4Ps Household ID Number below', 89, 100,{align:'left'});
            doc.setFont("Arial Medium", "normal"); 
            doc.line(89,  107, 200, 107);
            doc.text('--------------', 89, 105,{align:'left'});

            doc.rect(15, 109 , 187, 54);
            
            doc.text('Is the child a Learner with Disability?', 17, 113,{align:'left'});
            doc.text('Yes', 68, 113,{align:'left'});
            doc.rect(63, 110 , 4, 4);
            doc.text('No', 82, 113,{align:'left'});
            doc.rect(77, 110 , 4, 4);

            doc.text('If Yes, specify the type of disability:', 17, 118,{align:'left'});
            // ----------- LEARNER INFORMATION -------------------- 


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
