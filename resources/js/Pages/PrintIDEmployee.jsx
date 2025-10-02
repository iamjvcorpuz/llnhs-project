import React,{ Component } from "react";
import { Link } from '@inertiajs/react';
import { EachMethod } from '@/Components/EachMethod'
import swal from 'sweetalert';
import Swal from 'sweetalert2';

// import QRCode from "react-qr-code";
import ReactTable from "@/Components/ReactTable"; 

import DashboardLayout from '@/Layouts/DashboardLayout';
import jsPDF from 'jspdf';
import 'jspdf-autotable'; 
import QRCode from 'qrcode';

export default class PrintIDEmployee extends Component {
    constructor(props) {
		super(props);
        this.state = {
            code: this.props.data.qr_code,
            lrn: this.props.data.lrn,
            picture: this.props.data.picture_base64,
            fullname1: this.props.data.first_name + " " + ((typeof(this.props.data.middle_name)!="undefined"&&this.props.data.middle_name!="")?this.props.data.middle_name.charAt(0) + ".":"") ,
            lastname: this.props.data.last_name,
            econtact: this.props.data.emergency_contact_number,
            type: this.props.data.employee_type
        }
        $('body').attr('class', '');
        this.singleId = this.singleId.bind(this);
        console.log(this.props);
    }

