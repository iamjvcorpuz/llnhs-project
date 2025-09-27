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

export default class PrintIDs extends Component {
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
            student_list: this.props.data.student,
            guardian: this.props.data.guardian,
            strand: this.props.data.strand,
            track: this.props.data.track
        }
        $('body').attr('class', '');
        this.multiple = this.multiple.bind(this);
        console.log(this.props)
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
        setTimeout(() => {
            this.generateQRCODES(() => {
                this.multiple();
            });
        }, 2000);
    }
    generateQRCODES(callback) {
        let student_list = [];
        let self = this;
        const generateQR = async (text,callback_) => {
            try {
                callback_(await QRCode.toDataURL(text, { errorCorrectionLevel: 'H',margin: 1  }));                
            } catch (err) {
                console.error(err);
                callback_("");
            }
        }
        this.state.student_list.forEach(async(val,i,arr) => {
            await generateQR(val.lrn,(e)=>{
                student_list.push({...val,gen_qr: e});
                if((i + 1) == arr.length) {
                    self.setState({student_list: student_list},() => {
                        callback();
                    });
                }
            });
        });
    }
    
    async multiple() {
        try {
            let self = this;
            let sgv = "";
            const doc = new jsPDF({orientation:"landscape"});
            // const width = doc.getPageWidth(); 
            // let height = 20;
            // let width = 20;
            // // 1 row id 1
            // doc.addImage("/images/id/front.png", "PNG", 5, 10, 54, 88);
            // doc.addImage("/images/id/back.png", "PNG", 60, 10, 54, 88);
            // // 1 row id 2
            // doc.addImage("/images/id/front.png", "PNG", 120, 10, 54, 88);
            // doc.addImage("/images/id/back.png", "PNG", 175, 10, 54, 88);
            // // 2 row id 1
            // doc.addImage("/images/id/front.png", "PNG", 5, 106, 54, 88);
            // doc.addImage("/images/id/back.png", "PNG", 60, 106, 54, 88);
            // // 2 row id 2
            // doc.addImage("/images/id/front.png", "PNG", 120, 106, 54, 88);
            // doc.addImage("/images/id/back.png", "PNG", 175, 106, 54, 88);

            const generateQR = async (text,x,y,h,w) => {
                try {
                    sgv = await QRCode.toDataURL(text, { errorCorrectionLevel: 'H',margin: 1  });
                    doc.addImage(sgv, x,y,h,w);
                } catch (err) {
                    console.error(err)
                }
            }
            let loop_count = 1;
            let loop_row = 1;
            let x = 0;
            let y = 0;
            // console.log(doc);
            this.state.student_list.forEach(async(val,i,arr) => {
                console.log("val",val);
                let track_ = self.state.track.find(e => e.name == val.flsh_track);
                let strand_ = self.state.strand.find(e => e.name == val.flsh_strand);
                let track = typeof(track_)!="undefined"?track_.acronyms:"";
                let strand = typeof(strand_)!="undefined"?strand_.acronyms:"";
                let code = val.qr_code,
                    lrn = val.lrn,
                    picture = val.photo,
                    fullname1 = val.first_name + " " + val.middle_name,
                    lastname = val.last_name,
                    track_strand = (track!=""||track!="")?track + "-" + strand:"", 
                    guardianname = self.state.guardian.find(e=>e.student_id==val.student_id).first_name + " " + self.state.guardian.find(e=>e.student_id==val.student_id).middle_name + " " + self.state.guardian.find(e=>e.student_id==val.student_id).last_name,
                    relationship = self.state.guardian.find(e=>e.student_id==val.student_id).relationship,
                    guardiancontact = self.state.guardian.find(e=>e.student_id==val.student_id).phone_number,
                    address = self.state.guardian.find(e=>e.student_id==val.student_id).current_address,
                    grade = val.grade,
                    level = val.grade_level,
                    section = val.section,
                    _track =  val.flsh_track,
                    _strand = val.flsh_strand,
                    sy = val.sy;
                if(loop_count == 1) {
                    loop_count++;
                    doc.addImage("/images/id/front.png", "PNG", 5, 10, 54, 88);
                    doc.addImage("/images/id/back.png", "PNG", 60, 10, 54, 88);
                    // await generateQR(lrn,7.7, 57, 18, 18);
                    doc.addImage(val.gen_qr,7.7, 57, 18, 18);
                    if(picture != "") {
                        doc.addImage(picture, "PNG", 7.5, 26.5, 26, 25);
                    }
                    doc.setFont("helvetica", "bold");
                    doc.setTextColor(255, 255, 255);
                    doc.setFontSize(11);
                    doc.text(lrn.toLocaleUpperCase(), 17, 55,{align:'left',color: "white"});
                    doc.setFont("helvetica", "normal");
                    doc.setFontSize(11);
                    if(fullname1.length >= 11) {
                        doc.setFontSize(8);
                    }
                    doc.text(fullname1.toLocaleUpperCase(), 28, 60,{align:'left',maxWidth: 50});
                    doc.setFont("helvetica", "bold"); 
                    doc.setFontSize(15);
        
                    let fname_y = 66;// 89 nextline 83 ang defaul
                    if(fullname1.length >= 18) {
                        fname_y = 68;
                    }
                    // max 14 for the size of 15
                    if(lastname.length >= 9) {
                        doc.setFontSize(10);
                        fname_y = 64;
                    }
                    if(lastname.length > 13) {
                        doc.setFontSize(7); 
                    }
                    doc.text(lastname.toLocaleUpperCase() , 28, fname_y,{align:'left',maxWidth: 50});
                    doc.setFont("helvetica", "normal");
                    doc.setFontSize(9);
                    doc.text(track_strand.toLocaleUpperCase(), 28, 72,{align:'left',maxWidth: 50});
        
                    doc.setFont("helvetica", "bold");
                    doc.setFontSize(7);
                    doc.text(grade.toLocaleUpperCase() + "-" + section.toLocaleUpperCase(), 76, 30,{align:'center',maxWidth: 45});
                    doc.text(sy.toLocaleUpperCase(), 94, 30,{align:'left',maxWidth: 50});

                    doc.setTextColor(9,72,164);
                    doc.setFontSize(11);
                    doc.text(level.toLocaleUpperCase() , 28.5, 89.7,{align:'right',maxWidth: 50});
                    doc.setTextColor(255, 255, 255);

                    doc.setFont("helvetica", "normal");
                    doc.setFontSize(8);
                    doc.text(guardianname.toLocaleUpperCase(), 63, 43.5,{align:'left',maxWidth: 80});
                    doc.text(relationship.toLocaleUpperCase(), 63, 46,{align:'left',maxWidth: 50});
                    doc.text(guardiancontact.toLocaleUpperCase(), 63, 49,{align:'left',maxWidth: 70});
                    doc.text(address.toLocaleUpperCase(), 63, 52,{align:'left',maxWidth: 79});
                    
                } else if(loop_count == 2) {
                    loop_count++;
                    doc.addImage("/images/id/front.png", "PNG", 120, 10, 54, 88);
                    doc.addImage("/images/id/back.png", "PNG", 175, 10, 54, 88);
                    // await generateQR(lrn,122.5, 57, 18, 18);
                    doc.addImage(val.gen_qr,122.5, 57, 18, 18);
                    if(picture != "") {
                        doc.addImage(picture, "PNG", 122.4, 26.5, 26, 25);
                    }
                    doc.setFont("helvetica", "bold");
                    doc.setTextColor(255, 255, 255);
                    doc.setFontSize(11);
                    doc.text(lrn.toLocaleUpperCase(), 132, 55,{align:'left',color: "white"});
                    doc.setFont("helvetica", "normal");
                    doc.setFontSize(11);
                    fullname1 = fullname1 + "a"; 
                    if(fullname1.length >= 11) {
                        doc.setFontSize(8);
                    }
                    doc.text(fullname1.toLocaleUpperCase() , 143, 60,{align:'left',maxWidth: 50});
                    doc.setFont("helvetica", "bold"); 
                    doc.setFontSize(15);
        
                    let fname_y = 66;// 89 nextline 83 ang defaul
                    if(fullname1.length >= 11) {
                        fname_y = 68;
                    }
                    // max 14 for the size of 15
                    if(lastname.length > 10) {
                        doc.setFontSize(10);
                        fname_y = 64;
                    }
                    if(lastname.length > 13) {
                        doc.setFontSize(7); 
                    }
                    doc.text(lastname.toLocaleUpperCase() , 143, fname_y,{align:'left',maxWidth: 50});
                    doc.setFont("helvetica", "normal");
                    doc.setFontSize(8);
                    doc.text(track_strand.toLocaleUpperCase(), 143, 72,{align:'left',maxWidth: 50});
        
                    doc.setFont("helvetica", "bold");
                    doc.setFontSize(7);
                    doc.text(grade.toLocaleUpperCase() + "-" + section.toLocaleUpperCase(), 76, 30,{align:'center',maxWidth: 45});
                    doc.text(sy.toLocaleUpperCase(), 94, 30,{align:'left',maxWidth: 50});
                    
                    doc.setTextColor(9,72,164);
                    doc.setFontSize(11);
                    doc.text(level.toLocaleUpperCase() , 143.5, 89.7,{align:'right',maxWidth: 50});
                    doc.setTextColor(255, 255, 255);
        
                    doc.setFont("helvetica", "normal");
                    doc.setFontSize(8);
                    doc.text(guardianname.toLocaleUpperCase(), 177, 43.5,{align:'left',maxWidth: 80});
                    doc.text(relationship.toLocaleUpperCase(), 177, 46,{align:'left',maxWidth: 50});
                    doc.text(guardiancontact.toLocaleUpperCase(), 177, 49,{align:'left',maxWidth: 70});
                    doc.text(address.toLocaleUpperCase(), 177, 52,{align:'left',maxWidth: 79});
                } else if(loop_count == 3) {
                    loop_count++;
                    doc.addImage("/images/id/front.png", "PNG", 5, 106, 54, 88);
                    doc.addImage("/images/id/back.png", "PNG", 60, 106, 54, 88);
                    // await generateQR(lrn,7.7, 153, 18, 18);
                    doc.addImage(val.gen_qr,7.7, 153, 18, 18);
                    if(picture != "") {
                        doc.addImage(picture, "PNG", 7.5, 122.5, 26, 25);
                    }
                    doc.setFont("helvetica", "bold");
                    doc.setTextColor(255, 255, 255);
                    doc.setFontSize(11);
                    doc.text(lrn.toLocaleUpperCase(), 17, 151,{align:'left',color: "white"});
                    doc.setFont("helvetica", "normal");
                    doc.setFontSize(11);
                    if(fullname1.length >= 11) {
                        doc.setFontSize(8);
                    }
                    doc.text(fullname1.toLocaleUpperCase(), 28, 156,{align:'left',maxWidth: 50});
                    doc.setFont("helvetica", "bold"); 
                    doc.setFontSize(15);
        
                    let fname_y = 161;// 89 nextline 83 ang defaul
                    if(fullname1.length >= 18) {
                        fname_y = 165;
                    }
                    // max 14 for the size of 15
                    if(lastname.length < 14) {
                        doc.setFontSize(15);
                        fname_y = 161;
                    }
                    doc.text(lastname.toLocaleUpperCase() , 28, fname_y,{align:'left',maxWidth: 50});
                    doc.setFont("helvetica", "normal");
                    doc.setFontSize(9);
                    doc.text(track_strand.toLocaleUpperCase(), 28, 168,{align:'left',maxWidth: 50});
        
                    doc.setFont("helvetica", "bold");
                    doc.setFontSize(7);
                    doc.text(grade.toLocaleUpperCase() + "-" + section.toLocaleUpperCase(), 76, 126,{align:'center',maxWidth: 45});
                    doc.text(sy.toLocaleUpperCase(), 94, 126,{align:'left',maxWidth: 50});
        
                    doc.setFont("helvetica", "normal");
                    doc.setFontSize(8);
                    doc.text(guardianname.toLocaleUpperCase(), 63, 139.5,{align:'left',maxWidth: 80});
                    doc.text(relationship.toLocaleUpperCase(), 63, 142,{align:'left',maxWidth: 50});
                    doc.text(guardiancontact.toLocaleUpperCase(), 63, 145,{align:'left',maxWidth: 70});
                    doc.text(address.toLocaleUpperCase(), 63, 148,{align:'left',maxWidth: 79});
                } else if(loop_count == 4) {
                    loop_count++;
                    loop_row++;
                    doc.addImage("/images/id/front.png", "PNG", 120, 106, 54, 88);
                    doc.addImage("/images/id/back.png", "PNG", 175, 106, 54, 88);
                    // await generateQR(lrn,122.5, 153, 18, 18);
                    doc.addImage(val.gen_qr,122.5, 153, 18, 18);
                    if(picture != "") {
                        doc.addImage(picture, "PNG", 122.4, 122.5, 26, 25);
                    }
                    doc.setFont("helvetica", "bold");
                    doc.setTextColor(255, 255, 255);
                    doc.setFontSize(11);
                    doc.text(lrn.toLocaleUpperCase(), 132, 151,{align:'left',color: "white"});
                    doc.setFont("helvetica", "normal");
                    doc.setFontSize(11);
                    if(fullname1.length >= 11) {
                        doc.setFontSize(8);
                    }
                    doc.text(fullname1.toLocaleUpperCase(), 143, 156,{align:'left',maxWidth: 50});
                    doc.setFont("helvetica", "bold"); 
                    doc.setFontSize(15);
        
                    let fname_y = 161;// 89 nextline 83 ang defaul
                    if(fullname1.length >= 18) {
                        fname_y = 165;
                    }
                    // max 14 for the size of 15
                    if(lastname.length < 14) {
                        doc.setFontSize(15);
                        fname_y = 161;
                    }
                    doc.text(lastname.toLocaleUpperCase() , 143, fname_y,{align:'left',maxWidth: 50});
                    doc.setFont("helvetica", "normal");
                    doc.setFontSize(8);
                    doc.text(track_strand.toLocaleUpperCase(), 143, 168,{align:'left',maxWidth: 50});
        
                    doc.setFont("helvetica", "bold");
                    doc.setFontSize(7);
                    doc.text(grade.toLocaleUpperCase() + "-" + section.toLocaleUpperCase(), 76, 126,{align:'center',maxWidth: 45});
                    doc.text(sy.toLocaleUpperCase(), 94, 126,{align:'left',maxWidth: 50});
        
                    doc.setFont("helvetica", "normal");
                    doc.setFontSize(8);
                    doc.text(guardianname.toLocaleUpperCase(), 177, 139.5,{align:'left',maxWidth: 80});
                    doc.text(relationship.toLocaleUpperCase(), 177, 142,{align:'left',maxWidth: 50});
                    doc.text(guardiancontact.toLocaleUpperCase(), 177, 145,{align:'left',maxWidth: 70});
                    doc.text(address.toLocaleUpperCase(), 177, 148,{align:'left',maxWidth: 79});
                }
                if(loop_count==5) {
                    loop_count=1;
                    if((i+1)!=arr.length) {
                        doc.addPage();
                    }
                }
            });

            
            console.log(doc.output().length >= 1000000,doc.output().length)
            setTimeout(() => {
                $("#frame1").height(window.innerHeight - 8); 
                Swal.close(); 
                $('#frame1').attr('src',doc.output("bloburl"));  
                // }
            }, 1000);

                
        } catch (error) {
            console.log(error)
            Swal.fire({
                title: "Cannot continue because data is not sufficient or has error", 
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
                // window.close();
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
                className="">
            </iframe>
    </div>}
}