    componentDidMount() {
        $("#frame1").height(0);
        Swal.fire({
            title: "Generating ID. Please wait.", 
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
            this.setState({ 
                code: this.props.data.qr_code,
                lrn: this.props.data.lrn,
                picture: this.props.data.picture_base64,
                fullname1: this.props.data.first_name + " " + ((typeof(this.props.data.middle_name)!="undefined"&&this.props.data.middle_name!="")?this.props.data.middle_name.charAt(0) + ".":"") ,
                lastname: this.props.data.last_name,
                econtact: this.props.data.emergency_contact_number,
                type: this.props.data.employee_type
            },() => {
                this.singleId();
            });            
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
                // if(result.isConfirmed) {
                    window.close();
                // }
            });
        }
    }
    
    async singleId() {
        try {
            let self = this;
            let sgv = "";
            const doc = new jsPDF({});
            // const width = doc.getPageWidth();
            const width = 210.1;         
            // doc.addImage("/images/id/front.png", "PNG", 5, 5, 81, 130);
            // doc.addImage("/images/id/back.png", "PNG", 87, 5, 81, 130);
            
            doc.addImage("/images/id-teacher-front.png", "PNG", 5, 10, 88, 54);
            doc.addImage("/images/id-teacher-back.png", "PNG", 95, 10, 88, 54);
            const generateQR = async text => {
                try {
                    sgv = await QRCode.toDataURL(text, { errorCorrectionLevel: 'H',margin: 1 });
                    // console.log(sgv)
                    // doc.addSvgAsImage( sgv , 87, 5, 20, 20);
                    doc.addImage(sgv,72, 26, 20, 21);
                } catch (err) {
                console.error(err)
                }
            } 
            await generateQR(self.state.code); 

            // await generateQR(lrn,7.7, 57, 18, 18);
            // doc.addImage(self.state.gen_qr,72, 26, 20, 21); 
            if(self.state.picture != "") {
                doc.addImage(self.state.picture, "PNG", 6.7, 24.3, 23.6, 24.7);
            }
            doc.setFont("helvetica", "bold");
            doc.setTextColor(255, 255, 255);
            doc.setFontSize(11);
            doc.text(self.state.code.toLocaleUpperCase(), 7, 55,{align:'left',color: "white"});
            doc.setFont("helvetica", "normal");
            doc.setFontSize(11);
            if(self.state.fullname1.length >= 11) {
                doc.setFontSize(8);
            }
            doc.text(self.state.fullname1.toLocaleUpperCase(), 32, 43,{align:'left',maxWidth: 50});
            doc.setFont("helvetica", "bold"); 
            doc.setFontSize(15);

            let fname_y = 38;// 89 nextline 83 ang defaul
            // max 14 for the size of 15
            if(self.state.lastname.length >= 9) {
                doc.setFontSize(10);
                fname_y = 64;
            }
            if(self.state.lastname.length > 13) {
                doc.setFontSize(7); 
            }
            doc.text(self.state.lastname.toLocaleUpperCase() , 32, fname_y,{align:'left',maxWidth: 50});

            doc.setTextColor(9,72,164);
            doc.setFont("helvetica", "bold");
            doc.setFontSize(14);
            doc.text(self.state.type.toLocaleUpperCase(), 68, 56,{align:'center',maxWidth: 50});

            doc.setFont("helvetica", "normal");
            doc.setFontSize(12);
            doc.text(self.state.econtact, 139, 40,{align:'center',maxWidth: 45});

            // $("#obj1").height(window.innerHeight - 8);
            $("#frame1").height(window.innerHeight - 8);

            setTimeout(() => {
                Swal.close();
                $('#frame1').attr('src',doc.output("bloburl"));  
            }, 1000);

                
        } catch (error) {
            console.log(error)
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

    async multipleId() {
        let sgv = "";
        const doc = new jsPDF({});
        // const width = doc.getPageWidth();
        const width = 210.1;         
        doc.addImage("/images/id/front.png", "PNG", 5, 5, 81, 130);
        doc.addImage("/images/id/back.png", "PNG", 87, 5, 81, 130);
        doc.addImage(this.state.picture, "PNG", 9, 30, 38, 36);
        const generateQR = async text => {
            try {
                sgv = await QRCode.toDataURL(text, { errorCorrectionLevel: 'H' });
                console.log(sgv)
                // doc.addSvgAsImage( sgv , 87, 5, 20, 20);
                doc.addImage(sgv, 8, 74, 30, 27);
            } catch (err) {
              console.error(err)
            }
        }
        this.state.list.forEach(element => {
            
        });
        await generateQR(this.state.lrn);

        doc.setFont("helvetica", "bold");
        doc.setTextColor(255, 255, 255);
        doc.text(this.state.lrn.toLocaleUpperCase(), 22, 72,{align:'left',color: "white"});
        doc.setFont("helvetica", "normal");
        doc.setFontSize(12);
        doc.text(this.state.fullname1.toLocaleUpperCase(), 39, 78,{align:'left',maxWidth: 50});
        doc.setFont("helvetica", "bold"); 
        doc.setFontSize(15);

        let fname_y = 83;// 89 nextline 83 ang defaul
        if(this.state.fullname1.length >= 18) {
            fname_y = 89;
        }
        // max 14 for the size of 15
        if(this.state.lastname.length < 14) {
            doc.setFontSize(20);
            fname_y = 85;
        }
        doc.text(this.state.lastname.toLocaleUpperCase() , 39, fname_y,{align:'left',maxWidth: 50});
        doc.setFont("helvetica", "normal");
        doc.setFontSize(15);
        doc.text(this.state.track_strand.toLocaleUpperCase(), 39, 96,{align:'left',maxWidth: 50});

        doc.setFont("helvetica", "bold");
        doc.setFontSize(12);
        doc.text(this.state.grade.toLocaleUpperCase() + "-" + this.state.section.toLocaleUpperCase(), 109, 34,{align:'center',maxWidth: 45});
        doc.text(this.state.sy.toLocaleUpperCase(), 139, 34,{align:'left',maxWidth: 50});

        doc.setFont("helvetica", "normal");
        doc.setFontSize(10);
        doc.text(this.state.guardianname.toLocaleUpperCase(), 90, 56,{align:'left',maxWidth: 80});
        doc.text(this.state.relationship.toLocaleUpperCase(), 90, 60,{align:'left',maxWidth: 50});
        doc.text(this.state.guardiancontact.toLocaleUpperCase(), 90, 64,{align:'left',maxWidth: 70});
        doc.text(this.state.address.toLocaleUpperCase(), 90, 68,{align:'left',maxWidth: 79});

        // $('#obj1').attr('data',doc.output("datauristring"));
        $('#frame1').attr('src',doc.output("bloburl")); 
        // $('#frame1').attr('src',doc.output("datauristring") + '#view=Fit&toolbar=0'); 

    }
    
    render() {
        return <div className="" >
        {/* <object
            id="obj1"
            type="application/pdf"
            width="100%"
            height="100">
        </object> */}
            <iframe
                id="frame1"
                width="100%"
                height="100%"
            ></iframe>
    </div>}
}
